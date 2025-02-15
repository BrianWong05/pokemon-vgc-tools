import { useState } from "react";

function SearchBar({onSearch}) {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // real time search
  };

  return (
    <div>
      <input type="text" value={query} onChange={handleInputChange} placeholder="Search..."/>
    </div>
  );
};

export default SearchBar