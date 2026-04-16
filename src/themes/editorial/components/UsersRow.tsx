import React from 'react';

interface UsersRowProps {
  joinText?: string;
  countText?: string;
  clientsText?: string;
}

const UsersRow: React.FC<UsersRowProps> = ({ 
  joinText = "Join", 
  countText = "100+", 
  clientsText = "other awesome clients" 
}) => {
  return (
    <div className="flex items-center gap-4 py-2">
      {/* Avatars Placeholder - Framer usually has some circles here */}
      <div className="flex -space-x-2 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i}
            className="inline-block h-10 w-10 rounded-full border-2 border-white bg-zinc-200 bg-cover bg-center"
            style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})` }}
          />
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <span className="text-xl font-bold text-black">{joinText} {countText}</span>
        <span className="text-black opacity-60">{clientsText}</span>
      </div>
    </div>
  );
};

export default UsersRow;
