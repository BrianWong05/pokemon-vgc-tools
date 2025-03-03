import Layout from "@/components/layout";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/damagecalc");
  }, []);
  return (
    <Layout>
      <div>Home</div>
    </Layout>
  );
}

export default Home;
