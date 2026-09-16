import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { type FilterResponse } from '../types/meal';
import { RecipeCard } from '../components/RecipeCard';
import { Spinner } from '../components/Spinner';
import { ErrorMessage } from '../components/ErrorMessage';

export function CategoryPage() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const safeCategory = categoryName || '';

  const { data, loading, error } = useFetch<FilterResponse>(
    safeCategory ? `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(safeCategory)}` : null
  );

  if (loading) return <Spinner label={`Loading ${safeCategory} dishes...`} />;
  if (error) return <ErrorMessage message={error} />;

  const meals = data?.meals || [];

  return (
    <div className="container page-pad">
      <nav className="back-nav">
        <Link to="/">← Back to all categories</Link>
      </nav>

      <div className="section-head">
        <p className="kicker">Category</p>
        <h1 className="page-title">{safeCategory}</h1>
        <p className="page-subtitle">{meals.length} recipes available</p>
      </div>

      {meals.length === 0 ? (
        <div className="empty-box">
          <p>No recipes found in this category.</p>
        </div>
      ) : (
        <div className="recipe-grid">
          {meals.map((meal) => (
            <RecipeCard
              key={meal.idMeal}
              id={meal.idMeal}
              title={meal.strMeal}
              thumbnail={meal.strMealThumb}
              category={safeCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
}