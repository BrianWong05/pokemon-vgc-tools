import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import DamageCalc from './DamageCalc.tsx'
import { Generations } from '@pkmn/data'
import { Dex } from '@pkmn/dex'
import MoveList from './components/MoveList.tsx'
import PokemonList from './components/PokemonList.tsx'
import Pokemon from './components/Pokemon.tsx'
import ItemList from './components/ItemList.tsx'

const gens = new Generations(Dex);

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/damagecalc' element={<DamageCalc gens={gens} />} />
      <Route path='/moves' element={<MoveList gens={gens} />} />
      <Route path='/pokemons' element={<PokemonList gens={gens} onData={() => {}} />} >
        {/* <Route path=":pid" element={<Pokemon />} /> */}
      </Route>
      <Route path='/items' element={<ItemList gens={gens} onData={() => {}} />} />
    </Routes>
  </BrowserRouter>
)
