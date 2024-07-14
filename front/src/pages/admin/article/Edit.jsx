import { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";

const Edit = () => {
  const [me, setMe] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [post, setPost] = useState({
    id: "",
    title: "",
    content: "",
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
      const id = window.location.pathname.split("/").pop();
      fetch(`http://localhost:3000/posts/${id}`, {
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
      date: new Date(post.date).toISOString(),
      author: post.author,
    };

    console.log(sendData);

    fetch(
      `http://localhost:3000/posts/${window.location.pathname
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
      <div className="flex flex-row w-full justify-between gap-1 h-10">
        <label htmlFor="title">Titre</label>
        <input
          id="title"
          className="border-2 border-gray-300 w-full pl-2"
          type="text"
          placeholder="Titre"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
        />
        <label htmlFor="author">Auteur</label>
        <select
          id="author"
          name="author"
          className="border-2 border-gray-300 w-full pl-2"
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
        <label htmlFor="date">Date</label>
        <input
          id="date"
          className="border-2 border-gray-300 w-full pl-2"
          type="date"
          value={post.date}
          onChange={(e) => setPost({ ...post, date: e.target.value })}
        />
      </div>
      <div className="mb-2 h-[70vh] p-2 w-full gap-2 flex flex-col text-center">
        <p>Ecrivez votre texte à gauche, vous verrez le rendu à droite.</p>
        <MDEditor
          height="100%"
          value={post.content}
          onChange={(e) => setPost({ ...post, content: e })}
        />
        {/* <MDEditor.Markdown
          source={post.content}
          style={{ whiteSpace: "pre-wrap" }}
        /> */}
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
