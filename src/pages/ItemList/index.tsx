import { useState } from "react";
import Item from "@/components/Item";
import SearchBar from "@/components/SearchBar";

function ItemList({ gens, onData }) {
  const items = Array.from(gens.get(9).items);

  const [searchResults, setSearchResults] = useState(items);

  const handleSearch = (query: string) => {
    const filteredResults = items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
    setSearchResults(filteredResults);
  };

  return (
    <div className="bg-[#24283B]">
      <h2 className="text-3xl text-center text-gray-200 h-25 pt-10">Items</h2>
      <SearchBar onSearch={handleSearch} placeholder="Item" />
      <div className="flex flex-wrap justify-center">
        {searchResults.map((item) => {
          return <Item key={item.num} item={item} onData={onData} />;
        })}
      </div>
    </div>
  );
}

export default ItemList;
