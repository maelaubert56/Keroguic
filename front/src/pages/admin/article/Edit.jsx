import { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";

const Edit = () => {
  const [me, setMe] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [post, setPost] = useState({
    id: "",
    title: "",
    published: false,
    content: "",
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
      fetch(`${import.meta.env.VITE_API_URL}/posts/edit/${id}`, {
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
          setPost({
            title: data.title,
            content: data.content,
            published: data.published,
            date: new Date(data.date).toISOString().split("T")[0],
            author: data.authorId,
          });
        });
    }
  }, [me]);

  const handleEdit = () => {
    const sendData = {
      title: post.title,
      content: post.content,
      published: post.published,
      date: new Date(post.date).toISOString(),
      author: post.author,
    };

    console.log(sendData);

    fetch(
      `${import.meta.env.VITE_API_URL}/posts/${window.location.pathname
        .split("/")
        .pop()}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(sendData),
      }
    ).then((res) => {
      if (res.status !== 200) {
        console.log("Error");
      } else {
        window.location.href = "/admin";
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 space-y-4">
      <div className="flex flex-row justify-start gap-5 w-1/2">
        <div className="flex flex-col items-center justify-between gap-5 w-1/2">
          <label
            htmlFor="title"
            className="flex flex-col gap-2 w-full items-center justify-center"
          >
            Titre
            <input
              id="title"
              className="border-2 border-gray-300 w-full pl-2 h-10"
              type="text"
              placeholder="Titre"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
            />
          </label>
          <label
            htmlFor="published"
            className="flex flex-row gap-2 w-full items-center justify-end h-full"
          >
            <input
              className="h-5 w-5"
              id="published"
              type="checkbox"
              checked={post.published}
              onChange={(e) =>
                setPost({ ...post, published: e.target.checked })
              }
            />
            Publié
          </label>
        </div>
        <div className="flex flex-col gap-2 items-center justify-between w-1/2">
          <label htmlFor="author" className="flex flex-col gap-2 w-full">
            Auteur
            <select
              id="author"
              name="author"
              className="border-2 border-gray-300 w-full pl-2 h-10"
              value={post.author}
              onChange={(e) => setPost({ ...post, author: e.target.value })}
            >
              {authors.map((author) => (
                <option key={author.id} value={author.id} defaultValue={me.id}>
                  {author.name}
                  {author.id === me.id ? " (vous)" : ""}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="date" className="flex flex-col gap-2 w-full">
            Date
            <input
              id="date"
              className="border-2 border-gray-300 w-full pl-2 h-10"
              type="date"
              value={post.date}
              onChange={(e) => setPost({ ...post, date: e.target.value })}
            />
          </label>
        </div>
      </div>
      <div className="mb-2 p-2 h-[70vh] w-full gap-2 flex flex-col text-center">
        <p>Ecrivez votre texte à gauche, vous verrez le rendu à droite.</p>
        <MDEditor
          height="100%"
          value={post.content}
          onChange={(e) => setPost({ ...post, content: e })}
        />
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
