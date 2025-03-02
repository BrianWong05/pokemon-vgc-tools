import { icons } from "@/assets/icons";

function Pokemon({ pkm, onData }) {
  const selectedPkm = () => {
    if (onData) {
      onData(pkm);
    }
  };

  const baseStats = pkm.baseStats;
  const types = pkm.types;
  const type1 = types[0].toLocaleLowerCase();
  const type2 = types[types.length - 1].toLocaleLowerCase();

  const Stat = { hp: "HP", atk: "Atk", def: "Def", spa: "SpA", spd: "SpD", spe: "Spe" };

  return (
    <div className={`text-gray-200 flex py-5 w-150`} onClick={selectedPkm}>
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-white absolute top-3 left-3">
          <img
            className="w-18 h-18 rounded-2xl bg-white absolute top-3 left-3"
            src={`/pokemon-vgc-tools/images/pokemons/${pkm.name.replace(/\s+/g, "_")}_SV.png`}
            loading="lazy"
          />
        </div>
        <div className="flex">
          <div className={`w-15 h-30 rounded-tl-full rounded-bl-full bg-${type1}`} />
          <div className={`w-15 h-30 rounded-tr-full rounded-br-full bg-${type2}`} />
        </div>
      </div>
      <div className="flex ml-3 h-30">
        <div className="flex flex-col justify-center items-center gap-2 my-auto w-45">
          <div className="flex gap-1 text-md">
            {/* <div className="font-bold my-auto">ID: </div>
            <div className="my-auto">{pkm.num}</div> */}
            <div className="font-black my-auto">{pkm.name}</div>
          </div>
          <div className="flex gap-1">
            <div className={`flex h-6 w-22 bg-${type1} rounded-4xl `}>
              <div className={`flex mx-auto`}>
                <img src={icons[type1]} className="h-5 my-auto" />
                <div className="my-auto">{type1}</div>
              </div>
            </div>
            {type1 !== type2 && (
              <div className={`flex h-6 w-22 bg-${type2} rounded-4xl `}>
                <div className={`flex mx-auto`}>
                  <img src={icons[type2]} className="h-5 my-auto" />
                  <div className="my-auto">{type2}</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex">
          {Object.entries(baseStats).map(([stat, value]) => {
            return (
              <div className="flex flex-col w-10 text-center my-auto">
                <p className="text-xl">{value}</p>
                <p className="text-xs">{Stat[stat]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Pokemon;
