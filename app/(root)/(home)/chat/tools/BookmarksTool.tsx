import React from "react";

interface Props {
  setActiveTool: (val: string | null) => void;
}

const BookmarksTool: React.FC<Props> = ({ setActiveTool }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Бетбелгілер</h2>
      <p>Бұл жерде бетбелгіге қосылған хабарламалар көрсетіледі.</p>
    </div>
  );
};

export default BookmarksTool;
