import Pokemon from './Pokemon';
import { useState } from 'react';
import SearchBar from './SearchBar';

function PokemonList({gens}) {

  // const gens = new Generations(Dex);
  
	const pkms = Array.from(gens.get(9).species);
  
  const [searchResults, setSearchResults] = useState(pkms)

  const handleSearch = (query: string) => {
    const filteredResults = pkms.filter((pkm) =>
      pkm.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

	// console.log(pkms[0])

  return (
    <div>
    	<h2>Pokemons</h2>
      <SearchBar onSearch={handleSearch} placeholder="Pokémon"/>
      {searchResults.map((pkm) => {
        return <Pokemon key={pkm.id} pkm={pkm} />
      })}
    </div>
  )

}

export default PokemonList