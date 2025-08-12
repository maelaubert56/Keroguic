const Footer = () => {
  return (
    <>
      <div className="flex flex-col justify-start items-center gap-6 pt-14 pb-14 bg-black text-white font-librebaskervillebold text-xl uppercase">
        <h2>Nos Partenaires</h2>
        <div className="flex">
          <a href="https://www.mairie-baud.fr/">
            <img
              className="w-[8em] block hover:scale-110 transition-transform duration-500 ease-in-out"
              src="/assets/img/logo-baud.png"
              alt="logo mairie de baud"
            />
          </a>
        </div>
      </div>
      <footer className="border-t border-white bg-black flex flex-col justify-center items-center gap-5 text-center p-7 text-white">
        <div className="font-arial text-sm font-semibold">
          <h2>Copyright © 2023 - Comité du Quartier des Bois</h2>
          <h2>Site réalisé par Maël Aubert</h2>
          <a className="text-white underline hover:text-gray-300" href="/admin">
            Page Admin
          </a>
        </div>
        <div className="flex flex-row gap-6 items-center justify-center">
          <a href="https://www.facebook.com/www.keroguic.fr">
            <img
              className="w-9"
              src="/assets/img/facebook.svg"
              alt="facebook"
            />
          </a>
          <a href="mailto:bureau.vieux-metiers@orange.fr">
            <img
              className="bg-white p-1 rounded-full w-9"
              src="/assets/img/email.png"
              alt="email"
            />
          </a>
        </div>
      </footer>
    </>
  );
};

export default Footer;
