import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { type MealDetail, type LookupResponse } from '../types/meal';
import { RecipeCard } from '../components/RecipeCard';
import { Spinner } from '../components/Spinner';

export function FavoritesPage() {
  const { favorites } = useFavorites();
  const [recipes, setRecipes] = useState<MealDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (favorites.length === 0) {
      setRecipes([]);
      return;
    }

    setLoading(true);
    Promise.all(
      favorites.map((id) =>
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
          .then((res) => res.json() as Promise<LookupResponse>)
          .then((data) => data.meals?.[0] || null)
          .catch(() => null)
      )
    )
      .then((items) => {
        setRecipes(items.filter((item): item is MealDetail => item !== null));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [favorites]);

  if (loading) return <Spinner label="Loading your saved recipes..." />;

  return (
    <div className="container page-pad">
      <div className="section-head">
        <p className="kicker">Personal Cookbook</p>
        <h1 className="page-title">Favorite Recipes</h1>
        <p className="page-subtitle">
          {recipes.length} {recipes.length === 1 ? 'saved dish' : 'saved dishes'}
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="empty-box">
          <div className="empty-box__icon">♡</div>
          <h2>No favorites saved yet</h2>
          <p>You haven’t added any recipes to your favorites. Explore categories to start your collection.</p>
          <Link to="/" className="btn btn--primary">
            Explore Categories
          </Link>
        </div>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.idMeal}
              id={recipe.idMeal}
              title={recipe.strMeal}
              thumbnail={recipe.strMealThumb}
              category={recipe.strCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
}