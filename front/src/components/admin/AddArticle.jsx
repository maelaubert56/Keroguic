import { useState, useEffect, Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { toInputDate } from "@/utils/dateUtils";

const MDEditor = lazy(() => import("@uiw/react-md-editor"));

const AddArticle = () => {
  const { user: me, isAuthenticated } = useAuth();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState({
    title: "",
    published: true,
    content: "",
    date: toInputDate(new Date()),
    author: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/admin";
      return;
    }

    // Set current user as default author first
    if (me?.id) {
      setPost(prev => ({
        ...prev,
        author: me.id.toString()
      }));
    }

    // Fetch authors
    fetch(`${import.meta.env.VITE_API_URL}/users/all`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        if (res.status === 403) {
          return [me];
        }
        return res.json();
      })
      .then((data) => {
        setAuthors(Array.isArray(data) ? data : [me]);
        // Ensure the default author is set again after authors are loaded
        if (me?.id) {
          setPost(prev => ({
            ...prev,
            author: me.id.toString()
          }));
        }
      })
      .catch(() => {
        setAuthors([me]);
        if (me?.id) {
          setPost(prev => ({
            ...prev,
            author: me.id.toString()
          }));
        }
      });
  }, [me, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!post.title.trim() || !post.content.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(post),
      });

      if (response.ok) {
        toast.success("Article créé avec succès");
        window.location.href = "/admin";
      } else {
        const error = await response.json();
        toast.error(error.message || "Erreur lors de la création");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div>Redirection...</div>;
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
            <CardTitle>Nouvel Article</CardTitle>
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
                  {loading ? "Création..." : "Créer l'article"}
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

export default AddArticle;
