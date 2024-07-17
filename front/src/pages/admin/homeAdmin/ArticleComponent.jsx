/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const ArticleComponent = ({ me }) => {
  const [onlyMyPosts, setOnlyMyPosts] = useState(false);
  const [openDeleteArticle, setOpenDeleteArticle] = useState(null);
  const [articles, setArticles] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  // get articles
  useEffect(() => {
    if (me) {
      fetchArticles();
    }
  }, [me, page]);

  const fetchArticles = () => {
    fetch(`${import.meta.env.VITE_API_URL}/posts/page/${page}?nb=5&all=true`, {
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
      .then((data) => {
        setArticles(data.posts);
        setTotalPages(data.totalPages);
        setTotalPosts(data.totalPosts);
      })
      .catch((err) => console.log(err));
  };

  const onDeleteArticle = (id) => {
    fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: localStorage.getItem("token") },
    })
      .then((res) => {
        if (res.status === 200) {
          fetchArticles();
          setOpenDeleteArticle(null);
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

  return (
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
        <label htmlFor="onlyMyPosts">Afficher uniquement mes articles</label>
      </div>

      {articles?.length === 0 ? (
        <p>Aucun article disponible</p>
      ) : (
        <>
          <p className="text-sm">{totalPosts} articles</p>
          <table className="w-full">
            <thead className="bg-gray-300">
              <tr className="text-left">
                <th className="p-2">Titre</th>
                <th className="p-2">Date</th>
                <th className="p-2">Auteur</th>
                <th className="p-2">Publié</th>
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
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={article.published}
                          onChange={() => {
                            setArticles(
                              articles.map((a) =>
                                a.id === article.id
                                  ? { ...a, published: !a.published }
                                  : a
                              )
                            );
                            fetch(
                              `${import.meta.env.VITE_API_URL}/posts/${
                                article.id
                              }`,
                              {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: localStorage.getItem("token"),
                                },
                                body: JSON.stringify({
                                  title: article.title,
                                  content: article.content,
                                  published: !article.published,
                                  author: article.author.id,
                                  date: article.date,
                                }),
                              }
                            )
                              .then((res) => {
                                if (res.status === 200) {
                                  fetchArticles();
                                } else {
                                  alert(
                                    "Une erreur est survenue lors de la modification de l'article"
                                  );
                                }
                              })
                              .catch((error) => {
                                alert(
                                  "Une erreur est survenue lors de la modification de l'article: " +
                                    error.message
                                );
                              });
                          }}
                        />
                      </td>
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
                            <h2 className="mb-2">Confirmer la suppression</h2>
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
