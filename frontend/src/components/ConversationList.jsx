import { MessageCircle } from "lucide-react";

function ConversationList({ conversations = [], activeId, onSelect }) {
  return (
    <div className="space-y-3">

      {conversations.map((chat) => (

        <button
          key={chat.id}
          onClick={() => onSelect(chat.id)}
          className={`w-full rounded-xl border-2 border-black p-4 text-left transition-all
          ${
            activeId === chat.id
              ? "bg-yellow-300 shadow-[4px_4px_0px_#000]"
              : "bg-white hover:bg-yellow-100"
          }`}
        >

          <div className="flex items-center gap-3">

            <MessageCircle size={18} />

            <span className="font-semibold truncate">
              {chat.title}
            </span>

          </div>

        </button>

      ))}

    </div>
  );
}

export default ConversationList;