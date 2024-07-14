import { useState, useEffect } from "react";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // get the page nb from the url
    const url = new URL(window.location.href);
    const page = url.searchParams.get("page");
    setPage(page);
  }, []);

  useEffect(() => {
    // get the posts (depends on the page)
    setPosts([
      {
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
      },
      {
        id: 2,
        title: "Exemple d'article",
        content:
          "# Exemple d'article\n## Sous titre\nAvec une image : ![keroguic](https://www.keroguic.fr/img/assets/logo.png)\n>Une citation\n>\n> Avec un lien vers [keroguic](https://keroguic.fr)",
        date: new Date().toISOString().split("T")[0],
        author: {
          id: 2,
          name: "Éliane Aubert",
          image: "https://randomuser.me/api/portraits/women/29.jpg",
        },
      },
    ]);
    setTotalPages(3);
  }, [page]);

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 gap-8 py-16">
      <h1 className="text-2xl font-librebaskervillebold">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {posts.map((post, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 p-4 border-2 border-gray-300 rounded-lg hover:shadow-lg cursor-pointer"
            onClick={() => {
              window.location.href = `/blog/${post.id}`;
            }}
          >
            <h2 className="text-xl font-librebaskervillebold">{post.title}</h2>
            <div className="flex flex-row gap-2 justify-start items-center text-xs">
              <img
                className="w-10 h-10 rounded-full"
                src={post.author.image}
                alt={post.author.name}
              />
              <p>{post.author.name}</p>
              {"-"}
              <p>{new Date(post.date).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-center gap-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <a
            key={index}
            className={`${
              page == index + 1 ? "bg-gray-300" : "bg-gray-100"
            } px-4 py-2 rounded-lg`}
            href={`?page=${index + 1}`}
          >
            {index + 1}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Blog;
