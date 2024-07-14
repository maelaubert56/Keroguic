import { useEffect, useState } from "react";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Get the page number from the URL
    const url = new URL(window.location.href);
    const page = url.searchParams.get("page") || 1;
    setPage(parseInt(page, 10));
  }, []);

  useEffect(() => {
    // Fetch images based on the current page
    const fetchImages = () => {
      // Here you would typically fetch images from an API based on the page number.
      // For demonstration, we're using static data.
      const imagesData = [
        {
          id: 1,
          title: "Nouvelle Affiche de 2024",
          image: "https://keroguic.fr/img/images_blog/post1.jpg",
          date: "2024-01-01",
          author: {
            id: 1,
            name: "Maël Aubert",
            image: "https://randomuser.me/api/portraits/men/29.jpg",
          },
        },
        {
          id: 2,
          title: "Affiche de 2023",
          image: "https://keroguic.fr/img/images_posted/45658.jpg",
          date: "2023-01-01",
          author: {
            id: 1,
            name: "Maël Aubert",
            image: "https://randomuser.me/api/portraits/men/29.jpg",
          },
        },
        // Add more images as needed
      ];

      setImages(imagesData);
      setTotalPages(3); // Set total pages based on your data source
    };

    fetchImages();
  }, [page]);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full p-4 gap-8 py-16">
        <h1 className="text-2xl font-librebaskervillebold">Galerie</h1>
        <div className="grid grid-cols-3 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="flex flex-col items-center gap-2 border-2 border-gray-300 p-2 hover:shadow-lg cursor-pointer rounded-lg"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.image}
                alt={image.title}
                className="w-40 h-40 object-cover"
              />
              <p className="text-sm">{image.title}</p>
              <p className="text-xs">{image.date}</p>
              <div className="flex items-center gap-2">
                <img
                  src={image.author.image}
                  alt={image.author.name}
                  className="w-10 h-10 object-cover rounded-full"
                />
                <p className="text-xs">{image.author.name}</p>
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
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white p-4 rounded-lg relative flex flex-col justify-evenly items-center h-[90%] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="h-[89%] object-contain"
            />
            <span className="flex flex-col items-center gap-2 h-[9%] w-full relative">
              <span className="flex flex-row items-center gap-2">
                <p>{selectedImage.title}</p>
                {"-"}
                <p>{selectedImage.date}</p>
              </span>
              <div className="flex items-center gap-2">
                <img
                  src={selectedImage.author.image}
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
