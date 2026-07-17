import { useEffect, useState, useCallback } from "react";
import { MessageSquarePlus } from "lucide-react";
import ConversationList from "./ConversationList";
import {
  createConversation,
  getConversations,
} from "../services/api";

function Sidebar({ selectedChat, setSelectedChat }) {
  const [chats, setChats] = useState([]);

  const loadChats = useCallback(async () => {
    try {
      const data = await getConversations();
      setChats(data);

      // First chat auto select
      if (data.length > 0 && !selectedChat) {
        setSelectedChat(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  }, [selectedChat, setSelectedChat]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  async function handleNewChat() {
    try {
      const chat = await createConversation("New Chat");

      await loadChats();

      setSelectedChat(chat.id);
    } catch (err) {
      console.error(err);
      alert("Failed to create chat");
    }
  }

  return (
    <aside className="w-72 bg-[#e9e0ff] border-r-2 border-black flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b-2 border-black">
        <h1 className="text-3xl font-black">📚 StudyBuddy</h1>

        <p className="text-sm font-semibold mt-1">
          BY VERTEX MIND
        </p>
      </div>

      {/* New Chat */}
      <div className="p-5">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 border-2 border-black bg-white py-4 font-bold shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          <MessageSquarePlus size={22} />
          NEW CHAT
        </button>
      </div>

      {/* Recent */}
      <div className="flex-1 overflow-y-auto px-5">
        <h2 className="mb-4 text-sm font-bold tracking-widest">
          RECENT
        </h2>

        <ConversationList
          conversations={chats}
          activeId={selectedChat}
          onSelect={setSelectedChat}
        />
      </div>

      {/* Footer */}
      <div className="border-t-2 border-black p-5">
        <p className="text-sm font-semibold">
          Powered by Studdy Buddy AI
        </p>
      </div>

    </aside>
  );
}

export default Sidebar;