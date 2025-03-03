import { calculate, Field, Move, Pokemon } from "@smogon/calc";

function CalcMoveDamage({ gens, atkPkm, defPkm }) {
  const gen = gens.get(9);

  const calcDamageRange = (result) => {
    const move = result.move.name;
    const damages = result.damage;
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

  const pkmMoveDamage = (atkPkm, defPkm, gen) => {
    const damageRange = {
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
      <div className="w-1/2">
        {Object.values(atkPkmDamageRange).map((damage) => {
          return (
            <>
              {Object.entries(damage).map(([move, range]) => {
                return (
                  <div className="flex m-2">
                    <div className="w-35 p-1 bg-gray-300 rounded-xl text-center">{move}</div>
                    <div className="pl-5 text-center my-auto">{range}</div>
                  </div>
                );
              })}
            </>
          );
        })}
      </div>

      <div className="w-1/2">
        {Object.values(defPkmDamageRange).map((damage) => {
          return (
            <>
              {Object.entries(damage).map(([move, range]) => {
                return (
                  <div className="flex m-2">
                    <div className="w-35 p-1 bg-gray-300 rounded-xl text-center">{move}</div>
                    <div className="pl-5 text-center my-auto">{range}</div>
                  </div>
                );
              })}
            </>
          );
        })}
      </div>
    </div>
  );
}

export default CalcMoveDamage;
