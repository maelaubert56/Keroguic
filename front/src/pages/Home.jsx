const Home = () => {
  return (
    <main className="font-librebaskervilleregular">
      <div className="bg-[url('/assets/img/banner.jpg')] h-[40vh] bg-cover	bg-center bg-no-repeat flex flex-col justify-start items-center">
        <div className="w-[90%] p-5 m-4 bg-black/60 text-white flex flex-col text-center justify-center items-center">
          <h1 className="text-3xl">Fête des vieux métiers</h1>
          <h2 className="text-2xl">-</h2>
          <h2 className="text-2xl">Baud</h2>
          <h2 className="text-2xl">15 août 2023</h2>
        </div>
        <a
          className="bg-white rounded-xl p-2 m-2 shadow-lg hover:bg-gray-200"
          href="/blog"
        >
          Voir les actualités de la fête
        </a>
      </div>

      <div className="m-7 p-12 rounded-2xl flex lg:flex-row flex-col justify-between items-center gap-10 z-1 -mt-5 bg-white shadow-lg">
        <div className="w-full flex sm:flex-row flex-col justify-evenly items-center gap-5">
          <div
            className="flex flex-col justify-center items-center"
            data-max={30}
          >
            <div className="flex flex-row justify-center items-center gap-3">
              <h2 className="font-librebaskervillebold text-5xl">30</h2>
            </div>
            <p>années d{"'"}activité</p>
          </div>
          <div
            className="flex flex-col justify-center items-center"
            data-max={10000}
          >
            <div className="flex flex-row justify-center items-center gap-3 -ml-8">
              <h2 className="font-librebaskervillebold text-5xl">+</h2>
              <h2 className="font-librebaskervillebold text-5xl">10000</h2>
            </div>
            <p>visiteurs</p>
          </div>
        </div>
        <div className="w-full flex sm:flex-row flex-col justify-evenly items-center gap-5">
          <div
            className="flex flex-col justify-center items-center"
            data-max={60}
          >
            <div className="flex flex-row justify-center items-center gap-3 -ml-8">
              <h2 className="font-librebaskervillebold text-5xl">+</h2>
              <h2 className="font-librebaskervillebold text-5xl">60</h2>
            </div>
            <p>exposants</p>
          </div>
          <div
            className="flex flex-col justify-center items-center"
            data-max={400}
          >
            <div className="flex flex-row justify-center items-center gap-3 -ml-8">
              <h2 className="font-librebaskervillebold text-5xl">+</h2>
              <h2 className="font-librebaskervillebold text-5xl">400</h2>
            </div>
            <p>bénévoles</p>
          </div>
        </div>
      </div>

      <div className="-mt-14 relative -z-10 bg-[#EAC999] py-20 px-6 flex flex-col justify-center items-center gap-2">
        <h2 className="font-librebaskervillebold underline text-xl">Tarifs</h2>
        <div className="w-full flex flex-col lg:flex-row items-center lg:justify-evenly justify-center gap-2">
          <div className="flex flex-row justify-center items-center gap-2">
            <h3 className="font-librebaskervillebold text-lg">Gratuit</h3>
            <p>pour une arrivée avant 12h</p>
          </div>
          <div className="flex flex-row justify-center items-center gap-2">
            <h3 className="font-librebaskervillebold text-lg">5€</h3>
            <p>après 13h30 (gratuit pour les -16 ans)</p>
          </div>
        </div>
      </div>

      <div className="bg-[#FFE8C6] -z-10  py-20 px-6 text-center flex flex-col justify-center items-center gap-2">
        <p>
          La fête des vieux métiers est une fête organisée dans la commune de
          Baud, dans le Morbihan, qui a lieu tous les ans le 15 août.
          <br />
          Elle a pour but de faire découvrir aux visiteurs les métiers d{"'"}
          autrefois, et de faire revivre les traditions de la région.
        </p>
      </div>

      <div className="bg-[url('/assets/img/champs.jpg')] bg-cover bg-center bg-no-repeat w-full flex justify-center items-center relative">
        <div className="w-full m-7 p-10 rounded-2xl flex flex-col justify-between items-center lg:gap-10 gap-4 z-1 -mt-5 bg-white shadow-lg">
          <h3 className="text-3xl font-librebaskervillebold">Programme</h3>
          <div className="w-full lg:flex-row flex-col flex justify-evenly lg:items-start items-center gap-5">
            <img
              className="w-[100px] lg:hidden"
              src="assets/img/separation.png"
              alt="separation"
            />
            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="key_value">
                <h2 className="text-5xl font-librebaskervillebold">10h</h2>
              </div>
              <p className="text-sm">ouverture</p>
            </div>
            <img
              className="w-[100px] lg:hidden"
              src="assets/img/separation.png"
              alt="separation"
            />
            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="key_value">
                <h2 className="text-5xl font-librebaskervillebold">12h</h2>
              </div>
              <p className="text-sm">
                ouverture des restaurants,
                <br />
                casse croute et crêperies
              </p>
            </div>
            <img
              className="w-[100px] lg:hidden"
              src="assets/img/separation.png"
              alt="separation"
            />
            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="key_value">
                <h2 className="text-5xl font-librebaskervillebold">18h30</h2>
              </div>
              <span className="text-center leading-tight">
                <p className="text-sm">CONCERT</p>
                <h3 className="text-xl font-librebaskervillebold">Gwennyn</h3>
              </span>
            </div>
            <img
              className="w-[100px] lg:hidden"
              src="assets/img/separation.png"
              alt="separation"
            />
            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="key_value">
                <h2 className="text-5xl font-librebaskervillebold">21h</h2>
              </div>
              <span className="text-center leading-tight">
                <p className="text-sm">FEST-NOZ</p>
                <h3 className="text-xl font-librebaskervillebold">
                  Sonerien Du
                </h3>
                <span>&amp; Duo Blain-Leyzour</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
