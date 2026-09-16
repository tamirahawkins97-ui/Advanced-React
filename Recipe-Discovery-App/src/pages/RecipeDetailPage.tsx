import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useFavorites } from '../context/FavoritesContext';
import {type LookupResponse, type IngredientItem } from '../types/meal';
import { Spinner } from '../components/Spinner';
import { ErrorMessage } from '../components/ErrorMessage';

export function RecipeDetailPage() {
  const { recipeId } = useParams<{ recipeId: string }>();
  const safeId = recipeId || '';

  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { data, loading, error } = useFetch<LookupResponse>(
    safeId ? `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(safeId)}` : null
  );

  if (loading) return <Spinner label="Loading recipe details..." />;
  if (error) return <ErrorMessage message={error} />;

  const meal = data?.meals?.[0];

  if (!meal) {
    return <ErrorMessage message="Recipe not found." />;
  }

  const favorited = isFavorite(meal.idMeal);

  // Extract ingredients/measurements safely from key access
  const ingredientsList: IngredientItem[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredientsList.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : '',
      });
    }
  }

  return (
    <article className="container page-pad detail-page">
      <nav className="back-nav">
        <Link to={`/category/${meal.strCategory}`}>← Back to {meal.strCategory}</Link>
      </nav>

      <div className="detail-head">
        <div className="detail-head__tags">
          <span className="pill">{meal.strCategory}</span>
          {meal.strArea && <span className="pill pill--muted">{meal.strArea} Origin</span>}
        </div>
        <h1 className="page-title">{meal.strMeal}</h1>

        <button
          type="button"
          onClick={() => (favorited ? removeFavorite(meal.idMeal) : addFavorite(meal.idMeal))}
          className={`btn ${favorited ? 'btn--favorited' : 'btn--primary'}`}
        >
          {favorited ? '♥ Favorited' : '♡ Add to Favorites'}
        </button>
      </div>

      <div className="detail-body">
        <aside className="detail-sidebar">
          <div className="detail-img-card">
            <img src={meal.strMealThumb} alt={meal.strMeal} />
          </div>

          <div className="ingredients-panel">
            <h2>Ingredients</h2>
            <ul className="ingredients-table">
              {ingredientsList.map((item, index) => (
                <li key={index}>
                  <span className="item-name">{item.ingredient}</span>
                  <span className="item-measure">{item.measure}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="detail-content">
          <h2>Preparation Instructions</h2>
          <div className="detail-instructions">
            {meal.strInstructions
              .split('\r\n')
              .filter(Boolean)
              .map((step, idx) => (
                <p key={idx}>{step}</p>
              ))}
          </div>

          {meal.strYoutube && (
            <div className="detail-video-cta">
              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn--outline"
              >
                Watch Video Demonstration ↗
              </a>
            </div>
          )}
        </section>
      </div>
    </article>
  );
}