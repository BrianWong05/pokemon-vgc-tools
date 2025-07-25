import React, { useState } from "react";
import PopUp from "@/components/PopUp";
import PokemonList from "@/pages/PokemonList";
import NatureList from "@/components/NatureList";
import MoveList from "@/pages/MoveList";
import ItemList from "@/pages/ItemList";
import { AbilityName, Generations, Item, MoveData, MoveName, NatureName, Specie } from "@pkmn/data";
import { Pokemon } from "@smogon/calc";

interface IPokemonSelectionProps {
  gens: Generations;
  initPkm: Specie;
  battlepkm: Pokemon;
  onChangePkm(name: string): unknown;
  onChangeStats(battlepkm: Pokemon): unknown;
}

const PokemonSelection: React.FunctionComponent<IPokemonSelectionProps> = ({
  gens,
  initPkm,
  battlepkm,
  onChangePkm,
  onChangeStats,
}) => {
  const statsMap = { hp: "HP", atk: "Atk", def: "Def", spa: "SpA", spd: "Spd", spe: "Spe" };
  const AttPkmMove: { [key: number]: string | null } = { 0: null, 1: null, 2: null, 3: null };
  const heldItem = battlepkm.item;

  const [isPkmOpen, setIsPkmOpen] = useState(false);
  const [isItemOpen, setIsItemOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState([false, false, false, false]);
  const [selectedpkm, setSelectedPkm] = useState(initPkm);
  const [selectedmove, setSelectedMove] = useState<{ [key: number]: string | null }>(AttPkmMove);
  const [pkmAbility, setPkmAbility] = useState(Object.values(initPkm.abilities));

  const handleSeledtedPkm = (pkm: Specie) => {
    setSelectedPkm(pkm);
    onChangePkm(pkm.name);
    setPkmAbility(Object.values(pkm.abilities));
    setIsPkmOpen(false);
  };

  const handleSeledtedMove = (move: MoveData, id: string | number) => {
    const tmpMove = selectedmove;
    tmpMove[Number(id)] = move.name;
    setSelectedMove(tmpMove);
    setIsMoveOpen(isMoveOpen.map((value, index) => (Number(index) === Number(id) ? false : value)));

    battlepkm.moves = Object.values(selectedmove).filter((move): move is MoveName => move !== null);
    onChangeStats(battlepkm);
  };

  const handleSeledtedItem = (item: Item) => {
    setIsItemOpen(false);

    battlepkm.item = item.name;
    onChangeStats(battlepkm);
  };

  const handleIvInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.getAttribute("id");
    let value = Number(e.target.value);
    if (isNaN(value)) {
      value = 0;
    } else {
      value = Math.max(0, Math.min(value, 31));
    }
    const ivs = battlepkm.ivs;
    ivs[key as keyof typeof ivs] = value;

    battlepkm.ivs = ivs;
    onChangeStats(battlepkm);
  };

  const handleEvInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.getAttribute("id");
    let value = Number(e.target.value);
    if (isNaN(value)) {
      value = 0;
    } else {
      value = Math.max(0, Math.min(value, 252));
    }
    const evs = battlepkm.evs;
    evs[key as keyof typeof evs] = value;

    battlepkm.evs = evs;
    onChangeStats(battlepkm);
  };

  const handleLevelChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    const lvl = Number(e.currentTarget.value);
    console.log(lvl);
    battlepkm.level = lvl;
    onChangeStats(battlepkm);
  };

  const baseStats = selectedpkm.baseStats;

  const startRange = 6;
  const endRange = -6;

  const generateOptions = () => {
    const options = [];
    for (let i = startRange; i >= endRange; i--) {
      options.push(
        <option key={i} value={i.toString()}>
          {i > 0 ? `+${i}` : i === 0 ? "-" : i}
        </option>,
      );
    }
    return options;
  };

  const handleBoostChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.getAttribute("id");
    const value = e.target.value;

    const boost = battlepkm.boosts;
    boost[key as keyof typeof boost] = Number(value);

    battlepkm.boosts = boost;
    onChangeStats(battlepkm);
  };

  const handlePkmNatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    battlepkm.nature = value as NatureName;
    onChangeStats(battlepkm);
  };

  const handlePkmAbilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    battlepkm.ability = value as AbilityName;
    onChangeStats(battlepkm);
  };

  return (
    <div className="bg-[#333c67] rounded-xl p-6 shadow-lg border border-[#4e60b1] text-gray-200">
      {/* Pokemon Selection Button */}
      <button
        className="w-full mb-4 px-4 py-3 text-sm bg-[#4e60b1] hover:bg-[#5a6bc4] text-white rounded-xl font-medium shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4e60b1]"
        onClick={() => setIsPkmOpen(true)}
      >
        Select Pokemon
      </button>
      <PopUp
        isOpen={isPkmOpen}
        onClose={() => {
          setIsPkmOpen(false);
        }}
      >
        <PokemonList gens={gens} onData={handleSeledtedPkm} hidden={true} />
      </PopUp>
      
      {/* Selected Pokemon Display */}
      <div className="mb-4 p-3 bg-[#24283B] rounded-lg border border-[#4e60b1]">
        <span className="text-gray-300 text-sm">Selected: </span>
        <span className="text-gray-100 font-semibold">{selectedpkm.name}</span>
      </div>
      
      {/* Level Selection */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-gray-300 font-medium">Level: {battlepkm.level}</span>
        <button 
          value="50" 
          onClick={handleLevelChange}
          className="px-3 py-1 bg-[#4e60b1] hover:bg-[#5a6bc4] text-white rounded-lg text-sm font-medium transition-colors duration-200"
        >
          50
        </button>
        <button 
          value="100" 
          onClick={handleLevelChange}
          className="px-3 py-1 bg-[#4e60b1] hover:bg-[#5a6bc4] text-white rounded-lg text-sm font-medium transition-colors duration-200"
        >
          100
        </button>
      </div>
      {/* Stats Grid */}
      <div className="mb-6 p-4 bg-[#24283B] rounded-lg border border-[#4e60b1]">
        <h4 className="text-gray-100 font-semibold mb-3 text-center">Stats Configuration</h4>
        <div className="grid grid-cols-7 gap-2 text-sm" key={selectedpkm.name}>
          <div className="text-center font-medium text-gray-300"></div>
          <div className="text-center font-medium text-gray-300">Base</div>
          <div className="text-center font-medium text-gray-300">IVs</div>
          <div className="text-center font-medium text-gray-300">EVs</div>
          <div className="text-center font-medium text-gray-300">Total</div>
          <div className="text-center font-medium text-gray-300">Boost</div>
          <div className="text-center font-medium text-gray-300">Final</div>
          
          {Object.entries(baseStats).map(([stat, value]) => {
            return (
              <React.Fragment key={stat}>
                <div className="text-center font-medium text-gray-200 py-2">
                  {statsMap[stat as keyof typeof statsMap]}
                </div>
                <div className="text-center text-gray-300 py-2">{value}</div>
                <div className="flex justify-center">
                  <input
                    className="w-12 px-2 py-1 bg-[#333c67] border border-gray-600 rounded text-gray-200 text-center text-sm focus:border-[#4e60b1] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    type="number"
                    value={battlepkm.ivs[stat as keyof typeof battlepkm.ivs]}
                    id={stat}
                    onChange={handleIvInputChange}
                    min="0"
                    max="31"
                  />
                </div>
                <div className="flex justify-center">
                  <input
                    className="w-12 px-2 py-1 bg-[#333c67] border border-gray-600 rounded text-gray-200 text-center text-sm focus:border-[#4e60b1] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    type="number"
                    value={battlepkm.evs[stat as keyof typeof battlepkm.evs]}
                    id={stat}
                    onChange={handleEvInputChange}
                    min="0"
                    max="252"
                  />
                </div>
                <div className="text-center text-gray-200 py-2 font-medium">
                  {battlepkm.stats[stat as keyof typeof battlepkm.stats]}
                </div>
                {stat === "hp" ? (
                  <div className="col-span-2 text-center text-gray-400 py-2">-</div>
                ) : (
                  <>
                    <div className="flex justify-center">
                      <select
                        className="w-12 px-1 py-1 bg-[#333c67] border border-gray-600 rounded text-gray-200 text-center text-sm focus:border-[#4e60b1] focus:outline-none"
                        id={stat}
                        value={battlepkm.boosts[stat as keyof typeof battlepkm.boosts]}
                        onChange={handleBoostChange}
                      >
                        {generateOptions()}
                      </select>
                    </div>
                    <div className="text-center text-gray-300 py-2">
                      {battlepkm.boosts[stat as keyof typeof battlepkm.boosts] > 0 
                        ? `+${battlepkm.boosts[stat as keyof typeof battlepkm.boosts]}`
                        : battlepkm.boosts[stat as keyof typeof battlepkm.boosts] || "-"}
                    </div>
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      {/* Nature and Ability Selection - Side by Side */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        {/* Nature Selection */}
        <div className="p-4 bg-[#24283B] rounded-lg border border-[#4e60b1]">
          <label className="block text-gray-300 font-medium mb-2">Nature:</label>
          <NatureList gens={gens} onData={handlePkmNatureChange} init={battlepkm.nature} />
        </div>
        
        {/* Ability Selection */}
        <div className="p-4 bg-[#24283B] rounded-lg border border-[#4e60b1]">
          <label className="block text-gray-300 font-medium mb-2">Ability:</label>
          <select 
            onChange={handlePkmAbilityChange}
            className="w-full px-3 py-2 bg-[#333c67] border border-gray-600 rounded-lg text-gray-200 focus:border-[#4e60b1] focus:outline-none"
          >
            {pkmAbility.map((ability) => {
              return <option key={ability} value={ability}>{ability}</option>;
            })}
          </select>
        </div>
      </div>
      
      {/* Item Selection */}
      <div className="mb-4">
        <button
          className="w-full px-4 py-3 text-sm bg-[#4e60b1] hover:bg-[#5a6bc4] text-white rounded-xl font-medium shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4e60b1]"
          onClick={() => setIsItemOpen(true)}
        >
          {heldItem ? heldItem : "Select Item"}
        </button>
        <PopUp
          isOpen={isItemOpen}
          onClose={() => {
            setIsItemOpen(false);
          }}
        >
          <ItemList gens={gens} onData={handleSeledtedItem} hidden={true} />
        </PopUp>
      </div>
      
      {/* Moves Selection */}
      <div className="space-y-3">
        <h4 className="text-gray-100 font-semibold">Moves:</h4>
        {Object.keys(AttPkmMove).map((i, index) => {
          return (
            <div key={index}>
              <button
                className="w-full px-4 py-3 text-sm bg-[#4e60b1] hover:bg-[#5a6bc4] text-white rounded-xl font-medium shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4e60b1]"
                onClick={() =>
                  setIsMoveOpen(isMoveOpen.map((value, index) => (Number(index) === Number(i) ? true : value)))
                }
              >
                {selectedmove[Number(i) as keyof typeof selectedmove]
                  ? selectedmove[Number(i) as keyof typeof selectedmove]
                  : `Select Move ${Number(i) + 1}`}
              </button>
              <PopUp
                isOpen={Boolean(isMoveOpen[i as keyof typeof isMoveOpen])}
                onClose={() =>
                  setIsMoveOpen(isMoveOpen.map((value, index) => (Number(index) === Number(i) ? false : value)))
                }
              >
                <MoveList id={i} gens={gens} onData={handleSeledtedMove} hidden={true} />
              </PopUp>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PokemonSelection;
