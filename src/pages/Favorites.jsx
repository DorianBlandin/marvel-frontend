import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuperpowers } from "@fortawesome/free-brands-svg-icons";
import Card from "../components/Card";
import axios from "axios";

function Favorites({ userToken }) {
  const [favoriteCharacters, setFavoriteCharacters] = useState([]);
  const [favoriteComics, setFavoriteComics] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userToken) {
      navigate("/login");
    }
  }, [userToken, navigate]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(
          "https://site--marvel--pj2lbzfpm8z4.code.run/user/favorites",
          { params: { token: userToken } }
        );
        setFavoriteCharacters(response.data.favoriteCharacters || []);
        setFavoriteComics(response.data.favoriteComics || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des favoris :", error);
      }
    };

    if (userToken) {
      fetchFavorites();
    }
  }, [userToken]);

  const toggleFavoriteCharacter = async (char) => {
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
      console.error(
        "Erreur lors de la mise à jour des favoris personnage :",
        error
      );
    }
  };

  const toggleFavoriteComic = async (comic) => {
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
      console.error("Erreur lors de la mise à jour des favoris comic :", error);
    }
  };

  const filteredCharacters = favoriteCharacters.filter((char) =>
    char.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredComics = favoriteComics.filter((comic) =>
    comic.title.toLowerCase().includes(search.toLowerCase())
  );

  return userToken ? (
    <main>
      <div className="local-search-container">
        <div className="local-search">
          <FontAwesomeIcon icon={faSuperpowers} className="local-search-icon" />
          <input
            type="text"
            placeholder="Rechercher un favori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="horizontal-scroll">
        <h3>Personnages favoris</h3>
        {filteredCharacters.length === 0 ? (
          <p>
            {search
              ? "Aucun personnage trouvé avec cette recherche."
              : "Aucun personnage en favori 😱"}
          </p>
        ) : (
          <div className="scroll-container">
            {filteredCharacters.map((char) => (
              <Card
                key={char._id}
                item={char}
                type="character"
                isFavorite={true}
                toggleFavorite={toggleFavoriteCharacter}
              />
            ))}
          </div>
        )}
      </div>

      <div className="horizontal-scroll">
        <h3>Comics favoris</h3>
        {filteredComics.length === 0 ? (
          <p>
            {search
              ? "Aucun comic trouvé avec cette recherche."
              : "Aucun comic en favori 😭"}
          </p>
        ) : (
          <div className="scroll-container">
            {filteredComics.map((comic) => (
              <Card
                key={comic._id}
                item={comic}
                type="comic"
                isFavorite={true}
                toggleFavorite={toggleFavoriteComic}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  ) : null;
}

export default Favorites;
