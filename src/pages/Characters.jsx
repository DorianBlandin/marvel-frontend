import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuperpowers } from "@fortawesome/free-brands-svg-icons";
import Card from "../components/Card";

function Characters({ userToken }) {
  const [characters, setCharacters] = useState([]);
  const [favoriteCharacters, setFavoriteCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const limit = 100;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  useEffect(() => {
    if (!searchParams.get("page")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", "1");
      if (!newParams.get("search")) newParams.set("search", "");
      navigate(`/characters?${newParams.toString()}`, { replace: true });
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchParams({ page: 1, search: e.target.value });
  };

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://site--marvel--pj2lbzfpm8z4.code.run/characters",
          {
            params: {
              limit,
              skip: (page - 1) * limit,
              name: search,
            },
          }
        );
        setCharacters(response.data.results);
        setTotalCount(response.data.count);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des personnages :",
          error
        );
      }
      setLoading(false);
    };

    fetchCharacters();
  }, [searchParams]);

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
    if (!userToken) return;

    try {
      const response = await axios.post(
        "https://site--marvel--pj2lbzfpm8z4.code.run/user/favorites",
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

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <main>
      <div className="local-search-container">
        <div className="local-search">
          <FontAwesomeIcon icon={faSuperpowers} className="local-search-icon" />
          <input
            type="text"
            placeholder="Rechercher un personnage..."
            value={search}
            onChange={handleSearchChange}
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
        <button
          onClick={() => setSearchParams({ page: page - 1, search })}
          disabled={page <= 1}
        >
          Précédent
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button
          onClick={() => setSearchParams({ page: page + 1, search })}
          disabled={page >= totalPages}
        >
          Suivant
        </button>
      </div>
    </main>
  );
}

export default Characters;
