import { useEffect, useState } from "react";
import MeComponent from "./MeComponent";
import UsersComponent from "./UsersComponent";
import ArticleComponent from "./ArticleComponent";
import GalleryComponent from "./GalleryComponent";
import Login from "./Login";

const Admin = () => {
  const [me, setMe] = useState();
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    fetch(`${import.meta.env.VITE_API_URL}/users/all`, {
      method: "GET",
      headers: { Authorization: localStorage.getItem("token") },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error("Unauthorized");
        }
      })
      .then((data) => setUsers(data))
      .catch((err) => console.log(err));
  };

  //get me
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
        method: "GET",
        headers: { Authorization: token },
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            localStorage.removeItem("token");
            throw new Error("Unauthorized");
          }
        })
        .then((data) => setMe(data))
        .catch((err) => console.log(err));
    }
  }, []);

  // get all users
  useEffect(() => {
    if (me?.privilege === "admin" || me?.privilege === "owner") {
      fetchUsers();
    }
  }, [me]);

  return (
    <div className={`flex flex-col justify-center items-center gap-5 p-5 `}>
      {me ? (
        <>
          {/* user profile */}
          <MeComponent me={me} />

          {/* users */}
          <UsersComponent me={me} users={users} />

          {/* articles */}
          <ArticleComponent me={me} />

          {/* gallery */}
          <GalleryComponent me={me} />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default Admin;
