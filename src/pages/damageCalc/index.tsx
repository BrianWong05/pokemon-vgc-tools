import { calculate, Field, Move, Pokemon } from "@smogon/calc";
import { useEffect, useState } from "react";
import PokemonSelection from "@/components/PokemonSelection";
import CalcMoveDamage from "@/components/CalcMoveDamage";
import Layout from "@/components/layout";

function DamageCalc({ gens }) {
  const gen = gens.get(9);
  const initPkm = Array.from(gen.species)[0];
  const initIVs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
  const initEVs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
  const initLvl = 50;

  const [atkPkm, setAtkPkm] = useState(new Pokemon(gen, initPkm.name, { level: initLvl, ivs: initIVs, evs: initEVs }));
  const [defPkm, setDefPkm] = useState(new Pokemon(gen, initPkm.name, { level: initLvl, ivs: initIVs, evs: initEVs }));
  const [resultDesc, setResultDesc] = useState("");
  const [possibleDamage, setPossibleDamage] = useState("");

  const handleAttPkmChange = (name) => {
    setAtkPkm(new Pokemon(gen, name, { level: initLvl, ivs: initIVs, evs: initEVs }));
  };

  const handleAttPkmStatsChange = (pkm) => {
    setAtkPkm(pkm.clone());
  };

  const handleDetPkmChange = (name) => {
    setDefPkm(new Pokemon(gen, name, { level: initLvl, ivs: initIVs, evs: initEVs }));
  };

  const handleDefPkmStatsChange = (pkm) => {
    setDefPkm(pkm.clone());
  };

  const cmp = (a, b) => {
    if (a.damageRange[15] < b.damageRange[15]) return 1;
    if (a.damageRange[15] > b.damageRange[15]) return -1;
    return 0;
  };

  function isEmpty(obj) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }

    return true;
  }

  const handlePkmLvlChange = (e) => {
    const lvl = Number(e.target.value);
    const pkm = [atkPkm.clone(), defPkm.clone()];
    console.log(lvl);
    pkm[0].level = lvl;
    pkm[1].level = lvl;
    setAtkPkm(pkm[0].clone());
    setDefPkm(pkm[1].clone());
  };

  const calcDamageRange = (result) => {
    const move = result.move.name;
    const damages = result.damage;
    const defendPkm = result.defender;

    const drain = result.move.drain ? result.move.drain : null;
    const recoil = result.move.recoil ? result.move.recoil : null;
    const defendPkmHP = defendPkm.stats.hp;
    const attackLowRange = parseFloat(((damages[0] / defendPkmHP) * 100).toFixed(1));
    const attackHighRange = parseFloat(((damages[15] / defendPkmHP) * 100).toFixed(1));
    console.log(result, drain, recoil);

    const returnObj = { [move]: `${attackLowRange}% - ${attackHighRange}%` };
    if (drain) {
      returnObj[move] = `${returnObj[move]} (${parseFloat(
        ((attackLowRange * drain[0]) / drain[1]).toFixed(1),
      )}% - ${parseFloat(((attackHighRange * drain[0]) / drain[1]).toFixed(1))}% recovered)`;
    }
    if (recoil) {
      returnObj[move] = `${returnObj[move]} (${parseFloat(
        ((attackLowRange * recoil[0]) / recoil[1]).toFixed(1),
      )}% - ${parseFloat(((attackHighRange * recoil[0]) / recoil[1]).toFixed(1))}% recoiled)`;
    }
    return returnObj;
  };

  // const move = new Move(gen, 'pound');
  // const field = new Field({
  //   weather: 'Rain',
  //   terrain: 'Electric',
  // });

  const damagePercentageRange = {
    0: { "No Move": "0% - 0%" },
    1: { "No Move": "0% - 0%" },
    2: { "No Move": "0% - 0%" },
    3: { "No Move": "0% - 0%" },
  };

  const damageRange = {
    0: [0, 0],
    1: [0, 0],
    2: [0, 0],
    3: [0, 0],
  };

  const rawDescs = {
    0: {},
    1: {},
    2: {},
    3: {},
  };

  atkPkm.moves.forEach((move, index) => {
    const result = move ? calculate(gen, atkPkm, defPkm, new Move(gen, move)) : null;
    // console.log("result", result);
    damagePercentageRange[index] = result ? calcDamageRange(result) : { "No Move": "0% - 0%" };
    damageRange[index] = result ? result.damage : [0, 0];
    rawDescs[index] = result?.rawDesc;
  });

  // console.log("raw", rawDescs);
  // console.log("damage", damageRange);

  const getResultDesc = (rawDescs) => {
    const resultDescs = {};
    Object.entries(rawDescs).map(([key, value]) => {
      if (!isEmpty(value)) {
        console.log("raw", value);
        const attackBoost = value.attackBoost
          ? value.attackBoost > 0
            ? `+${value.attackBoost} `
            : value.attackBoost + " "
          : "";
        const attackEVs = value.attackEVs;
        const attackItem = value.attackerItem ? value.attackerItem + " " : "";
        const atatckTera = value.attackerTera ? value.attackerTera + " " : "";
        const attackName = value.attackerName;

        const defendBoost = value.defenseBoost
          ? value.defenseBoost > 0
            ? `+${value.defenseBoost} `
            : value.defenseBoost + " "
          : "";
        const HPEVs = value.HPEVs;
        const defendEVs = value.defenseEVs;
        const defendItem = value.defenderItem ? value.defenderItem + " " : "";
        const defendTera = value.defenderTera ? value.defenderTera + " " : "";
        const defendName = value.defenderName;
        const minDamage = Object.values(damageRange[key])[0];
        const maxDamage = Object.values(damageRange[key])[15];

        const conclusion = `${attackBoost}${attackEVs} ${attackItem}${atatckTera}${attackName} ${Object.keys(
          damagePercentageRange[key],
        )} VS. ${defendBoost}${HPEVs} / ${defendEVs} ${defendItem}${defendTera}${defendName}: ${minDamage}-${maxDamage} (${Object.values(
          damagePercentageRange[key],
        )})`;
        resultDescs[key] = { conclusion: conclusion, damageRange: damageRange[key] };
        console.log(resultDescs);
      }
    });
    return resultDescs;
  };

  const conclusion = getResultDesc(rawDescs);
  console.log("con", conclusion);

  console.log(atkPkm, defPkm);

  useEffect(() => {
    if (!isEmpty(conclusion)) {
      const key = Object.entries(conclusion).sort((a, b) => cmp(a[1], b[1]))[0][0];
      console.log("last one", key, conclusion[key]["damageRange"]);
      setResultDesc(conclusion[key]["conclusion"] || "");
      setPossibleDamage(conclusion[key]["damageRange"].toString());
    }
  }, [conclusion]);

  return (
    <Layout>
      <div className="flex flex-col mt-5">
        <div className="mx-10">
          <CalcMoveDamage gens={gens} atkPkm={atkPkm} defPkm={defPkm} />
          <div className="text-lg font-black mt-2 ml-2">
            <div>{resultDesc}</div>
            <div className="text-sm font-light">{possibleDamage && `Posible Damage amounts: (${possibleDamage})`}</div>
          </div>
        </div>
        <div className="flex justify-between p-10">
          <PokemonSelection
            gens={gens}
            initPkm={initPkm}
            battlepkm={atkPkm}
            onChangePkm={handleAttPkmChange}
            onChangeStats={handleAttPkmStatsChange}
          />
          <div className="flex gap-x-2">
            <button value={50} onClick={handlePkmLvlChange}>
              Level 50
            </button>
            <button value={100} onClick={handlePkmLvlChange}>
              Level 100
            </button>
          </div>
          <PokemonSelection
            gens={gens}
            initPkm={initPkm}
            battlepkm={defPkm}
            onChangePkm={handleDetPkmChange}
            onChangeStats={handleDefPkmStatsChange}
          />
        </div>
      </div>
    </Layout>
  );
}

export default DamageCalc;
