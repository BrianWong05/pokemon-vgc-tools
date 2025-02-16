function Pokemon ({pkm, onData}) {

  const selectedPkm = () => {
    if (onData) {
      onData(pkm);
    }
  }

  const baseStats = pkm.baseStats;
  const types = pkm.types;
  const type1 = types[0].toLocaleLowerCase();
  const type2 = types[types.length - 1].toLocaleLowerCase();

  const Stat = {hp: "HP", atk: "Atk", def: "Def", spa: "SpA", spd: "SpD", spe: "Spe"};

  return (
    <div className={`text-gray-200 flex p-5`} onClick={selectedPkm}>
      <div className="relative">
        <div className="w-40 h-40 rounded-full bg-white absolute top-4 left-4" />
        <div className="flex">
          <div className={`w-24 h-48 rounded-tl-full rounded-bl-full bg-${type1}`} />
          <div className={`w-24 h-48 rounded-tr-full rounded-br-full bg-${type2}`} />
        </div>
      </div>
      <strong>ID:</strong> {pkm.num} {pkm.name}
      {Object.entries(baseStats).map(([stat, value]) => {
        return <div className="flex flex-col w-10 text-center"><p className="text-xl">{value}</p><p className="text-xs">{Stat[stat]}</p></div>
      })}
    </div>
  )
}

export default Pokemon;