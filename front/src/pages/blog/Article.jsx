import { useState, useEffect, Suspense, lazy } from "react";
import { useParams } from "react-router-dom";

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  const Markdown = lazy(() => import("@uiw/react-md-editor"));

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setArticle(data);
      });
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 gap-8 py-16">
      {article ? (
        <div className="flex flex-col gap-10 p-4 w-full lg:w-2/3 justify-start items-center">
          <h1 className="text-2xl font-librebaskervillebold">
            {article.title}
          </h1>

          <div className="mt-4 w-full">
            <Suspense fallback={<div>Loading...</div>}>
              <Markdown source={article.content} />
            </Suspense>
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
        <p>Article introuvable</p>
      )}
    </div>
  );
};

export default Article;
