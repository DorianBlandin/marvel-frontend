import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuperpowers } from "@fortawesome/free-brands-svg-icons";
import Card from "../components/Card";

function Comics({ userToken }) {
  const [comics, setComics] = useState([]);
  const [favoriteComics, setFavoriteComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchComics = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://site--marvel--pj2lbzfpm8z4.code.run/comics",
          {
            params: { limit: 100, skip: (page - 1) * 100, title: search },
          }
        );
        setComics(response.data.results);
      } catch (error) {
        console.error("Erreur lors de la récupération des comics :", error);
      }
      setLoading(false);
    };

    fetchComics();
  }, [page, search]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(
          "https://site--marvel--pj2lbzfpm8z4.code.run/user/favorites",
          { params: { token: userToken } }
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

  return (
    <div>
      <div className="local-search-container">
        <div className="local-search">
          <FontAwesomeIcon icon={faSuperpowers} className="local-search-icon" />
          <input
            type="text"
            placeholder="Rechercher un comic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid-container">
          {comics.map((comic) => (
            <Card
              key={comic._id}
              item={comic}
              isFavorite={favoriteComics.some((fav) => fav._id === comic._id)}
              toggleFavorite={() => toggleFavorite(comic)}
            />
          ))}
        </div>
      )}

      <div className="pagination">
        <button onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
          Précédent
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage((prev) => prev + 1)}>Suivant</button>
      </div>
    </div>
  );
}

export default Comics;
