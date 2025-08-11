/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Edit, Download, Upload } from "lucide-react";
import { toast } from "react-toastify";

const MeComponent = ({ me }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleBackup = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/data/save`, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `backup-${new Date().toISOString().split('T')[0]}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("Sauvegarde téléchargée avec succès");
      }
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const handleRestore = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.zip';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/data/restore`, {
            method: "POST",
            headers: {
              Authorization: localStorage.getItem("token"),
            },
            body: formData,
          });
          
          if (response.ok) {
            toast.success("Restauration effectuée avec succès");
            setTimeout(() => window.location.reload(), 2000);
          } else {
            toast.error("Erreur lors de la restauration");
          }
        } catch (error) {
          toast.error("Erreur lors de la restauration");
        }
      }
    };
    input.click();
  };

  const getPrivilegeLabel = (privilege) => {
    switch (privilege) {
      case "owner": return "Propriétaire";
      case "admin": return "Administrateur";
      case "editor": return "Éditeur";
      case "author": return "Auteur";
      default: return privilege;
    }
  };

  const getPrivilegeVariant = (privilege) => {
    switch (privilege) {
      case "owner": return "destructive";
      case "admin": return "default";
      case "editor": return "secondary";
      case "author": return "outline";
      default: return "outline";
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Mon Profil</span>
          <Badge variant={getPrivilegeVariant(me?.privilege)}>
            {getPrivilegeLabel(me?.privilege)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="w-20 h-20">
            <AvatarImage 
              src={`${import.meta.env.VITE_API_URL}/uploads/pp/${me?.picture}`} 
              alt={me?.name}
            />
            <AvatarFallback>
              {me?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{me?.name}</h3>
            <p className="text-muted-foreground">@{me?.username}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Se déconnecter
          </Button>
          
          <Button variant="outline" asChild>
            <a href={`/admin/user/edit/${me?.id}`}>
              <Edit className="w-4 h-4 mr-2" />
              Modifier mon profil
            </a>
          </Button>

          {me?.privilege === "owner" && (
            <>
              <Button variant="outline" onClick={handleBackup}>
                <Download className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
              
              <Button variant="outline" onClick={handleRestore}>
                <Upload className="w-4 h-4 mr-2" />
                Restaurer
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MeComponent;
