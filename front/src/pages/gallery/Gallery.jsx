import { useEffect, useState } from "react";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalImages, setTotalImages] = useState(0);

  useEffect(() => {
    // get the params from the url
    const url = new URL(window.location.href);
    var pageParam = url.searchParams.get("page");

    // if there is no page in the url, set the page to 1
    if (pageParam === null) {
      pageParam = 1;
    }
    setPage(pageParam);
    fetch(`${import.meta.env.VITE_API_URL}/gallery/page/${pageParam}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setImages(data.images);
        setTotalPages(data.totalPages);
        setTotalImages(data.totalImages);
      });
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full p-4 gap-8 py-16">
        <h1 className="text-2xl font-librebaskervillebold">Galerie</h1>
        <span className="text-sm">{totalImages} images</span>
        <div className="grid grid-cols-3 gap-4">
          {images?.map((image) => (
            <div
              key={image.id}
              className="flex flex-col items-center border-2 gap-2 border-gray-300 p-2 hover:shadow-lg cursor-pointer rounded-lg hover:scale-[100.5%] transition-transform"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={`${import.meta.env.VITE_API_URL}/uploads/gallery/${
                  image.image
                }`}
                alt={image.title}
                className="w-40 h-40 object-contain"
              />
              <p className="text-sm font-librebaskervillebold text-center">
                {image.title}
              </p>
              <p className="text-xs text-center">
                {new Date(image.date).toLocaleDateString()}
              </p>
              <div className="flex items-center gap-2">
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/pp/${
                    image.author.picture
                  }`}
                  alt={image.author.name}
                  className="w-8 h-8 object-cover rounded-full"
                />
                <p className="text-xs text-center">{image.author.name}</p>
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
      {selectedImage && (
        <div
          className="fixed z-99 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white p-4 m-4 rounded-lg relative flex flex-col justify-evenly items-center h-[90%] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`${import.meta.env.VITE_API_URL}/uploads/gallery/${
                selectedImage.image
              }`}
              alt={selectedImage.title}
              className="h-[89%] object-contain"
            />
            <span className="flex flex-col items-center gap-2 h-[9%] w-full relative">
              <span className="flex flex-row items-center gap-2">
                <p className="font-librebaskervillebold">
                  {selectedImage.title}
                </p>
                {"-"}
                <p>{new Date(selectedImage.date).toLocaleDateString()}</p>
              </span>
              <div className="flex items-center gap-2">
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/pp/${
                    selectedImage.author.picture
                  }`}
                  alt={selectedImage.author.name}
                  className="w-10 h-10 object-cover rounded-full"
                />
                <p>{selectedImage.author.name}</p>
              </div>
            </span>
            <button
              className="bg-red-500 text-white rounded-md w-7 h-7 hover:bg-red-700 absolute top-1 right-1 flex items-baseline justify-center"
              onClick={() => setSelectedImage(null)}
            >
              x
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
