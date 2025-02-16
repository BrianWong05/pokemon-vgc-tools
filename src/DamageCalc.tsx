import { calculate, Field, Move, Pokemon } from "@smogon/calc";
import { useState } from "react";
import PopUp from "./components/PopUp";
import PokemonList from "./components/PokemonList";

function DamageCalc ({gens}) {

  const [isPopUpAttOpen, setIsPopUpAttOpen] = useState(false);
  const [attPkm, setAttPkm] = useState('');

  const handleSeledtedAttPkm = (name) => {
    setAttPkm(name);
    setIsPopUpAttOpen(false);
  }

  const [isPopUpDefOpen, setIsPopUpDefOpen] = useState(false);
  const [defPkm, setDefPkm] = useState('');

  const handleSeledtedDefPkm = (name) => {
    setDefPkm(name);
    setIsPopUpDefOpen(false);
  }

  const calcDamageRange = (result) => {
    const move = result.move.name;
    const damages = result.damage;
    const defendPkm = result.defender;
  
    const defendPkmHP = defendPkm.stats.hp;
    const attackLowRange = parseFloat((damages[0]/defendPkmHP * 100).toFixed(1));
    const attackHighRange = parseFloat((damages[15]/defendPkmHP * 100).toFixed(1));
    return [move, attackLowRange, attackHighRange]
  };
  
  const gen = gens.get(9);
  const attacker = new Pokemon(gen, 'Pikachu', {
    level: 50,
    evs: {spa: 252},
    nature: "Timid",
  });
  const defender = new Pokemon(gen, 'Garchomp', {
    level: 50,
    evs: {hp: 252, def: 252},
    nature: "Impish",
  });
  const move = new Move(gen, 'pound');
  const field = new Field({
    weather: 'Rain',
    terrain: 'Electric',
  });
  // const result = calculate(gen, attacker, defender, move, field);

  const result = calculate(
    gen,
    new Pokemon(gen, 'Gengar', {
      item: 'Choice Specs',
      nature: 'Timid',
      evs: {hp: 252, spa: 252},
      boosts: {spa: 1},
    }),
    new Pokemon(gen, 'Chansey', {
      item: 'Eviolite',
      nature: 'Calm',
      evs: {hp: 22, spd: 252},
      // boosts: {spd: -1},
    }),
    new Move(gen, 'pound')
  );

  console.log(result);

  const test = calcDamageRange(result);
  console.log(test);

  const rawDesc = result.rawDesc;
  const attackBoost = (rawDesc.attackBoost ? (rawDesc.attackBoost > 0 ? `+${rawDesc.attackBoost}` : rawDesc.attackBoost) : '');
  const attackEVs = rawDesc.attackEVs;
  const attackItem = rawDesc.attackerItem || '';
  const atatckTera = rawDesc.attackerTera || '';
  const attackName = rawDesc.attackerName;

  const defendBoost = (rawDesc.defenseBoost ? (rawDesc.defenseBoost > 0 ? `+${rawDesc.defenseBoost}` : rawDesc.defenseBoost) : '');
  const HPEVs = rawDesc.HPEVs;
  const defendEVs = rawDesc.defenseEVs;
  const defendItem = rawDesc.defenderItem || '';
  const defendTera = rawDesc.defenderTera || '';
  const defendName = rawDesc.defenderName;

  const conclusion = `${attackBoost} ${attackEVs} ${attackItem} ${atatckTera} ${attackName} VS. ${defendBoost} ${HPEVs} / ${defendEVs} ${defendItem} ${defendTera} ${defendName}`
  
  console.log(conclusion);

  return (
    <div>
      test
      <div className="mt-4 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-800" onClick={() => setIsPopUpAttOpen(true)}>
        Open Pokémon List
      </div>
      <PopUp isOpen={isPopUpAttOpen} onClose={() => {setIsPopUpAttOpen(false)}}>
        <PokemonList gens={gens} onData={handleSeledtedAttPkm}/>
      </PopUp>
      <div>selected: {attPkm.name}</div>


      <div className="mt-4 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-800" onClick={() => setIsPopUpDefOpen(true)}>
        Open Pokémon List
      </div>
      <PopUp isOpen={isPopUpDefOpen} onClose={() => {setIsPopUpDefOpen(false)}}>
        <PokemonList gens={gens} onData={handleSeledtedDefPkm}/>
      </PopUp>
      <div>selected: {defPkm.name}</div>
    </div>
  )
}

export default DamageCalc