import { useState, useEffect } from "react";

const Edit = () => {
  const [me, setMe] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [image, setImage] = useState({
    id: "",
    title: "",
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
      const id = window.location.pathname.split("/").pop();
      fetch(`${import.meta.env.VITE_API_URL}/gallery/${id}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (res.status !== 200) {
            window.location.href = "/admin";
          }
          return res.json();
        })
        .then((data) => {
          setImage({
            id: data.id,
            title: data.title,
            image: data.image,
            date: new Date(data.date).toISOString().split("T")[0],
            author: data.authorId,
          });
        });
    }
  }, [me]);

  const handleEdit = () => {
    console.log(image);
    const formData = new FormData();
    formData.append("title", image.title);
    formData.append("author", image.author);
    formData.append("date", new Date(image.date).toISOString());
    formData.append("image", image.image);

    fetch(`${import.meta.env.VITE_API_URL}/gallery/${image.id}`, {
      method: "PUT",
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
      body: formData,
    }).then((res) => {
      if (res.status !== 200) {
        console.log("Error");
      } else {
        window.location.href = "/admin";
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 gap-8 py-16">
      <div className="md:w-1/2 w-full flex flex-col gap-1 px-10">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          className="border-2 border-gray-300 w-full pl-2 h-10"
          type="text"
          placeholder="Title"
          value={image.title}
          onChange={(e) => setImage({ ...image, title: e.target.value })}
        />
        <label htmlFor="author">Auteur</label>
        <select
          id="author"
          name="author"
          className="border-2 border-gray-300 w-full pl-2"
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

        <label htmlFor="date">Date</label>
        <input
          id="date"
          className="border-2 border-gray-300 w-full pl-2 h-10"
          type="date"
          value={image.date}
          onChange={(e) => setImage({ ...image, date: e.target.value })}
        />

        <label htmlFor="image">Image</label>
        <input
          id="image"
          className="border-2 border-gray-300 w-full pl-2 py-1 text-sm"
          type="file"
          accept="image/*"
          onChange={(e) => setImage({ ...image, image: e.target.files[0] })}
        />
        <div className="flex flex-col gap-1 items-center rounded-lg border-2 border-gray-300 p-2">
          <p>Ancienne image :</p>
          <img
            className="w-1/2"
            src={`${import.meta.env.VITE_API_URL}/uploads/gallery/${
              image.image
            }`}
            alt={image?.title}
          />
        </div>
      </div>

      <button
        className="bg-blue-500 text-white p-2 rounded-md min-w-60 hover:bg-blue-700"
        onClick={() => handleEdit()}
      >
        Modifier
      </button>
    </div>
  );
};

export default Edit;
