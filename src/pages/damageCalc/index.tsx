import { calculate, Field, Move, Pokemon, Result } from "@smogon/calc";
import React, { useEffect, useState } from "react";
import PokemonSelection from "@/components/PokemonSelection";
import CalcMoveDamage from "@/components/CalcMoveDamage";
import Layout from "@/components/layout";
import { Generations, Specie } from "@pkmn/data";

interface RawDescData {
  attackBoost?: number;
  attackEVs?: string;
  attackerItem?: string;
  attackerTera?: string;
  attackerName?: string;
  defenseBoost?: number;
  HPEVs?: string;
  defenseEVs?: string;
  defenderItem?: string;
  defenderTera?: string;
  defenderName?: string;
}

interface ResultWithRawDesc extends Omit<Result, 'rawDesc'> {
  rawDesc?: RawDescData;
}

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
  const [selectedMoveIndex, setSelectedMoveIndex] = useState<number | null>(null);
  const [selectedDefenderMoveIndex, setSelectedDefenderMoveIndex] = useState<number | null>(null);

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

  const defenderDamageRange: number[][] = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ];

  const rawDescs: { [key: number]: RawDescData } = {
    0: {},
    1: {},
    2: {},
    3: {},
  };

  const defenderRawDescs: { [key: number]: RawDescData } = {
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
    rawDescs[index] = (result as ResultWithRawDesc)?.rawDesc || {};
  });

  // Calculate defender moves damage
  const defenderDamagePercentageRange: { [key: number]: { [move: string]: string } } = {
    0: { "No Move": "0% - 0%" },
    1: { "No Move": "0% - 0%" },
    2: { "No Move": "0% - 0%" },
    3: { "No Move": "0% - 0%" },
  };

  defPkm.moves.forEach((move, index) => {
    const result = move ? calculate(gen, defPkm, atkPkm, new Move(gen, move)) : null;
    defenderDamagePercentageRange[index] = result ? calcDamageRange(result) : { "No Move": "0% - 0%" };
    defenderDamageRange[index] = Array.isArray(result?.damage) ? (result.damage as number[]) : [0, 0];
    defenderRawDescs[index] = (result as ResultWithRawDesc)?.rawDesc || {};
  });

  // console.log("raw", rawDescs);
  // console.log("damage", damageRange);

  const getResultDesc = (rawDescs: { [key: number]: RawDescData }, damageRangeData: number[][], damagePercentageData: { [key: number]: { [move: string]: string } }, isDefender: boolean = false) => {
    const resultDescs: { [key: string]: { conclusion: string; damageRange: number[] } } = {};
    Object.entries(rawDescs).map(([key, value]) => {
      if (!isEmpty(value)) {
        console.log("raw", value);
        const attackBoost = value.attackBoost
          ? value.attackBoost > 0
            ? `+${value.attackBoost} `
            : value.attackBoost + " "
          : "";
        const attackEVs = value.attackEVs || "";
        const attackItem = value.attackerItem ? value.attackerItem + " " : "";
        const atatckTera = value.attackerTera ? value.attackerTera + " " : "";
        const attackName = value.attackerName || "";

        const defendBoost = value.defenseBoost
          ? value.defenseBoost > 0
            ? `+${value.defenseBoost} `
            : value.defenseBoost + " "
          : "";
        const HPEVs = value.HPEVs || "";
        const defendEVs = value.defenseEVs || "";
        const defendItem = value.defenderItem ? value.defenderItem + " " : "";
        const defendTera = value.defenderTera ? value.defenderTera + " " : "";
        const defendName = value.defenderName || "";
        const minDamage = Object.values(damageRangeData[key as keyof typeof damageRangeData])[0];
        const maxDamage = Object.values(damageRangeData[key as keyof typeof damageRangeData])[15];

        const conclusion = `${attackBoost}${attackEVs} ${attackItem}${atatckTera}${attackName} ${Object.keys(
          damagePercentageData[Number(key)],
        )} VS. ${defendBoost}${HPEVs} / ${defendEVs} ${defendItem}${defendTera}${defendName}: ${minDamage}-${maxDamage} (${Object.values(
          damagePercentageData[Number(key)],
        )})`;
        resultDescs[key] = {
          conclusion: conclusion,
          damageRange: damageRangeData[key as keyof typeof damageRangeData] as number[],
        };
        console.log(resultDescs);
      }
    });
    return resultDescs;
  };

  const attackerConclusion = getResultDesc(rawDescs, damageRange, damagePercentageRange, false);
  const defenderConclusion = getResultDesc(defenderRawDescs, defenderDamageRange, defenderDamagePercentageRange, true);
  
  // Combine both conclusions for selection logic
  const allConclusions = { 
    ...Object.fromEntries(Object.entries(attackerConclusion).map(([key, value]) => [`attacker_${key}`, value])),
    ...Object.fromEntries(Object.entries(defenderConclusion).map(([key, value]) => [`defender_${key}`, value]))
  };
  
  console.log("attacker conclusion", attackerConclusion);
  console.log("defender conclusion", defenderConclusion);

  console.log(atkPkm, defPkm);

  useEffect(() => {
    if (!isEmpty(allConclusions)) {
      let selectedKey: string;
      
      // Determine which move to show based on selections
      if (selectedMoveIndex !== null && attackerConclusion[selectedMoveIndex]) {
        selectedKey = `attacker_${selectedMoveIndex}`;
      } else if (selectedDefenderMoveIndex !== null && defenderConclusion[selectedDefenderMoveIndex]) {
        selectedKey = `defender_${selectedDefenderMoveIndex}`;
      } else {
        // Auto-select highest damage move from attacker moves only
        const attackerEntries = Object.entries(attackerConclusion);
        if (attackerEntries.length > 0) {
          const highestAttackerMove = attackerEntries.sort((a, b) => cmp(a[1], b[1]))[0][0];
          selectedKey = `attacker_${highestAttackerMove}`;
        } else {
          // Fallback to all moves if no attacker moves available
          selectedKey = Object.entries(allConclusions).sort((a, b) => cmp(a[1], b[1]))[0][0];
        }
      }
      
      console.log("selected attacker move:", selectedMoveIndex, "selected defender move:", selectedDefenderMoveIndex, "using key:", selectedKey);
      setResultDesc(allConclusions[selectedKey]["conclusion"] || "");
      setPossibleDamage((allConclusions[selectedKey]["damageRange"] as number[]).toString());
    }
  }, [allConclusions, selectedMoveIndex, selectedDefenderMoveIndex, attackerConclusion, defenderConclusion]);

  return (
    <Layout fixed={false}>
      <div className="bg-[#24283B] min-h-screen text-gray-200 pt-20">
        {/* Page Title */}
        <div className="text-3xl text-center text-gray-200 mb-8 font-bold">
          Damage Calculator
        </div>

        {/* Damage Results Section */}
        <div className="mx-4 sm:mx-10 mb-8">
          <div className="bg-[#333c67] rounded-xl p-6 shadow-lg border border-[#4e60b1]">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-100">
              Battle Results
            </h2>
            <CalcMoveDamage 
              gens={gens} 
              atkPkm={atkPkm} 
              defPkm={defPkm} 
              onMoveSelect={(index) => {
                setSelectedMoveIndex(index);
                setSelectedDefenderMoveIndex(null);
              }}
              selectedMoveIndex={selectedMoveIndex}
              onDefenderMoveSelect={(index) => {
                setSelectedDefenderMoveIndex(index);
                setSelectedMoveIndex(null);
              }}
              selectedDefenderMoveIndex={selectedDefenderMoveIndex}
            />
            
            {/* Result Description */}
            {resultDesc && (
              <div className="mt-6 p-4 bg-[#24283B] rounded-lg border border-[#4e60b1]">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-semibold text-gray-100">
                    {resultDesc}
                  </div>
                  {(selectedMoveIndex !== null || selectedDefenderMoveIndex !== null) && (
                    <button
                      onClick={() => {
                        setSelectedMoveIndex(null);
                        setSelectedDefenderMoveIndex(null);
                      }}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      Auto Select
                    </button>
                  )}
                </div>
                {possibleDamage && (
                  <div className="text-sm text-gray-300">
                    Possible Damage amounts: ({possibleDamage})
                  </div>
                )}
                {(selectedMoveIndex !== null || selectedDefenderMoveIndex !== null) && (
                  <div className="text-sm text-blue-300 mt-1">
                    {selectedMoveIndex !== null && (
                      <>Showing result for Attacker Move {selectedMoveIndex + 1}</>
                    )}
                    {selectedDefenderMoveIndex !== null && (
                      <>Showing result for Defender Move {selectedDefenderMoveIndex + 1} (roles reversed)</>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Pokemon Selection Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 px-4 sm:px-10 pb-10">
          {/* Attacker Pokemon */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-100">
              Attacker
            </h3>
            <PokemonSelection
              gens={gens}
              initPkm={initPkm}
              battlepkm={atkPkm}
              onChangePkm={handleAttPkmChange}
              onChangeStats={handleAttPkmStatsChange}
            />
          </div>

          {/* Level Selection */}
          <div className="flex flex-col items-center justify-center gap-4 lg:mx-8">
            <h3 className="text-lg font-semibold text-gray-100">Battle Level</h3>
            <div className="flex flex-col gap-3">
              <button 
                value={50} 
                onClick={handlePkmLvlChange}
                className="bg-[#4e60b1] hover:bg-[#5a6bc4] text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4e60b1] min-w-32"
              >
                Level 50
              </button>
              <button 
                value={100} 
                onClick={handlePkmLvlChange}
                className="bg-[#4e60b1] hover:bg-[#5a6bc4] text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4e60b1] min-w-32"
              >
                Level 100
              </button>
            </div>
          </div>

          {/* Defender Pokemon */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-100">
              Defender
            </h3>
            <PokemonSelection
              gens={gens}
              initPkm={initPkm}
              battlepkm={defPkm}
              onChangePkm={handleDetPkmChange}
              onChangeStats={handleDefPkmStatsChange}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DamageCalc;
