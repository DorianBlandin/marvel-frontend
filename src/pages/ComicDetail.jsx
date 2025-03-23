import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";

function ComicDetail({ userToken }) {
  const { comicId } = useParams();
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoriteComics, setFavoriteComics] = useState([]);

  useEffect(() => {
    const fetchComic = async () => {
      try {
        const response = await axios.get(
          `https://site--marvel--pj2lbzfpm8z4.code.run/comic/${comicId}`
        );
        setComic(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du comic :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComic();
  }, [comicId]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(
          "https://site--marvel--pj2lbzfpm8z4.code.run/user/favorites",
          {
            params: { token: userToken },
          }
        );
        setFavoriteComics(response.data.favoriteComics || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des favoris :", error);
      }
    };

    if (userToken) {
      fetchFavorites();
    }
  }, [userToken]);

  const toggleFavorite = async (comic) => {
    if (!userToken) return;

    try {
      const response = await axios.post(
        "https://site--marvel--pj2lbzfpm8z4.code.run/user/favorites",
        {
          token: userToken,
          item: comic,
          type: "comic",
        }
      );

      setFavoriteComics(response.data.favoriteComics || []);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du favori :", error);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!comic) return <p>Comic introuvable.</p>;

  return (
    <div className="comic-detail-container">
      <h2>{comic.title}</h2>

      <Card
        item={comic}
        isFavorite={favoriteComics.some((fav) => fav._id === comic._id)}
        toggleFavorite={() => toggleFavorite(comic)}
        hideTitle={true}
      />

      <p>
        {comic.description || "Pas de description disponible pour ce comic."}
      </p>

      <Link to="/comics" className="back-btn">
        ← Retour à la liste des comics
      </Link>
    </div>
  );
}

export default ComicDetail;
