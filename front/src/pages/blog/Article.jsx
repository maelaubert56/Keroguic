import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // D'abord essayer avec les droits d'admin si un token existe
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };
    
    if (token) {
      headers.Authorization = token;
    }

    fetch(`${import.meta.env.VITE_API_URL}/posts/edit/${id}`, {
      method: "GET",
      headers,
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 403 || response.status === 401) {
          // Pas de droits admin, essayer la route publique
          return fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }).then(publicResponse => {
            if (publicResponse.status === 200) {
              return publicResponse.json();
            } else {
              throw new Error("Article non trouvé ou non publié");
            }
          });
        } else {
          throw new Error("Article non trouvé");
        }
      })
      .then((data) => {
        setArticle(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [id]);

  useEffect(() => {
    if (article) {
      const prevTitle = document.title;
      document.title = `${article.title} | Fête des vieux métiers`;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = article.content?.replace(/[#*_>`]/g, " ").slice(0, 155) || `Article du blog de la fête des vieux métiers.`;
      return () => { document.title = prevTitle; };
    }
  }, [article]);

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 gap-8 py-16">
      {error ? (
        <div className="text-center">
          <h1 className="text-2xl font-librebaskervillebold mb-4">Article non trouvé</h1>
          <p className="text-gray-600">{error}</p>
          <Link to="/blog" className="text-blue-600 hover:underline mt-4 inline-block">
            ← Retour au blog
          </Link>
        </div>
      ) : article ? (
        <div className="flex flex-col gap-10 p-4 w-full lg:w-2/3 justify-start items-center">
          {!article.published && (
            <div className="w-full bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded">
              ⚠️ Cet article est en brouillon et n&apos;est pas visible publiquement
            </div>
          )}
          <h1 className="text-2xl font-librebaskervillebold">
            {article.title}
          </h1>

          <div className="mt-4 w-full" data-color-mode="light">
              <MDEditor.Markdown source={article?.content} />
          </div>
          <div className="flex w-full flex-row gap-2 justify-start items-center">
            <img
              className="h-12 w-12 rounded-full"
              src={`${import.meta.env.VITE_API_URL}/uploads/pp/${
                article.author.picture
              }`}
              alt={article.author.name}
            />
            <span>
              <p>{new Date(article.date).toLocaleDateString()}</p>
              <p>Écrit par {article.author.name}</p>
            </span>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Chargement de l&apos;article...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Article;
