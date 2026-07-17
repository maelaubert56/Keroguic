const Section = ({ children, className }) => (
  <div
    className={`flex flex-col justify-center items-center gap-4 ${className}`}
  >
    {children}
  </div>
);

const Block = ({ title, children }) => (
  <div className="w-full bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-4">
    <h2 className="font-alegreyasc text-xl underline">{title}</h2>
    {children}
  </div>
);

const MenuItem = ({ label, accent }) => (
  <div className="flex flex-row justify-between items-center border-b last:border-b-0 py-1 text-sm w-full">
    <span className={`leading-tight ${accent ? "font-alegreyasc" : ""}`}>
      {label}
    </span>
  </div>
);

const GroupTitle = ({ children }) => (
  <h3 className="font-alegreyasc text-lg mt-2 mb-1">{children}</h3>
);

const Menu = () => {
  return (
    <main className="font-librebaskervilleregular">
      <div
        className="h-[40vh] bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center w-full"
        style={{ backgroundImage: "url('/assets/img/banner.jpg')" }}
      >
        <div className="w-[90%] max-w-xl bg-black/60 text-white flex flex-col justify-center items-center p-5 text-center">
          <h1 className="text-3xl font-alegreyasc">Au Menu</h1>
          <p className="text-sm mt-2 leading-tight">
            Restauration et crêperies sur place.
          </p>
        </div>
      </div>

      <Section className="m-7 -mt-10 z-10 relative gap-8">
        <div className="grid lg:grid-cols-2 gap-8 w-full">
          <Block title="Restaurant">
            <MenuItem label="Jambon braisé + Frites + Fromage + Tarte" />
            <MenuItem label="Cuisse de poulet + Frites + Fromage + Tarte" />
            <MenuItem label="Chipolatas + Frites + Fromage + Tarte" />
          </Block>

          <Block title="Casse-croûte">
            <MenuItem label="Chipo ou Paté ou Merguez" />
            <MenuItem label="Barquette de frites" />
          </Block>

          <Block title="Galettes & Crêpes">
            <GroupTitle>Galettes blé noir</GroupTitle>
            <MenuItem label="Beurre" />
            <MenuItem label="Œuf" />
            <MenuItem label="Fromage" />
            <MenuItem label="Œuf + Fromage" />
            <MenuItem label="Jambon" />
            <MenuItem label="Jambon + Œuf" />
            <MenuItem label="Jambon + Fromage" />
            <MenuItem label="Complète (œuf + jambon + fromage)" accent />
            <GroupTitle>Crêpes froment</GroupTitle>
            <MenuItem label="Sucre" />
            <MenuItem label="Beurre" />
            <MenuItem label="Chocolat" />
            <MenuItem label="Confiture" />
            <MenuItem label="Caramel" />
          </Block>

          <Block title="Café & Far">
            <MenuItem label="Café" />
            <MenuItem label="Part de far" />
          </Block>
        </div>
      </Section>
    </main>
  );
};

export default Menu;
