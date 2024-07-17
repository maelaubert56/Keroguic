import PropTypes from "prop-types";

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
          <li className={`${page === "a-propos" && "active"}`}>
            <a href="/a-propos">A propos</a>
          </li>
        </ul>
      </header>
      <input
        type="checkbox"
        className="openSidebarMenu hidden box-border"
        id="openSidebarMenu"
      />
      <label
        onClick={() => {
          document
            .getElementById("sidebarMenu")
            .classList.toggle("translate-x-[250px]");
        }}
        htmlFor="openSidebarMenu"
        className="md:hidden sidebarIconToggle z-10 absolute w-[30px] right-9 top-9"
      >
        <span className="spinner diagonal part-1"></span>
        <span className="spinner horizontal"></span>
        <span className="spinner diagonal part-2"></span>
      </label>

      <div
        id="sidebarMenu"
        className="z-10 h-full fixed right-0 w-[250px] transition-transform bg-[#987253] translate-x-[250px] duration-300 ease-in-out"
      >
        <ul className="sidebarMenuInner p-0 m-0 border-t border-t-white/40 font-librebaskervillebold text-white">
          <li
            onClick={() => (window.location.href = "/a-propos")}
            className="p-5 border-b border-b-white/40 leading-tight cursor-pointer"
          >
            KEROGUIC{" "}
            <span className="text-sm text-white/60 block">A PROPOS</span>
          </li>
          <li
            onClick={() => (window.location.href = "/blog")}
            className="p-5 border-b border-b-white/40 cursor-pointer"
          >
            BLOG
          </li>
          <li
            onClick={() => (window.location.href = "/carte")}
            className="p-5 border-b border-b-white/40 cursor-pointer"
          >
            LA CARTE DU SITE
          </li>

          <li
            onClick={() => (window.location.href = "/galerie")}
            className="p-5 border-b border-b-white/40 cursor-pointer"
          >
            GALERIE
          </li>
        </ul>
      </div>
    </>
  );
};

Header.propTypes = {
  page: PropTypes.string.isRequired,
};

export default Header;
