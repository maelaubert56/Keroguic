import { useState, useEffect, Suspense, lazy } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { toInputDate } from "@/utils/dateUtils";

const MDEditor = lazy(() => import("@uiw/react-md-editor"));

const EditArticle = () => {
  const { id } = useParams();
  const { user: me, isAuthenticated } = useAuth();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [post, setPost] = useState({
    id: "",
    title: "",
    published: false,
    content: "",
    date: "",
    author: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/admin";
      return;
    }

    // Fetch article data
    const fetchArticle = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/edit/${id}`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        
        if (response.ok) {
          const data = await response.json();
          setPost({
            id: data.id,
            title: data.title,
            published: data.published,
            content: data.content,
            date: toInputDate(data.date),
            author: data.authorId || (data.author ? data.author.id.toString() : me?.id?.toString() || ""),
          });
        } else {
          toast.error("Article non trouvé");
          window.location.href = "/admin";
        }
      } catch (error) {
        toast.error("Erreur lors du chargement");
        window.location.href = "/admin";
      } finally {
        setInitialLoading(false);
      }
    };

    // Fetch authors
    const fetchAuthors = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/all`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        
        if (response.status === 403) {
          setAuthors([me]);
        } else {
          const data = await response.json();
          setAuthors(Array.isArray(data) ? data : [me]);
        }
      } catch (error) {
        setAuthors([me]);
      }
    };

    if (me) {
      fetchArticle();
      fetchAuthors();
    }
  }, [id, me, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!post.title.trim() || !post.content.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          ...post,
          date: new Date(post.date).toISOString(),
        }),
      });

      if (response.ok) {
        toast.success("Article modifié avec succès");
        window.location.href = "/admin";
      } else {
        const error = await response.json();
        toast.error(error.message || "Erreur lors de la modification");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: localStorage.getItem("token") },
      });

      if (response.ok) {
        toast.success("Article supprimé avec succès");
        window.location.href = "/admin";
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    }
  };

  if (!isAuthenticated) {
    return <div>Redirection...</div>;
  }

  if (initialLoading) {
    return <div className="flex justify-center items-center h-64">Chargement de l&apos;article...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <Button variant="outline" asChild className="mb-4">
          <a href="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l&apos;admin
          </a>
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Modifier l&apos;Article</span>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={post.title}
                    onChange={(e) => setPost({...post, title: e.target.value})}
                    placeholder="Titre de l'article"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={post.date}
                    onChange={(e) => setPost({...post, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(me?.privilege === "owner" || me?.privilege === "admin" || me?.privilege === "editor") && (
                  <div className="space-y-2">
                    <Label htmlFor="author">Auteur</Label>
                    <Select value={post.author} onValueChange={(value) => setPost({...post, author: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un auteur" />
                      </SelectTrigger>
                      <SelectContent>
                        {authors.map((author) => (
                          <SelectItem key={author.id} value={author.id.toString()}>
                            {author.name}
                            {author.id === me?.id ? " (vous)" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={post.published}
                    onCheckedChange={(checked) => setPost({...post, published: checked})}
                  />
                  <Label htmlFor="published">Article publié</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenu *</Label>
                <Suspense fallback={<div>Chargement de l&apos;éditeur...</div>}>
                  <MDEditor
                    value={post.content}
                    onChange={(val) => setPost({...post, content: val || ""})}
                    preview="edit"
                    height={400}
                    data-color-mode="light"
                  />
                </Suspense>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Modification..." : "Modifier l'article"}
                </Button>
                
                <Button type="button" variant="outline" asChild>
                  <a href="/admin">Annuler</a>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditArticle;
