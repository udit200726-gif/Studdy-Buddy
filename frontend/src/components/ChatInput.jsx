import { Send } from "lucide-react";

function ChatInput({ value, setValue, onSend }) {

  const handleSend = () => {
    if (!value.trim()) return;

    onSend(value);
    setValue("");
  };

  return (
    <div className="border-t-2 border-black bg-white p-6">

      <div className="flex items-center gap-4">

        <textarea
          rows={2}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask anything about your studies..."
          className="flex-1 resize-none rounded-xl border-2 border-black p-4 text-lg focus:outline-none"
        />

        <button
          onClick={handleSend}
          className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          <Send />
        </button>

      </div>

    </div>
  );
}

export default ChatInput;