function Pokemon ({pkm}) {
  const baseStats = pkm.baseStats;
  console.log(pkm);

  const Stat = {hp: "HP", atk: "Atk", def: "Def", spa: "SpA", spd: "SpD", spe: "Spe"};

  return (
    <>
      <p>{pkm.name}</p>
      {Object.entries(baseStats).map(([stat, value]) => {
        return <p><strong>{Stat[stat]}:</strong> {value}</p>
      })}
    </>
  )
}

export default Pokemon;