import { useState } from "react";
import Move from "./Move";
import SearchBar from "./SearchBar";

function MoveList({gens}) {
  const moves = Array.from(gens.get(9).moves);
  
  const [searchResults, setSearchResults] = useState(moves);

  const handleSearch = (query: string) => {
    const filteredResults = moves.filter((move) =>
      move.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

  return (
    <div className="bg-[#24283B]">
    <h2 className="text-3xl text-center text-gray-200 h-25 pt-10">Moves</h2>
    <SearchBar onSearch={handleSearch}/>
    <div className="flex flex-wrap justify-center">
      {searchResults.map((move) => {
        return <Move move={move} />
      })};
    </div>
    </div>
  )
}

export default MoveList