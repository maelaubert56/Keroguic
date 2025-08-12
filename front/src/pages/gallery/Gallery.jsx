import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const Gallery = () => {
  const [medias, setMedias] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalMedias, setTotalMedias] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const fetchPage = useCallback(async (pageParam) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/gallery/page/${pageParam}`
      );
      const data = await res.json();
      setMedias(data.medias);
      setTotalPages(data.totalPages);
      setTotalMedias(data.totalMedias);
    } catch (e) {
      // noop simple
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  useEffect(() => {
    function onKey(e) {
      if (!selectedMedia) return;
      if (e.key === "Escape") setSelectedMedia(null);
      if (e.key === "ArrowRight") {
        const idx = medias.findIndex((m) => m.id === selectedMedia.id);
        if (idx < medias.length - 1) setSelectedMedia(medias[idx + 1]);
      }
      if (e.key === "ArrowLeft") {
        const idx = medias.findIndex((m) => m.id === selectedMedia.id);
        if (idx > 0) setSelectedMedia(medias[idx - 1]);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedMedia, medias]);

  return (
    <main
      className="flex flex-col items-center justify-center w-full p-4 gap-6 py-16"
      aria-label="Galerie médias"
    >
      <h1 className="text-3xl font-librebaskervillebold">Galerie</h1>
      <span className="text-sm" aria-live="polite">
        {totalMedias} médias
      </span>
      {loading && (
        <p className="text-sm text-gray-500" role="alert">
          Chargement...
        </p>
      )}
      <section
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-6xl"
        aria-label="Vignettes médias"
      >
        {medias?.map((media) => {
          const isVideo = media.media.includes(".mp4");
          const src = `${import.meta.env.VITE_API_URL}/uploads/gallery/${media.media}`;
          return (
            <button
              type="button"
              key={media.id}
              className="group relative flex flex-col items-center border border-gray-200 gap-1 p-2 rounded-lg hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 bg-white"
              onClick={() => setSelectedMedia(media)}
              aria-label={`Ouvrir ${isVideo ? "vidéo" : "image"} : ${media.title}`}
            >
              {isVideo ? (
                <video
                  src={src}
                  className="w-full aspect-square object-cover rounded-md"
                  muted
                  playsInline
                  preload="metadata"
                  loading="lazy"
                />
              ) : (
                <img
                  src={src}
                  alt={media.title}
                  className="w-full aspect-square object-cover rounded-md"
                  loading="lazy"
                />
              )}
              <p className="text-xs font-librebaskervillebold text-center line-clamp-2" title={media.title}>{media.title}</p>
              <time
                className="text-[10px] text-gray-500"
                dateTime={new Date(media.date).toISOString()}
              >
                {new Date(media.date).toLocaleDateString()}
              </time>
            </button>
          );
        })}
      </section>
      <nav
        className="flex flex-row justify-center gap-2 flex-wrap"
        aria-label="Pagination"
      >
        {Array.from({ length: totalPages }, (_, index) => {
          const target = index + 1;
          return (
            <button
              key={index}
              onClick={() => setSearchParams({ page: String(target) })}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                page === target
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              aria-current={page === target ? "page" : undefined}
            >
              {target}
            </button>
          );
        })}
      </nav>
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Visionneuse ${selectedMedia.title}`}
        >
          <div
            className="bg-white rounded-lg relative max-w-5xl w-full h-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/70 text-white hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              onClick={() => setSelectedMedia(null)}
              aria-label="Fermer la visionneuse"
            >
              ×
            </button>
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              {selectedMedia.media.includes(".mp4") ? (
                <video
                  src={`${import.meta.env.VITE_API_URL}/uploads/gallery/${selectedMedia.media}`}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/gallery/${selectedMedia.media}`}
                  alt={selectedMedia.title}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                />
              )}
            </div>
            <footer className="p-4 border-t text-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/pp/${selectedMedia.author.picture}`}
                  alt={selectedMedia.author.name}
                  className="w-10 h-10 object-cover rounded-full"
                  loading="lazy"
                />
                <div>
                  <p className="font-librebaskervillebold">{selectedMedia.title}</p>
                  <p className="text-xs text-gray-500">
                    <time dateTime={new Date(selectedMedia.date).toISOString()}>
                      {new Date(selectedMedia.date).toLocaleDateString()}
                    </time>{" "}
                    · {selectedMedia.author.name}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const idx = medias.findIndex((m) => m.id === selectedMedia.id);
                    if (idx > 0) setSelectedMedia(medias[idx - 1]);
                  }}
                  disabled={
                    medias.findIndex((m) => m.id === selectedMedia.id) === 0
                  }
                  className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
                >
                  ← Précédent
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const idx = medias.findIndex((m) => m.id === selectedMedia.id);
                    if (idx < medias.length - 1) setSelectedMedia(medias[idx + 1]);
                  }}
                  disabled={
                    medias.findIndex((m) => m.id === selectedMedia.id) ===
                    medias.length - 1
                  }
                  className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
                >
                  Suivant →
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </main>
  );
};

export default Gallery;
