import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuperpowers } from "@fortawesome/free-brands-svg-icons";
import Card from "../components/Card";

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
    setFavoriteCharacters(
      JSON.parse(localStorage.getItem("favoriteCharacters")) || []
    );
    setFavoriteComics(JSON.parse(localStorage.getItem("favoriteComics")) || []);
  }, []);

  const toggleFavoriteCharacter = (char) => {
    let newFavorites;
    if (favoriteCharacters.some((fav) => fav._id === char._id)) {
      newFavorites = favoriteCharacters.filter((fav) => fav._id !== char._id);
    } else {
      newFavorites = [...favoriteCharacters, char];
    }
    setFavoriteCharacters(newFavorites);
    localStorage.setItem("favoriteCharacters", JSON.stringify(newFavorites));
  };

  const toggleFavoriteComic = (comic) => {
    let newFavorites;
    if (favoriteComics.some((fav) => fav._id === comic._id)) {
      newFavorites = favoriteComics.filter((fav) => fav._id !== comic._id);
    } else {
      newFavorites = [...favoriteComics, comic];
    }
    setFavoriteComics(newFavorites);
    localStorage.setItem("favoriteComics", JSON.stringify(newFavorites));
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
              {favoriteCharacters.map((char) => (
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

        {/* Ligne Comics */}
        <h3>Comics favoris</h3>
        <div className="horizontal-scroll">
          {favoriteComics.length === 0 ? (
            <p>Aucun comic en favori.</p>
          ) : (
            <div className="scroll-container">
              {favoriteComics.map((comic) => (
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
