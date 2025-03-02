import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import Pokemon from "@/components/Pokemon";

function PokemonList({ gens, onData }) {
  // const gens = new Generations(Dex);

  const pkms = Array.from(gens.get(9).species);

  const [searchResults, setSearchResults] = useState(pkms);

  const handleSearch = (query: string) => {
    const filteredResults = pkms.filter(
      (pkm) =>
        pkm.name.toLowerCase().includes(query.toLowerCase()) ||
        pkm.types.some((type) => type.toLowerCase().includes(query.toLowerCase())),
    );
    setSearchResults(filteredResults);
  };

  // console.log(pkms[0]);

  return (
    <div className="bg-[#24283B] scrollbar">
      <h2 className="text-3xl text-center text-gray-200 h-25 pt-10">Pokemons</h2>
      <SearchBar onSearch={handleSearch} placeholder="Pokémon" />
      {searchResults.map((pkm) => {
        return <Pokemon key={pkm.id} pkm={pkm} onData={onData} />;
      })}
    </div>
  );
}

export default PokemonList;
