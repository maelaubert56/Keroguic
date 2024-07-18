import { useEffect, useState } from "react";
import MeComponent from "./MeComponent";
import UsersComponent from "./UsersComponent";
import ArticleComponent from "./ArticleComponent";
import GalleryComponent from "./GalleryComponent";

const Admin = () => {
  const [me, setMe] = useState();
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    fetch(`${import.meta.env.VITE_API_URL}/users/all`, {
      method: "GET",
      headers: { Authorization: localStorage.getItem("token") },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error("Unauthorized");
        }
      })
      .then((data) => setUsers(data))
      .catch((err) => console.log(err));
  };

  const onLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          window.location.reload();
        }
      });
  };

  //get me
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
        method: "GET",
        headers: { Authorization: token },
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            localStorage.removeItem("token");
            throw new Error("Unauthorized");
          }
        })
        .then((data) => setMe(data))
        .catch((err) => console.log(err));
    }
  }, []);

  // get all users
  useEffect(() => {
    if (me?.privilege === "admin" || me?.privilege === "owner") {
      fetchUsers();
    }
  }, [me]);

  return (
    <div className={`flex flex-col justify-center items-center gap-5 p-5 `}>
      {me ? (
        <>
          {/* user profile */}
          <MeComponent me={me} />

          {/* users */}
          <UsersComponent me={me} users={users} />

          {/* articles */}
          <ArticleComponent me={me} />

          {/* gallery */}
          <GalleryComponent me={me} />
        </>
      ) : (
        <div className="flex flex-col justify-center items-center p-5 bg-gray-200 rounded-lg my-20">
          <h2 className="text-2xl font-librebaskervillebold">Connexion</h2>
          <form
            className="flex flex-col justify-center items-center gap-5 p-5 bg-gray-200 rounded-lg"
            onSubmit={onLogin}
          >
            <label htmlFor="username">Nom d{"'"}utilisateur</label>
            <input
              type="userame"
              id="username"
              name="username"
              placeholder="Nom d'utilisateur"
              className="p-2"
            />
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Mot de passe"
              className="p-2"
            />
            <button className="bg-blue-500 text-white p-2 rounded-lg">
              Connexion
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Admin;
