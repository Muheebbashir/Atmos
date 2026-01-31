
import Layout from "../components/Layout";
import Albums from "../components/Albums";
import Songs from "../components/Songs";

function Home() {
  return (
    <div>
      <Layout>
        <Albums />
        <Songs />
      </Layout>
    </div>
  );
}

export default Home;
