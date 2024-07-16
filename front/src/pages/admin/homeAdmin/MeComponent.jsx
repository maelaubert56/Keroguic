/* eslint-disable react/prop-types */

const MeComponent = ({ me }) => {
  return (
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
      <div className="absolute top-5 right-5 text-xs flex flex-col gap-2 w-56">
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
          onClick={() => (window.location.href = `/admin/user/edit/${me.id}`)}
        >
          Modifier mon profil
        </button>
        {me?.privilege === "owner" && (
          <div className="flex flex-row gap-1 w-full justify-between items-center">
            <button
              className="bg-blue-500 text-white p-2 rounded-lg w-1/2 hover:bg-blue-700"
              onClick={() =>
                fetch(`${import.meta.env.VITE_API_URL}/data/save`, {
                  method: "GET",
                  headers: {
                    Authorization: localStorage.getItem("token"),
                  },
                }).then((res) => {
                  if (res.status === 200) {
                    res.blob().then((blob) => {
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download =
                        "data" +
                        new Date().toISOString().split("T")[0] +
                        ".zip";
                      a.click();
                    });
                  } else {
                    alert(
                      "Une erreur est survenue lors de la sauvegarde des données"
                    );
                  }
                })
              }
            >
              Sauvegarder
            </button>
            <label
              htmlFor="restore"
              className="bg-blue-500 w-1/2 text-white p-2 rounded-lg hover:bg-blue-700 text-center cursor-pointer"
            >
              <input
                type="file"
                id="restore"
                name="restore"
                accept=".zip"
                onChange={(e) => {
                  const formData = new FormData();
                  formData.append("zip", e.target.files[0]);
                  fetch(`${import.meta.env.VITE_API_URL}/data/restore`, {
                    method: "POST",
                    headers: {
                      Authorization: localStorage.getItem("token"),
                    },
                    body: formData,
                  })
                    .then((res) => {
                      if (res.status === 200) {
                        window.location.reload();
                      } else {
                        window.location.reload();
                      }
                    })
                    .catch(() => {
                      window.location.reload();
                    });
                }}
                className="hidden"
              />
              Restaurer
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeComponent;
