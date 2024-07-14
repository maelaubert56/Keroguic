import { useState, useEffect, useRef } from "react";

const Add = () => {
  const [me, setMe] = useState(null);
  const form = useRef(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        window.location.href = "/admin";
      })
      .then((data) => setMe(data))
      .catch((err) => console.log(err));
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    // check if all the fields are filled
    if (
      form.current[0].value === "" ||
      form.current[1].value === "" ||
      form.current[2].value === "" ||
      form.current[3].value === "" ||
      form.current[4].value === ""
    ) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    // get the form data
    const data = new FormData(form.current);
    console.log(data.get("name"));
    // send a POST request to the server
    fetch(`${import.meta.env.VITE_API_URL}/users/add`, {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
      body: data,
    })
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          window.location.href = "/admin/";
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 gap-8 py-16">
      <h1 className="text-2xl font-librebaskervillebold">
        Ajouter un utilisateur
      </h1>
      <div className="md:w-1/2 w-full flex flex-col gap-1 px-10">
        <form ref={form} onSubmit={handleAdd}>
          <label className="text-sm">Nom d{"'"}utilisateur</label>
          <input
            name="username"
            className="border-2 border-gray-300 w-full pl-2 h-10"
            type="text"
            placeholder="Nom d'utilisateur"
          />
          <label className="text-sm">Nom</label>
          <input
            name="name"
            className="border-2 border-gray-300 w-full pl-2 h-10"
            type="text"
            placeholder="Nom"
          />
          <label className="text-sm">Mot de passe</label>
          <input
            name="password"
            className="border-2 border-gray-300 w-full pl-2 h-10"
            type="password"
            placeholder="Mot de passe"
          />
          <label className="text-sm">Privilège</label>
          <select
            className="border-2 border-gray-300 w-full pl-2 h-10"
            name="privilege"
          >
            <option value="" disabled>
              {" "}
              Choisir un privilège{" "}
            </option>
            {me?.privilege === "owner" && (
              <option value="admin">Administrateur</option>
            )}
            <option value="editor">Editeur</option>
            <option value="author">Auteur</option>
          </select>
          <label className="text-sm">Image</label>
          <input
            name="picture"
            className="border-2 border-gray-300 w-full pl-2 py-1 text-sm"
            type="file"
            accept="image/*"
          />
          <button className="bg-blue-500 text-white p-2 rounded-md min-w-60 hover:bg-blue-700">
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;
