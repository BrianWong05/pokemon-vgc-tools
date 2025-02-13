import { Generations } from '@pkmn/data';
import { Dex } from '@pkmn/dex';
import Pokemon from './Pokemon';

function PokemonList() {

  const gens = new Generations(Dex);

	const pkms = Array.from(gens.get(9).species);

	// console.log(pkms[0])

  return (
    <div>
    	<h2>Pokemons</h2>
      {pkms.map((pkm) => {
        return <Pokemon pkm={pkm} />
      })}
    </div>
  )

}

export default PokemonList