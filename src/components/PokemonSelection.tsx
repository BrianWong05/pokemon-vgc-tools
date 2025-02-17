import { useState } from "react"
import PopUp from "./PopUp";
import PokemonList from "./PokemonList";

function PokemonSelection ({gens, initPkm, battlepkm, onChangePkm, onChangeStats}) {
  const initIVs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
  const initEVs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};

  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [selectedpkm, setSelectedPkm] = useState(initPkm);
  const [ivs, setIvs] = useState(initIVs);
  const [evs, setEvs] = useState(initEVs);

  const handleSeledtedPkm = (pkm) => {
    setSelectedPkm(pkm);
    onChangePkm(pkm.name);
    setEvs(initEVs);
    setIvs(initIVs);
    setSelectedBoostValue(initBoostValue);
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
    let tmpIvs = ivs;
    tmpIvs[key] = value;

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
    let tmpEvs = evs;
    tmpEvs[key] = value;

    battlepkm.evs = evs;
    onChangeStats(battlepkm);
  };

  const baseStats = selectedpkm.baseStats;

  const startRange = 6;
  const endRange = -6;
  const initBoostValue = {atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
  const [selectedBoostValue, setSelectedBoostValue] = useState(initBoostValue);

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
    setSelectedBoostValue((prevState) => ({
      ...prevState,
      [key]: Number(value)
    }));
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
      <div>
        {Object.entries(baseStats).map(([stat, value]) => {
          return <div>{stat} {value} <input type="number" value={ivs[stat]} id={stat} onChange={handleIvInputChange} />
           <input type="number" value={evs[stat]} id={stat} onChange={handleEvInputChange} /> {} 
           { stat === 'hp' ? null :
             <>
                <select id={stat} value={selectedBoostValue[stat]} onChange={handleBoostChange}>
                  {generateOptions()}
                </select>
                {selectedBoostValue[stat]}
              </>
           }
      </div>
        })}
      </div>
    </div>
  )

}

export default PokemonSelection