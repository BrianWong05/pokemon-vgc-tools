import React, { useState } from "react";
import Move from "@/components/Move";
import SearchBar from "@/components/SearchBar";
import Layout from "@/components/layout";
import { Generations, MoveData } from "@pkmn/data";
interface IMoveListProps {
  gens: Generations;
  onData?: (move: MoveData, id: string | number) => void;
  id?: string | number;
  hidden?: boolean;
}

const MoveList: React.FunctionComponent<IMoveListProps> = ({ gens, onData, id, hidden = false }) => {
  const moves = Array.from(gens.get(9).moves);

  const [searchResults, setSearchResults] = useState(moves);

  const handleSearch = (query: string) => {
    const filteredResults = moves.filter(
      (move) =>
        move.name.toLowerCase().includes(query.toLowerCase()) ||
        move.type.toLocaleLowerCase().includes(query.toLowerCase()),
    );
    setSearchResults(filteredResults);
  };

  return (
    <Layout hidden={hidden}>
      <div className="bg-[#24283B] h-full pt-15">
        <div className="sticky -top-2 bg-[#24283B50] pb-7 z-10 backdrop-blur-xs">
          <div className="text-3xl text-center text-gray-200 h-25 pt-8">Moves</div>
          <SearchBar onSearch={handleSearch} placeholder="Move" />
        </div>
        <div className="flex flex-wrap justify-center">
          {searchResults.map((move) => {
            return <Move key={move.name} move={move} onData={onData} id={id ?? ""} />;
          })}
        </div>
      </div>
    </Layout>
  );
};

export default MoveList;
