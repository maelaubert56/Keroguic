import { useState, useEffect } from "react";

const Add = () => {
  const [me, setMe] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [media, setMedia] = useState({
    title: "",
    published: true,
    media: "",
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
      setMedia({
        title: "",
        published: true,
        media: "",
        date: new Date().toISOString().split("T")[0],
        author: me.id,
      });
    }
  }, [me]);

  const handleAdd = () => {
    const sendData = {
      title: media.title,
      media: media.media,
      date: new Date(media.date).toISOString(),
      author: media.author,
      published: media.published,
    };

    const formData = new FormData();
    formData.append("title", sendData.title);
    formData.append("media", sendData.media);
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
        Ajouter une media
      </h1>
      <div className="md:w-1/2 w-full flex flex-col gap-3 px-10">
        <label className="text-sm">
          Titre
          <input
            className="border-2 border-gray-300 w-full pl-2 h-10"
            type="text"
            placeholder="Title"
            value={media.title}
            onChange={(e) => setMedia({ ...media, title: e.target.value })}
          />
        </label>

        <label htmlFor="author" className="text-sm">
          Auteur
          <select
            name="author"
            className="border-2 border-gray-300 w-full pl-2 h-10"
            value={media.author}
            onChange={(e) => setMedia({ ...media, author: e.target.value })}
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
            value={media.published}
            onChange={(e) =>
              setMedia({ ...media, published: e.target.checked })
            }
          />
          Publié
        </label>
        <label className="text-sm">
          Date
          <input
            className="border-2 border-gray-300 w-full pl-2 h-10"
            type="date"
            value={media.date}
            onChange={(e) => setMedia({ ...media, date: e.target.value })}
          />
        </label>
        <label className="text-sm">
          Media
          <input
            className="border-2 border-gray-300 w-full pl-2 py-1 text-sm"
            type="file"
            // accept media and video
            accept="media/*,video/*"
            onChange={(e) => setMedia({ ...media, media: e.target.files[0] })}
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
