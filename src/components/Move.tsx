import { icons } from "@/assets/icons";
import physical from "@/assets/images/Physical_SV_icon.png";
import special from "@/assets/images/Special_SV_icon.png";
import status from "@/assets/images/Status_SV_icon.png";
import { MoveData } from "@pkmn/data";
import React from "react";

interface IMoveProps {
  move: MoveData;
  onData?: (move: MoveData, id: string | number) => unknown;
  id: string | number;
}

const categoryIcons = {
  physical: physical,
  special: special,
  status: status,
};

const targetMap = {
  any: "Any",
  normal: "Any",
  allAdjacentFoes: "All foes",
  allAdjacent: "All",
  self: "Self",
  adjacentAllyOrSelf: "Ally or self",
  adjacentAlly: "Ally",
  allySide: "All allies",
  foeSide: "All foes",
};

const Move: React.FunctionComponent<IMoveProps> = ({ move, onData, id }) => {
  const props = ["contact", "heal", "power", "bite", "bullet", "slicing", "wind", "dance", "pulse", "sound", "punch"];
  const flags = Object.keys(move.flags);
  const moveProp = flags.filter((item) => props.some((prop) => item.toLowerCase().includes(prop)));

  const type = move.type.toLocaleLowerCase() as keyof typeof icons;
  const category = move.category.toLocaleLowerCase() as keyof typeof categoryIcons;
  const basePower = "basePower" in move ? String(move.basePower) : "-";
  const accuracy = "accuracy" in move ? (move.accuracy === true ? "-" : String(move.accuracy)) : "-";
  const priority = move.priority ? (move.priority > 0 ? `+${move.priority}` : move.priority) : "-";
  const icon = icons[type];
  const categoryIcon = categoryIcons[category];
  const target = targetMap[move.target as keyof typeof targetMap];

  const selectedMove = () => {
    if (onData) {
      onData(move, id);
    }
  };

  return (
    <>
      <div className="cursor-pointer w-fit" onClick={selectedMove}>
        <div className={`text-gray-200 flex w-screen sm:w-xl px-2 sm:px-0`}>
          <div className="block pl-5 py-5 justify-between w-full">
            <div className="flex justify-between">
              <img src={categoryIcon} className="h-9" />
              <div className="text-2xl my-auto">{move.name}</div>
              <img src={icon} className="h-9" />
            </div>
            <div className="flex justify-space my-2">
              <div className="text-sm text-gray-400 m-1 px-2 py-auto rounded-xl border-2 border-gray-400">
                Target: {target}
              </div>
              {moveProp.map((prop) => {
                return (
                  <div
                    key={prop}
                    className="text-sm text-gray-400 m-1 px-2 py-auto rounded-xl border-2 border-gray-400"
                  >
                    {prop}{" "}
                  </div>
                );
              })}
            </div>
            <div className="text-sm text-justify ml-2">{"desc" in move ? String(move.desc) : ""}</div>
          </div>
          <div className="h-50 w-30 content-center">
            <div className="text-center">
              <div className="text-xl">{basePower}</div>
              <div className="text-xs">Power</div>
            </div>
            <div className="text-center">
              <div className="text-xl">{accuracy}</div>
              <div className="text-xs">Accurcay</div>
            </div>
            <div className="text-center">
              <div className="text-xl">{priority}</div>
              <div className="text-xs">Priority</div>
            </div>
          </div>
        </div>
        <hr className="w-full sm:w-xl border-gray-700" />
      </div>
    </>
  );
};

export default Move;
