import MeComponent from "@/components/admin/MeComponent";
import UsersComponent from "@/components/admin/UsersComponent";
import ArticleComponent from "@/components/admin/ArticleComponent";
import GalleryComponent from "@/components/admin/GalleryComponent";
import Login from "@/components/admin/Login";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";

const Admin = () => {
  const { user: me, loading: authLoading, isAuthenticated } = useAuth();
  
  const { data: users = [] } = useFetch(
    `${import.meta.env.VITE_API_URL}/users/all`,
    {
      method: "GET",
      headers: { Authorization: localStorage.getItem("token") },
    },
    [isAuthenticated]
  );

  if (authLoading) return <div className="flex justify-center items-center h-64">Chargement...</div>;

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
