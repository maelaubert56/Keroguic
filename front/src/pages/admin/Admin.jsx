import { useEffect, useState } from "react";

const Admin = () => {
  const [openDeleteArticle, setOpenDeleteArticle] = useState(null);
  const [openDeleteImage, setOpenDeleteImage] = useState(null);
  const [openPreviewImage, setOpenPreviewImage] = useState(null);

  const [me, setMe] = useState();
  const [articles, setArticles] = useState([]);
  const [onlyMyPosts, setOnlyMyPosts] = useState(false);
  const [galerie, setGalerie] = useState([]);
  const [onlyMyImages, setOnlyMyImages] = useState(false);
  const [users, setUsers] = useState([]);

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

  const onDeleteArticle = (id) => {
    fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: localStorage.getItem("token") },
    })
      .then((res) => {
        if (res.status === 200) {
          window.location.reload();
        } else {
          alert("Une erreur est survenue lors de la suppression de l'article");
        }
      })
      .catch((error) => {
        alert(
          "Une erreur est survenue lors de la suppression de l'article: " +
            error.message
        );
      });
  };

  const onDeleteImage = (id) => {
    fetch(`${import.meta.env.VITE_API_URL}/gallery/${id}`, {
      method: "DELETE",
      headers: { Authorization: localStorage.getItem("token") },
    })
      .then((res) => {
        if (res.status === 200) {
          window.location.reload();
        } else {
          alert("Une erreur est survenue lors de la suppression de l'image");
        }
      })
      .catch((error) => {
        alert(
          "Une erreur est survenue lors de la suppression de l'image: " +
            error.message
        );
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

  // get articles
  useEffect(() => {
    if (me) {
      fetch(`${import.meta.env.VITE_API_URL}/posts`, {
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
        .then((data) => setArticles(data))
        .catch((err) => console.log(err));
    }
  }, [me]);

  // get images
  useEffect(() => {
    if (me) {
      fetch(`${import.meta.env.VITE_API_URL}/gallery`, {
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
        .then((data) => setGalerie(data))
        .catch((err) => console.log(err));
    }
  }, [me]);

  // get all users
  useEffect(() => {
    if (me?.privilege === "admin" || me?.privilege === "owner") {
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
    }
  }, [me]);

  return (
    <div className={`flex flex-col justify-center items-center gap-5 p-5 `}>
      {me ? (
        <>
          {/* user profile */}
          <div className="flex w-full flex-col justify-center items-center gap-1 p-5 relative bg-gray-200 rounded-lg">
            <h2 className="text-2xl font-librebaskervillebold">{me?.name}</h2>
            <span className="flex flex-row justify-center items-baseline gap-2 text-sm">
              <p>
                {me?.privilege === "admin"
                  ? "Administrateur"
                  : me?.privilege === "editor"
                  ? "Éditeur"
                  : me?.privilege === "author" && "Auteur"}
              </p>
            </span>
            <img
              className="w-16 rounded-full"
              src={`${import.meta.env.VITE_API_URL}/uploads/pp/${me?.picture}`}
              alt={me?.name}
            />
            <div className="absolute top-5 right-5 text-xs flex flex-col gap-2">
              <button
                className="bg-red-500
             text-white p-2 rounded-lg hover:bg-red-700
            "
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.reload();
                }}
              >
                Se déconnecter
              </button>
              <button
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700"
                onClick={() =>
                  (window.location.href = `/admin/user/edit/${me.id}`)
                }
              >
                Modifier mon profil
              </button>
            </div>
          </div>

          {/* users */}
          {(me?.privilege === "admin" || me?.privilege === "owner") && (
            <div
              className={`flex w-full flex-col justify-center items-center gap-5 p-5 `}
            >
              <h2 className="text-2xl font-librebaskervillebold">
                Utilisateurs
              </h2>
              <button
                className="bg-blue-500 text-white text-sm p-2 rounded-lg hover:bg-blue-700"
                onClick={() => (window.location.href = "/admin/user/add")}
              >
                Ajouter un utilisateur
              </button>
              <table className="w-full">
                <thead className="bg-gray-300">
                  <tr className="text-left">
                    <th className="p-2">Image</th>
                    <th className="p-2">Nom d{"'"}utilisateur</th>
                    <th className="p-2">Nom</th>
                    <th className="p-2">Privilège</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-100">
                  {users?.map((user) => (
                    <tr key={user.id} className="text-left">
                      <td className="p-2">
                        <img
                          className="w-10 rounded-md"
                          src={`${import.meta.env.VITE_API_URL}/uploads/pp/${
                            user.picture
                          }`}
                          alt={user.name}
                        />
                      </td>

                      <td className="p-2">
                        {user.username}
                        {user.id === me.id && (
                          <span
                            className="text-xs text-gray-500
                          "
                          >
                            {" "}
                            (moi)
                          </span>
                        )}
                      </td>

                      <td className="p-2">{user.name}</td>
                      <td className="p-2">
                        {user.privilege === "owner"
                          ? "Propriétaire"
                          : user.privilege === "admin"
                          ? "Administrateur"
                          : user.privilege === "editor"
                          ? "Éditeur"
                          : user.privilege === "author" && "Auteur"}
                      </td>
                      <td className="p-2 flex flex-row gap-2">
                        <button
                          className={`bg-blue-500 text-white p-2 text-xs rounded-lg hover:bg-blue-700 ${
                            (user.privilege === "admin" ||
                              user.privilege === "owner") &&
                            me.privilege !== "owner" &&
                            me.id !== user.id &&
                            "hidden"
                          }`}
                          onClick={() =>
                            (window.location.href = `/admin/user/edit/${user.id}`)
                          }
                        >
                          Modifier
                        </button>
                        <button
                          className={`bg-red-500 text-white p-2 text-xs rounded-lg hover:bg-red-700 ${
                            (((user.privilege === "admin" ||
                              user.privilege === "owner") &&
                              me.privilege !== "owner") ||
                              me.id === user.id) &&
                            "hidden"
                          }`}
                          onClick={() => {
                            fetch(
                              `${import.meta.env.VITE_API_URL}/users/delete/${
                                user.id
                              }`,
                              {
                                method: "DELETE",
                                headers: {
                                  Authorization: localStorage.getItem("token"),
                                },
                              }
                            )
                              .then((res) => {
                                if (res.status === 200) {
                                  window.location.reload();
                                } else {
                                  alert(
                                    "Une erreur est survenue lors de la suppression de l'utilisateur"
                                  );
                                }
                              })
                              .catch((error) => {
                                alert(
                                  "Une erreur est survenue lors de la suppression de l'utilisateur: " +
                                    error.message
                                );
                              });
                          }}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* articles */}
          <div className="flex w-full flex-col justify-center items-center gap-5 p-5">
            <h2 className="text-2xl font-librebaskervillebold">Articles</h2>
            <button
              className="bg-blue-500 text-white p-2 text-sm rounded-lg hover:bg-blue-700"
              onClick={() => (window.location.href = "/admin/article/add")}
            >
              Ajouter un article
            </button>

            <div className="flex flex-row gap-2">
              <input
                id="onlyMyPosts"
                type="checkbox"
                onClick={() => {
                  setOnlyMyPosts(!onlyMyPosts);
                }}
              />
              <label htmlFor="onlyMyPosts">
                Afficher uniquement mes articles
              </label>
            </div>

            {articles?.length === 0 ? (
              <p>Aucun article disponible</p>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-300">
                  <tr className="text-left">
                    <th className="p-2">Titre</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Auteur</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>

                <tbody className="bg-gray-100">
                  {articles?.map(
                    (article) =>
                      (!onlyMyPosts || article.author.id === me.id) && (
                        <tr key={article.id} className="text-left">
                          <td className="p-2">{article.title}</td>
                          <td className="p-2">
                            {new Date(article.date).toLocaleDateString()}
                          </td>
                          <td className="p-2">{article.author.name}</td>
                          <td className="p-2 flex flex-row gap-2">
                            <button
                              className={`bg-blue-500 text-white p-2 text-xs rounded-lg hover:bg-blue-700 ${
                                article.author.id !== me.id &&
                                me.privilege !== "owner" &&
                                me.privilege !== "admin" &&
                                me.privilege !== "editor" &&
                                "hidden"
                              }`}
                              onClick={() =>
                                (window.location.href = `/admin/article/edit/${article.id}`)
                              }
                            >
                              Modifier
                            </button>

                            <button
                              className={`bg-red-500 text-white p-2 text-xs rounded-lg hover:bg-red-700 ${
                                article.author.id !== me.id &&
                                me.privilege !== "owner" &&
                                me.privilege !== "admin" &&
                                me.privilege !== "editor" &&
                                "hidden"
                              }`}
                              onClick={() => setOpenDeleteArticle(article.id)}
                            >
                              Supprimer
                            </button>
                          </td>
                          {openDeleteArticle && (
                            <div
                              className="absolute top-0 left-0 w-screen h-screen flex flex-col justify-center items-center backdrop-filter backdrop-blur-sm"
                              onClick={() => setOpenDeleteArticle(null)}
                            >
                              <div
                                className="bg-white p-5 rounded-lg flex flex-col justify-center items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <h2 className="mb-2">
                                  Confirmer la suppression
                                </h2>
                                <span className="text-sm font-semibold text-center gap-2 border p-2 rounded-md">
                                  <p>{article.title}</p>
                                  <p>{article.date}</p>
                                  <p>{article.author.name}</p>
                                </span>
                                <div className="flex flex-row gap-5 w-full justify-center items-center mt-5">
                                  <button
                                    className="bg-red-500 text-white p-2 text-xs rounded-lg w-1/3 hover:bg-red-700"
                                    onClick={() => onDeleteArticle(article.id)}
                                  >
                                    Oui
                                  </button>
                                  <button
                                    className="bg-blue-500 text-white p-2 text-xs rounded-lg w-1/3 hover:bg-blue-700"
                                    onClick={() => setOpenDeleteArticle(null)}
                                  >
                                    Non
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* images */}
          <div className="flex w-full flex-col justify-center items-center gap-5 p-5 ">
            <h2 className="text-2xl font-librebaskervillebold">Galerie</h2>
            <button
              className="bg-blue-500 text-white p-2 text-sm rounded-lg hover:bg-blue-700"
              onClick={() => (window.location.href = "/admin/gallery/add")}
            >
              Ajouter une image
            </button>

            <div className="flex flex-row gap-2">
              <input
                id="onlyMyImages"
                type="checkbox"
                onClick={() => {
                  setOnlyMyImages(!onlyMyImages);
                }}
              />
              <label htmlFor="onlyMyImages">
                Afficher uniquement mes images
              </label>
            </div>
            {galerie?.length === 0 ? (
              <p>Aucune image disponible</p>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-300">
                  <tr className="text-left">
                    <th className="p-2">Image</th>
                    <th className="p-2">Titre</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Auteur</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-100">
                  {galerie?.map(
                    (image) =>
                      (!onlyMyImages || image.author.id === me.id) && (
                        <tr key={image.id} className="text-left">
                          <td
                            className="p-2"
                            onClick={() => setOpenPreviewImage(image.id)}
                          >
                            <img
                              className="w-10 rounded-md"
                              src={`${
                                import.meta.env.VITE_API_URL
                              }/uploads/gallery/${image.image}`}
                              alt={image.title}
                            />
                          </td>
                          <td className="p-2">{image.title}</td>
                          <td className="p-2">
                            {new Date(image.date).toLocaleDateString()}
                          </td>
                          <td className="p-2">{image.author.name}</td>
                          <td className="p-2 flex flex-row gap-2">
                            <button
                              className={`bg-blue-500 text-white p-2 text-xs rounded-lg hover:bg-blue-700 ${
                                image.author.id !== me.id &&
                                me.privilege !== "owner" &&
                                me.privilege !== "admin" &&
                                me.privilege !== "editor" &&
                                "hidden"
                              }`}
                              onClick={() =>
                                (window.location.href = `/admin/gallery/edit/${image.id}`)
                              }
                            >
                              Modifier
                            </button>

                            <button
                              className={`bg-red-500 text-white p-2 text-xs rounded-lg hover:bg-red-700 ${
                                image.author.id !== me.id &&
                                me.privilege !== "owner" &&
                                me.privilege !== "admin" &&
                                me.privilege !== "editor" &&
                                "hidden"
                              }`}
                              onClick={() => setOpenDeleteImage(image.id)}
                            >
                              Supprimer
                            </button>
                          </td>
                          {openPreviewImage === image.id && (
                            <div
                              className="absolute top-0 left-0 w-screen h-screen flex flex-col justify-center items-center backdrop-filter backdrop-blur-sm"
                              onClick={() => setOpenPreviewImage(null)}
                            >
                              <div
                                className="bg-white p-5 rounded-lg flex flex-col justify-center items-center gap-5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <h2>{image.title}</h2>
                                <img
                                  className="w-64 rounded-md"
                                  src={`${
                                    import.meta.env.VITE_API_URL
                                  }/uploads/gallery/${image.image}`}
                                  alt={image.title}
                                />
                              </div>
                            </div>
                          )}
                          {openDeleteImage === image.id && (
                            <div
                              className="absolute top-0 left-0 w-screen h-screen flex flex-col justify-center items-center backdrop-filter backdrop-blur-sm"
                              onClick={() => setOpenDeleteImage(null)}
                            >
                              <div
                                className="bg-white p-5 rounded-lg flex flex-col justify-center items-center gap-3"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <h2 className="mb-2">
                                  Confirmer la suppression
                                </h2>
                                <p
                                  className="text-sm font-semibold
                            "
                                >
                                  {image.title}
                                </p>
                                <img
                                  className="w-64 rounded-md"
                                  src={`${
                                    import.meta.env.VITE_API_URL
                                  }/uploads/gallery/${image.image}`}
                                  alt={image.title}
                                />
                                <p className="text-sm font-semibold">
                                  {image.date}
                                </p>
                                <p className="text-sm font-semibold">
                                  {image.author.name}
                                </p>
                                <div className="flex flex-row gap-5 w-full justify-center items-center">
                                  <button
                                    className="bg-red-500 text-white p-2 text-xs rounded-lg w-1/3 hover:bg-red-700"
                                    onClick={() => onDeleteImage(image.id)}
                                  >
                                    Oui
                                  </button>
                                  <button
                                    className="bg-blue-500 text-white p-2 text-xs rounded-lg w-1/3 hover:bg-blue-700"
                                    onClick={() => setOpenDeleteImage(null)}
                                  >
                                    Non
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            )}
          </div>
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
