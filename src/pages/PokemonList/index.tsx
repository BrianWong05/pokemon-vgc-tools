import React, { useState, useEffect, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
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
  scrollContainer?: HTMLDivElement | null;
}

const PokemonList: React.FunctionComponent<IPokemonListProps> = ({
  gens,
  onData,
  hidden = false,
  scrollContainer,
}) => {
  const pkms = useMemo(() => Array.from(gens.get(9).species), [gens]);

  const [searchResults, setSearchResults] = useState<typeof pkms>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenerations, setSelectedGenerations] = useState<number[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [typeFilterMode, setTypeFilterMode] = useState<"and" | "or">("or");
  const [sortBy, setSortBy] = useState<string>("num");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Virtualization state
  const parentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);
  
  const isPopup = !!scrollContainer;

  // Measure container width for responsive columns
  useEffect(() => {
    if (!parentRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    resizeObserver.observe(parentRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Calculate columns - assuming approx 610px per card (adjust as needed based on Pokemon.tsx)
  // Pokemon.tsx uses w-150 (approx 600px).
  // Let's assume a safe minimum width for the responsive grid.
  const ITEM_WIDTH = 610; 
  const columns = Math.max(1, Math.floor(containerWidth / ITEM_WIDTH));
  
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
          selectedTypes.every((selectedType) => pkm.types.some((type) => type === selectedType)),
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

  // Virtualization Logic
  const rowCount = Math.ceil(searchResults.length / columns);
  
  // Estimate height to prevent initial overlap
  const ESTIMATED_ROW_HEIGHT = 180;

  // Utilize a dedicated scroll container for the Main Page to ensure consistent virtualization
  // This avoids issues with window scrolling offsets and sticky headers.
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollContainer || parentRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <Layout hidden={hidden}>
      <div 
        className={`${isPopup ? "bg-[#24283B] w-full" : "fixed inset-0 w-full h-full overflow-y-auto bg-[#24283B] z-0 pt-20"}`} 
        ref={parentRef}
      >
        <div className="sticky -top-2 bg-[#24283B50] pb-7 z-10 backdrop-blur-xs">
          <div className="text-3xl text-center text-gray-200 h-25 pt-10 backdrop-blur">Pokemon</div>

          {/* Search Bar and Sort Side by Side */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center px-4">
            <div className="w-full sm:w-auto flex-1 max-w-xl">
              <SearchBar onSearch={handleSearch} placeholder="Pokemon / Type" />
            </div>
            <div className="w-full sm:w-auto">
              <PokemonSort
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
            </div>
          </div>
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
        </div>

        {/* Virtualized Grid */}
        <div
            ref={gridRef}
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualItems.map((virtualRow) => {
              const start = virtualRow.index * columns;
              const end = Math.min(start + columns, searchResults.length);
              const items = searchResults.slice(start, end);

              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="flex justify-evenly"
                >
                  {items.map((pkm) => (
                    <div key={pkm.id} style={{ width: `${100/columns}%`, display: 'flex', justifyContent: 'center' }}>
                         <Pokemon pkm={pkm} onData={onData} />
                    </div>
                  ))}
                  {/* Fill empty columns if last row */}
                  {items.length < columns && 
                    Array.from({ length: columns - items.length }).map((_, i) => (
                        <div key={`empty-${i}`} style={{ width: `${100/columns}%` }} />
                    ))
                  }
                </div>
              );
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
