import Move from "./Move";

function MoveList({gens}) {
  const moves = Array.from(gens.get(9).moves);
  console.log(moves);

  return (
    <>
    <h2>Moves</h2>
    {moves.map((move) => {
      return <Move move={move} />
    })};
    </>
  )
}

export default MoveList