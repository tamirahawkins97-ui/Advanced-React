import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { type CategoriesResponse } from '../types/meal';
import { Spinner } from '../components/Spinner';
import { ErrorMessage } from '../components/ErrorMessage';

export function HomePage() {
  const { data, loading, error } = useFetch<CategoriesResponse>(
    'https://www.themealdb.com/api/json/v1/1/categories.php'
  );

  if (loading) return <Spinner label="Loading recipe categories..." />;
  if (error) return <ErrorMessage message={error} />;

  const categories = data?.categories || [];

  return (
    <div className="container page-pad">
      <div className="section-head">
        <p className="kicker">Culinary Directory</p>
        <h1 className="page-title">Browse by Category</h1>
        <p className="page-subtitle">Select a category to explore tested culinary dishes.</p>
      </div>

      <div className="category-grid">
        {categories.map((cat) => (
          <Link to={`/category/${cat.strCategory}`} key={cat.idCategory} className="category-tile">
            <div className="category-tile__img-wrap">
              <img src={cat.strCategoryThumb} alt={cat.strCategory} loading="lazy" />
            </div>
            <div className="category-tile__content">
              <h2>{cat.strCategory}</h2>
              <p>{cat.strCategoryDescription.slice(0, 95)}...</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}