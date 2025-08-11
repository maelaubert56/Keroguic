import { useState } from "react";
import { getPageParam } from "../utils/pagination";
import { useFetch } from "@/hooks/useFetch";
import { usePagination } from "@/hooks/usePagination";

const Gallery = () => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const pageParam = getPageParam(1);
  const { page } = usePagination(pageParam);
  
  const { data, loading, error } = useFetch(
    `${import.meta.env.VITE_API_URL}/gallery/page/${page}`,
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

  const { medias = [], totalPages = 0, totalMedias = 0 } = data || {};

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full p-4 gap-8 py-16">
        <h1 className="text-2xl font-librebaskervillebold">Galerie</h1>
        <span className="text-sm">{totalMedias} medias</span>
        <div className="grid grid-cols-3 gap-4">
          {medias?.map((media) => (
            <div key={media.id} className="bg-white rounded-lg shadow-md p-2 cursor-pointer" onClick={() => setSelectedMedia(media)}>
              <img src={`${import.meta.env.VITE_API_URL}/uploads/gallery/${media.filename}`} alt={media.title} className="w-full h-40 object-cover rounded" />
              <span className="block text-center mt-2 font-librebaskervilleregular">{media.title}</span>
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
                window.location.href = `/galerie?page=${i + 1}`;
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
        {/* Modal for selected media */}
        {selectedMedia && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setSelectedMedia(null)}>
            <div className="bg-white p-4 rounded-lg max-w-lg w-full" onClick={e => e.stopPropagation()}>
              <img src={`${import.meta.env.VITE_API_URL}/uploads/gallery/${selectedMedia.filename}`} alt={selectedMedia.title} className="w-full h-auto rounded" />
              <h2 className="mt-2 font-librebaskervillebold text-xl">{selectedMedia.title}</h2>
              <p className="mt-1 font-librebaskervilleregular">{selectedMedia.description}</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setSelectedMedia(null)}>Fermer</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Gallery;
