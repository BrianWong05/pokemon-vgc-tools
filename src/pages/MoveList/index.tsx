import React, { useState, useEffect, useMemo } from "react";
import Move from "@/components/Move";
import SearchBar from "@/components/SearchBar";
import MoveFilter from "@/components/MoveFilter";
import MoveSort from "@/components/MoveSort";
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
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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
      } else if (sortBy === "power") {
        const aValue = "basePower" in a ? a.basePower || 0 : 0;
        const bValue = "basePower" in b ? b.basePower || 0 : 0;
        if (sortOrder === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      } else if (sortBy === "accuracy") {
        const aValue = "accuracy" in a ? (a.accuracy === true ? 100 : a.accuracy || 0) : 0;
        const bValue = "accuracy" in b ? (b.accuracy === true ? 100 : b.accuracy || 0) : 0;
        if (sortOrder === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      } else if (sortBy === "priority") {
        const aValue = a.priority || 0;
        const bValue = b.priority || 0;
        if (sortOrder === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      }
      return 0;
    });

    setSearchResults(filteredResults);
  }, [searchQuery, selectedCategories, selectedTypes, sortBy, sortOrder, moves]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoriesChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  const handleTypesChange = (types: string[]) => {
    setSelectedTypes(types);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: "asc" | "desc") => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  return (
    <Layout hidden={hidden}>
      <div className="bg-[#24283B] h-full pt-15">
        <div className="sticky -top-2 bg-[#24283B50] pb-7 z-10 backdrop-blur-xs">
          <div className="text-3xl text-center text-gray-200 h-25 pt-8">Moves</div>
          
          {/* Search Bar and Sort Side by Side */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center px-4">
            <div className="w-full sm:w-auto flex-1 max-w-xl">
              <SearchBar onSearch={handleSearch} placeholder="Move / Type" />
            </div>
            <div className="w-full sm:w-auto">
              <MoveSort
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
            </div>
          </div>
          
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
