import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card";

function CharacterDetail({ userToken }) {
  const { characterId } = useParams();
  const [character, setCharacter] = useState(null);
  const [comics, setComics] = useState([]);
  const [favoriteComics, setFavoriteComics] = useState([]);
  const [favoriteCharacters, setFavoriteCharacters] = useState([]);
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
          {
            params: { token: userToken },
          }
        );
        setFavoriteComics(response.data.favoriteComics || []);
        setFavoriteCharacters(response.data.favoriteCharacters || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des favoris :", error);
      }
    };

    if (userToken) {
      fetchFavorites();
    }
  }, [userToken]);

  const toggleFavoriteComic = async (comic) => {
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

  const toggleFavoriteCharacter = async (char) => {
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

  if (loading || !character) return <p>Chargement...</p>;

  return (
    <main>
      <div className="detail-container">
        <h2>{character.name}</h2>

        <Card
          item={character}
          isFavorite={favoriteCharacters.some(
            (fav) => fav._id === character._id
          )}
          toggleFavorite={() => toggleFavoriteCharacter(character)}
          hideTitle={true}
        />

        <p>{character.description || "Pas de description disponible."}</p>

        <div className="comics-found">
          <h3>Présent·e·s dans :</h3>
          {comics.length > 0 ? (
            <div className="grid-container">
              {comics.map((comic) => (
                <Card
                  key={comic._id}
                  item={comic}
                  isFavorite={favoriteComics.some(
                    (fav) => fav._id === comic._id
                  )}
                  toggleFavorite={() => toggleFavoriteComic(comic)}
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
    </main>
  );
}

export default CharacterDetail;
