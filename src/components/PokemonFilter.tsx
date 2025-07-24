import React, { useState, useEffect, useRef } from "react";
import TypeTag from "@/components/TypeTag";

interface IPokemonFilterProps {
  selectedGenerations: number[];
  selectedTypes: string[];
  onGenerationsChange: (gens: number[]) => void;
  onTypesChange: (types: string[]) => void;
  className?: string;
}

const PokemonFilter: React.FunctionComponent<IPokemonFilterProps> = ({
  selectedGenerations,
  selectedTypes,
  onGenerationsChange,
  onTypesChange,
  className = "",
}) => {
  const [showGenerations, setShowGenerations] = useState(false);
  const [showTypes, setShowTypes] = useState(false);
  const generationsRef = useRef<HTMLDivElement>(null);
  const typesRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (generationsRef.current && !generationsRef.current.contains(event.target as Node)) {
        setShowGenerations(false);
      }
      if (typesRef.current && !typesRef.current.contains(event.target as Node)) {
        setShowTypes(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const types = [
    "Bug", "Dark", "Dragon", "Electric", "Fairy", "Fighting",
    "Fire", "Flying", "Ghost", "Grass", "Ground", "Ice",
    "Normal", "Poison", "Psychic", "Rock", "Steel", "Water"
  ];

  const handleGenerationToggle = (gen: number) => {
    if (selectedGenerations.includes(gen)) {
      onGenerationsChange(selectedGenerations.filter(g => g !== gen));
    } else {
      onGenerationsChange([...selectedGenerations, gen]);
    }
  };

  const handleTypeToggle = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter(t => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  const clearAllFilters = () => {
    onGenerationsChange([]);
    onTypesChange([]);
  };

  return (
    <div className={`flex flex-col gap-4 mb-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-start">
        {/* Generation Filter */}
        <div className="flex flex-col items-center relative" ref={generationsRef}>
          <button
            onClick={() => setShowGenerations(!showGenerations)}
            className="bg-[#24283B] text-gray-100 rounded-xl py-3 px-6 backdrop-blur border border-[#333c67] hover:border-[#4e60b1] hover:bg-[#333c67] focus:outline-none focus:ring-2 focus:ring-[#4e60b1] transition-all duration-200 min-w-44 font-medium shadow-lg"
          >
            Generations {selectedGenerations.length > 0 && `(${selectedGenerations.length})`}
          </button>
          {showGenerations && (
            <div className="absolute z-20 mt-16 bg-[#24283B] backdrop-blur-md rounded-xl border border-[#4e60b1] p-6 shadow-2xl min-w-80">
              <h3 className="text-gray-200 font-semibold mb-4 text-center">Select Generations</h3>
              <div className="grid grid-cols-3 gap-3">
                {generations.map((gen) => (
                  <label key={gen} className="flex items-center space-x-2 cursor-pointer hover:bg-[#333c67] p-2 rounded-lg transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={selectedGenerations.includes(gen)}
                      onChange={() => handleGenerationToggle(gen)}
                      className="rounded border-gray-400 text-blue-500 focus:ring-blue-400 focus:ring-2"
                    />
                    <span className="text-gray-200 text-sm whitespace-nowrap">Gen {gen}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Type Filter */}
        <div className="flex flex-col items-center relative" ref={typesRef}>
          <button
            onClick={() => setShowTypes(!showTypes)}
            className="bg-[#24283B] text-gray-100 rounded-xl py-3 px-6 backdrop-blur border border-[#333c67] hover:border-[#4e60b1] hover:bg-[#333c67] focus:outline-none focus:ring-2 focus:ring-[#4e60b1] transition-all duration-200 min-w-44 font-medium shadow-lg"
          >
            Types {selectedTypes.length > 0 && `(${selectedTypes.length})`}
          </button>
          {showTypes && (
            <div className="absolute z-20 mt-16 bg-[#24283B] backdrop-blur-md rounded-xl border border-[#4e60b1] p-6 shadow-2xl min-w-[32rem] max-w-[36rem]">
              <h3 className="text-gray-200 font-semibold mb-4 text-center">Select Types</h3>
              <div className="grid grid-cols-3 gap-2">
                {types.map((type) => (
                  <label key={type} className="flex items-center space-x-2 cursor-pointer hover:bg-[#333c67] p-1.5 rounded-lg transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeToggle(type)}
                      className="rounded border-gray-400 text-blue-500 focus:ring-blue-400 focus:ring-2 flex-shrink-0"
                    />
                    <TypeTag type={type.toLowerCase()} />
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Clear Filters Button */}
        {(selectedGenerations.length > 0 || selectedTypes.length > 0) && (
          <button
            onClick={clearAllFilters}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {(selectedGenerations.length > 0 || selectedTypes.length > 0) && (
        <div className="flex flex-wrap gap-2 justify-center">
          {selectedGenerations.map((gen) => (
            <span
              key={`gen-${gen}`}
              className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              Gen {gen}
              <button
                onClick={() => handleGenerationToggle(gen)}
                className="ml-1 hover:bg-blue-700 rounded-full w-4 h-4 flex items-center justify-center"
              >
                x
              </button>
            </span>
          ))}
          {selectedTypes.map((type) => (
            <span
              key={`type-${type}`}
              className="bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {type}
              <button
                onClick={() => handleTypeToggle(type)}
                className="ml-1 hover:bg-green-700 rounded-full w-4 h-4 flex items-center justify-center"
              >
                x
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PokemonFilter;