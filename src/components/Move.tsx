function Move({move}) {

  const props = ["contact", "heal", "power", "bite", "bullet", "slicing", "wind", "dance", "pulse", "sound", "punch"];
  const flags = Object.keys(move.flags);
  const moveProp = flags.filter((item) =>
    props.some((prop) => item.toLowerCase().includes(prop))
  );

  return (
    <div>
    <p>{move.name} Category: {move.category} Power: {move.basePower} Accurcay: {move.accuracy} priority: {move.priority} type: {move.type} target: {move.target}</p>
    <p>desc: {move.desc}</p>
    {moveProp.map((prop) => {
      return <>{prop} </>
    })}
    </div>
  )

};

export default Move