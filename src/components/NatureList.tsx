function NatureList ({gens, onData, init}) {
  const natures = Array.from(gens.get(9).natures);
  const statsMap = {hp: "HP", atk: "Atk", def: "Def", spa: "SpA", spd: "Spd", spe: "Spe"};

  const generateOptions = () => {
    const options = [];
    natures.map((nature) => {
      if (init == nature.name) {
        options.push(
          <option key={nature.id} value={nature.name} onChange={onData} selected>
            {nature.name}{nature.plus && nature.minus ? ` (+${statsMap[nature.plus]}, -${statsMap[nature.minus]})` : ''}
          </option>
        );
      } else {
        options.push(
          <option key={nature.id} value={nature.name} onChange={onData}> 
            {nature.name}{nature.plus && nature.minus ? ` (+${statsMap[nature.plus]}, -${statsMap[nature.minus]})` : ''}
          </option>
        );
      };
    });
    return options;
  };

  return (
    <select onChange={onData}>
      {generateOptions()}
    </select>
  )
}

export default NatureList