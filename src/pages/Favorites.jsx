import { useState, useEffect } from "react";

function Favorites() {
  const [favoriteCharacters, setFavoriteCharacters] = useState([]);
  const [favoriteComics, setFavoriteComics] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setFavoriteCharacters(
      JSON.parse(localStorage.getItem("favoriteCharacters")) || []
    );
    setFavoriteComics(JSON.parse(localStorage.getItem("favoriteComics")) || []);
  }, []);

  const filteredCharacters = favoriteCharacters.filter((char) =>
    char.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredComics = favoriteComics.filter((comic) =>
    comic.title.toLowerCase().includes(search.toLowerCase())
  );

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedCharacters = filteredCharacters.slice(startIndex, endIndex);
  const paginatedComics = filteredComics.slice(startIndex, endIndex);

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Rechercher un favori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <h3>Personnages</h3>
      {paginatedCharacters.length === 0 ? (
        <p>Aucun personnage en favori.</p>
      ) : (
        <div className="grid-container">
          {paginatedCharacters.map((char) => (
            <div key={char._id} className="card">
              <img
                src={`${char.thumbnail.path}/portrait_xlarge.${char.thumbnail.extension}`}
                alt={char.name}
              />
              <p>{char.name}</p>
            </div>
          ))}
        </div>
      )}

      <h3>Comics</h3>
      {paginatedComics.length === 0 ? (
        <p>Aucun comic en favori.</p>
      ) : (
        <div className="grid-container">
          {paginatedComics.map((comic) => (
            <div key={comic._id} className="card">
              <img
                src={`${comic.thumbnail.path}/portrait_xlarge.${comic.thumbnail.extension}`}
                alt={comic.title}
              />
              <p>{comic.title}</p>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
        >
          Précédent
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={
            endIndex >= filteredCharacters.length &&
            endIndex >= filteredComics.length
          }
        >
          Suivant
        </button>
      </div>
    </div>
  );
}

export default Favorites;
