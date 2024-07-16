import { useState, useEffect } from "react";

const Add = () => {
  const [me, setMe] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [image, setImage] = useState({
    title: "",
    published: true,
    image: "",
    date: "",
    author: "",
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setMe(data);
        }
      });
  }, []);

  useEffect(() => {
    if (me === null) return;
    fetch(`${import.meta.env.VITE_API_URL}/users/all`, {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        // if the res is 403, then authors is only me, else it's all users
        if (res.status === 403) {
          return [me];
        }
        return res.json();
      })
      .then((data) => {
        setAuthors(data);
      });
  }, [me]);

  useEffect(() => {
    if (me !== null) {
      setImage({
        title: "",
        published: true,
        image: "",
        date: new Date().toISOString().split("T")[0],
        author: me.id,
      });
    }
  }, [me]);

  const handleAdd = () => {
    const sendData = {
      title: image.title,
      image: image.image,
      date: new Date(image.date).toISOString(),
      author: image.author,
      published: image.published,
    };

    const formData = new FormData();
    formData.append("title", sendData.title);
    formData.append("image", sendData.image);
    formData.append("date", sendData.date);
    formData.append("author", sendData.author);
    formData.append("published", sendData.published);
    console.log(sendData.published);

    fetch(`${import.meta.env.VITE_API_URL}/gallery`, {
      method: "POST",
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          window.location.href = "/admin/";
        }
      });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 gap-8 py-16">
      <h1 className="text-2xl font-bold font-librebaskervilleregular">
        Ajouter une image
      </h1>
      <div className="md:w-1/2 w-full flex flex-col gap-3 px-10">
        <label className="text-sm">
          Titre
          <input
            className="border-2 border-gray-300 w-full pl-2 h-10"
            type="text"
            placeholder="Title"
            value={image.title}
            onChange={(e) => setImage({ ...image, title: e.target.value })}
          />
        </label>

        <label htmlFor="author" className="text-sm">
          Auteur
          <select
            name="author"
            className="border-2 border-gray-300 w-full pl-2 h-10"
            value={image.author}
            onChange={(e) => setImage({ ...image, author: e.target.value })}
          >
            {authors.map((author) => (
              <option key={author.id} value={author.id} defaultValue={me.id}>
                {author.name}
                {author.id === me.id ? " (vous)" : ""}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="published" className="flex flex-row gap-2 items-center">
          <input
            id="published"
            type="checkbox"
            className="h-5 w-5"
            defaultChecked={true}
            value={image.published}
            onChange={(e) =>
              setImage({ ...image, published: e.target.checked })
            }
          />
          Publié
        </label>
        <label className="text-sm">
          Date
          <input
            className="border-2 border-gray-300 w-full pl-2 h-10"
            type="date"
            value={image.date}
            onChange={(e) => setImage({ ...image, date: e.target.value })}
          />
        </label>
        <label className="text-sm">
          Image
          <input
            className="border-2 border-gray-300 w-full pl-2 py-1 text-sm"
            type="file"
            accept="image/*"
            onChange={(e) => setImage({ ...image, image: e.target.files[0] })}
          />
        </label>
      </div>

      <button
        className="bg-blue-500 text-white p-2 rounded-md min-w-60 hover:bg-blue-700"
        onClick={() => handleAdd()}
      >
        Ajouter
      </button>
    </div>
  );
};

export default Add;
