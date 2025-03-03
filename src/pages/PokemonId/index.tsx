import Layout from "@/components/layout";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function PokemonId({ gens }) {
  const param = useParams();
  const id = param.id;
  const navigate = useNavigate();

  const pkms = Array.from(gens.get(9).species);
  const [pkm, setPkm] = useState(null);

  useEffect(() => {
    const selectedPkm = pkms.filter(
      (pkm) => pkm.num.toString() === id || pkm.name.toLocaleLowerCase() === String(id).toLocaleLowerCase(),
    );
    if (selectedPkm.length !== 1) navigate("/pokemons");
    else setPkm(selectedPkm[0]);
  }, [id]);

  if (!pkm)
    return (
      <Layout>
        <div>Loading</div>
      </Layout>
    );

  const baseStats = pkm.baseStats;
  const types = pkm.types;
  const type1 = types[0].toLocaleLowerCase();
  const type2 = types[types.length - 1].toLocaleLowerCase();
  console.log(pkm);
  return (
    <Layout>
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-white absolute top-3 left-3">
          <img
            className="w-18 h-18 rounded-2xl bg-white absolute top-3 left-3"
            src={`/pokemon-vgc-tools/images/pokemons/${pkm.name.replace(/\s+/g, "_")}_SV.png`}
            loading="lazy"
          />
        </div>
        <div className="flex">
          <div className={`w-15 h-30 rounded-tl-full rounded-bl-full bg-${type1}`} />
          <div className={`w-15 h-30 rounded-tr-full rounded-br-full bg-${type2}`} />
        </div>
      </div>
      <div>{pkm.name}</div>
    </Layout>
  );
}

export default PokemonId;
