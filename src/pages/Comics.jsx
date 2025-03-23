import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuperpowers } from "@fortawesome/free-brands-svg-icons";
import Card from "../components/Card";

function Comics({ userToken }) {
  const [comics, setComics] = useState([]);
  const [favoriteComics, setFavoriteComics] = useState([]);
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
      navigate(`/comics?${newParams.toString()}`, { replace: true });
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchParams({ page: 1, search: e.target.value });
  };

  useEffect(() => {
    const fetchComics = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://site--marvel--pj2lbzfpm8z4.code.run/comics",
          {
            params: { limit, skip: (page - 1) * limit, title: search },
          }
        );
        setComics(response.data.results || []);
        setTotalCount(response.data.count || 0);
      } catch (error) {
        console.error("Erreur lors de la récupération des comics :", error);
      }
      setLoading(false);
    };

    fetchComics();
  }, [searchParams]);

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

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <main>
      <div className="local-search-container">
        <div className="local-search">
          <FontAwesomeIcon icon={faSuperpowers} className="local-search-icon" />
          <input
            type="text"
            placeholder="Rechercher un comic..."
            value={search}
            onChange={handleSearchChange}
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

export default Comics;
