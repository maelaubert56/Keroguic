import { useState, useEffect } from "react";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    // get the params from the url
    const url = new URL(window.location.href);
    var pageParam = url.searchParams.get("page");

    // if there is no page in the url, set the page to 1
    if (pageParam === null) {
      pageParam = 1;
    }
    setPage(pageParam);
    fetch(`${import.meta.env.VITE_API_URL}/posts/page/${pageParam}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.posts);
        setTotalPages(data.totalPages);
        setTotalPosts(data.totalPosts);
      });
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center w-full p-4 py-16 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("assets/img/champs.jpg")' }}
    >
      <h1 className="text-2xl text-white font-librebaskervillebold">Blog</h1>
      <span className="text-sm text-white">{totalPosts} articles</span>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {posts?.map((post, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 p-4 bg-white rounded-lg hover:shadow-lg cursor-pointer"
            onClick={() => {
              window.location.href = `/blog/${post.id}`;
            }}
          >
            <h2 className="text-xl font-librebaskervillebold">{post.title}</h2>
            <div className="flex flex-row gap-2 justify-start items-center text-xs">
              <img
                className="w-10 h-10 rounded-full"
                src={`${import.meta.env.VITE_API_URL}/uploads/pp/${
                  post.author.picture
                }`}
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
