import React, { useState, useEffect, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import Pokemon from "@/components/Pokemon";
import PokemonFilter from "@/components/PokemonFilter";
import PokemonSort from "@/components/PokemonSort";
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
  const [typeFilterMode, setTypeFilterMode] = useState<"and" | "or">("or");
  const [sortBy, setSortBy] = useState<string>("num");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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
      if (typeFilterMode === "or") {
        // OR logic: Pokemon must have at least one of the selected types
        filteredResults = filteredResults.filter((pkm) => pkm.types.some((type) => selectedTypes.includes(type)));
      } else {
        // AND logic: Pokemon must have all selected types
        filteredResults = filteredResults.filter((pkm) =>
          selectedTypes.every((selectedType) => pkm.types.some(type => type === selectedType)),
        );
      }
    }

    // Apply sorting
    filteredResults.sort((a, b) => {
      if (sortBy === "name") {
        const aValue = a.name.toLowerCase();
        const bValue = b.name.toLowerCase();
        if (sortOrder === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      } else if (sortBy === "num") {
        const aValue = a.num;
        const bValue = b.num;
        if (sortOrder === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      } else if (sortBy === "total") {
        const aValue = Object.values(a.baseStats).reduce((sum, stat) => sum + stat, 0);
        const bValue = Object.values(b.baseStats).reduce((sum, stat) => sum + stat, 0);
        if (sortOrder === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      } else {
        // Individual stats (hp, atk, def, spa, spd, spe)
        const aValue = a.baseStats[sortBy as keyof typeof a.baseStats];
        const bValue = b.baseStats[sortBy as keyof typeof b.baseStats];
        if (sortOrder === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      }
    });

    setSearchResults(filteredResults);
  }, [searchQuery, selectedGenerations, selectedTypes, typeFilterMode, sortBy, sortOrder, pkms]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleGenerationsChange = (gens: number[]) => {
    setSelectedGenerations(gens);
  };

  const handleTypesChange = (types: string[]) => {
    setSelectedTypes(types);
  };

  const handleTypeFilterModeChange = (mode: "and" | "or") => {
    setTypeFilterMode(mode);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: "asc" | "desc") => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  // console.log(pkms[0]);

  return (
    <Layout hidden={hidden}>
      <div className="bg-[#24283B] w-full pt-15">
        <div className="sticky -top-2 bg-[#24283B50] pb-7 z-10 backdrop-blur-xs">
          <div className="text-3xl text-center text-gray-200 h-25 pt-10 backdrop-blur">Pokemon</div>
          <SearchBar onSearch={handleSearch} placeholder="Pokemon / Type" />
          <div className="mt-6">
            <PokemonFilter
              selectedGenerations={selectedGenerations}
              selectedTypes={selectedTypes}
              typeFilterMode={typeFilterMode}
              onGenerationsChange={handleGenerationsChange}
              onTypesChange={handleTypesChange}
              onTypeFilterModeChange={handleTypeFilterModeChange}
            />
          </div>
          <div className="mt-4">
            <PokemonSort sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
          </div>
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
