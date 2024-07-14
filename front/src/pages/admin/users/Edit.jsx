import { useState, useEffect, useRef } from "react";

const Add = () => {
  const [me, setMe] = useState(null);
  const form = useRef(null);
  const [oldUser, setOldUser] = useState(null);

  const handleEditUser = (e) => {
    e.preventDefault();
    // Check if all the fields are filled
    if (form.current[1].value === "" || form.current[3].value === "") {
      alert("Veuillez remplir tous les champs");
      return;
    }

    // Get the form data
    const data = new FormData(form.current);
    console.log("Form data:", {
      name: data.get("name"),
      password: data.get("password"),
      privilege: data.get("privilege"),
    });

    // Send a POST request to the server
    fetch(`${import.meta.env.VITE_API_URL}/users/edit/${oldUser.id}`, {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
      body: data,
    })
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          window.location.href = "/admin/";
        } else {
          return res.json().then((data) => {
            console.error("Error response:", data);
            alert(data.message);
          });
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        alert("An error occurred while updating the user.");
      });
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => setMe(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (me !== null) {
      // Get the user ID from the URL
      const id = window.location.pathname.split("/").pop();
      // Get the user information from the database
      fetch(`${import.meta.env.VITE_API_URL}/users/single/${id}`, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
        .then((res) => {
          if (res.status !== 200) {
            window.location.href = "/admin";
          }
          return res.json();
        })
        .then((data) => {
          setOldUser(data);
          // Fill the form with the user information
          form.current[0].value = data.username;
          form.current[1].value = data.name;
          form.current[3].value = data.privilege;
        })
        .catch((err) => console.log(err));
    }
  }, [me]);

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 gap-8 py-16">
      <h1 className="text-2xl font-librebaskervillebold">
        Modifier un utilisateur
      </h1>
      {me === null && <p>Chargement...</p>}
      {me !== null && oldUser?.id === "" && <p>Utilisateur introuvable</p>}
      {me !== null && oldUser?.id !== "" && (
        <>
          <div className="md:w-1/2 w-full flex flex-col gap-1 px-10">
            <form ref={form} onSubmit={handleEditUser}>
              <label className="text-sm">
                Nom d{"'"}utilisateur (non modifiable)
              </label>
              <input
                name="username"
                disabled
                className="border-2 border-gray-300 w-full pl-2 h-10"
                type="text"
                placeholder="Nom d'utilisateur"
              />
              <label className="text-sm">Nom</label>
              <input
                name="name"
                className="border-2 border-gray-500 w-full pl-2 h-10"
                type="text"
                placeholder="Nom"
              />
              <label className="text-sm">
                Mot de passe (laisser vide pour ne pas changer)
              </label>
              <input
                name="password"
                className="border-2 border-gray-500 w-full pl-2 h-10"
                type="password"
                placeholder="Mot de passe"
              />
              <label className="text-sm">
                Privilège{" "}
                {me?.id ===
                  "(vous ne pouvez pas modifier votre propre privilège)"}
              </label>
              <select
                name="privilege"
                disabled={me?.id === oldUser?.id}
                defaultValue={oldUser?.privilege}
                className={`border-2 border-gray-${
                  me?.id === oldUser?.id ? "300" : "500"
                } w-full pl-2 h-10`}
              >
                <option value="" disabled>
                  Choisir un privilège
                </option>
                {me?.privilege === "owner" && me?.id === oldUser?.id && (
                  <option value="owner">Propriétaire</option>
                )}
                {((me?.privilege === "admin" && me?.id === oldUser?.id) ||
                  me?.privilege === "owner") && (
                  <option value="admin">Admin</option>
                )}
                <option value="editor">Editeur</option>
                <option value="author">Auteur</option>
              </select>

              <label className="text-sm">Image</label>
              <input
                name="picture"
                className="border-2 border-gray-500 w-full pl-2 py-1 text-sm"
                type="file"
                accept="image/*"
              />
              <div className="flex flex-col gap-1 items-center border-2 border-gray-500 p-2">
                <img
                  className="w-1/2"
                  src={`${import.meta.env.VITE_API_URL}/uploads/pp/${
                    oldUser?.picture
                  }`}
                  alt={oldUser?.name}
                />
              </div>
              <button className="bg-blue-500 text-white p-2 rounded-md min-w-60 hover:bg-blue-700">
                Modifier
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Add;
