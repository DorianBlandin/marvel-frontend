import { useEffect, useState } from "react";
import axios from "axios";
import Hero from "../components/Hero";
import Card from "../components/Card";

function Home({ userToken }) {
  const [recommendedComics, setRecommendedComics] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  useEffect(() => {
    const fetchRecommendedComics = async () => {
      setLoadingRecommendations(true);
      try {
        if (!userToken) {
          setRecommendedComics([]);
          setLoadingRecommendations(false);
          return;
        }

        const favoritesResponse = await axios.get(
          "https://site--marvel--pj2lbzfpm8z4.code.run/user/favorites",
          {
            params: { token: userToken },
          }
        );

        const favoriteCharacters =
          favoritesResponse.data.favoriteCharacters || [];
        const allComics = [];

        for (const character of favoriteCharacters) {
          const comicsResponse = await axios.get(
            `https://site--marvel--pj2lbzfpm8z4.code.run/comics/${character._id}`
          );
          const comics = comicsResponse.data.comics;

          for (const comic of comics) {
            if (!allComics.find((c) => c._id === comic._id)) {
              allComics.push(comic);
            }
          }
        }

        setRecommendedComics(allComics);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des comics recommandés :",
          error
        );
      }
      setLoadingRecommendations(false);
    };

    fetchRecommendedComics();
  }, [userToken]);

  return (
    <section className="home-main">
      <div className="home-background">
        <Hero />

        <div className="recommended-container">
          <h2>👇 Ces comics pourraient t'intéresser 👀</h2>

          {loadingRecommendations ? (
            <p className="recommendation-message">Chargement...</p>
          ) : !userToken || recommendedComics.length === 0 ? (
            <p className="recommendation-message">
              🚨 Connecte-toi et ajoute des personnages favoris pour avoir des
              suggestions de comics ! 🚨
            </p>
          ) : (
            <div className="scroll-container">
              {recommendedComics.map((comic) => (
                <Card
                  key={comic._id}
                  item={comic}
                  isFavorite={false}
                  toggleFavorite={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Home;
