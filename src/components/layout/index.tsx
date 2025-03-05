import { Link, useLocation } from "react-router-dom";

function Layout({ children, hidden = false, fixed = true }) {
  const location = useLocation();
  const { hash, pathname, search } = location;
  console.log(hash, pathname, search);
  return (
    <>
      <div
        className={`h-fit w-full py-2 flex justify-center text-xl bg-[#24283B] text-gray-200 z-50 ${
          hidden && "hidden"
        }`}
      >
        <div
          className={`flex w-fit py-2 px-5 rounded-full gap-0.5 border border-[#333c6715] bg-[#333c6750] backdrop-blur z-50 ${
            fixed && "fixed"
          }`}
        >
          <Link
            to={"/damagecalc"}
            className={`my-auto nav-item ${pathname.toLowerCase().includes("/damagecalc") && "bg-[#4e60b1]"}`}
          >
            <button className="cursor-pointer">Damage calculator</button>
          </Link>
          <Link
            to={"/pokemons"}
            className={`my-auto nav-item ${pathname.toLowerCase().includes("/pokemons") && "bg-[#4e60b1]"}`}
          >
            <button className="cursor-pointer">Pokemons</button>
          </Link>
          <Link
            to={"/moves"}
            className={`my-auto nav-item ${pathname.toLowerCase().includes("/moves") && "bg-[#4e60b1]"}`}
          >
            <button className="cursor-pointer">Moves</button>
          </Link>
          <Link
            to={"/items"}
            className={`my-auto nav-item ${pathname.toLowerCase().includes("/items") && "bg-[#4e60b1]"}`}
          >
            <button className="cursor-pointer">Items</button>
          </Link>
        </div>
      </div>
      <div className={``}>{children}</div>
    </>
  );
}

export default Layout;
