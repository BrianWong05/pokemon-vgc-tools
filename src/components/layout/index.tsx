import { Link } from "react-router";

function Layout({ children, hidden = false, fixed = true }) {
  return (
    <>
      <div className={`h-15 w-full flex text-xl bg-[#24283B] text-gray-200 z-50 ${hidden && "hidden"}`}>
        <div className={`h-15 flex justify-evenly w-full bg-[#24283B] z-50 ${fixed && "fixed"}`}>
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
      <div className={``}>{children}</div>
    </>
  );
}

export default Layout;
