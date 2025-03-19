import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function CharacterDetail() {
  const { characterId } = useParams();
  //   console.log("Character ID:", characterId);

  const [character, setCharacter] = useState(null);
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacterData = async () => {
      setLoading(true);
      try {
        // console.log("Fetching character...");
        const charResponse = await axios.get(
          `https://site--marvel--pj2lbzfpm8z4.code.run/character/${characterId}`
        );
        // console.log("Character data:", charResponse.data);
        setCharacter(charResponse.data);

        // console.log("Fetching comics...");
        const comicsResponse = await axios.get(
          `https://site--marvel--pj2lbzfpm8z4.code.run/comics/${characterId}`
        );
        // console.log("Comics response:", comicsResponse.data);

        setComics(comicsResponse.data?.comics || []);
      } catch (error) {
        console.error("Erreur lors de la récupération du personnage :", error);
      }
      setLoading(false);
    };

    fetchCharacterData();
  }, [characterId]);

  if (loading) return <p>Chargement...</p>;
  if (!character) return <p>Personnage introuvable.</p>;

  return (
    <div>
      <h2>{character.name}</h2>
      <img
        src={`${character.thumbnail.path}/portrait_xlarge.${character.thumbnail.extension}`}
        alt={character.name}
      />
      <p>{character.description || "Pas de description disponible."}</p>

      <h3>Comics associés :</h3>
      {comics.length === 0 ? (
        <p>Aucun comic trouvé pour ce personnage.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
          }}
        >
          {comics.map((comic) => (
            <div key={comic._id}>
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
  );
}

export default CharacterDetail;
