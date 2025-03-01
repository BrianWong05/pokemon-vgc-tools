import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col">
      <Link to={"/damagecalc"}>
        <button>Damage calculator</button>
      </Link>
      <Link to={"/pokemons"}>
        <button>Pokemons</button>
      </Link>
      <Link to={"/moves"}>
        <button>Moves</button>
      </Link>
      <Link to={"/items"}>
        <button>Items</button>
      </Link>
    </div>
  );
}

export default Home;
