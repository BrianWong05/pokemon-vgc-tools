import React, { useState, useEffect, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import Pokemon from "@/components/Pokemon";
import PokemonFilter from "@/components/PokemonFilter";
import Layout from "@/components/layout";
import { Generations, Specie } from "@pkmn/data";

interface IPokemonListProps {
  gens: Generations;
  onData?: (pkm: Specie) => void;
  hidden?: boolean;
}

const PokemonList: React.FunctionComponent<IPokemonListProps> = ({ gens, onData, hidden = false }) => {
  const pkms = useMemo(() => Array.from(gens.get(9).species), [gens]);

  const [searchResults, setSearchResults] = useState<typeof pkms>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenerations, setSelectedGenerations] = useState<number[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Initialize search results when pkms changes
  useEffect(() => {
    setSearchResults(pkms);
  }, [pkms]);

  // Apply all filters whenever search query or filters change
  useEffect(() => {
    let filteredResults = pkms;

    // Apply search filter
    if (searchQuery) {
      filteredResults = filteredResults.filter(
        (pkm) =>
          pkm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pkm.types.some((type) => type.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }

    // Apply generation filter
    if (selectedGenerations.length > 0) {
      filteredResults = filteredResults.filter((pkm) => selectedGenerations.includes(pkm.gen));
    }

    // Apply type filter
    if (selectedTypes.length > 0) {
      filteredResults = filteredResults.filter((pkm) => pkm.types.some((type) => selectedTypes.includes(type)));
    }

    setSearchResults(filteredResults);
  }, [searchQuery, selectedGenerations, selectedTypes, pkms]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleGenerationsChange = (gens: number[]) => {
    setSelectedGenerations(gens);
  };

  const handleTypesChange = (types: string[]) => {
    setSelectedTypes(types);
  };

  // console.log(pkms[0]);

  return (
    <Layout hidden={hidden}>
      <div className="bg-[#24283B] w-full pt-15">
        <div className="sticky -top-2 bg-[#24283B50] pb-7 z-10 backdrop-blur-xs">
          <div className="text-3xl text-center text-gray-200 h-25 pt-10 backdrop-blur">Pokemon</div>
          <SearchBar onSearch={handleSearch} placeholder="Pokemon / Type" />
          <PokemonFilter
            selectedGenerations={selectedGenerations}
            selectedTypes={selectedTypes}
            onGenerationsChange={handleGenerationsChange}
            onTypesChange={handleTypesChange}
            className="mt-4"
          />
        </div>
        <div className="flex flex-wrap justify-evenly">
          {searchResults.map((pkm) => {
            return <Pokemon key={pkm.id} pkm={pkm} onData={onData} />;
          })}
        </div>
        {searchResults.length === 0 && (
          <div className="text-center text-gray-400 py-10">No Pokemon found matching your criteria.</div>
        )}
      </div>
    </Layout>
  );
};

export default PokemonList;
