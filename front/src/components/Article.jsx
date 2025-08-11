import { useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { useFetch } from "@/hooks/useFetch";

const Article = () => {
  const { id } = useParams();
  
  const { data: article, loading, error } = useFetch(
    `${import.meta.env.VITE_API_URL}/posts/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
    [id]
  );

  if (loading) return <div className="flex justify-center items-center h-64">Chargement...</div>;
  if (error) return <div className="flex justify-center items-center h-64">Erreur: {error.message}</div>;

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 gap-8 py-16">
      <div className="flex flex-col gap-10 p-4 w-full lg:w-2/3 justify-start items-center">
        <h1 className="text-2xl font-librebaskervillebold">
          {article.title}
        </h1>

        <div className="mt-4 w-full">
          <MDEditor.Markdown source={article?.content} />
        </div>
        <div className="flex w-full flex-row gap-2 justify-start items-center">
          <img
            className="h-12 w-12 rounded-full"
            src={`${import.meta.env.VITE_API_URL}/uploads/pp/${article.author.picture}`}
            alt={article.author.name}
          />
          <span className="font-librebaskervilleregular text-lg">
            {article.author.name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Article;
