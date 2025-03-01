import { Generations } from "@pkmn/data";
import { Dex } from "@pkmn/dex";
import { RouterProvider } from "react-router-dom";
import router from "./routes";

function App() {
  // const gens = new Generations(Dex);
  // console.log(Object.values(gens.get(9).conditions));

  return <RouterProvider router={router} />;
}

export default App;
