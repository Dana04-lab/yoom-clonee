"use client";
import React, { useState } from "react";
import { Toaster } from "sonner";
import ChatHeader from "./companents/ChatHeader";
import { ToolPanel } from "./companents/ToolPanel";
import { Chat } from "./types";
import Sidebar from "./companents/ChatSidebar";
import ChatWindow from "./companents/ChatWindow";
import ToolContent from "./companents/ToolContent";

const ChatPage = () => {
  const [currentUser, setCurrentUser] = useState<string>(""); // Қолданушыны сақтау
  const [chats, setChats] = useState<Chat[]>([]); // Чаттарды сақтау
  const [activeChatId, setActiveChatId] = useState<string | null>(null); // Қазіргі таңда белсенді чат
  const [showToolPage, setShowToolPage] = useState(false); // Құрал панелін көрсету
  const [activeTool, setActiveTool] = useState<string | null>(null); // Белсенді құрал
  const [searchQuery, setSearchQuery] = useState(""); // Іздеу сұранысы

  // Белсенді чатты табу
  const activeChat = chats.find((c) => c.id === activeChatId);

  return (
    <div className="h-screen bg-[#1C1F2E] text-white flex flex-col">
      <Toaster position="top-center" /> {/* Кіші хабарламаларды көрсету */}
      
      {/* ChatHeader компоненті */}
      <ChatHeader
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        showToolPage={showToolPage}
        setShowToolPage={setShowToolPage}
      />

      {/* Құрал беттерін көрсету логикасы */}
      {showToolPage ? (
        activeTool ? (
          <ToolContent activeTool={activeTool} setActiveTool={setActiveTool} />
        ) : (
          <ToolPanel
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            setShowToolPage={setShowToolPage}
          />
        )
      ) : (
        // Негізгі чат интерфейсі
        <div className="flex flex-1">
          <Sidebar
            currentUser={currentUser}
            chats={chats}
            setChats={setChats}
            setActiveChatId={setActiveChatId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <ChatWindow
            currentUser={currentUser}
            activeChat={activeChat}
            setChats={setChats}
            chats={chats}
          />
        </div>
      )}
    </div>
  );
};

export default ChatPage;
