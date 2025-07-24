import Layout from "@/components/layout";
import TypeDefense from "@/components/TypeDefense";
import TypeTag from "@/components/TypeTag";
import { Generations, Specie } from "@pkmn/data";
import { TYPE_CHART } from "@smogon/calc";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface IPokemonIdProps {
  gens: Generations;
}

const PokemonId: React.FunctionComponent<IPokemonIdProps> = ({ gens }) => {
  const param = useParams();
  const id = param.id;
  const navigate = useNavigate();

  const pkms = Array.from(gens.get(9).species);
  const [pkm, setPkm] = useState<Specie>();
  const Stat = { hp: "HP", atk: "Atk", def: "Def", spa: "SpA", spd: "SpD", spe: "Spe" };

  useEffect(() => {
    const selectedPkm = pkms.filter(
      (pkm) => pkm.num.toString() === id || pkm.name.toLocaleLowerCase() === String(id).toLocaleLowerCase(),
    );
    if (selectedPkm.length !== 1) navigate("/pokemons");
    else setPkm(selectedPkm[0]);
  }, [id, navigate, pkms]);

  if (!pkm)
    return (
      <Layout>
        <div>Loading</div>
      </Layout>
    );

  const baseStats = pkm.baseStats;
  const types = pkm.types;
  const type1 = types[0].toLocaleLowerCase();
  const type2 = types[types.length - 1].toLocaleLowerCase();
  const typeChart: { [key: string]: { [key: string]: number } } = TYPE_CHART[9];

  console.log(typeChart);
  const capitalizeFirstLetter = (val: string) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  };

  const calcTypeDefence = (type1: string, type2: string = "???") => {
    const typeDefense: { [key: string]: number } = {};
    Object.entries(typeChart).map(([key, value]) => {
      if (key !== "???" && key !== "Stellar") {
        typeDefense[key.toLocaleLowerCase()] =
          value[capitalizeFirstLetter(type1.toLocaleLowerCase())] *
          value[capitalizeFirstLetter(type2.toLocaleLowerCase())];
      }
    });

    return typeDefense;
  };

  const typeDefense = calcTypeDefence(type1, type1 === type2 ? "???" : type2);

  console.log(Object.keys(typeDefense).filter((key) => typeDefense[key] === 1));

  console.log(pkm.num, pkm, baseStats);
  return (
    <Layout>
      <div className="text-gray-200 bg-[#24283B] h-full min-h-screen w-full justify-center pt-20">
        {/* Back Button */}
        <div className="flex justify-start mb-6 px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-[#333c67] hover:bg-[#4e60b1] text-gray-200 px-4 py-2 rounded-xl transition-colors duration-200 font-medium shadow-lg cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        <div className="flex w-full justify-center">
          <div className="relative">
            <div className="w-38 h-38 rounded-full bg-white absolute top-3 left-3">
              <img
                className="w-26 h-26 rounded-2xl bg-white absolute top-5.5 left-5.5"
                src={`/pokemon-vgc-tools/images/pokemons/${pkm.name.replace(/\s+/g, "_")}_SV.png`}
                loading="lazy"
              />
            </div>
            <div className="flex">
              <div className={`w-22 h-44 rounded-tl-full rounded-bl-full bg-${type1}`} />
              <div className={`w-22 h-44 rounded-tr-full rounded-br-full bg-${type2}`} />
            </div>
          </div>
          <div className="flex ml-3 h-44 flex-col">
            <div className="flex w-full justify-center my-auto">
              {Object.entries(baseStats).map(([stat, value]) => {
                return (
                  <div className="flex flex-col w-10 text-center my-auto font-black">
                    <p className="text-xl">{value}</p>
                    <p className="text-xs">{Stat[stat as keyof typeof Stat]}</p>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col justify-center items-center gap-2 my-auto w-full">
              <div className="flex gap-1 text-xl font-black">
                <div className="my-auto">ID: </div>
                <div className="my-auto">{pkm.num}</div>
                <div className="my-auto">{pkm.name}</div>
              </div>
              <div className="flex gap-1">
                <TypeTag type={type1} />
                {type1 !== type2 && <TypeTag type={type2} />}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-6">
          <TypeDefense typeDefense={typeDefense} times={4} />
          <TypeDefense typeDefense={typeDefense} times={2} />
          <TypeDefense typeDefense={typeDefense} times={0.5} />
          <TypeDefense typeDefense={typeDefense} times={0.25} />
          <TypeDefense typeDefense={typeDefense} times={0} />
          <TypeDefense typeDefense={typeDefense} times={1} />
        </div>
      </div>
    </Layout>
  );
};

export default PokemonId;
