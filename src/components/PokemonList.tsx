import { Generations } from '@pkmn/data';
import { Dex } from '@pkmn/dex';
import Pokemon from './Pokemon';
import { useState } from 'react';
import SearchBar from './SearchBar';

function PokemonList() {

  const [searchResults, setSearchResults] = useState([])

  const gens = new Generations(Dex);

	const pkms = Array.from(gens.get(9).species);

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
      <SearchBar onSearch={handleSearch}/>
      {searchResults.map((pkm) => {
        return <Pokemon pkm={pkm} />
      })}
    </div>
  )

}

export default PokemonList