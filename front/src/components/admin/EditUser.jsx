import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Trash2, User, Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

const EditUser = () => {
  const { id } = useParams();
  const { user: me, isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentProfilePicture, setCurrentProfilePicture] = useState("");
  const fileInputRef = useRef(null);
  const [user, setUser] = useState({
    name: "",
    email: "",
    privilege: "author",
    active: true,
    password: "", // New password if changing
  });

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      window.location.href = "/admin";
      return;
    }

    if (authLoading || !me) {
      return; // Attendre que l'authentification soit chargée
    }

    // Check if current user has admin privileges or is editing themselves
    if (me?.privilege !== "admin" && me?.privilege !== "owner" && me?.id !== parseInt(id)) {
      window.location.href = "/admin";
      return;
    }

    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/single/${id}`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser({
            name: data.name,
            email: data.email || data.username || "", // L'API peut utiliser username
            privilege: data.privilege,
            active: data.active !== false, // Par défaut true si pas défini
            password: "",
          });
          setCurrentProfilePicture(data.picture || "");
        } else {
          toast.error("Utilisateur non trouvé");
          window.location.href = "/admin";
        }
      } catch (error) {
        toast.error("Erreur lors du chargement");
        window.location.href = "/admin";
      } finally {
        setInitialLoading(false);
      }
    };

    if (me) {
      fetchUser();
    }
  }, [id, me, isAuthenticated, authLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user.name.trim() || !user.email.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (user.email.trim().length < 3) {
      toast.error("Le nom d'utilisateur doit contenir au moins 3 caractères");
      return;
    }

    if (user.password && user.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);
    
    try {
      // Utiliser FormData comme dans l'ancien code
      const formData = new FormData();
      formData.append("name", user.name);
      if (user.password.trim()) {
        formData.append("password", user.password);
      }
      formData.append("privilege", user.privilege);
      
      // Ajouter la nouvelle photo de profil si elle existe
      if (selectedFile) {
        formData.append("picture", selectedFile);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/edit/${id}`, {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        body: formData,
      });

      if (response.ok) {
        toast.success("Utilisateur modifié avec succès");
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
    if (parseInt(id) === me?.id) {
      toast.error("Vous ne pouvez pas supprimer votre propre compte");
      return;
    }

    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: localStorage.getItem("token") },
      });

      if (response.ok) {
        toast.success("Utilisateur supprimé avec succès");
        window.location.href = "/admin";
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
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

  if (authLoading) {
    return <div className="flex justify-center items-center h-64">Chargement de l&apos;authentification...</div>;
  }

  if (!isAuthenticated) {
    return <div>Redirection...</div>;
  }

  if (initialLoading) {
    return <div className="flex justify-center items-center h-64">Chargement de l&apos;utilisateur...</div>;
  }

  const isEditingSelf = me?.id === parseInt(id);
  const canEditPrivileges = (me?.privilege === "admin" || me?.privilege === "owner") && !isEditingSelf;
  const canDelete = (me?.privilege === "admin" || me?.privilege === "owner") && !isEditingSelf;

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
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                {isEditingSelf ? "Modifier mon profil" : "Modifier l'utilisateur"}
              </div>
              {canDelete && (
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
              )}
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
                <Label htmlFor="password">
                  {isEditingSelf ? "Nouveau mot de passe" : "Nouveau mot de passe"}
                  <span className="text-sm text-gray-500 ml-1">(laisser vide pour ne pas changer)</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={user.password}
                  onChange={(e) => setUser({...user, password: e.target.value})}
                  placeholder="Minimum 6 caractères"
                  minLength={6}
                />
              </div>

              {canEditPrivileges && (
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
              )}

              <div className="space-y-2">
                <Label>Photo de profil</Label>
                <div className="flex items-center space-x-4">
                  {currentProfilePicture && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Photo actuelle :</p>
                      <img
                        src={`${import.meta.env.VITE_API_URL}/uploads/pp/${currentProfilePicture}`}
                        alt="Photo actuelle"
                        className="w-16 h-16 rounded-full object-cover border"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
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
                          <p className="text-sm text-gray-600">Nouvelle photo : {selectedFile.name}</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">
                            Cliquez pour changer la photo
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
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Modification..." : "Modifier l'utilisateur"}
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

export default EditUser;
