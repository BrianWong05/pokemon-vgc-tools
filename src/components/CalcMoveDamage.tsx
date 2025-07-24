import { calculate, Move, Pokemon, Result } from "@smogon/calc";
import React from "react";
import { Generation, Generations } from "@pkmn/data";

interface ICalcMoveDamageProps {
  gens: typeof Generations.prototype;
  atkPkm: typeof Pokemon.prototype;
  defPkm: typeof Pokemon.prototype;
  onMoveSelect?: (moveIndex: number) => void;
  selectedMoveIndex?: number | null;
  onDefenderMoveSelect?: (moveIndex: number) => void;
  selectedDefenderMoveIndex?: number | null;
}

const CalcMoveDamage: React.FunctionComponent<ICalcMoveDamageProps> = ({ 
  gens, 
  atkPkm, 
  defPkm, 
  onMoveSelect, 
  selectedMoveIndex, 
  onDefenderMoveSelect, 
  selectedDefenderMoveIndex
}) => {
  const gen = gens.get(9);
  console.log("gen", gen);

  const calcDamageRange = (result: typeof Result.prototype) => {
    const move = result.move.name;
    const damages = result.damage as number[];
    const defendPkm = result.defender;

    const drain = result.move.drain ? result.move.drain : null;
    const recoil = result.move.recoil ? result.move.recoil : null;
    const defendPkmHP = defendPkm.stats.hp;
    const atkackLowRange = parseFloat(((damages[0] / defendPkmHP) * 100).toFixed(1));
    const atkackHighRange = parseFloat(((damages[15] / defendPkmHP) * 100).toFixed(1));
    console.log(result, drain, recoil);

    const returnObj = { [move]: `${atkackLowRange}% - ${atkackHighRange}%` };
    if (drain) {
      returnObj[move] = `${returnObj[move]} (${parseFloat(
        ((atkackLowRange * drain[0]) / drain[1]).toFixed(1),
      )}% - ${parseFloat(((atkackHighRange * drain[0]) / drain[1]).toFixed(1))}% recovered)`;
    }
    if (recoil) {
      returnObj[move] = `${returnObj[move]} (${parseFloat(
        ((atkackLowRange * recoil[0]) / recoil[1]).toFixed(1),
      )}% - ${parseFloat(((atkackHighRange * recoil[0]) / recoil[1]).toFixed(1))}% recoiled)`;
    }
    return returnObj;
  };

  const pkmMoveDamage = (atkPkm: Pokemon, defPkm: Pokemon, gen: Generation) => {
    const damageRange: { [key: number]: { [move: string]: string } } = {
      0: { "No Move": "0% - 0%" },
      1: { "No Move": "0% - 0%" },
      2: { "No Move": "0% - 0%" },
      3: { "No Move": "0% - 0%" },
    };
    atkPkm.moves.forEach((move, index) => {
      const result = move ? calculate(gen, atkPkm, defPkm, new Move(gen, move)) : null;
      damageRange[index] = result ? calcDamageRange(result) : { "No Move": "0% - 0%" };
    });

    console.log(Object.values(damageRange));
    return damageRange;
  };
  const atkPkmDamageRange = pkmMoveDamage(atkPkm, defPkm, gen);
  const defPkmDamageRange = pkmMoveDamage(defPkm, atkPkm, gen);

  return (
    <div className="w-full flex justify-between">
      <div className="w-full sm:w-1/2">
        <h3 className="text-lg font-semibold mb-3 text-center text-gray-100">
          Attacker Moves (Click to select for result)
        </h3>
        {Object.values(atkPkmDamageRange).map((damage, index) => {
          return (
            <div key={index}>
              {Object.entries(damage).map(([move, range]) => {
                const isSelected = selectedMoveIndex === index;
                const isClickable = move !== "No Move" && onMoveSelect;
                return (
                  <div 
                    className={`flex m-2 ${isClickable ? 'cursor-pointer' : ''} ${isSelected ? 'ring-2 ring-blue-400' : ''}`} 
                    key={move}
                    onClick={() => isClickable && onMoveSelect(index)}
                  >
                    <div className={`w-35 p-1 text-gray-100 rounded-xl text-center font-medium transition-colors duration-200 ${
                      isSelected 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : isClickable 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-700'
                    }`}>
                      {move}
                    </div>
                    <div className="pl-5 text-center my-auto">{range}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="w-1/2 hidden sm:block">
        <h3 className="text-lg font-semibold mb-3 text-center text-gray-100">
          Defender Moves (Click to select for result)
        </h3>
        {Object.values(defPkmDamageRange).map((damage, index) => {
          return (
            <div key={index}>
              {Object.entries(damage).map(([move, range]) => {
                const isSelected = selectedDefenderMoveIndex === index;
                const isClickable = move !== "No Move" && onDefenderMoveSelect;
                return (
                  <div 
                    className={`flex m-2 ${isClickable ? 'cursor-pointer' : ''} ${isSelected ? 'ring-2 ring-blue-400' : ''}`} 
                    key={move}
                    onClick={() => isClickable && onDefenderMoveSelect(index)}
                  >
                    <div className={`w-35 p-1 text-gray-100 rounded-xl text-center font-medium transition-colors duration-200 ${
                      isSelected 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : isClickable 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-700'
                    }`}>
                      {move}
                    </div>
                    <div className="pl-5 text-center my-auto">{range}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalcMoveDamage;
