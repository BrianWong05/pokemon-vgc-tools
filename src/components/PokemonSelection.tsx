import { useState } from "react";
import PopUp from "@/components/PopUp";
import PokemonList from "@/pages/PokemonList";
import NatureList from "@/components/NatureList";
import MoveList from "@/pages/MoveList";
import ItemList from "@/pages/ItemList";

function PokemonSelection({ gens, initPkm, battlepkm, onChangePkm, onChangeStats }) {
  const statsMap = { hp: "HP", atk: "Atk", def: "Def", spa: "SpA", spd: "Spd", spe: "Spe" };
  const AttPkmMove = { 0: null, 1: null, 2: null, 3: null };
  const heldItem = battlepkm.item;

  const [isPkmOpen, setIsPkmOpen] = useState(false);
  const [isItemOpen, setIsItemOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState([false, false, false, false]);
  const [selectedpkm, setSelectedPkm] = useState(initPkm);
  const [selectedmove, setSelectedMove] = useState(AttPkmMove);
  const [pkmAbility, setPkmAbility] = useState(Object.values(initPkm.abilities));

  const handleSeledtedPkm = (pkm) => {
    setSelectedPkm(pkm);
    onChangePkm(pkm.name);
    setPkmAbility(Object.values(pkm.abilities));
    setIsPkmOpen(false);
  };

  const handleSeledtedMove = (move, id) => {
    const tmpMove = selectedmove;
    tmpMove[id] = move.name;
    setSelectedMove(tmpMove);
    setIsMoveOpen(isMoveOpen.map((value, index) => (Number(index) === Number(id) ? false : value)));

    battlepkm.moves = Object.values(selectedmove);
    onChangeStats(battlepkm);
  };

  const handleSeledtedItem = (item) => {
    setIsItemOpen(false);

    battlepkm.item = item.name;
    onChangeStats(battlepkm);
  };

  const handleIvInputChange = (e) => {
    const key = e.target.getAttribute("id");
    let value = e.target.value;
    if (isNaN(value)) {
      value = 0;
    } else {
      value = Math.max(0, Math.min(value, 31));
    }
    const ivs = battlepkm.ivs;
    ivs[key] = value;

    battlepkm.ivs = ivs;
    onChangeStats(battlepkm);
  };

  const handleEvInputChange = (e) => {
    const key = e.target.getAttribute("id");
    let value = e.target.value;
    if (isNaN(value)) {
      value = 0;
    } else {
      value = Math.max(0, Math.min(value, 252));
    }
    const evs = battlepkm.evs;
    evs[key] = value;

    battlepkm.evs = evs;
    onChangeStats(battlepkm);
  };

  const handleLevelChange = (e) => {
    const lvl = Number(e.target.value);
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

  const handleBoostChange = (e) => {
    const key = e.target.getAttribute("id");
    const value = e.target.value;

    const boost = battlepkm.boosts;
    boost[key] = Number(value);

    battlepkm.boosts = boost;
    onChangeStats(battlepkm);
  };

  const handlePkmNatureChange = (e) => {
    const value = e.target.value;

    battlepkm.nature = value;
    onChangeStats(battlepkm);
  };

  const handlePkmAbilityChange = (e) => {
    const value = e.target.value;

    battlepkm.ability = value;
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
      <div className="grid grid-cols-7 gap-y-1 w-100">
        <div className="col-span-1"></div>
        <div>Base</div>
        <div>IVs</div>
        <div className="col-span-4">Evs</div>
        {Object.entries(baseStats).map(([stat, value]) => {
          return (
            <>
              <div className="text-center">{statsMap[stat]}</div>
              <div>{value}</div>
              <div className="w-12.5">
                <input
                  className="w-full"
                  type="number"
                  value={battlepkm.ivs[stat]}
                  id={stat}
                  onChange={handleIvInputChange}
                />
              </div>
              <div className="w-12.5">
                <input
                  className="w-full"
                  type="number"
                  value={battlepkm.evs[stat]}
                  id={stat}
                  onChange={handleEvInputChange}
                />
              </div>
              <div>{battlepkm.stats[stat]} </div>
              {stat === "hp" ? (
                <div className="col-span-2" />
              ) : (
                <>
                  <select className="w-10" id={stat} value={battlepkm.boosts[stat]} onChange={handleBoostChange}>
                    {generateOptions()}
                  </select>
                  <div>{battlepkm.boosts[stat] ? battlepkm.boosts[stat] : ""}</div>
                </>
              )}
            </>
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
            return <option> {ability} </option>;
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
        {Object.keys(AttPkmMove).map((i) => {
          return (
            <>
              <div
                className="mt-4 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-800"
                onClick={() =>
                  setIsMoveOpen(isMoveOpen.map((value, index) => (Number(index) === Number(i) ? true : value)))
                }
              >
                {selectedmove[i] ? selectedmove[i] : "Select Move"}
              </div>
              <PopUp
                isOpen={isMoveOpen[i]}
                onClose={() =>
                  setIsMoveOpen(isMoveOpen.map((value, index) => (Number(index) === Number(i) ? false : value)))
                }
              >
                <MoveList id={i} gens={gens} onData={handleSeledtedMove} hidden={true} />
              </PopUp>
            </>
          );
        })}
      </div>
    </div>
  );
}

export default PokemonSelection;
