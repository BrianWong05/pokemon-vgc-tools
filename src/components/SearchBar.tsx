import { useState } from "react";

function SearchBar({ onSearch, placeholder }) {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // real time search
  };

  return (
    <div className="w-full flex justify-center">
      <input
        className="bg-black/80 w-[70%] text-gray-100 rounded-2xl py-2 px-5 backdrop-blur"
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
    </div>
  );
}

export default SearchBar;
