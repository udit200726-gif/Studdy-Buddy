import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";

function Home() {

  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="flex h-screen">

      <Sidebar
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />

      <ChatArea
        selectedChat={selectedChat}
      />

    </div>
  );
}

export default Home;