/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import LinkIcon from "../../../assets/linkIcon.svg";

import { toast } from "react-toastify";

const ArticleComponent = ({ me }) => {
  const [openDeleteMedia, setOpenDeleteMedia] = useState(null);
  const [openPreviewMedia, setOpenPreviewMedia] = useState(null);

  const [galerie, setGalerie] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMedias, setTotalMedias] = useState(0);

  const [onlyMyMedias, setOnlyMyMedias] = useState(false);

  // get medias
  useEffect(() => {
    if (me) {
      fetchMedias();
    }
  }, [me, page]);

  const fetchMedias = () => {
    // if page is negative or nan, return an error
    if (page <= 0 || isNaN(page)) {
      return;
    }

    fetch(
      `${import.meta.env.VITE_API_URL}/gallery/page/${page}?nb=5&all=true`,
      {
        method: "GET",
        headers: { Authorization: localStorage.getItem("token") },
      }
    )
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error("Unauthorized");
        }
      })
      .then((data) => {
        setGalerie(data.medias);
        setTotalPages(data.totalPages);
        setTotalMedias(data.totalMedias);
      })
      .catch((err) => console.log(err));
  };

  const onDeleteMedia = (id) => {
    fetch(`${import.meta.env.VITE_API_URL}/gallery/${id}`, {
      method: "DELETE",
      headers: { Authorization: localStorage.getItem("token") },
    })
      .then((res) => {
        if (res.status === 200) {
          fetchMedias();
          setOpenDeleteMedia(null);
        } else {
          alert("Une erreur est survenue lors de la suppression de l'media");
        }
      })
      .catch((error) => {
        alert(
          "Une erreur est survenue lors de la suppression de l'media: " +
            error.message
        );
      });
  };

  return (
    <div className="flex w-full flex-col justify-center items-center gap-5 p-5 ">
      <h2 className="text-2xl font-librebaskervillebold">Galerie</h2>
      <button
        className="bg-blue-500 text-white p-2 text-sm rounded-lg hover:bg-blue-700"
        onClick={() => (window.location.href = "/admin/gallery/add")}
      >
        Ajouter une media
      </button>

      <div className="flex flex-row gap-2">
        <input
          id="onlyMyMedias"
          type="checkbox"
          onClick={() => {
            setOnlyMyMedias(!onlyMyMedias);
          }}
        />
        <label htmlFor="onlyMyMedias">Afficher uniquement mes medias</label>
      </div>
      {galerie?.length === 0 ? (
        <p>Aucune media disponible</p>
      ) : (
        <>
          <p className="text-sm">{totalMedias} medias</p>
          <table className="w-full">
            <thead className="bg-gray-300">
              <tr className="text-left">
                <th className="p-2">Media</th>
                <th className="p-2">Titre</th>
                <th className="p-2">Date</th>
                <th className="p-2">Auteur</th>
                <th className="p-2">Publié</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-100">
              {galerie?.map(
                (media) =>
                  (!onlyMyMedias || media.author.id === me.id) && (
                    <tr key={media.id} className="text-left">
                      <td
                        className="p-2"
                        onClick={() => setOpenPreviewMedia(media.id)}
                      >
                        {media.media.includes(".mp4") ? (
                          <video
                            className="w-10 rounded-md"
                            src={`${
                              import.meta.env.VITE_API_URL
                            }/uploads/gallery/${media.media}`}
                            alt={media.title}
                            controls
                          />
                        ) : (
                          <img
                            className="w-10 rounded-md"
                            src={`${
                              import.meta.env.VITE_API_URL
                            }/uploads/gallery/${media.media}`}
                            alt={media.title}
                          />
                        )}
                      </td>
                      <td className="p-2">{media.title}</td>
                      <td className="p-2">
                        {new Date(media.date).toLocaleDateString()}
                      </td>
                      <td className="p-2">{media.author.name}</td>
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={media.published}
                          onChange={() => {
                            setGalerie(
                              galerie.map((a) =>
                                a.id === media.id
                                  ? { ...a, published: !a.published }
                                  : a
                              )
                            );
                            fetch(
                              `${import.meta.env.VITE_API_URL}/gallery/${
                                media.id
                              }`,
                              {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: localStorage.getItem("token"),
                                },
                                body: JSON.stringify({
                                  title: media.title,
                                  author: media.author.id,
                                  date: media.date,
                                  published: !media.published,
                                }),
                              }
                            )
                              .then((res) => {
                                if (res.status === 200) {
                                  fetchMedias();
                                } else {
                                  alert(
                                    "Une erreur est survenue lors de la modification de l'media"
                                  );
                                }
                              })
                              .catch((error) => {
                                alert(
                                  "Une erreur est survenue lors de la modification de l'media: " +
                                    error.message
                                );
                              });
                          }}
                        />
                      </td>
                      <td className="p-2 flex flex-row gap-2 items-center justify-center h-full">
                        <button
                          className={`bg-blue-500 text-white p-2 text-xs rounded-lg hover:bg-blue-700`}
                          onClick={() => {
                            // add the link to the media in the clipboard
                            navigator.clipboard.writeText(
                              `${
                                import.meta.env.VITE_API_URL
                              }/uploads/gallery/${media.media}`
                            );
                            toast("Lien copié dans le presse-papier", {
                              type: "success",
                            });
                          }}
                        >
                          <img src={LinkIcon} alt="link" className="w-4 h-4" />
                        </button>

                        <button
                          className={`bg-blue-500 text-white p-2 text-xs rounded-lg hover:bg-blue-700 ${
                            media.author.id !== me.id &&
                            me.privilege !== "owner" &&
                            me.privilege !== "admin" &&
                            me.privilege !== "editor" &&
                            "hidden"
                          }`}
                          onClick={() =>
                            (window.location.href = `/admin/gallery/edit/${media.id}`)
                          }
                        >
                          Modifier
                        </button>

                        <button
                          className={`bg-red-500 text-white p-2 text-xs rounded-lg hover:bg-red-700 ${
                            media.author.id !== me.id &&
                            me.privilege !== "owner" &&
                            me.privilege !== "admin" &&
                            me.privilege !== "editor" &&
                            "hidden"
                          }`}
                          onClick={() => setOpenDeleteMedia(media.id)}
                        >
                          Supprimer
                        </button>
                      </td>
                      {openPreviewMedia === media.id && (
                        <div
                          className="absolute top-0 left-0 w-screen h-screen flex flex-col justify-center items-center backdrop-filter backdrop-blur-sm"
                          onClick={() => setOpenPreviewMedia(null)}
                        >
                          <div
                            className="bg-white p-5 rounded-lg flex flex-col justify-center items-center gap-5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <h2>{media.title}</h2>
                            {media.media.includes(".mp4") ? (
                              <video
                                className="w-10 rounded-md"
                                src={`${
                                  import.meta.env.VITE_API_URL
                                }/uploads/gallery/${media.media}`}
                                alt={media.title}
                                controls
                              />
                            ) : (
                              <img
                                className="w-10 rounded-md"
                                src={`${
                                  import.meta.env.VITE_API_URL
                                }/uploads/gallery/${media.media}`}
                                alt={media.title}
                              />
                            )}
                          </div>
                        </div>
                      )}
                      {openDeleteMedia === media.id && (
                        <div
                          className="absolute top-0 left-0 w-screen h-screen flex flex-col justify-center items-center backdrop-filter backdrop-blur-sm"
                          onClick={() => setOpenDeleteMedia(null)}
                        >
                          <div
                            className="bg-white p-5 rounded-lg flex flex-col justify-center items-center gap-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <h2 className="mb-2">Confirmer la suppression</h2>
                            <p
                              className="text-sm font-semibold
                        "
                            >
                              {media.title}
                            </p>
                            <img
                              className="w-64 rounded-md"
                              src={`${
                                import.meta.env.VITE_API_URL
                              }/uploads/gallery/${media.media}`}
                              alt={media.title}
                            />
                            <p className="text-sm font-semibold">
                              {media.date}
                            </p>
                            <p className="text-sm font-semibold">
                              {media.author.name}
                            </p>
                            <div className="flex flex-row gap-5 w-full justify-center items-center">
                              <button
                                className="bg-red-500 text-white p-2 text-xs rounded-lg w-1/3 hover:bg-red-700"
                                onClick={() => onDeleteMedia(media.id)}
                              >
                                Oui
                              </button>
                              <button
                                className="bg-blue-500 text-white p-2 text-xs rounded-lg w-1/3 hover:bg-blue-700"
                                onClick={() => setOpenDeleteMedia(null)}
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
        </>
      )}
      <div className="flex flex-row gap-2 justify-center items-center">
        {page > 1 && (
          <button
            className="bg-blue-500 text-white p-2 text-xs rounded-lg hover:bg-blue-700"
            onClick={() => setPage(page - 1)}
          >
            Page précédente
          </button>
        )}
        <input
          value={page}
          onChange={(e) => setPage(e.target.value)}
          type="number"
          min="1"
          max={totalPages}
          className="text-sm bg-gray-300 p-2 w-12 rounded-lg"
        />
        <p className="text-sm">/ {totalPages}</p>

        {page < totalPages && (
          <button
            className="bg-blue-500 text-white p-2 text-xs rounded-lg hover:bg-blue-700"
            onClick={() => setPage(page + 1)}
          >
            Page suivante
          </button>
        )}
      </div>
    </div>
  );
};

export default ArticleComponent;
