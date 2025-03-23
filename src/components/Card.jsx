import { Link } from "react-router-dom";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";

function Card({ item, isFavorite, toggleFavorite }) {
  const [imageUrl, setImageUrl] = useState(
    `${item.thumbnail.path}/portrait_uncanny.${item.thumbnail.extension}`
  );

  const fallbackFormats = [
    "portrait_fantastic",
    "portrait_medium",
    "portrait_small",
    "standard_fantastic",
    "standard_large",
    "standard_medium",
    "standard_small",
    "standard_amazing",
  ];

  const handleImageError = () => {
    const currentFormat = imageUrl.split("/").pop().split(".")[0];

    const currentIndex = fallbackFormats.indexOf(currentFormat);
    const nextFormat =
      fallbackFormats[currentIndex + 1] || "image_not_available";
    const fallbackUrl = `${item.thumbnail.path}/${nextFormat}.${item.thumbnail.extension}`;
    setImageUrl(fallbackUrl);
  };

  const isCharacter = Boolean(item.name);
  const linkPath = isCharacter
    ? `/character/${item._id}`
    : `/comic/${item._id}`;
  const title = item.name || item.title;

  return (
    <div className="card">
      <Link to={linkPath}>
        <img
          src={imageUrl}
          alt={title}
          onError={handleImageError}
          className="card-image"
        />
        <p>{title}</p>
      </Link>

      <button className="favorite-btn" onClick={() => toggleFavorite(item)}>
        <FaHeart color={isFavorite ? "red" : "black"} />
      </button>
    </div>
  );
}

export default Card;
