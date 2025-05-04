import React, { useState, useEffect } from "react";
import SavedTools from "../tools/SavedTool";
import FoldersTool from "../tools/FoldersTool";
import DraftsTool from "../tools/DraftsTool";
import BookmarksTool from "../tools/BookmarksTool";
import DocumentsTool from "../tools/DocumentsTool";
import RemindersTool from "../tools/RemindersTool";
import SettingsTool from "../tools/SettingsTool";

interface ToolContentProps {
  activeTool: string;
  setActiveTool: (val: string | null) => void;
}

const ToolContent: React.FC<ToolContentProps> = ({ activeTool, setActiveTool }) => {
  // Папкалар мен сақталған құралдар күйін сақтау
  const [folders, setFolders] = useState<string[]>(() => {
    // Деректерді localStorage-тен алу
    const savedFolders = localStorage.getItem("folders");
    return savedFolders ? JSON.parse(savedFolders) : [];
  });

  const [savedItems, setSavedItems] = useState<string[]>(() => {
    // Деректерді localStorage-тен алу
    const savedTools = localStorage.getItem("savedItems");
    return savedTools ? JSON.parse(savedTools) : [];
  });

  // Папкалар немесе құралдар өзгергенде localStorage-ке сақтау
  useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders));
    localStorage.setItem("savedItems", JSON.stringify(savedItems));
  }, [folders, savedItems]);

  const renderContent = () => {
    switch (activeTool) {
      case "Сақталғандар":
        return <SavedTools savedItems={savedItems} setSavedItems={setSavedItems} setActiveTool={setActiveTool} />;
      case "Папкалар":
        return <FoldersTool folders={folders} setFolders={setFolders} setActiveTool={setActiveTool} />;
      case "Қаралып жатқан":
        return <DraftsTool setActiveTool={setActiveTool} />;
      case "Бетбелгілер":
        return <BookmarksTool setActiveTool={setActiveTool} />;
      case "Құжаттар":
        return <DocumentsTool setActiveTool={setActiveTool} />;
      case "Еске салу":
        return <RemindersTool setActiveTool={setActiveTool} />;
      case "Баптаулар":
        return <SettingsTool setActiveTool={setActiveTool} />;
      default:
        return <div>Белгісіз құрал</div>;
    }
  };

  return (
    <div className="flex-1 p-6 bg-[#1C1F2E] text-white">
      <button
        onClick={() => setActiveTool(null)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Артқа
      </button>
      {renderContent()}
    </div>
  );
};

export default ToolContent;

