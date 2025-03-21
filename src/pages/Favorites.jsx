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
      const isFav = favoriteCharacters.some((fav) => fav._id === char._id);
      const route = isFav ? "/remove" : "";

      const response = await axios.post(
        `https://site--marvel--pj2lbzfpm8z4.code.run/user/favorites${route}`,
        {
          token: userToken,
          item: char,
          type: "character",
        }
      );

      setFavoriteCharacters(response.data.favoriteCharacters || []);
      setFavoriteComics(response.data.favoriteComics || []);
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des favoris personnage :",
        error
      );
    }
  };

  const toggleFavoriteComic = async (comic) => {
    try {
      const isFav = favoriteComics.some((fav) => fav._id === comic._id);
      const route = isFav ? "/remove" : "";

      const response = await axios.post(
        `https://site--marvel--pj2lbzfpm8z4.code.run/user/favorites${route}`,
        {
          token: userToken,
          item: comic,
          type: "comic",
        }
      );

      setFavoriteCharacters(response.data.favoriteCharacters || []);
      setFavoriteComics(response.data.favoriteComics || []);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des favoris comic :", error);
    }
  };

  return userToken ? (
    <div>
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

      <div className="favorites-container">
        <h3>Personnages favoris</h3>
        <div className="horizontal-scroll">
          {favoriteCharacters.length === 0 ? (
            <p>Aucun personnage en favori.</p>
          ) : (
            <div className="scroll-container">
              {favoriteCharacters
                .filter((char) =>
                  char.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((char) => (
                  <Card
                    key={char._id}
                    item={char}
                    isFavorite={true}
                    toggleFavorite={toggleFavoriteCharacter}
                  />
                ))}
            </div>
          )}
        </div>

        <h3>Comics favoris</h3>
        <div className="horizontal-scroll">
          {favoriteComics.length === 0 ? (
            <p>Aucun comic en favori.</p>
          ) : (
            <div className="scroll-container">
              {favoriteComics
                .filter((comic) =>
                  comic.title.toLowerCase().includes(search.toLowerCase())
                )
                .map((comic) => (
                  <Card
                    key={comic._id}
                    item={comic}
                    isFavorite={true}
                    toggleFavorite={toggleFavoriteComic}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
}

export default Favorites;
