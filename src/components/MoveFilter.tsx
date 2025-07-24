import React, { useState, useEffect, useRef } from "react";
import TypeTag from "@/components/TypeTag";
import physical from "@/assets/images/Physical_SV_icon.png";
import special from "@/assets/images/Special_SV_icon.png";
import status from "@/assets/images/Status_SV_icon.png";

interface IMoveFilterProps {
  selectedCategories: string[];
  selectedTypes: string[];
  onCategoriesChange: (categories: string[]) => void;
  onTypesChange: (types: string[]) => void;
  className?: string;
}

const MoveFilter: React.FunctionComponent<IMoveFilterProps> = ({
  selectedCategories,
  selectedTypes,
  onCategoriesChange,
  onTypesChange,
  className = "",
}) => {
  const [showCategories, setShowCategories] = useState(false);
  const [showTypes, setShowTypes] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const typesRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setShowCategories(false);
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

  const categoryIcons = {
    Physical: physical,
    Special: special,
    Status: status,
  };

  const categories = ["Physical", "Special", "Status"];
  const types = [
    "Bug", "Dark", "Dragon", "Electric", "Fairy", "Fighting",
    "Fire", "Flying", "Ghost", "Grass", "Ground", "Ice",
    "Normal", "Poison", "Psychic", "Rock", "Steel", "Water"
  ];

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
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
    onCategoriesChange([]);
    onTypesChange([]);
  };

  return (
    <div className={`flex flex-col gap-4 mb-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-start">
        {/* Category Filter */}
        <div className="flex flex-col items-center relative" ref={categoriesRef}>
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="bg-[#24283B] text-gray-100 rounded-xl py-3 px-6 backdrop-blur border border-[#333c67] hover:border-[#4e60b1] hover:bg-[#333c67] focus:outline-none focus:ring-2 focus:ring-[#4e60b1] transition-all duration-200 min-w-44 font-medium shadow-lg"
          >
            Categories {selectedCategories.length > 0 && `(${selectedCategories.length})`}
          </button>
          {showCategories && (
            <div className="absolute z-20 mt-16 bg-[#24283B] backdrop-blur-md rounded-xl border border-[#4e60b1] p-6 shadow-2xl min-w-80">
              <h3 className="text-gray-200 font-semibold mb-4 text-center">Select Categories</h3>
              <div className="flex flex-col gap-3">
                {categories.map((category) => (
                  <label key={category} className="flex items-center space-x-3 cursor-pointer hover:bg-[#333c67] p-2 rounded-lg transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="rounded border-gray-400 text-blue-500 focus:ring-blue-400 focus:ring-2 flex-shrink-0"
                    />
                    <img 
                      src={categoryIcons[category as keyof typeof categoryIcons]} 
                      alt={category}
                      className="w-6 h-6 flex-shrink-0"
                    />
                    <span className="text-gray-200 text-sm whitespace-nowrap font-medium">{category}</span>
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
        {(selectedCategories.length > 0 || selectedTypes.length > 0) && (
          <button
            onClick={clearAllFilters}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {(selectedCategories.length > 0 || selectedTypes.length > 0) && (
        <div className="flex flex-wrap gap-2 justify-center">
          {selectedCategories.map((category) => (
            <span
              key={`category-${category}`}
              className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              <img 
                src={categoryIcons[category as keyof typeof categoryIcons]} 
                alt={category}
                className="w-4 h-4 flex-shrink-0"
              />
              {category}
              <button
                onClick={() => handleCategoryToggle(category)}
                className="ml-1 hover:bg-purple-700 rounded-full w-4 h-4 flex items-center justify-center"
              >
                x
              </button>
            </span>
          ))}
          {selectedTypes.map((type) => (
            <div
              key={`type-${type}`}
              className="flex items-center gap-1 bg-gray-800 rounded-full pl-1 pr-2 py-1"
            >
              <TypeTag type={type.toLowerCase()} />
              <button
                onClick={() => handleTypeToggle(type)}
                className="hover:bg-gray-700 rounded-full w-5 h-5 flex items-center justify-center text-gray-300 hover:text-white transition-colors duration-200"
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoveFilter;