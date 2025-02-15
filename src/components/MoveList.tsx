import Move from "./Move";

function MoveList({gens}) {
  const moves = Array.from(gens.get(9).moves);
  console.log(moves);

  return (
    <div className="bg-[#24283B]">
    <h2 className="text-3xl text-center text-gray-200 h-25 pt-10">Moves</h2>
    <div className="flex flex-wrap justify-center">
      {moves.map((move) => {
        return <Move move={move} />
      })};
    </div>
    </div>
  )
}

export default MoveList