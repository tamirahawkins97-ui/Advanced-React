import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';

export function Navbar() {
  const [searchInput, setSearchInput] = useState('');
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (query) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
      setSearchInput('');
    }
  };

  return (
    <header className="app-nav">
      <div className="app-nav__container container">
        <Link to="/" className="app-nav__logo">
          Tamira's <span>Tasties</span>
        </Link>

        <form onSubmit={handleSearchSubmit} className="app-nav__search">
          <input
            type="search"
            placeholder="Search recipes (e.g. Arrabiata)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <nav className="app-nav__menu">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Categories
          </NavLink>
          <NavLink to="/favorites" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Favorites
            {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}