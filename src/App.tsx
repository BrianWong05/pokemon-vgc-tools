import { Generations } from '@pkmn/data';
import { Dex } from '@pkmn/dex';
import PokemonList from './components/PokemonList';

function App() {
  
  const gens = new Generations(Dex)

  const pkm = gens.get(9);

  // console.log(Array.from(gens.get(9).species));
  // console.log(Array.from(gens.get(9).moves));
  return (
    <>
    <PokemonList></PokemonList>
    </>
  )
}

export default App
