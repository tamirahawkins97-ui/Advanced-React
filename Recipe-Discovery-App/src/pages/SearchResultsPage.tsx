import { useSearchParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { type LookupResponse } from '../types/meal';
import { RecipeCard } from '../components/RecipeCard';
import { Spinner } from '../components/Spinner';
import { ErrorMessage } from '../components/ErrorMessage';

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';

  const { data, loading, error } = useFetch<LookupResponse>(
    query ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}` : null
  );

  if (loading) return <Spinner label={`Searching for "${query}"...`} />;
  if (error) return <ErrorMessage message={error} />;

  const meals = data?.meals || [];

  return (
    <div className="container page-pad">
      <nav className="back-nav">
        <Link to="/">← Back to categories</Link>
      </nav>

      <div className="section-head">
        <p className="kicker">Search Results</p>
        <h1 className="page-title">"{query}"</h1>
        <p className="page-subtitle">{meals.length} recipes matched</p>
      </div>

      {meals.length === 0 ? (
        <div className="empty-box">
          <h2>No matching recipes</h2>
          <p>We couldn't find any dishes matching "{query}". Try a broader search term like "Chicken" or "Soup".</p>
        </div>
      ) : (
        <div className="recipe-grid">
          {meals.map((meal) => (
            <RecipeCard
              key={meal.idMeal}
              id={meal.idMeal}
              title={meal.strMeal}
              thumbnail={meal.strMealThumb}
              category={meal.strCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
}