const API = process.env.REACT_APP_BACKEND_URL;

// Conversation APIs
export async function getConversations() {
  const res = await fetch(`${API}/api/conversations`);
  return await res.json();
}

export async function createConversation(title = "New Chat") {
  const res = await fetch(`${API}/api/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  return await res.json();
}

export async function getMessages(conversationId) {
  const res = await fetch(
    `${API}/api/conversations/${conversationId}/messages`
  );

  return await res.json();
}

// Chat API
export async function sendMessage(conversationId, message) {
  const res = await fetch(`${API}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      conversation_id: conversationId,
      message,
    }),
  });

  return await res.json();
}
export async function streamMessage(conversationId, message, onChunk) {
  const response = await fetch(`${API}/api/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      conversation_id: conversationId,
      message,
    }),
  });

  if (!response.ok) {
    throw new Error("Streaming failed");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();

    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");

    buffer = events.pop(); // keep incomplete event

    for (const event of events) {
      if (!event.startsWith("data: ")) continue;

      const json = event.slice(6);

      const data = JSON.parse(json);

      if (data.type === "delta") {
        onChunk(data.content);
      }
    }
  }
}