/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Edit, Trash2, Plus, Eye, Copy, Play } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import { usePagination } from "@/hooks/usePagination";
import { getPaginationRange } from "@/utils/pagination";
import { formatDate } from "@/utils/dateUtils";
import { toast } from "react-toastify";

const GalleryComponent = ({ me }) => {
  const [onlyMyMedias, setOnlyMyMedias] = useState(false);
  const [openDeleteMedia, setOpenDeleteMedia] = useState(null);
  const [openPreviewMedia, setOpenPreviewMedia] = useState(null);
  const { page, setPage } = usePagination(1);

  const { data, loading, error, refetch } = useFetch(
    `${import.meta.env.VITE_API_URL}/gallery/page/${page}?nb=5&all=true${onlyMyMedias ? `&author=${me?.id}` : ''}`,
    {
      method: "GET",
      headers: { Authorization: localStorage.getItem("token") },
    },
    [page, onlyMyMedias, me?.id]
  );

  const medias = data?.medias || [];
  const totalPages = data?.totalPages || 1;
  const totalMedias = data?.totalMedias || 0;

  const copyMediaLink = async (media) => {
    const mediaUrl = `${import.meta.env.VITE_API_URL}/uploads/gallery/${media.media}`;
    try {
      await navigator.clipboard.writeText(mediaUrl);
      toast.success("Lien copié dans le presse-papiers !");
    } catch (error) {
      toast.error("Erreur lors de la copie du lien");
    }
  };

  const isVideo = (filename) => {
    const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv', '.wmv'];
    return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  const onDeleteMedia = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: localStorage.getItem("token") },
      });
      
      if (response.ok) {
        setOpenDeleteMedia(null);
        refetch();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  if (loading) return <div className="flex justify-center p-8">Chargement...</div>;
  if (error) return <Alert><AlertDescription>Erreur: {error.message}</AlertDescription></Alert>;

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Galerie ({totalMedias})</span>
          <div className="flex gap-2">
            <Button
              variant={onlyMyMedias ? "default" : "outline"}
              onClick={() => setOnlyMyMedias(!onlyMyMedias)}
            >
              Mes médias
            </Button>
            <Button asChild>
              <a href="/admin/gallery/add">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau média
              </a>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aperçu</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Auteur</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Publié</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medias.map((media) => (
              <TableRow key={media.id}>
                <TableCell>
                  <div className="relative">
                    <img 
                      src={`${import.meta.env.VITE_API_URL}/uploads/gallery/${media.media}`}
                      alt={media.title}
                      className="w-12 h-12 object-cover rounded cursor-pointer"
                      onClick={() => setOpenPreviewMedia(media)}
                    />
                    {isVideo(media.media) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded cursor-pointer" onClick={() => setOpenPreviewMedia(media)}>
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{media.title}</TableCell>
                <TableCell>{media.author?.name}</TableCell>
                <TableCell>{formatDate(media.date || media.createdAt)}</TableCell>
                <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${media.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {media.published ? 'Publié' : 'Brouillon'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setOpenPreviewMedia(media)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyMediaLink(media)}
                      title="Copier le lien"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/admin/gallery/edit/${media.id}`}>
                        <Edit className="w-4 h-4" />
                      </a>
                    </Button>
                    {(me?.privilege === "admin" || me?.privilege === "owner" || media.author?.id === me?.id) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setOpenDeleteMedia(media)}
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

        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => page > 1 && setPage(page - 1)}
                    className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {getPaginationRange(page, totalPages).map((pageNum, index) => (
                  <PaginationItem key={index}>
                    {pageNum === '...' ? (
                      <span className="px-3 py-2">...</span>
                    ) : (
                      <PaginationLink
                        onClick={() => setPage(pageNum)}
                        isActive={page === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => page < totalPages && setPage(page + 1)}
                    className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>

      {/* Dialog de prévisualisation */}
      <Dialog open={!!openPreviewMedia} onOpenChange={() => setOpenPreviewMedia(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{openPreviewMedia?.title}</DialogTitle>
            <DialogDescription>{openPreviewMedia?.author?.name}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <img 
              src={`${import.meta.env.VITE_API_URL}/uploads/gallery/${openPreviewMedia?.media}`}
              alt={openPreviewMedia?.title}
              className="max-w-full max-h-96 object-contain rounded"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={!!openDeleteMedia} onOpenChange={() => setOpenDeleteMedia(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le média &quot;{openDeleteMedia?.title}&quot; ? 
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteMedia(null)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => onDeleteMedia(openDeleteMedia.id)}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default GalleryComponent;
