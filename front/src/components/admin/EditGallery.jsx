import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

const EditGallery = () => {
  const { id } = useParams();
  const { user: me, isAuthenticated } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [gallery, setGallery] = useState({
    title: "",
    published: false,
    media: "",
    date: "",
    author: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/admin";
      return;
    }

    // Fetch authors for privileged users
    const fetchAuthors = async () => {
      if (me?.privilege === "owner" || me?.privilege === "admin" || me?.privilege === "editor") {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/users/all`, {
            headers: { Authorization: localStorage.getItem("token") },
          });
          if (response.ok) {
            const data = await response.json();
            setAuthors(data);
            console.log("Authors loaded:", data.length, "Current user privilege:", me?.privilege);
          }
        } catch (error) {
          console.error("Erreur lors du chargement des auteurs:", error);
        }
      } else {
        console.log("User privilege:", me?.privilege, "- No author selector");
      }
    };

    // Fetch gallery data
    const fetchGallery = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/gallery/${id}`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        
        if (response.ok) {
          const data = await response.json();
          setGallery({
            title: data.title || "",
            published: data.published || false,
            media: data.media || "",
            date: data.date ? new Date(data.date).toISOString().split('T')[0] : "",
            author: data.authorId || (data.author ? data.author.id.toString() : me?.id?.toString() || ""),
          });
          // Pour un seul média, on peut montrer l'image existante
          if (data.media) {
            setExistingImages([{
              name: data.media,
              url: `${import.meta.env.VITE_API_URL}/uploads/gallery/${data.media}`
            }]);
          }
        } else {
          toast.error("Galerie non trouvée");
          window.location.href = "/admin";
        }
      } catch (error) {
        toast.error("Erreur lors du chargement");
        window.location.href = "/admin";
      } finally {
        setInitialLoading(false);
      }
    };

    fetchAuthors();
    fetchGallery();
  }, [id, isAuthenticated, me?.privilege, me?.id]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files.slice(0, 1)); // Only take the first file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!gallery.title.trim()) {
      toast.error("Veuillez saisir un titre pour le média");
      return;
    }

    setLoading(true);
    
    console.log("Editing gallery with authorId:", gallery.authorId, "me privilege:", me?.privilege);
    
    try {
      const formData = new FormData();
      formData.append("title", gallery.title);
      formData.append("published", gallery.published.toString());
      formData.append("date", gallery.date);
      
      // Always add authorId if it exists (not just for privileged users)
      if (gallery.author) {
        formData.append("author", gallery.author);
        console.log("Adding author to formData:", gallery.author);
      } else {
        console.log("No author to add");
      }
      
      // Add new media file if selected
      if (selectedFiles.length > 0) {
        formData.append("media", selectedFiles[0]); // Only one file for gallery items
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/gallery/${id}`, {
        method: "PUT",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        body: formData,
      });

      if (response.ok) {
        toast.success("Média modifié avec succès");
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
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce média ?")) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: localStorage.getItem("token") },
      });

      if (response.ok) {
        toast.success("Média supprimé avec succès");
        window.location.href = "/admin";
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    }
  };

  const getFilePreview = (file) => {
    return URL.createObjectURL(file);
  };

  if (!isAuthenticated) {
    return <div>Redirection...</div>;
  }

  if (initialLoading) {
    return <div className="flex justify-center items-center h-64">Chargement de la galerie...</div>;
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
              <span>Modifier le média</span>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre du média *</Label>
                  <Input
                    id="title"
                    value={gallery.title}
                    onChange={(e) => setGallery({...gallery, title: e.target.value})}
                    placeholder="Titre du média"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={gallery.date}
                    onChange={(e) => setGallery({...gallery, date: e.target.value})}
                  />
                </div>

                {(me?.privilege === "owner" || me?.privilege === "admin" || me?.privilege === "editor") && (
                  <div className="space-y-2">
                    <Label htmlFor="author">Auteur</Label>
                    <Select
                      value={gallery.author}
                      onValueChange={(value) => setGallery({...gallery, author: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un auteur" />
                      </SelectTrigger>
                      <SelectContent>
                        {authors.map((author) => (
                          <SelectItem key={author.id} value={author.id.toString()}>
                            {author.name}{author.id === me?.id ? " (vous)" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={gallery.published}
                    onCheckedChange={(checked) => setGallery({...gallery, published: checked})}
                  />
                  <Label htmlFor="published">Publié</Label>
                </div>
              </div>

              {existingImages.length > 0 && (
                <div className="space-y-2">
                  <Label>Média actuel</Label>
                  <div className="flex justify-center">
                    <div className="relative group">
                      <img
                        src={existingImages[0].url}
                        alt="Média actuel"
                        className="max-w-sm max-h-64 object-cover rounded-lg border"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Remplacer le média</Label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Cliquez pour sélectionner un nouveau média
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés: JPG, PNG, GIF, MP4, MOV (max 10MB)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Nouveau média sélectionné</Label>
                  <div className="flex justify-center">
                    <div className="relative">
                      <img
                        src={getFilePreview(selectedFiles[0])}
                        alt="Preview du nouveau média"
                        className="max-w-sm max-h-64 object-cover rounded-lg border"
                      />
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {selectedFiles[0].name}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Modification..." : "Modifier le média"}
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

export default EditGallery;
