import React, { useState, useEffect, useMemo } from "react";
import Move from "@/components/Move";
import SearchBar from "@/components/SearchBar";
import MoveFilter from "@/components/MoveFilter";
import Layout from "@/components/layout";
import { Generations, MoveData } from "@pkmn/data";
interface IMoveListProps {
  gens: Generations;
  onData?: (move: MoveData, id: string | number) => void;
  id?: string | number;
  hidden?: boolean;
}

const MoveList: React.FunctionComponent<IMoveListProps> = ({ gens, onData, id, hidden = false }) => {
  const moves = useMemo(() => Array.from(gens.get(9).moves), [gens]);

  const [searchResults, setSearchResults] = useState<typeof moves>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Initialize search results when moves changes
  useEffect(() => {
    setSearchResults(moves);
  }, [moves]);

  // Apply all filters whenever search query or filters change
  useEffect(() => {
    let filteredResults = moves;

    // Apply search filter
    if (searchQuery) {
      filteredResults = filteredResults.filter(
        (move) =>
          move.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          move.type.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filteredResults = filteredResults.filter((move) => selectedCategories.includes(move.category));
    }

    // Apply type filter
    if (selectedTypes.length > 0) {
      filteredResults = filteredResults.filter((move) => selectedTypes.includes(move.type));
    }

    setSearchResults(filteredResults);
  }, [searchQuery, selectedCategories, selectedTypes, moves]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoriesChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  const handleTypesChange = (types: string[]) => {
    setSelectedTypes(types);
  };

  return (
    <Layout hidden={hidden}>
      <div className="bg-[#24283B] h-full pt-15">
        <div className="sticky -top-2 bg-[#24283B50] pb-7 z-10 backdrop-blur-xs">
          <div className="text-3xl text-center text-gray-200 h-25 pt-8">Moves</div>
          <SearchBar onSearch={handleSearch} placeholder="Move / Type" />
          <div className="mt-6">
            <MoveFilter
              selectedCategories={selectedCategories}
              selectedTypes={selectedTypes}
              onCategoriesChange={handleCategoriesChange}
              onTypesChange={handleTypesChange}
            />
          </div>
        </div>
        <div className="flex flex-wrap justify-center">
          {searchResults.map((move) => {
            return <Move key={move.name} move={move} onData={onData} id={id ?? ""} />;
          })}
        </div>
        {searchResults.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            No moves found matching your criteria.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MoveList;
