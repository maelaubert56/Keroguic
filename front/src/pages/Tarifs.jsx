const Section = ({ children, className }) => (
  <div className={`flex flex-col justify-center items-center gap-4 ${className}`}>
    {children}
  </div>
);

const Block = ({ title, children }) => (
  <div className="w-full bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-4">
    <h2 className="font-alegreyasc text-xl underline">{title}</h2>
    {children}
  </div>
);

const PriceLine = ({ label, price, accent }) => (
  <div className="flex flex-row justify-between items-center border-b last:border-b-0 py-1 text-sm w-full">
    <span className={`leading-tight ${accent ? 'font-alegreyasc' : ''}`}>{label}</span>
    <span className="font-alegreyasc">{price}</span>
  </div>
);

const GroupTitle = ({ children }) => (
  <h3 className="font-alegreyasc text-lg mt-2 mb-1">{children}</h3>
);

const Tarifs = () => {
  return (
    <main className="font-librebaskervilleregular">
      <div
        className="h-[40vh] bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center w-full"
        style={{ backgroundImage: "url('/assets/img/banner.jpg')" }}
      >
        <div className="w-[90%] max-w-xl bg-black/60 text-white flex flex-col justify-center items-center p-5 text-center">
          <h1 className="text-3xl font-alegreyasc">Tarifs 2025</h1>
          <p className="text-sm mt-2 leading-tight">Restauration, crêperies, bar et entrée de la fête.</p>
        </div>
      </div>

      <Section className="m-7 -mt-10 z-10 relative gap-8">
        <div className="grid lg:grid-cols-2 gap-8 w-full">
          <Block title="Restaurant">
            <PriceLine label="Jambon braisé + Frites + Fromage + Tarte" price="12€" />
            <PriceLine label="Cuisse de poulet + Frites + Fromage + Tarte" price="10€" />
            <PriceLine label="Chipolatas + Frites + Fromage + Tarte" price="9€" />
          </Block>

          <Block title="Casse-croûte">
            <PriceLine label="Chipo ou Paté ou Merguez" price="2,50€" />
            <PriceLine label="Barquette de frites" price="2,50€" />
          </Block>

          <Block title="Galettes & Crêpes">
            <GroupTitle>Galettes blé noir</GroupTitle>
            <PriceLine label="Beurre" price="2€" />
            <PriceLine label="Œuf" price="2,50€" />
            <PriceLine label="Fromage" price="2,50€" />
            <PriceLine label="Œuf + Fromage" price="3€" />
            <PriceLine label="Jambon" price="3€" />
            <PriceLine label="Jambon + Œuf" price="3,50€" />
            <PriceLine label="Jambon + Fromage" price="3,50€" />
            <PriceLine label="Complète (œuf + jambon + fromage)" price="4€" accent />
            <GroupTitle>Crêpes froment</GroupTitle>
            <PriceLine label="Sucre" price="2€" />
            <PriceLine label="Beurre" price="2,50€" />
            <PriceLine label="Chocolat" price="2,50€" />
            <PriceLine label="Confiture" price="2,50€" />
            <PriceLine label="Caramel" price="2,50€" />
          </Block>

          <Block title="Boissons">
            <GroupTitle>Au verre</GroupTitle>
            <PriceLine label="Bière" price="2,50€" />
            <PriceLine label="Coca" price="1,50€" />
            <PriceLine label="Orangina" price="1,50€" />
            <PriceLine label="Perrier" price="1,50€" />
            <PriceLine label="Vin rouge / rosé / blanc" price="1€" />
            <PriceLine label="Kir" price="1,50€" />
            <PriceLine label="Cidre" price="1,50€" />
            <GroupTitle>À la bouteille</GroupTitle>
            <PriceLine label="Eau" price="1,50€" />
            <PriceLine label="Cidre" price="6,50€" />
            <PriceLine label="Vin rouge / rosé / blanc" price="7€" />
          </Block>

          <Block title="Café & Far">
            <PriceLine label="Café" price="1€" />
            <PriceLine label="Part de far" price="1,50€" />
          </Block>
        </div>

        <div className="w-full bg-[#EAC999] rounded-2xl p-6 text-center shadow-lg">
          <h2 className="font-alegreyasc text-xl mb-2">Entrée de la fête</h2>
          <p className="text-lg"><span className="font-alegreyasc">5€</span> (gratuit pour les -16 ans)</p>
          <p className="text-xs mt-2 opacity-70">Entrée gratuite pour tous avant 13h30.</p>
        </div>
      </Section>
    </main>
  );
};

export default Tarifs;
