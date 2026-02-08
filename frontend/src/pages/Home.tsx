

import Layout from "../components/Layout";
import Albums from "../components/Albums";
import Songs from "../components/Songs";
import PageLoader from "../components/PageLoader";
import { useAlbums } from "../hooks/useAlbums";
import { useSongs } from "../hooks/useSongs";
import {useAuthUser} from "../hooks/useAuthUser";


function Home() {
  const { isLoading: albumsLoading } = useAlbums();
  const { isLoading: songsLoading } = useSongs();
  const { isLoading: userLoading } = useAuthUser();

  if (albumsLoading || songsLoading || userLoading) {
    return <PageLoader />;
  }

  return (
    <div className="">
      <Layout>
        <Albums />
        <Songs />
      </Layout>
    </div>
  );
}

export default Home;
