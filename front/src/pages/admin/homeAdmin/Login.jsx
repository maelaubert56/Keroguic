// Toastify
import { toast } from "react-toastify";

const Login = () => {
  const onLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message != "ok") {
          toast.error(data.message);
          e.target.username.value = "";
          e.target.password.value = "";
        } else if (data.token) {
          localStorage.setItem("token", data.token);
          window.location.reload();
        }
      });
  };

  return (
    <div className="flex flex-col justify-center items-center p-5 bg-gray-200 rounded-lg my-20">
      <h2 className="text-2xl font-librebaskervillebold">Connexion</h2>
      <form
        className="flex flex-col justify-center items-center gap-5 p-5 bg-gray-200 rounded-lg"
        onSubmit={onLogin}
      >
        <label htmlFor="username">Nom d{"'"}utilisateur</label>
        <input
          type="userame"
          id="username"
          name="username"
          placeholder="Nom d'utilisateur"
          className="p-2"
        />
        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Mot de passe"
          className="p-2"
        />
        <button className="bg-blue-500 text-white p-2 rounded-lg">
          Connexion
        </button>
      </form>
    </div>
  );
};

export default Login;
