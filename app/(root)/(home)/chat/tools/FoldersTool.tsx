// FoldersTool.tsx
import React, { useState } from "react";

interface FoldersToolProps {
  folders: string[];
  setFolders: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveTool: (val: string | null) => void;
}

const FoldersTool: React.FC<FoldersToolProps> = ({ folders, setFolders, setActiveTool }) => {
  const [folderName, setFolderName] = useState("");

  const handleCreateFolder = () => {
    const newFolders = [...folders, folderName];
    setFolders(newFolders);
    localStorage.setItem("folders", JSON.stringify(newFolders)); // Папканы сақтау
    setFolderName("");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Папкалар</h2>
      <div>
        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Папка атауы"
          className="p-2 border rounded mb-3"
        />
        <button onClick={handleCreateFolder} className="bg-blue-500 text-white p-2 rounded">
          Папка Құру
        </button>
      </div>
      <ul>
        {folders.map((folder, index) => (
          <li key={index}>{folder}</li>
        ))}
      </ul>
    </div>
  );
};

export default FoldersTool;
