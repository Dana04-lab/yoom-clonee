import React from "react";

interface Props {
  setActiveTool: (val: string | null) => void;
}

const SettingsTool: React.FC<Props> = ({ setActiveTool }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Баптаулар</h2>
      <p>Бұл жерде аккаунт және басқа баптауларды өзгертуге болады.</p>
    </div>
  );
};

export default SettingsTool;
