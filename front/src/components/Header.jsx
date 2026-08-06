/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { to: "/", end: true, label: "Accueil", key: "home" },
  { to: "/blog", label: "Blog", key: "blog" },
  { to: "/carte", label: "La carte du site", key: "carte" },
  { to: "/galerie", label: "Galerie", key: "galerie" },
  { to: "/menu", label: "Menu", key: "menu" },
  { to: "/a-propos", label: "A propos", key: "a-propos" },
];

const Header = ({ page }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="bottom_header flex flex-row justify-between items-center m-0 relative z-50 bg-white border-b-2 border-[#EAC999]">
        <Link
          to="/"
          className="flex flex-row gap-2 items-center p-2"
          aria-label="Accueil - Fête des vieux métiers"
        >
          <img
            src="/assets/img/logo-text.png"
            alt="Logo de la fête des vieux métiers"
            className="h-16 py-2"
            loading="lazy"
          />
        </Link>
        <nav aria-label="Navigation principale" className="md:flex hidden">
          <ul className="menu flex flex-row mr-4 gap-4 items-center p-2 font-librebaskervilleregular">
            {navLinks.map(({ to, end, label, key }) => (
              <li key={key}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    isActive || page === key ? "active" : undefined
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className="md:hidden flex items-center justify-center p-2 mr-3 rounded-md text-[#1B2A3C] hover:bg-[#FFE8C6] active:bg-[#EAC999] transition-colors"
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </header>
      <div
        className={`md:hidden fixed inset-0 top-0 z-40 bg-[#1B2A3C]/50 transition-opacity duration-300 ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />
      <nav
        id="mobile-menu"
        aria-label="Navigation principale mobile"
        className={`md:hidden fixed top-0 right-0 z-40 h-full w-64 max-w-[80%] bg-[#FFE8C6] shadow-xl pt-24 border-l-4 border-[#EAC999] transition-transform duration-300 ease-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="mobile-menu flex flex-col font-librebaskervilleregular divide-y divide-[#EAC999]">
          {navLinks.map(({ to, end, label, key }) => (
            <li key={key}>
              <NavLink
                to={to}
                end={end}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-6 py-4 text-lg transition-colors text-[#1B2A3C] hover:bg-[#EAC999]/50 ${
                    isActive || page === key
                      ? "font-bold bg-[#EAC999]/60 border-l-4 border-[#A8462E] -ml-1 pl-5"
                      : ""
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Header;
