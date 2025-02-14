import { Generations } from '@pkmn/data';
import { Dex } from '@pkmn/dex';
import PokemonList from './components/PokemonList';
import MoveList from './components/MoveList';
import './App.css'

function App() {
  
  const gens = new Generations(Dex)

  return (
    <>
    <MoveList gens={gens} />
    {/* <PokemonList gens={gens}/> */}
    </>
  )
}

export default App
