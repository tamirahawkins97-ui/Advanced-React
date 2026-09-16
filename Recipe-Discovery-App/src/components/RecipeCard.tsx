import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';

interface RecipeCardProps {
  id: string;
  title: string;
  thumbnail: string;
  category?: string;
}

export function RecipeCard({ id, title, thumbnail, category }: RecipeCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorited = isFavorite(id);

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorited) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  return (
    <article className="recipe-card">
      <Link to={`/recipe/${id}`} className="recipe-card__media">
        <img src={thumbnail} alt={title} loading="lazy" />
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={`favorite-toggle-btn ${favorited ? 'active' : ''}`}
          aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
        >
          {favorited ? '♥' : '♡'}
        </button>
      </Link>
      <div className="recipe-card__details">
        {category && <span className="recipe-card__tag">{category}</span>}
        <h3 className="recipe-card__name">
          <Link to={`/recipe/${id}`}>{title}</Link>
        </h3>
      </div>
    </article>
  );
}