import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    setArticle({
      id: 1,
      title: "C'est le grand jour !",
      content:
        "# C'est le grand jour !\nLa fête des Vieux Métiers commence aujourd'hui à 10h00.\n\n## Programme\n- 10h00 : Ouverture\n- 11h00 : Défilé\n- 12h00 : Repas\n- 14h00 : Concours de labour\n- 16h00 : Remise des prix\n\nBonne fête à tous !\n>Éliane Aubert - Présidente\n>\n>![keroguic](https://www.keroguic.fr/img/assets/logo.png)",
      date: new Date().toISOString().split("T")[0],
      author: {
        id: 1,
        name: "Maël Aubert",
        image: "https://randomuser.me/api/portraits/men/29.jpg",
      },
    });
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center w-full  p-4  gap-8 py-16">
      {article ? (
        <div className="flex flex-col gap-10 p-4 w-full lg:w-2/3 justify-start items-center">
          <h1 className="text-2xl font-librebaskervillebold">
            {article.title}
          </h1>

          <div className="mt-4 w-full">
            <MDEditor.Markdown source={article.content} />
          </div>
          <div className="flex w-full flex-row gap-2 justify-start items-center">
            <img
              className="h-12 w-12 rounded-full"
              src={article.author.image}
              alt={article.author.name}
            />
            <span>
              <p>{article.date}</p>
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
