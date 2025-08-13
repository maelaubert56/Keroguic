import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const fetchPage = useCallback(async (pageParam) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/posts/page/${pageParam}`
      );
      const data = await res.json();
      setPosts(data.posts);
      setTotalPages(data.totalPages);
      setTotalPosts(data.totalPosts);
    } catch (e) {
      // noop
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  useEffect(() => {
    const prev = document.title;
    document.title = `Blog – Page ${page} | Fête des vieux métiers`;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = `Actualités de la fête des vieux métiers. Page ${page}.`;
    return () => {
      document.title = prev;
    };
  }, [page]);

  return (
    <main
      className="flex flex-col items-center justify-center w-full p-4 py-16 bg-cover bg-center bg-no-repeat gap-6"
      style={{ backgroundImage: 'url("/assets/img/champs.jpg")' }}
      aria-label="Articles de blog"
    >
      <header className="text-center text-white">
        <h1 className="text-3xl font-alegreyasc">Blog</h1>
        <p className="text-sm" aria-live="polite">
          {totalPosts} articles
        </p>
      </header>
      {loading && <p className="text-white text-sm">Chargement...</p>}
      <section
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl"
        aria-label="Liste des articles"
      >
        {posts?.map((post) => (
          <article
            key={post.id}
            className="flex flex-col gap-3 p-5 bg-white/95 backdrop-blur rounded-lg shadow-sm hover:shadow-md transition cursor-pointer focus-within:ring-2 focus-within:ring-black"
            onClick={() => navigate(`/blog/${post.id}`)}
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === "Enter" && navigate(`/blog/${post.id}`)
            }
            aria-label={`Lire l'article ${post.title}`}
          >
            <h2 className="text-xl font-alegreyasc line-clamp-2" title={post.title}>
              {post.title}
            </h2>
            <div className="flex flex-row gap-2 items-center text-xs text-gray-600">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={`${import.meta.env.VITE_API_URL}/uploads/pp/${post.author.picture}`}
                alt={post.author.name}
                loading="lazy"
              />
              <span>{post.author.name}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={new Date(post.date).toISOString()}>
                {new Date(post.date).toLocaleDateString()}
              </time>
            </div>
            {post.content && (
              <p className="text-sm text-gray-700 line-clamp-3">
                {post.content.replace(/[#*_>`]/g, "").slice(0, 160)}
                {post.content.length > 160 ? "…" : ""}
              </p>
            )}
            <span className="text-xs font-semibold text-blue-700 mt-auto">
              Lire l&apos;article →
            </span>
          </article>
        ))}
      </section>
      <nav
        className="flex flex-row justify-center gap-2 flex-wrap"
        aria-label="Pagination articles"
      >
        {Array.from({ length: totalPages }, (_, index) => {
          const target = index + 1;
          return (
            <button
              key={index}
              onClick={() => setSearchParams({ page: String(target) })}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                page === target
                  ? "bg-white text-black"
                  : "bg-black/30 text-white hover:bg-black/50"
              }`}
              aria-current={page === target ? "page" : undefined}
            >
              {target}
            </button>
          );
        })}
      </nav>
    </main>
  );
};

export default Blog;
