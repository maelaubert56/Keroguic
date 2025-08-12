/* eslint-disable react/prop-types */
import { Link, NavLink } from "react-router-dom";

const Header = ({ page }) => {
  return (
    <>
      <header className="bottom_header flex flex-row justify-between m-0">
        <Link
          to="/"
          className="flex flex-row gap-2 items-center p-2"
          aria-label="Accueil - Fête des vieux métiers"
        >
          <img
            src="/assets/img/logo.png"
            alt="Logo de la fête des vieux métiers"
            className="h-16 rounded-2xl"
            loading="lazy"
          />
          <span className="logo-text font-librebaskervillebold text-md uppercase leading-tight">
            Fête
            <br />
            des vieux
            <br />
            métiers
          </span>
        </Link>
        <nav aria-label="Navigation principale" className="md:flex hidden">
          <ul className="menu flex flex-row mr-4 gap-4 items-center p-2 font-librebaskervilleregular">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive || page === "home" ? "active" : undefined
                }
              >
                Accueil
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/blog"
                className={({ isActive }) =>
                  isActive || page === "blog" ? "active" : undefined
                }
              >
                Blog
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/carte"
                className={({ isActive }) =>
                  isActive || page === "carte" ? "active" : undefined
                }
              >
                La carte du site
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/galerie"
                className={({ isActive }) =>
                  isActive || page === "galerie" ? "active" : undefined
                }
              >
                Galerie
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tarifs"
                className={({ isActive }) =>
                  isActive || page === "tarifs" ? "active" : undefined
                }
              >
                Tarifs
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/a-propos"
                className={({ isActive }) =>
                  isActive || page === "a-propos" ? "active" : undefined
                }
              >
                A propos
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;
