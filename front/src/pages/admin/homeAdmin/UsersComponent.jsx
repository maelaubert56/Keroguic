/* eslint-disable react/prop-types */

const UsersComponent = ({ me, users }) => {
  return (
    (me?.privilege === "admin" || me?.privilege === "owner") && (
      <div
        className={`flex w-full flex-col justify-center items-center gap-5 p-5 `}
      >
        <h2 className="text-2xl font-librebaskervillebold">Utilisateurs</h2>
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
    )
  );
};

export default UsersComponent;
