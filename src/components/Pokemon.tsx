import TypeTag from "@/components/TypeTag";
import { Specie } from "@pkmn/data";
import React from "react";
import { useNavigate } from "react-router-dom";

interface IPokemonProps {
  pkm: Specie;
  onData?: (pkm: Specie) => void;
}

const Pokemon: React.FunctionComponent<IPokemonProps> = ({ pkm, onData }) => {
  const navigate = useNavigate();
  const selectedPkm = () => {
    if (onData) {
      onData(pkm);
    } else {
      navigate(`/pokemons/${pkm.name}`);
    }
  };

  const baseStats = pkm.baseStats;
  const types = pkm.types;
  const type1 = types[0].toLocaleLowerCase();
  const type2 = types[types.length - 1].toLocaleLowerCase();

  const Stat = { hp: "HP", atk: "Atk", def: "Def", spa: "SpA", spd: "SpD", spe: "Spe" };

  return (
    <div className={`text-gray-200 flex py-5 w-150 cursor-pointer`} onClick={selectedPkm}>
      <div className="flex mx-auto">
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white absolute top-2 left-2 sm:top-3 sm:left-3">
            <img
              className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-white absolute top-3 left-3"
              src={`/pokemon-vgc-tools/images/pokemons/${pkm.name.replace(/\s+/g, "_")}_SV.png`}
              loading="lazy"
            />
          </div>
          <div className="flex">
            <div className={`w-12 h-24 sm:w-15 sm:h-30 rounded-tl-full rounded-bl-full bg-${type1}`} />
            <div className={`w-12 h-24 sm:w-15 sm:h-30 rounded-tr-full rounded-br-full bg-${type2}`} />
          </div>
        </div>
        <div className="flex ml-3 h-30">
          <div className="flex flex-col justify-center items-center gap-2 my-auto sm:w-45">
            <div className="flex gap-1 text-sm sm:text-md">
              {/* <div className="font-bold my-auto">ID: </div>
            <div className="my-auto">{pkm.num}</div> */}
              <div className="font-black my-auto">{pkm.name}</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-1">
              <TypeTag type={type1} />
              {type1 !== type2 && <TypeTag type={type2} />}
            </div>
          </div>
          <div className="flex">
            {Object.entries(baseStats).map(([stat, value]) => {
              return (
                <div className="flex flex-col w-10 text-center my-auto">
                  <p className="text-xl">{value}</p>
                  <p className="text-xs">{Stat[stat as keyof typeof Stat]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pokemon;
