import { Link } from "react-router";

function Layout({ children, hidden = false }) {
  return (
    <>
      <div className={`h-15 w-full flex text-xl text-gray-200 ${hidden && "hidden"}`}>
        <div className="h-15 flex justify-evenly w-full bg-[#24283B] z-50">
          <Link to={"/damagecalc"} className="my-auto">
            <button>Damage calculator</button>
          </Link>
          <Link to={"/pokemons"} className="my-auto">
            <button>Pokemons</button>
          </Link>
          <Link to={"/moves"} className="my-auto">
            <button>Moves</button>
          </Link>
          <Link to={"/items"} className="my-auto">
            <button>Items</button>
          </Link>
        </div>
      </div>
      <div>{children}</div>
    </>
  );
}

export default Layout;
