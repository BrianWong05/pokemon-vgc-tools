function Pokemon ({pkm}) {
  const baseStats = pkm.baseStats;
  const types = pkm.types;
  // console.log(pkm.types);
  // console.log(pkm)

  const Stat = {hp: "HP", atk: "Atk", def: "Def", spa: "SpA", spd: "SpD", spe: "Spe"};

  return (
    <div>
      <strong>ID:</strong> {pkm.num} {pkm.name} <strong>type:</strong>
      {types.map((type) => {
        return <> {type}</>
      })}
      {Object.entries(baseStats).map(([stat, value]) => {
        return <p><strong>{Stat[stat]}:</strong> {value}</p>
      })}
    </div>
  )
}

export default Pokemon;