import { calculate, Field, Move, Pokemon, Result } from "@smogon/calc";
import React, { useEffect, useState } from "react";
import PokemonSelection from "@/components/PokemonSelection";
import CalcMoveDamage from "@/components/CalcMoveDamage";
import Layout from "@/components/layout";
import { Generations, Specie } from "@pkmn/data";

interface IDamageCalcProps {
  gens: Generations;
}

const DamageCalc: React.FunctionComponent<IDamageCalcProps> = ({ gens }) => {
  const gen = gens.get(9);
  const initPkm = Array.from(gen.species)[0] as Specie;
  const initIVs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
  const initEVs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
  const initLvl = 50;

  const [atkPkm, setAtkPkm] = useState(new Pokemon(gen, initPkm.name, { level: initLvl, ivs: initIVs, evs: initEVs }));
  const [defPkm, setDefPkm] = useState(new Pokemon(gen, initPkm.name, { level: initLvl, ivs: initIVs, evs: initEVs }));
  const [resultDesc, setResultDesc] = useState("");
  const [possibleDamage, setPossibleDamage] = useState("");

  const handleAttPkmChange = (name: string) => {
    setAtkPkm(new Pokemon(gen, name, { level: initLvl, ivs: initIVs, evs: initEVs }));
  };

  const handleAttPkmStatsChange = (pkm: Pokemon) => {
    setAtkPkm(pkm.clone());
  };

  const handleDetPkmChange = (name: string) => {
    setDefPkm(new Pokemon(gen, name, { level: initLvl, ivs: initIVs, evs: initEVs }));
  };

  const handleDefPkmStatsChange = (pkm: Pokemon) => {
    setDefPkm(pkm.clone());
  };

  const cmp = (
    a: {
      conclusion: string;
      damageRange: number[];
    },
    b: {
      conclusion: string;
      damageRange: number[];
    },
  ) => {
    if (a.damageRange[15] < b.damageRange[15]) return 1;
    if (a.damageRange[15] > b.damageRange[15]) return -1;
    return 0;
  };

  function isEmpty(obj: object) {
    for (const prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }

    return true;
  }

  const handlePkmLvlChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    const lvl = Number(e.currentTarget.value);
    const pkm = [atkPkm.clone(), defPkm.clone()];
    console.log(lvl);
    pkm[0].level = lvl;
    pkm[1].level = lvl;
    setAtkPkm(pkm[0].clone());
    setDefPkm(pkm[1].clone());
  };

  const calcDamageRange = (result: Result) => {
    const move = result.move.name;
    const damages = result.damage as number[];
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
  //       weather: "";
  //       terrain?: Terrain;
  //       isMagicRoom: boolean;
  //       isWonderRoom: boolean;
  //       isGravity: boolean;
  //       isAuraBreak?: boolean;
  //       isFairyAura?: boolean;
  //       isDarkAura?: boolean;
  //       isBeadsOfRuin?: boolean;
  //       isSwordOfRuin?: boolean;
  //       isTabletsOfRuin?: boolean;
  //       isVesselOfRuin?: boolean;
  // });

  const damagePercentageRange: { [key: number]: { [move: string]: string } } = {
    0: { "No Move": "0% - 0%" },
    1: { "No Move": "0% - 0%" },
    2: { "No Move": "0% - 0%" },
    3: { "No Move": "0% - 0%" },
  };

  const damageRange: number[][] = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ];

  const rawDescs: { [key: number]: unknown | null } = {
    0: {},
    1: {},
    2: {},
    3: {},
  };

  console.log("Result");

  atkPkm.moves.forEach((move, index) => {
    const result = move ? calculate(gen, atkPkm, defPkm, new Move(gen, move)) : null;
    // console.log("result", result);
    damagePercentageRange[index] = result ? calcDamageRange(result) : { "No Move": "0% - 0%" };
    damageRange[index] = Array.isArray(result?.damage) ? (result.damage as number[]) : [0, 0];
    rawDescs[index] = result?.rawDesc;
  });

  // console.log("raw", rawDescs);
  // console.log("damage", damageRange);

  const getResultDesc = (rawDescs: { [key: number]: object }) => {
    const resultDescs: { [key: string]: { conclusion: string; damageRange: number[] } } = {};
    Object.entries(rawDescs).map(([key, value]) => {
      if (!isEmpty(value)) {
        console.log("raw", value, Result["rawDesc"]);
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
        const minDamage = Object.values(damageRange[key as keyof typeof damageRange])[0];
        const maxDamage = Object.values(damageRange[key as keyof typeof damageRange])[15];

        const conclusion = `${attackBoost}${attackEVs} ${attackItem}${atatckTera}${attackName} ${Object.keys(
          damagePercentageRange[Number(key)],
        )} VS. ${defendBoost}${HPEVs} / ${defendEVs} ${defendItem}${defendTera}${defendName}: ${minDamage}-${maxDamage} (${Object.values(
          damagePercentageRange[Number(key)],
        )})`;
        resultDescs[key] = {
          conclusion: conclusion,
          damageRange: damageRange[key as keyof typeof damageRange] as number[],
        };
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
      console.log("last one", key, conclusion[key as keyof typeof conclusion]["damageRange"]);
      setResultDesc(conclusion[key as keyof typeof conclusion]["conclusion"] || "");
      setPossibleDamage((conclusion[key as keyof typeof conclusion]["damageRange"] as number[]).toString());
    }
  }, [conclusion]);

  return (
    <Layout fixed={false}>
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
};

export default DamageCalc;
