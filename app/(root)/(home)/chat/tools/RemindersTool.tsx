import React from "react";

interface Props {
  setActiveTool: (val: string | null) => void;
}

const RemindersTool: React.FC<Props> = ({ setActiveTool }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Еске салу</h2>
      <p>Бұл жерде еске салу хабарламалары мен ескертулер көрсетіледі.</p>
    </div>
  );
};

export default RemindersTool;
