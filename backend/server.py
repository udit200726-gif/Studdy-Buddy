from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pydantic import BaseModel
from bson import ObjectId
from groq import Groq
import os
import json

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB
MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Groq
groq = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


class ConversationCreate(BaseModel):
    title: str


class ChatRequest(BaseModel):
    conversation_id: str
    message: str


@app.get("/api/")
async def home():
    return {
        "status": "success",
        "message": "Study Buddy Backend is Running!"
    }


@app.get("/api/test-db")
async def test_db():
    try:
        await db.command("ping")
        return {"database": "Connected Successfully!"}
    except Exception as e:
        return {"error": str(e)}


@app.post("/api/conversations")
async def create_conversation(data: ConversationCreate):

    result = await db.conversations.insert_one({
        "title": data.title
    })

    return {
        "id": str(result.inserted_id),
        "title": data.title
    }


@app.get("/api/conversations")
async def list_conversations():

    conversations = []

    async for doc in db.conversations.find():
        conversations.append({
            "id": str(doc["_id"]),
            "title": doc["title"]
        })

    return conversations


@app.get("/api/conversations/{conversation_id}/messages")
async def get_messages(conversation_id: str):

    messages = []

    async for msg in db.messages.find(
        {"conversation_id": conversation_id}
    ):
        messages.append({
            "id": str(msg["_id"]),
            "conversation_id": msg["conversation_id"],
            "role": msg["role"],
            "content": msg["content"]
        })

    return messages


@app.delete("/api/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str):

    await db.conversations.delete_one(
        {"_id": ObjectId(conversation_id)}
    )

    await db.messages.delete_many(
        {"conversation_id": conversation_id}
    )

    return {
        "message": "Conversation deleted successfully"
    }
async def update_chat_title(conversation_id: str, message: str):

    conversation = await db.conversations.find_one(
        {"_id": ObjectId(conversation_id)}
    )

    if conversation and conversation["title"] == "New Chat":

        title = message.strip()

        if len(title) > 40:
            title = title[:40] + "..."

        await db.conversations.update_one(
            {"_id": ObjectId(conversation_id)},
            {
                "$set": {
                    "title": title
                }
            }
        )


@app.post("/api/chat")
async def chat(request: ChatRequest):

    try:

        # Save user message
        await db.messages.insert_one({
            "conversation_id": request.conversation_id,
            "role": "user",
            "content": request.message
        })
        await update_chat_title(
    request.conversation_id,
    request.message
)

        # Ask Groq
        response = groq.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": request.message
                }
            ],
            temperature=0.7,
            max_tokens=1024
        )

        reply = response.choices[0].message.content

        # Save AI reply
        await db.messages.insert_one({
            "conversation_id": request.conversation_id,
            "role": "assistant",
            "content": reply
        })

        return {
            "reply": reply
        }

    except Exception as e:
        return {
            "error": str(e)
        }

@app.post("/api/chat/stream")
async def chat_stream(request: ChatRequest):

    async def generate():

        # Save user message
        await db.messages.insert_one({
            "conversation_id": request.conversation_id,
            "role": "user",
            "content": request.message
        })
        await update_chat_title(
    request.conversation_id,
    request.message
)

        full_reply = ""

        stream = groq.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": request.message
                }
            ],
            stream=True,
            temperature=0.7,
            max_tokens=1024
        )

        for chunk in stream:
            if chunk.choices:
                delta = chunk.choices[0].delta.content

                if delta:
                    full_reply += delta

                    yield (
                        f"data: {json.dumps({'type':'delta','content':delta})}\n\n"
                    )

        await db.messages.insert_one({
            "conversation_id": request.conversation_id,
            "role": "assistant",
            "content": full_reply
        })

        yield 'data: {"type":"done"}\n\n'

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )