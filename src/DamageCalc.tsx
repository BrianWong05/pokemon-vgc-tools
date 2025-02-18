import { calculate, Field, Move, Pokemon } from "@smogon/calc";
import { useState } from "react";
import PokemonSelection from "./components/PokemonSelection";

function DamageCalc ({gens}) {
  const gen = gens.get(9);
  const initPkm = Array.from(gen.species)[0];
  const initIVs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
  const initEVs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
  const initLvl = 50;

  const [attPkm, setAttPkm] = useState(new Pokemon(gen, initPkm.name, {level:initLvl, ivs: initIVs, evs: initEVs}));
  const [defPkm, setDefPkm] = useState(new Pokemon(gen, initPkm.name, {level:initLvl, ivs: initIVs, evs: initEVs}));
  
  const handleAttPkmChange = (name) => {
    setAttPkm(new Pokemon(gen, name, {level:initLvl, ivs: initIVs, evs: initEVs}));
  };

  const handleAttPkmStatsChange = (pkm) => {
    setAttPkm(pkm.clone());
  };

  const handleDetPkmChange = (name) => {
    setDefPkm(new Pokemon(gen, name, {level:initLvl, ivs: initIVs, evs: initEVs}));
  };

  const handleDefPkmStatsChange = (pkm) => {
    setDefPkm(pkm.clone());
  };

  const handlePkmLvlChange = (e) => {
    const lvl = Number(e.target.value);
    const pkm = [attPkm.clone(), defPkm.clone()];
    console.log(lvl);
    pkm[0].level = lvl;
    pkm[1].level = lvl;
    setAttPkm(pkm[0].clone());
    setDefPkm(pkm[1].clone());
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
  
  // const gen = gens.get(9);
  // const attacker = new Pokemon(gen, attPkm, {
  //   level: 50,
  //   evs: {spa: 252},
  //   nature: "Timid",
  // });
  // const defender = new Pokemon(gen, defPkm, {
  //   level: 50,
  //   evs: {hp: 252, def: 252},
  //   nature: "Impish",
  // });
  // const move = new Move(gen, 'pound');
  // const field = new Field({
  //   weather: 'Rain',
  //   terrain: 'Electric',
  // });
  // const result = calculate(gen, attacker, defender, move, field);

  // const result = calculate(
  //   gen,
  //   new Pokemon(gen, 'Gengar', {
  //     item: 'Choice Specs',
  //     nature: 'Timid',
  //     evs: {hp: 252, spa: 252},
  //     boosts: {spa: 1},
  //   }),
  //   new Pokemon(gen, 'Chansey', {
  //     item: 'Eviolite',
  //     nature: 'Calm',
  //     evs: {hp: 22, spd: 252},
  //     // boosts: {spd: -1},
  //   }),
  //   new Move(gen, 'pound')
  // );

  // console.log(result);

  // const test = calcDamageRange(result);
  // console.log(test);

  // const rawDesc = result.rawDesc;
  // const attackBoost = (rawDesc.attackBoost ? (rawDesc.attackBoost > 0 ? `+${rawDesc.attackBoost}` : rawDesc.attackBoost) : '');
  // const attackEVs = rawDesc.attackEVs;
  // const attackItem = rawDesc.attackerItem || '';
  // const atatckTera = rawDesc.attackerTera || '';
  // const attackName = rawDesc.attackerName;

  // const defendBoost = (rawDesc.defenseBoost ? (rawDesc.defenseBoost > 0 ? `+${rawDesc.defenseBoost}` : rawDesc.defenseBoost) : '');
  // const HPEVs = rawDesc.HPEVs;
  // const defendEVs = rawDesc.defenseEVs;
  // const defendItem = rawDesc.defenderItem || '';
  // const defendTera = rawDesc.defenderTera || '';
  // const defendName = rawDesc.defenderName;

  // const conclusion = `${attackBoost} ${attackEVs} ${attackItem} ${atatckTera} ${attackName} VS. ${defendBoost} ${HPEVs} / ${defendEVs} ${defendItem} ${defendTera} ${defendName}`
  
  // console.log(conclusion);

  console.log(attPkm, defPkm);

  return (
    <div>
      <div className="flex gap-x-2"><button value={50} onClick={handlePkmLvlChange}>50</button><button value={100}  onClick={handlePkmLvlChange}>100</button></div>
      <PokemonSelection gens={gens} initPkm={initPkm} battlepkm={attPkm} onChangePkm={handleAttPkmChange} onChangeStats={handleAttPkmStatsChange} />
      <PokemonSelection gens={gens} initPkm={initPkm} battlepkm={defPkm} onChangePkm={handleDetPkmChange} onChangeStats={handleDefPkmStatsChange} />
    </div>
  )
}

export default DamageCalc