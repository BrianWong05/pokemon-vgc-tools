import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import Pokemon from "@/components/Pokemon";
import Layout from "@/components/layout";

function PokemonList({ gens, onData, hidden = false }) {
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
    <Layout hidden={hidden}>
      <div className="bg-[#24283B] scrollbar w-full">
        <div className="sticky -top-8 bg-[#24283B] pb-7 z-10">
          <div className="text-3xl text-center text-gray-200 h-25 pt-10">Pokemons</div>
          <SearchBar onSearch={handleSearch} placeholder="Pokémon" />
        </div>
        <div className="flex flex-wrap justify-evenly">
          {searchResults.map((pkm) => {
            return <Pokemon key={pkm.id} pkm={pkm} onData={onData} />;
          })}
        </div>
      </div>
    </Layout>
  );
}

export default PokemonList;
