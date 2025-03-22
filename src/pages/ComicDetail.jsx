import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ComicDetail() {
  const { comicId } = useParams();
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComic = async () => {
      try {
        const response = await axios.get(
          `https://site--marvel--pj2lbzfpm8z4.code.run/comic/${comicId}`
        );
        setComic(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du comic :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComic();
  }, [comicId]);

  if (loading) return <p>Chargement...</p>;
  if (!comic) return <p>Comic introuvable.</p>;

  return (
    <div className="comic-detail-container">
      <h2>{comic.title}</h2>
      <img
        src={`${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}`}
        alt={comic.title}
        className="comic-image"
      />
      <p>
        {comic.description || "Pas de description disponible pour ce comic."}
      </p>

      <Link to="/comics" className="back-btn">
        ← Retour à la liste des comics
      </Link>
    </div>
  );
}

export default ComicDetail;
