import { useState, useEffect } from "react";

const Add = () => {
  const [me, setMe] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [image, setImage] = useState({
    title: "",
    image: "",
    date: "",
    author: "",
  });

  useEffect(() => {
    fetch("http://localhost:3000/users/me", {
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
    fetch("http://localhost:3000/users/all", {
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
    };

    const formData = new FormData();
    formData.append("title", sendData.title);
    formData.append("image", sendData.image);
    formData.append("date", sendData.date);
    formData.append("author", sendData.author);

    fetch("http://localhost:3000/gallery", {
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
          console.log("Image added");
        }
      });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 gap-8 py-16">
      <div className="md:w-1/2 w-full flex flex-col gap-1 px-10">
        <label className="text-lg">Titre</label>
        <input
          className="border-2 border-gray-300 w-full pl-2 h-10"
          type="text"
          placeholder="Title"
          value={image.title}
          onChange={(e) => setImage({ ...image, title: e.target.value })}
        />

        <label htmlFor="author">Auteur</label>
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

        <label className="text-sm">Date</label>
        <input
          className="border-2 border-gray-300 w-full pl-2 h-10"
          type="date"
          value={image.date}
          onChange={(e) => setImage({ ...image, date: e.target.value })}
        />
        <input
          className="border-2 border-gray-300 w-full pl-2 py-1 text-sm"
          type="file"
          accept="image/*"
          onChange={(e) => setImage({ ...image, image: e.target.files[0] })}
        />
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
