/* eslint-disable react/prop-types */

import { useEffect } from "react";
import { Link } from "react-router-dom";

const Section = ({ children, className }) => (
  <div
    className={`flex flex-col justify-center items-center gap-2 ${className}`}
  >
    {children}
  </div>
);

const StatsCard = ({ value, label, additional }) => (
  <div
    className="flex flex-col justify-center items-center"
    data-max={additional}
  >
    <div
      className={`flex flex-row justify-center items-center gap-3 ${
        additional ? "-ml-7" : ""
      }`}
    >
      {additional && <h2 className="font-librebaskervillebold text-5xl">+</h2>}
      <h2 className="font-librebaskervillebold text-5xl">{value}</h2>
    </div>
    <p>{label}</p>
  </div>
);

const TimeEvent = ({ time, children }) => (
  <div className="flex flex-col gap-2 justify-center items-center">
    <div className="key_value">
      <h2 className="text-5xl font-librebaskervillebold">{time}</h2>
    </div>
    <span>{children}</span>
  </div>
);

const Home = () => {
  useEffect(() => {
    const images = document.querySelectorAll("img.lazy");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => observer.observe(img));

    return () => {
      images.forEach((img) => observer.unobserve(img));
    };
  }, []);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Fête des vieux métiers – 15 août Kéroguic en Baud";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content =
      "Découvrez la fête des vieux métiers à Baud : programme, tarifs, galerie des éditions précédentes et actualités.";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <main className="font-librebaskervilleregular">
      <div
        className="h-[40vh] bg-cover bg-center bg-no-repeat flex flex-col justify-start items-center"
        style={{ backgroundImage: "url('/assets/img/banner.jpg')" }}
      >
        <div className="w-[90%] p-5 m-4 bg-black/60 text-white flex flex-col text-center justify-center items-center">
          <img
            className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px] object-cover"
            src="/assets/img/logo.png"
            alt="Logo de la fête des vieux métiers"
          />
          <h2 className="text-2xl font-alegreyasc">Keroguic en Baud</h2>
          <h2 className="text-2xl font-alegreyasc">15 août 2025</h2>
        </div>
        <Link
          className="bg-white rounded-xl p-2 m-2 shadow-lg hover:bg-gray-200"
          to="/blog"
        >
          Voir les actualités de la fête
        </Link>
      </div>

      <Section className="m-7 p-12 rounded-2xl lg:flex-row flex-col justify-between items-center gap-12 z-1 -mt-5 bg-white shadow-lg">
        <div className="w-full flex sm:flex-row flex-col justify-evenly items-center gap-5">
          <StatsCard value="32" label="années d'activité" />
          <StatsCard value="10000" label="visiteurs" additional />
        </div>
        <div className="w-full flex sm:flex-row flex-col justify-evenly items-center gap-5">
          <StatsCard value="60" label="exposants" additional />
          <StatsCard value="400" label="bénévoles" additional />
        </div>
      </Section>

      <Section className="-mt-14 relative -z-10 bg-[#EAC999] py-20 px-6">
        <h2 className="font-alegreyasc underline text-xl">Tarifs</h2>
        <div className="w-full flex flex-col lg:flex-row items-center lg:justify-evenly justify-center gap-2">
          <div className="flex flex-row justify-center items-center gap-2">
            <h3 className="font-alegreyasc text-lg">Gratuit</h3>
            <p>pour une arrivée avant 13h30</p>
          </div>
          <div className="flex flex-row justify-center items-center gap-2">
            <h3 className="font-alegreyasc text-lg">5€</h3>
            <p>après 13h30 (gratuit pour les -16 ans)</p>
          </div>
        </div>
      </Section>

      <Section className="bg-[#FFE8C6] -z-10 py-20 px-6 text-center">
        <p>
          La fête des vieux métiers est une fête organisée dans la commune de
          Baud, dans le Morbihan, qui a lieu tous les ans le 15 août.
          <br />
          Elle a pour but de faire découvrir aux visiteurs les métiers d{"'"}
          autrefois, et de faire revivre les traditions de la région.
        </p>
      </Section>

      <div className="bg-[url('/assets/img/champs.jpg')] bg-cover bg-center bg-no-repeat w-full flex justify-center items-center relative">
        <div className="w-full m-7 p-10 rounded-2xl flex flex-col justify-between items-center lg:gap-10 gap-4 z-1 -mt-5 bg-white shadow-lg">
          <h3 className="text-3xl font-alegreyasc">Programme</h3>
          <div className="w-full lg:flex-row flex-col flex justify-evenly lg:items-start items-center gap-5">
            <TimeEvent time={"10h"}>
              <p className="text-sm">ouverture</p>
            </TimeEvent>
            <img
              className="w-[100px] lg:hidden lazy"
              data-src="assets/img/separation.png"
              alt="Séparateur décoratif"
            />
            <TimeEvent time={"12h"}>
              <p className="text-sm">
                ouverture des restaurants,
                <br />
                casse croute et crêperies
              </p>
            </TimeEvent>
            <img
              className="w-[100px] lg:hidden lazy"
              data-src="assets/img/separation.png"
              alt="Séparateur décoratif"
            />
            <TimeEvent time={"18h30"}>
              <span className="text-center leading-tight">
                <p className="text-sm">CONCERT</p>
                <h3 className="text-xl font-alegreyasc">Madelyn-Ann</h3>
              </span>
            </TimeEvent>

            <img
              className="w-[100px] lg:hidden lazy"
              data-src="assets/img/separation.png"
              alt="Séparateur décoratif"
            />
            <TimeEvent time={"21h"}>
              <span className="text-center leading-tight">
                <p className="text-sm">FEST-NOZ</p>
                <h3 className="text-xl font-alegreyasc">
                  Sonerien Du & Martin Hamon Quintet
                </h3>
              </span>
            </TimeEvent>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
