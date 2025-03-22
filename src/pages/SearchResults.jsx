import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Card from "../components/Card";

function SearchResults() {
  const [characters, setCharacters] = useState([]);
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query") || "";

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const [charResponse, comicResponse] = await Promise.all([
          axios.get("https://site--marvel--pj2lbzfpm8z4.code.run/characters", {
            params: { limit: 10, name: searchQuery },
          }),
          axios.get("https://site--marvel--pj2lbzfpm8z4.code.run/comics", {
            params: { limit: 10, title: searchQuery },
          }),
        ]);
        setCharacters(charResponse.data.results);
        setComics(comicResponse.data.results);
      } catch (error) {
        console.error("Erreur lors de la recherche :", error);
      }
      setLoading(false);
    };

    fetchResults();
  }, [searchQuery]);

  return (
    <main>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="horizontal-scroll">
          <h3>Personnages</h3>
          <div className="scroll-container">
            {characters.length === 0 ? (
              <p>Aucun personnage trouvé.</p>
            ) : (
              characters.map((char) => (
                <Card
                  key={char._id}
                  item={char}
                  isFavorite={false}
                  toggleFavorite={() => {}}
                  isLink
                />
              ))
            )}
          </div>
          <h3>Comics</h3>
          <div className="scroll-container">
            {comics.length === 0 ? (
              <p>Aucun comic trouvé.</p>
            ) : (
              comics.map((comic) => (
                <Card
                  key={comic._id}
                  item={comic}
                  isFavorite={false}
                  toggleFavorite={() => {}}
                />
              ))
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default SearchResults;
