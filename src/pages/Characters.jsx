import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuperpowers } from "@fortawesome/free-brands-svg-icons";
import Card from "../components/Card";

function Characters({ userToken }) {
  const [characters, setCharacters] = useState([]);
  const [favoriteCharacters, setFavoriteCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://site--marvel--pj2lbzfpm8z4.code.run/characters",
          {
            params: { limit: 100, skip: (page - 1) * 100, name: search },
          }
        );
        setCharacters(response.data.results);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des personnages :",
          error
        );
      }
      setLoading(false);
    };

    fetchCharacters();
  }, [page, search]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(
          "https://site--marvel--pj2lbzfpm8z4.code.run/user/favorites",
          { params: { token: userToken } }
        );
        setFavoriteCharacters(response.data.favoriteCharacters || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des favoris :", error);
      }
    };

    if (userToken) {
      fetchFavorites();
    }
  }, [userToken]);

  const toggleFavorite = async (char) => {
    try {
      const isFavorite = favoriteCharacters.some((fav) => fav._id === char._id);
      const route = isFavorite ? "remove" : "add";

      const response = await axios.post(
        `https://site--marvel--pj2lbzfpm8z4.code.run/user/favorites/${route}`,
        {
          token: userToken,
          item: char,
          type: "character",
        }
      );

      setFavoriteCharacters(response.data.favoriteCharacters || []);
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
            placeholder="Rechercher un personnage..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid-container">
          {characters.map((char) => (
            <Card
              key={char._id}
              item={char}
              isFavorite={favoriteCharacters.some(
                (fav) => fav._id === char._id
              )}
              toggleFavorite={() => toggleFavorite(char)}
              isLink
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

export default Characters;
