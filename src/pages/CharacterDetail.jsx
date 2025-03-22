import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card";

function CharacterDetail({ userToken }) {
  const { characterId } = useParams();
  const [character, setCharacter] = useState(null);
  const [comics, setComics] = useState([]);
  const [favoriteComics, setFavoriteComics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      try {
        const response = await axios.get(
          `https://site--marvel--pj2lbzfpm8z4.code.run/character/${characterId}`
        );
        setCharacter(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du personnage :", error);
      }
    };

    const fetchComics = async () => {
      try {
        const response = await axios.get(
          `https://site--marvel--pj2lbzfpm8z4.code.run/comics/${characterId}`
        );
        setComics(response.data.comics);
      } catch (error) {
        console.error("Erreur lors de la récupération des comics :", error);
      }

      setLoading(false);
    };

    fetchCharacterDetails();
    fetchComics();
  }, [characterId]);

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

  if (loading || !character) return <p>Chargement...</p>;

  return (
    <div className="character-detail-container">
      <h2>{character.name}</h2>
      <img
        src={`${character.thumbnail.path}/portrait_xlarge.${character.thumbnail.extension}`}
        alt={character.name}
        className="character-image"
      />
      <p>{character.description || "Pas de description disponible."}</p>

      <div className="comics-found">
        <h3>Présent·e·s dans :</h3>
        {comics.length > 0 ? (
          <div className="comics-grid">
            {comics.map((comic) => (
              <Card
                key={comic._id}
                item={comic}
                isFavorite={favoriteComics.some((fav) => fav._id === comic._id)}
                toggleFavorite={() => toggleFavorite(comic)}
              />
            ))}
          </div>
        ) : (
          <p>Aucun comic trouvé pour ce personnage.</p>
        )}
      </div>

      <Link to="/characters" className="back-btn">
        ← Retour à la liste des personnages
      </Link>
    </div>
  );
}

export default CharacterDetail;
