import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Characters({ search }) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favoriteCharacters")) || []
  );

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

  const toggleFavorite = (char) => {
    let updatedFavorites;
    if (favorites.some((fav) => fav._id === char._id)) {
      updatedFavorites = favorites.filter((fav) => fav._id !== char._id);
    } else {
      updatedFavorites = [...favorites, char];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem(
      "favoriteCharacters",
      JSON.stringify(updatedFavorites)
    );
  };

  return (
    <div>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid-container">
          {characters.map((char) => (
            <div key={char._id} className="card">
              <Link to={`/character/${char._id}`}>
                <img
                  src={`${char.thumbnail.path}/portrait_xlarge.${char.thumbnail.extension}`}
                  alt={char.name}
                />
                <p>{char.name}</p>
              </Link>
              <button
                className="favorite-btn"
                onClick={() => toggleFavorite(char)}
              >
                {favorites.some((fav) => fav._id === char._id)
                  ? "Retirer des favoris 💔"
                  : "Ajouter aux favoris ❤️"}
              </button>
            </div>
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
