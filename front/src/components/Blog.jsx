import { getPageParam } from "../utils/pagination";
import { useFetch } from "@/hooks/useFetch";
import { usePagination } from "@/hooks/usePagination";

const Blog = () => {
  const pageParam = getPageParam(1);
  const { page } = usePagination(pageParam);
  
  const { data, loading, error } = useFetch(
    `${import.meta.env.VITE_API_URL}/posts/page/${page}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
    [page]
  );

  if (loading) return <div className="flex justify-center items-center h-64">Chargement...</div>;
  if (error) return <div className="flex justify-center items-center h-64">Erreur: {error.message}</div>;

  const { posts = [], totalPages = 0, totalPosts = 0 } = data || {};

  return (
    <div
      className="flex flex-col items-center justify-center w-full p-4 py-16 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/assets/img/champs.jpg")' }}
    >
      <h1 className="text-2xl text-white font-librebaskervillebold">Blog</h1>
      <span className="text-sm text-white">{totalPosts} articles</span>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-librebaskervillebold">{post.title}</h2>
            <p className="text-sm font-librebaskervilleregular">{post.excerpt}</p>
            <a href={`/blog/${post.id}`} className="text-blue-500 underline">
              Lire l&apos;article
            </a>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex flex-row gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-1 rounded ${page == i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => {
              window.location.href = `/blog?page=${i + 1}`;
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Blog;
