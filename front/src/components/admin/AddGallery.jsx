import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

const AddGallery = () => {
  const { user: me, isAuthenticated } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [gallery, setGallery] = useState({
    title: "",
    published: true,
    date: new Date().toISOString().split('T')[0],
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
            
            // Set current user as default author AFTER loading authors
            if (me?.id && !gallery.author) {
              setGallery(prev => ({ ...prev, author: me.id.toString() }));
            }
            
            console.log("Authors loaded:", data.length, "Current user privilege:", me?.privilege, "Default author set to:", me?.id);
          }
        } catch (error) {
          console.error("Erreur lors du chargement des auteurs:", error);
        }
      } else {
        console.log("User privilege:", me?.privilege, "- No author selector");
        // For non-privileged users, still set the current user as author
        if (me?.id && !gallery.author) {
          setGallery(prev => ({ ...prev, author: me.id.toString() }));
        }
      }
    };

    // Only fetch authors if we have user data
    if (me?.id) {
      fetchAuthors();
    }
  }, [isAuthenticated, me?.id, me?.privilege, gallery.author]);

  if (!isAuthenticated) {
    window.location.href = "/admin";
    return <div>Redirection...</div>;
  }

  // Debug log
  console.log("AddGallery - me:", me, "privilege:", me?.privilege, "authors:", authors.length);

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

    if (selectedFiles.length === 0) {
      toast.error("Veuillez sélectionner un média");
      return;
    }

    setLoading(true);
    
    console.log("Submitting gallery with author:", gallery.author, "me privilege:", me?.privilege);
    
    try {
      const formData = new FormData();
      formData.append("title", gallery.title);
      formData.append("published", gallery.published.toString());
      formData.append("date", gallery.date);
      
      // Always add author if it exists (not just for privileged users)
      if (gallery.author) {
        formData.append("author", gallery.author);
        console.log("Adding author to formData:", gallery.author);
      } else {
        console.log("No author to add");
      }
      
      // Add media files
      selectedFiles.forEach((file) => {
        formData.append("media", file);
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/gallery`, {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        body: formData,
      });

      if (response.ok) {
        toast.success("Média créé avec succès");
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

  const getFilePreview = (file) => {
    return URL.createObjectURL(file);
  };

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
            <CardTitle>Ajouter un Média</CardTitle>
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

              <div className="space-y-2">
                <Label>Média *</Label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Cliquez pour sélectionner un média
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
                  <Label>Aperçu du média</Label>
                  <div className="flex justify-center">
                    <div className="relative">
                      <img
                        src={getFilePreview(selectedFiles[0])}
                        alt="Aperçu du média"
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
                  {loading ? "Création..." : "Créer le média"}
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

export default AddGallery;
