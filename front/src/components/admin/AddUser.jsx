import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, UserPlus, Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

const AddUser = () => {
  const { user: me, isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    privilege: "author",
  });

  // Afficher un loader pendant le chargement de l'authentification
  if (authLoading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  if (!isAuthenticated) {
    window.location.href = "/admin";
    return <div>Redirection...</div>;
  }

  // Check if current user has admin privileges
  if (me?.privilege !== "admin" && me?.privilege !== "owner") {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Vous n&apos;avez pas les droits pour ajouter des utilisateurs.</p>
            <Button asChild className="mt-4">
              <a href="/admin">Retour à l&apos;admin</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user.name.trim() || !user.email.trim() || !user.password.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (user.email.trim().length < 3) {
      toast.error("Le nom d'utilisateur doit contenir au moins 3 caractères");
      return;
    }

    if (user.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);
    
    try {
      // Utiliser FormData comme dans l'ancien code
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("username", user.email); // L'API attend 'username'
      formData.append("password", user.password);
      formData.append("privilege", user.privilege);
      
      // Ajouter le fichier si sélectionné
      if (selectedFile) {
        formData.append("picture", selectedFile);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/add`, {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        body: formData,
      });

      if (response.ok) {
        toast.success("Utilisateur créé avec succès");
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const getFilePreview = () => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6">
        <Button variant="outline" asChild className="mb-4">
          <a href="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l&apos;admin
          </a>
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Ajouter un Utilisateur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  value={user.name}
                  onChange={(e) => setUser({...user, name: e.target.value})}
                  placeholder="Nom et prénom"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Nom d&apos;utilisateur *</Label>
                <Input
                  id="username"
                  type="text"
                  value={user.email}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                  placeholder="nom_utilisateur"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe *</Label>
                <Input
                  id="password"
                  type="password"
                  value={user.password}
                  onChange={(e) => setUser({...user, password: e.target.value})}
                  placeholder="Minimum 6 caractères"
                  minLength={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="privilege">Privilèges</Label>
                <Select value={user.privilege} onValueChange={(value) => setUser({...user, privilege: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le niveau de privilège" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="author">Auteur</SelectItem>
                    <SelectItem value="editor">Éditeur</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    {me?.privilege === "owner" && (
                      <SelectItem value="owner">Propriétaire</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Photo de profil (optionnel)</Label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {selectedFile ? (
                    <div className="space-y-2">
                      <img
                        src={getFilePreview()}
                        alt="Aperçu"
                        className="w-16 h-16 rounded-full mx-auto object-cover"
                      />
                      <p className="text-sm text-gray-600">{selectedFile.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Cliquez pour sélectionner une photo
                      </p>
                      <p className="text-xs text-gray-500">
                        JPG, PNG (max 5MB) - Optionnel
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Création..." : "Créer l'utilisateur"}
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

export default AddUser;
