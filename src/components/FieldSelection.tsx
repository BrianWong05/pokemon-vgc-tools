import React, { useState } from "react";
import { Field } from "@smogon/calc";
import { Generations } from "@pkmn/data";

interface IFieldSelectionProps {
  gens: Generations;
  field: Field;
  onFieldChange: (field: Field) => void;
}

const FieldSelection: React.FunctionComponent<IFieldSelectionProps> = ({
  gens,
  field,
  onFieldChange,
}) => {
  const gen = gens.get(9);
  
  // Weather options
  const weatherOptions = [
    { value: "", label: "None" },
    { value: "Sun", label: "Sun" },
    { value: "Rain", label: "Rain" },
    { value: "Sand", label: "Sandstorm" },
    { value: "Hail", label: "Hail" },
    { value: "Snow", label: "Snow" },
  ];

  // Terrain options
  const terrainOptions = [
    { value: "", label: "None" },
    { value: "Electric", label: "Electric" },
    { value: "Grassy", label: "Grassy" },
    { value: "Misty", label: "Misty" },
    { value: "Psychic", label: "Psychic" },
  ];

  const handleWeatherChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const weather = event.target.value as any;
    const newField = new Field({
      ...field,
      weather: weather || undefined,
    });
    onFieldChange(newField);
  };

  const handleTerrainChange = (terrain: string) => {
    const newField = new Field({
      ...field,
      terrain: terrain || undefined,
    });
    onFieldChange(newField);
  };

  const handleFieldEffectChange = (effect: string, checked: boolean) => {
    const newField = new Field({
      ...field,
      [effect]: checked,
    });
    onFieldChange(newField);
  };

  return (
    <div className="mb-6 p-4 bg-[#1a1d2e] rounded-lg border border-[#4e60b1]">
      <h3 className="text-gray-100 font-semibold mb-4 text-center">Field Conditions</h3>
      
      {/* Weather Selection */}
      <div className="mb-4">
        <label className="block text-gray-300 font-medium mb-2">Weather:</label>
        <select
          value={field.weather || ""}
          onChange={handleWeatherChange}
          className="w-full px-3 py-2 bg-[#333c67] border border-gray-600 rounded-lg text-gray-200 focus:border-[#4e60b1] focus:outline-none"
        >
          {weatherOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Terrain Selection */}
      <div className="mb-4">
        <label className="block text-gray-300 font-medium mb-2">Terrain:</label>
        <div className="grid grid-cols-2 gap-2">
          {terrainOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleTerrainChange(option.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                field.terrain === option.value || (!field.terrain && option.value === "")
                  ? "bg-[#4e60b1] text-white border border-[#4e60b1]"
                  : "bg-[#333c67] text-gray-300 border border-gray-600 hover:bg-[#3d4785]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Field Effects */}
      <div className="space-y-3">
        <label className="block text-gray-300 font-medium">Field Effects:</label>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Gravity */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={field.isGravity || false}
              onChange={(e) => handleFieldEffectChange("isGravity", e.target.checked)}
              className="w-4 h-4 text-[#4e60b1] bg-[#333c67] border-gray-600 rounded focus:ring-[#4e60b1] focus:ring-2"
            />
            <span className="text-gray-300 text-sm">Gravity</span>
          </label>

          {/* Trick Room */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={field.isTrickRoom || false}
              onChange={(e) => handleFieldEffectChange("isTrickRoom", e.target.checked)}
              className="w-4 h-4 text-[#4e60b1] bg-[#333c67] border-gray-600 rounded focus:ring-[#4e60b1] focus:ring-2"
            />
            <span className="text-gray-300 text-sm">Trick Room</span>
          </label>

          {/* Wonder Room */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={field.isWonderRoom || false}
              onChange={(e) => handleFieldEffectChange("isWonderRoom", e.target.checked)}
              className="w-4 h-4 text-[#4e60b1] bg-[#333c67] border-gray-600 rounded focus:ring-[#4e60b1] focus:ring-2"
            />
            <span className="text-gray-300 text-sm">Wonder Room</span>
          </label>

          {/* Magic Room */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={field.isMagicRoom || false}
              onChange={(e) => handleFieldEffectChange("isMagicRoom", e.target.checked)}
              className="w-4 h-4 text-[#4e60b1] bg-[#333c67] border-gray-600 rounded focus:ring-[#4e60b1] focus:ring-2"
            />
            <span className="text-gray-300 text-sm">Magic Room</span>
          </label>

          {/* Aura Break */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={field.isAuraBreak || false}
              onChange={(e) => handleFieldEffectChange("isAuraBreak", e.target.checked)}
              className="w-4 h-4 text-[#4e60b1] bg-[#333c67] border-gray-600 rounded focus:ring-[#4e60b1] focus:ring-2"
            />
            <span className="text-gray-300 text-sm">Aura Break</span>
          </label>

          {/* Fairy Aura */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={field.isFairyAura || false}
              onChange={(e) => handleFieldEffectChange("isFairyAura", e.target.checked)}
              className="w-4 h-4 text-[#4e60b1] bg-[#333c67] border-gray-600 rounded focus:ring-[#4e60b1] focus:ring-2"
            />
            <span className="text-gray-300 text-sm">Fairy Aura</span>
          </label>

          {/* Dark Aura */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={field.isDarkAura || false}
              onChange={(e) => handleFieldEffectChange("isDarkAura", e.target.checked)}
              className="w-4 h-4 text-[#4e60b1] bg-[#333c67] border-gray-600 rounded focus:ring-[#4e60b1] focus:ring-2"
            />
            <span className="text-gray-300 text-sm">Dark Aura</span>
          </label>

          {/* Beads of Ruin */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={field.isBeadsOfRuin || false}
              onChange={(e) => handleFieldEffectChange("isBeadsOfRuin", e.target.checked)}
              className="w-4 h-4 text-[#4e60b1] bg-[#333c67] border-gray-600 rounded focus:ring-[#4e60b1] focus:ring-2"
            />
            <span className="text-gray-300 text-sm">Beads of Ruin</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FieldSelection;