/* eslint-disable react/prop-types */
const Header = ({ page }) => {
  // component code here
  return (
    <>
      <header className="bottom_header flex flex-row justify-between m-0">
        <a href="/" className="flex flex-row gap-2 items-center p-2">
          <img
            src="/assets/img/logo.png"
            alt="logo"
            className="h-16 rounded-2xl"
          />
          <span className="logo-text font-librebaskervillebold text-md uppercase leading-tight">
            Fête
            <br />
            des vieux
            <br />
            métiers
          </span>
        </a>
        <ul className="menu md:flex hidden flex-row mr-4 gap-4 items-center p-2 font-librebaskervilleregular">
          <li className={`${page === "home" && "active"}`}>
            <a href="/">Accueil</a>
          </li>
          <li className={`${page === "blog" && "active"}`}>
            <a href="/blog">Blog</a>
          </li>
          <li className={`${page === "carte" && "active"}`}>
            <a href="/carte">La carte du site</a>
          </li>
          <li className={`${page === "galerie" && "active"}`}>
            <a href="/galerie">Galerie</a>
          </li>
          <li className={`${page === "tarifs" && "active"}`}>
            <a href="/tarifs">Tarifs</a>
          </li>
          <li className={`${page === "a-propos" && "active"}`}>
            <a href="/a-propos">A propos</a>
          </li>
        </ul>
      </header>
    </>
  );
};

export default Header;
