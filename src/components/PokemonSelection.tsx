import { useState } from "react"
import PopUp from "./PopUp";
import PokemonList from "./PokemonList";

function PokemonSelection ({gens, initPkm, battlepkm, onChangePkm, onChangeStats}) {

  const statsMap = {hp: "HP", atk: "Atk", def: "Def", spa: "SpA", spd: "Spd", spe: "Spe"};

  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [selectedpkm, setSelectedPkm] = useState(initPkm);
  // const [test, setTest] = useState(battlepkm);

  const handleSeledtedPkm = (pkm) => {
    setSelectedPkm(pkm);
    onChangePkm(pkm.name);
    setIsPopUpOpen(false);
  };

  const handleIvInputChange = (e) => {
    const key = e.target.getAttribute('id');
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
    const key = e.target.getAttribute('id');
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
    // const pkm = test.clone();
    // pkm.level = lvl;
    // setTest(pkm);
    console.log(lvl);
    battlepkm.level = lvl;
    onChangeStats(battlepkm);
  }

  const baseStats = selectedpkm.baseStats;

  const startRange = 6;
  const endRange = -6;

    const generateOptions = () => {
      const options = [];
      for (let i = startRange; i >= endRange; i--) {
        options.push(
          <option key={i} value={i.toString()}>
            {i > 0 ? `+${i}` : (i === 0 ? '-' : i)}
          </option>
        );
      }
      return options;
    };

  const handleBoostChange = (e) => {
    const key = e.target.getAttribute('id');
    const value = e.target.value;

    const boost = battlepkm.boosts;
    boost[key] = Number(value);

    battlepkm.boosts = boost;
    onChangeStats(battlepkm);
  };

  return (
    <div>
      <div className="mt-4 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-800" onClick={() => setIsPopUpOpen(true)}>
        Open Pokémon List
      </div>
      <PopUp isOpen={isPopUpOpen} onClose={() => {setIsPopUpOpen(false)}}>
        <PokemonList gens={gens} onData={handleSeledtedPkm}/>
      </PopUp>
      <div>selected: {selectedpkm.name}</div>
      <div className="flex gap-x-2">level: {battlepkm.level}<button value="50" onClick={handleLevelChange} >50</button><button value="100" onClick={handleLevelChange}>100</button></div>
      <div className="grid grid-cols-7 gap-y-1 w-100">
        <div className="col-span-1"></div>
        <div>Base</div>
        <div>IVs</div>
        <div className="col-span-4">Evs</div>
        {Object.entries(baseStats).map(([stat, value]) => {
          return <>
            <div className="text-center">{statsMap[stat]}</div>
            <div>{value}</div>
            <div className="w-12.5"><input className="w-full" type="number" value={battlepkm.ivs[stat]} id={stat} onChange={handleIvInputChange} /></div>
            <div className="w-12.5"><input className="w-full" type="number" value={battlepkm.evs[stat]} id={stat} onChange={handleEvInputChange} /></div>
            <div>{ battlepkm.stats[stat] } </div>
          { stat === 'hp' ? <div className="col-span-2" /> :
            <>
              <select className="w-10" id={stat} value={battlepkm.boosts[stat]} onChange={handleBoostChange}>
                {generateOptions()}
              </select>
              <div>{battlepkm.boosts[stat] ? battlepkm.boosts[stat] : ''}</div>
            </>
          }
      </>
        })}
      </div>
    </div>
  )

}

export default PokemonSelection