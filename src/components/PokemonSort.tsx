import React, { useState, useEffect, useRef } from "react";

interface IPokemonSortProps {
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  className?: string;
}

const PokemonSort: React.FunctionComponent<IPokemonSortProps> = ({
  sortBy,
  sortOrder,
  onSortChange,
  className = "",
}) => {
  const [showSort, setShowSort] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSort(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const sortOptions = [
    { key: "name", label: "Name" },
    { key: "num", label: "Dex Number" },
    { key: "hp", label: "HP" },
    { key: "atk", label: "Attack" },
    { key: "def", label: "Defense" },
    { key: "spa", label: "Sp. Attack" },
    { key: "spd", label: "Sp. Defense" },
    { key: "spe", label: "Speed" },
    { key: "total", label: "Base Stat Total" },
  ];

  const handleSortSelect = (key: string) => {
    // Always default to ascending when selecting a new sort field
    onSortChange(key, "asc");
    setShowSort(false);
  };

  const toggleSortOrder = () => {
    onSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc");
  };

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.key === sortBy);
    return option ? option.label : "Sort by";
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center relative" ref={sortRef}>
          <button
            onClick={() => setShowSort(!showSort)}
            className="bg-[#24283B] text-gray-100 rounded-xl py-3 px-6 backdrop-blur border border-[#333c67] hover:border-[#4e60b1] hover:bg-[#333c67] focus:outline-none focus:ring-2 focus:ring-[#4e60b1] transition-all duration-200 min-w-48 font-medium shadow-lg"
          >
            {getCurrentSortLabel()}
          </button>
        
        {showSort && (
          <div className="absolute z-20 mt-16 bg-[#24283B] backdrop-blur-md rounded-xl border border-[#4e60b1] p-4 shadow-2xl min-w-64">
            <h3 className="text-gray-200 font-semibold mb-4 text-center">Sort Pokemon</h3>
            <div className="flex flex-col gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => handleSortSelect(option.key)}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                    sortBy === option.key
                      ? "bg-[#4e60b1] text-white"
                      : "text-gray-200 hover:bg-[#333c67]"
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        </div>
        
        {/* Sort Order Toggle Button */}
        <button
          onClick={toggleSortOrder}
          className="bg-[#4e60b1] hover:bg-[#5a6bc4] text-white rounded-xl py-3 px-4 font-medium shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4e60b1]"
          title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
        >
          {sortOrder === "asc" ? "↑" : "↓"}
        </button>
      </div>
    </div>
  );
};

export default PokemonSort;