/* eslint-disable react/prop-types */

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Users, Store, HeartHandshake } from "lucide-react";

const Section = ({ children, className }) => (
  <div
    className={`flex flex-col justify-center items-center gap-2 ${className}`}
  >
    {children}
  </div>
);

const StatsCard = ({ value, label, additional, icon: Icon }) => (
  <div
    className="flex flex-col justify-center items-center gap-2 w-full min-h-[168px] sm:min-h-[200px] p-4 rounded-xl bg-[#FFE8C6]/40 border border-[#EAC999]"
    data-max={additional}
  >
    <Icon className="text-[#A8462E]" size={28} />
    <div className="flex flex-row justify-center items-baseline gap-1">
      {additional && (
        <h2 className="font-librebaskervillebold text-2xl sm:text-4xl">+</h2>
      )}
      <h2 className="font-librebaskervillebold text-3xl sm:text-5xl">
        {value}
      </h2>
    </div>
    <p className="text-sm sm:text-base text-center leading-tight">{label}</p>
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
      "Découvrez la fête des vieux métiers à Baud : programme, menu, galerie des éditions précédentes et actualités.";
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
        <div className="w-[90%] p-5 m-4 rounded-2xl bg-[#1B2A3C]/70 backdrop-blur-sm text-white flex flex-col text-center justify-center items-center shadow-lg">
          <img
            className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px] object-cover"
            src="/assets/img/logo.png"
            alt="Logo de la fête des vieux métiers"
          />
          <h2 className="text-2xl font-alegreyasc">Keroguic en Baud</h2>
          <h2 className="text-2xl font-alegreyasc">15 août 2026</h2>
        </div>
        <Link
          className="bg-white rounded-xl p-2 m-2 shadow-lg hover:bg-[#FFE8C6] transition-colors"
          to="/blog"
        >
          Voir les actualités de la fête
        </Link>
      </div>

      <Section className="m-7 p-8 sm:p-12 rounded-2xl justify-between items-center gap-12 z-1 -mt-5 bg-white shadow-lg">
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatsCard value="33" label="années d'activité" icon={CalendarDays} />
          <StatsCard value="10000" label="visiteurs" additional icon={Users} />
          <StatsCard value="60" label="exposants" additional icon={Store} />
          <StatsCard
            value="400"
            label="bénévoles"
            additional
            icon={HeartHandshake}
          />
        </div>
      </Section>

      <Section className="-mt-14 relative -z-10 bg-[#EAC999] py-16 sm:py-24 px-6 gap-6">
        <h2 className="font-alegreyasc underline text-2xl">Tarifs</h2>
        <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-8">
          <div className="flex flex-col items-center text-center gap-1 bg-white/50 rounded-xl px-6 py-4">
            <h3 className="font-alegreyasc text-2xl">Gratuit</h3>
            <p>pour une arrivée avant 13h30</p>
          </div>
          <div className="flex flex-col items-center text-center gap-1 bg-white/50 rounded-xl px-6 py-4">
            <h3 className="font-alegreyasc text-2xl">6€</h3>
            <p>après 13h30 (gratuit pour les -16 ans)</p>
          </div>
        </div>
      </Section>

      <Section className="bg-[#FFE8C6] -z-10 py-16 sm:py-24 px-6 text-center">
        <p>
          La fête des vieux métiers est une fête organisée dans la commune de
          Baud, dans le Morbihan, qui a lieu tous les ans le 15 août.
          <br />
          Elle a pour but de faire découvrir aux visiteurs les métiers d{"'"}
          autrefois, et de faire revivre les traditions de la région.
        </p>
      </Section>

      <div className="bg-[url('/assets/img/champs.jpg')] bg-cover bg-center bg-no-repeat w-full flex justify-center items-center relative">
        <div className="w-full m-7 p-8 sm:p-12 rounded-2xl flex flex-col justify-between items-center lg:gap-10 gap-6 z-1 -mt-5 bg-white shadow-lg">
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
            <TimeEvent time={"16h"}>
              <span className="text-center leading-tight">
                <p className="text-sm">PRESTATION DU</p>
                <h3 className="text-xl font-alegreyasc">
                  Bagad de Lann Bihoué
                </h3>
              </span>
            </TimeEvent>
            <img
              className="w-[100px] lg:hidden lazy"
              data-src="assets/img/separation.png"
              alt="Séparateur décoratif"
            />
            <TimeEvent time={"18h"}>
              <span className="text-center leading-tight">
                <p className="text-sm">CONCERT</p>
                <h3 className="text-xl font-alegreyasc">Mask Ha Gazh</h3>
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
                  Sonerien Du & Ampouailh
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
