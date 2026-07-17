import { useEffect, useState } from "react";
import ChatInput from "./ChatInput";
import Hero from "./Hero";
import {
  getMessages,
  streamMessage,
} from "../services/api";
import PromptCards from "./PromptCards";

function ChatArea({ selectedChat }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Load messages whenever conversation changes
  useEffect(() => {
    async function loadMessages() {
      if (!selectedChat) {
        setMessages([]);
        return;
      }

      try {
        const data = await getMessages(selectedChat);
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadMessages();
  }, [selectedChat]);

  async function handleSend(message) {
    if (!selectedChat) {
      alert("Please create a new chat first.");
      return;
    }

    // Show user message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
      },
    ]);

    try {
      // Empty assistant bubble
setMessages((prev) => [
  ...prev,
  {
    role: "assistant",
    content: "",
  },
]);

await streamMessage(
  selectedChat,
  message,
  (chunk) => {

    setMessages((prev) => {

      const copy = [...prev];

      copy[copy.length - 1].content += chunk;

      return [...copy];

    });

  }
);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main className="flex flex-1 flex-col bg-gray-50">

      <div className="flex-1 overflow-y-auto px-10 pt-6 pb-4">

       {messages.length === 0 ? (
  <div className="flex h-full flex-col items-center justify-center">

    <Hero />

    <div className="mt-8">
      <PromptCards
        onPrompt={(prompt) => setInput(prompt)}
      />
    </div>

  </div>
) : (
          <div className="mx-auto max-w-5xl space-y-6">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`rounded-xl border-2 border-black p-5 shadow-[4px_4px_0px_#000]
                ${
                  msg.role === "user"
                    ? "bg-yellow-100 ml-auto max-w-3xl"
                    : "bg-white mr-auto max-w-3xl"
                }`}
              >
                <div className="mb-2 font-bold">
                  {msg.role === "user"
                    ? "🧑 You"
                    : "🤖 StudyBuddy"}
                </div>

                <p className="whitespace-pre-wrap leading-7">
                  {msg.content}
                </p>
              </div>
            ))}

          </div>
        )}

      </div>
      
      <ChatInput
  value={input}
  setValue={setInput}
  onSend={handleSend}
/>

    </main>
  );
}

export default ChatArea;