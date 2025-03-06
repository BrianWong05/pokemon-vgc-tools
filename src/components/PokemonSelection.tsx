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
    <div className="w-fit">
      <div
        className="mt-4 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-800"
        onClick={() => setIsPkmOpen(true)}
      >
        Open Pokémon List
      </div>
      <PopUp
        isOpen={isPkmOpen}
        onClose={() => {
          setIsPkmOpen(false);
        }}
      >
        <PokemonList gens={gens} onData={handleSeledtedPkm} hidden={true} />
      </PopUp>
      <div>selected: {selectedpkm.name}</div>
      <div className="flex gap-x-2">
        level: {battlepkm.level}
        <button value="50" onClick={handleLevelChange}>
          50
        </button>
        <button value="100" onClick={handleLevelChange}>
          100
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-1 w-100" key={selectedpkm.name}>
        <div className="col-span-1"></div>
        <div>Base</div>
        <div>IVs</div>
        <div className="col-span-4">Evs</div>
        {Object.entries(baseStats).map(([stat, value]) => {
          return (
            <div className="grid grid-cols-7 col-span-7" key={stat}>
              <div className="text-center">{statsMap[stat as keyof typeof statsMap]}</div>
              <div>{value}</div>
              <div className="w-12.5">
                <input
                  className="w-full"
                  type="number"
                  value={battlepkm.ivs[stat as keyof typeof battlepkm.ivs]}
                  id={stat}
                  onChange={handleIvInputChange}
                />
              </div>
              <div className="w-12.5">
                <input
                  className="w-full"
                  type="number"
                  value={battlepkm.evs[stat as keyof typeof battlepkm.evs]}
                  id={stat}
                  onChange={handleEvInputChange}
                />
              </div>
              <div>{battlepkm.stats[stat as keyof typeof battlepkm.stats]} </div>
              {stat === "hp" ? (
                <div className="col-span-2" />
              ) : (
                <>
                  <select
                    className="w-10"
                    id={stat}
                    value={battlepkm.boosts[stat as keyof typeof battlepkm.boosts]}
                    onChange={handleBoostChange}
                  >
                    {generateOptions()}
                  </select>
                  <div>
                    {battlepkm.boosts[stat as keyof typeof battlepkm.boosts]
                      ? battlepkm.boosts[stat as keyof typeof battlepkm.boosts]
                      : ""}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div>
        Nature: <NatureList gens={gens} onData={handlePkmNatureChange} init={battlepkm.nature} />
      </div>
      <div>
        Ability:{" "}
        <select onChange={handlePkmAbilityChange}>
          {pkmAbility.map((ability) => {
            return <option key={ability}> {ability} </option>;
          })}
        </select>
      </div>
      <div
        className="mt-4 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-800"
        onClick={() => setIsItemOpen(true)}
      >
        {heldItem ? heldItem : "Select Item"}
      </div>
      <PopUp
        isOpen={isItemOpen}
        onClose={() => {
          setIsItemOpen(false);
        }}
      >
        <ItemList gens={gens} onData={handleSeledtedItem} hidden={true} />
      </PopUp>
      <div>
        {Object.keys(AttPkmMove).map((i, index) => {
          return (
            <div key={index}>
              <div
                className="mt-4 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-800"
                onClick={() =>
                  setIsMoveOpen(isMoveOpen.map((value, index) => (Number(index) === Number(i) ? true : value)))
                }
              >
                {selectedmove[Number(i) as keyof typeof selectedmove]
                  ? selectedmove[Number(i) as keyof typeof selectedmove]
                  : "Select Move"}
              </div>
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
