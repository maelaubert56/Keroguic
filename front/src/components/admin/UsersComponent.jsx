/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { toast } from "react-toastify";

const UsersComponent = ({ me, users }) => {
  const [openDeleteUser, setOpenDeleteUser] = useState(null);

  const onDeleteUser = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      
      if (response.ok) {
        setOpenDeleteUser(null);
        window.location.reload();
        toast.success("Utilisateur supprimé avec succès");
      } else {
        toast.error("Erreur lors de la suppression de l'utilisateur");
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression: " + error.message);
    }
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

  if (me?.privilege !== "admin" && me?.privilege !== "owner") {
    return null;
  }

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Utilisateurs ({users?.length || 0})</span>
          <Button asChild>
            <a href="/admin/user/add">
              <UserPlus className="w-4 h-4 mr-2" />
              Nouvel utilisateur
            </a>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Nom d&apos;utilisateur</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Privilège</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage 
                      src={`${import.meta.env.VITE_API_URL}/uploads/pp/${user.picture}`} 
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {user.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">@{user.username}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>
                  <Badge variant={getPrivilegeVariant(user.privilege)}>
                    {getPrivilegeLabel(user.privilege)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/admin/user/edit/${user.id}`}>
                        <Edit className="w-4 h-4" />
                      </a>
                    </Button>
                    {user.privilege !== "owner" && me?.privilege === "owner" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setOpenDeleteUser(user)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={!!openDeleteUser} onOpenChange={() => setOpenDeleteUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l&apos;utilisateur &quot;{openDeleteUser?.name}&quot; ? 
              Cette action est irréversible. Tous ses articles et médias seront réattribués à votre compte avant suppression.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteUser(null)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => onDeleteUser(openDeleteUser.id)}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UsersComponent;
