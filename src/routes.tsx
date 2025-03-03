import { createHashRouter } from "react-router-dom";
import Error from "@/pages/error";
import Home from "@/pages/home";
import { Generations } from "@pkmn/data";
import { Dex } from "@pkmn/dex";
import DamageCalc from "@/pages/damageCalc";
import PokemonList from "@/pages/PokemonList";
import MoveList from "@/pages/MoveList";
import ItemList from "@/pages/ItemList";
import PokemonId from "@/pages/PokemonId";

const gens = new Generations(Dex);

export const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: "/pokemons",
    element: <PokemonList gens={gens} />,
    errorElement: <Error />,
  },
  {
    path: "/pokemons/:id",
    element: <PokemonId gens={gens} />,
    errorElement: <Error />,
  },
  {
    path: "/moves",
    element: <MoveList gens={gens} onData={() => {}} />,
    errorElement: <Error />,
  },
  {
    path: "/items",
    element: <ItemList gens={gens} />,
    errorElement: <Error />,
  },
  {
    path: "/damagecalc",
    element: <DamageCalc gens={gens} />,
    errorElement: <Error />,
  },
]);

export default router;
