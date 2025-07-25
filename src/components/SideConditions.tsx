import React from "react";
import { Field } from "@smogon/calc";
import { Generations } from "@pkmn/data";

interface ISideConditionsProps {
  gens: Generations;
  field: Field;
  onFieldChange: (field: Field) => void;
  side: "attacker" | "defender";
  title: string;
}

const SideConditions: React.FunctionComponent<ISideConditionsProps> = ({
  gens,
  field,
  onFieldChange,
  side,
  title,
}) => {
  const sideField = side === "attacker" ? field.attackerSide : field.defenderSide;

  const handleSideConditionChange = (condition: string, value: boolean | number) => {
    const newField = new Field({
      ...field,
      [side === "attacker" ? "attackerSide" : "defenderSide"]: {
        ...sideField,
        [condition]: value,
      },
    });
    onFieldChange(newField);
  };

  const handleSpikesChange = (layers: number) => {
    handleSideConditionChange("spikes", layers);
  };

  const handleToxicSpikesChange = (layers: number) => {
    handleSideConditionChange("toxicSpikes", layers);
  };

  return (
    <div className="mt-4 p-4 bg-gradient-to-br from-[#1a1d2e] to-[#24283B] rounded-xl border border-[#4e60b1] shadow-lg">
      <h4 className="text-gray-100 font-bold mb-4 text-center text-lg bg-gradient-to-r from-[#4e60b1] to-[#5a6bc4] bg-clip-text text-transparent">
        {title} Side Conditions
      </h4>
      
      <div className="space-y-4">
        {/* Entry Hazards */}
        <div className="bg-[#2a2f47] rounded-lg p-3 border border-[#3d4785]">
          <div className="flex items-center mb-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            <label className="text-red-300 font-semibold text-sm">Entry Hazards</label>
          </div>
          <div className="space-y-3">
            {/* Stealth Rock */}
            <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-[#333c67] transition-colors duration-200">
              <input
                type="checkbox"
                checked={sideField.isSR || false}
                onChange={(e) => handleSideConditionChange("isSR", e.target.checked)}
                className="w-4 h-4 text-[#4e60b1] bg-[#333c67] border-gray-600 rounded focus:ring-[#4e60b1] focus:ring-2"
              />
              <span className="text-gray-200 text-sm font-medium">Stealth Rock</span>
            </label>

            {/* Spikes */}
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#333c67] transition-colors duration-200">
              <span className="text-gray-200 text-sm font-medium">Spikes:</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((layers) => (
                  <button
                    key={layers}
                    onClick={() => handleSpikesChange(layers)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 border ${
                      (sideField.spikes || 0) === layers
                        ? "bg-[#4e60b1] text-white border-[#4e60b1] shadow-lg transform scale-105"
                        : "bg-[#333c67] text-gray-300 border-gray-600 hover:bg-[#3d4785] hover:border-[#4e60b1]"
                    }`}
                  >
                    {layers}
                  </button>
                ))}
              </div>
            </div>

            {/* Toxic Spikes */}
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#333c67] transition-colors duration-200">
              <span className="text-gray-200 text-sm font-medium">Toxic Spikes:</span>
              <div className="flex gap-1">
                {[0, 1, 2].map((layers) => (
                  <button
                    key={layers}
                    onClick={() => handleToxicSpikesChange(layers)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 border ${
                      (sideField.toxicSpikes || 0) === layers
                        ? "bg-purple-600 text-white border-purple-600 shadow-lg transform scale-105"
                        : "bg-[#333c67] text-gray-300 border-gray-600 hover:bg-[#3d4785] hover:border-purple-500"
                    }`}
                  >
                    {layers}
                  </button>
                ))}
              </div>
            </div>

            {/* Sticky Web */}
            <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-[#333c67] transition-colors duration-200">
              <input
                type="checkbox"
                checked={sideField.isStickyWeb || false}
                onChange={(e) => handleSideConditionChange("isStickyWeb", e.target.checked)}
                className="w-4 h-4 text-[#4e60b1] bg-[#333c67] border-gray-600 rounded focus:ring-[#4e60b1] focus:ring-2"
              />
              <span className="text-gray-200 text-sm font-medium">Sticky Web</span>
            </label>
          </div>
        </div>

        {/* Screens */}
        <div className="bg-[#2a2f47] rounded-lg p-3 border border-[#3d4785]">
          <div className="flex items-center mb-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <label className="text-blue-300 font-semibold text-sm">Protective Screens</label>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-[#333c67] transition-colors duration-200">
              <input
                type="checkbox"
                checked={sideField.isReflect || false}
                onChange={(e) => handleSideConditionChange("isReflect", e.target.checked)}
                className="w-4 h-4 text-[#4e60b1] bg-[#333c67] border-gray-600 rounded focus:ring-[#4e60b1] focus:ring-2"
              />
              <span className="text-gray-200 text-sm font-medium">Reflect</span>
              <span className="text-xs text-gray-400 ml-auto">Physical</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-[#333c67] transition-colors duration-200">
              <input
                type="checkbox"
                checked={sideField.isLightScreen || false}
                onChange={(e) => handleSideConditionChange("isLightScreen", e.target.checked)}
                className="w-4 h-4 text-[#4e60b1] bg-[#333c67] border-gray-600 rounded focus:ring-[#4e60b1] focus:ring-2"
              />
              <span className="text-gray-200 text-sm font-medium">Light Screen</span>
              <span className="text-xs text-gray-400 ml-auto">Special</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-[#333c67] transition-colors duration-200">
              <input
                type="checkbox"
                checked={sideField.isAuroraVeil || false}
                onChange={(e) => handleSideConditionChange("isAuroraVeil", e.target.checked)}
                className="w-4 h-4 text-[#4e60b1] bg-[#333c67] border-gray-600 rounded focus:ring-[#4e60b1] focus:ring-2"
              />
              <span className="text-gray-200 text-sm font-medium">Aurora Veil</span>
              <span className="text-xs text-gray-400 ml-auto">Both</span>
            </label>
          </div>
        </div>

        {/* Other Conditions */}
        <div className="bg-[#2a2f47] rounded-lg p-3 border border-[#3d4785]">
          <div className="flex items-center mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <label className="text-green-300 font-semibold text-sm">Battle Conditions</label>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-[#333c67] transition-colors duration-200">
              <input
                type="checkbox"
                checked={sideField.isProtected || false}
                onChange={(e) => handleSideConditionChange("isProtected", e.target.checked)}
                className="w-4 h-4 text-[#4e60b1] bg-[#333c67] border-gray-600 rounded focus:ring-[#4e60b1] focus:ring-2"
              />
              <span className="text-gray-200 text-sm font-medium">Protected</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-[#333c67] transition-colors duration-200">
              <input
                type="checkbox"
                checked={sideField.isSeeded || false}
                onChange={(e) => handleSideConditionChange("isSeeded", e.target.checked)}
                className="w-4 h-4 text-[#4e60b1] bg-[#333c67] border-gray-600 rounded focus:ring-[#4e60b1] focus:ring-2"
              />
              <span className="text-gray-200 text-sm font-medium">Leech Seed</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-[#333c67] transition-colors duration-200">
              <input
                type="checkbox"
                checked={sideField.isForesight || false}
                onChange={(e) => handleSideConditionChange("isForesight", e.target.checked)}
                className="w-4 h-4 text-[#4e60b1] bg-[#333c67] border-gray-600 rounded focus:ring-[#4e60b1] focus:ring-2"
              />
              <span className="text-gray-200 text-sm font-medium">Foresight</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-[#333c67] transition-colors duration-200">
              <input
                type="checkbox"
                checked={sideField.isTailwind || false}
                onChange={(e) => handleSideConditionChange("isTailwind", e.target.checked)}
                className="w-4 h-4 text-[#4e60b1] bg-[#333c67] border-gray-600 rounded focus:ring-[#4e60b1] focus:ring-2"
              />
              <span className="text-gray-200 text-sm font-medium">Tailwind</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-[#333c67] transition-colors duration-200">
              <input
                type="checkbox"
                checked={sideField.isHelpingHand || false}
                onChange={(e) => handleSideConditionChange("isHelpingHand", e.target.checked)}
                className="w-4 h-4 text-[#4e60b1] bg-[#333c67] border-gray-600 rounded focus:ring-[#4e60b1] focus:ring-2"
              />
              <span className="text-gray-200 text-sm font-medium">Helping Hand</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-[#333c67] transition-colors duration-200">
              <input
                type="checkbox"
                checked={sideField.isFriendGuard || false}
                onChange={(e) => handleSideConditionChange("isFriendGuard", e.target.checked)}
                className="w-4 h-4 text-[#4e60b1] bg-[#333c67] border-gray-600 rounded focus:ring-[#4e60b1] focus:ring-2"
              />
              <span className="text-gray-200 text-sm font-medium">Friend Guard</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideConditions;