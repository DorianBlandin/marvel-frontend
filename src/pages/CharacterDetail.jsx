import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function CharacterDetail() {
  const { characterId } = useParams();
  const [character, setCharacter] = useState(null);
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favoriteCharacters")) || []
  );

  useEffect(() => {
    const fetchCharacterData = async () => {
      setLoading(true);
      try {
        const charResponse = await axios.get(
          `https://site--marvel--pj2lbzfpm8z4.code.run/character/${characterId}`
        );
        setCharacter(charResponse.data);

        const comicsResponse = await axios.get(
          `https://site--marvel--pj2lbzfpm8z4.code.run/comics/${characterId}`
        );
        setComics(comicsResponse.data?.comics || []);
      } catch (error) {
        console.error("Erreur lors de la récupération du personnage :", error);
      }
      setLoading(false);
    };

    fetchCharacterData();
  }, [characterId]);

  const toggleFavorite = () => {
    let updatedFavorites;
    if (favorites.some((fav) => fav._id === character._id)) {
      updatedFavorites = favorites.filter((fav) => fav._id !== character._id);
    } else {
      updatedFavorites = [...favorites, character];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem(
      "favoriteCharacters",
      JSON.stringify(updatedFavorites)
    );
  };

  if (loading) return <p>Chargement...</p>;
  if (!character) return <p>Personnage introuvable.</p>;

  return (
    <div className="character-detail-container">
      <h2>{character.name}</h2>
      <img
        src={`${character.thumbnail.path}/portrait_xlarge.${character.thumbnail.extension}`}
        alt={character.name}
        className="character-image"
      />
      <p>{character.description || "Pas de description disponible."}</p>

      <button className="favorite-btn" onClick={toggleFavorite}></button>
      <div className="comics-found">
        <h3>Présent·e·s dans :</h3>
        {comics.length === 0 ? (
          <p>Aucun comic trouvé pour ce personnage.</p>
        ) : (
          <div className="comics-grid">
            {comics.map((comic) => (
              <div key={comic._id} className="comic-card">
                <img
                  src={`${comic.thumbnail.path}/portrait_xlarge.${comic.thumbnail.extension}`}
                  alt={comic.title}
                />
                <p>{comic.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link to="/characters" className="back-btn">
        ← Retour à la liste des personnages
      </Link>
    </div>
  );
}

export default CharacterDetail;
