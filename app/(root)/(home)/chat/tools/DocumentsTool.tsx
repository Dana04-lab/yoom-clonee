import React from "react";

interface Props {
  setActiveTool: (val: string | null) => void;
}

const DocumentsTool: React.FC<Props> = ({ setActiveTool }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Құжаттар</h2>
      <p>Бұл жерде құжаттар мен файлдар көрсетіледі.</p>
    </div>
  );
};

export default DocumentsTool;
