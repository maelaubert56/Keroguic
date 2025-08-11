/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Edit, Trash2, Plus, Eye } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import { usePagination } from "@/hooks/usePagination";
import { getPaginationRange } from "@/utils/pagination";
import { formatDate } from "@/utils/dateUtils";

const ArticleComponent = ({ me }) => {
  const [onlyMyPosts, setOnlyMyPosts] = useState(false);
  const [openDeleteArticle, setOpenDeleteArticle] = useState(null);
  const { page, setPage } = usePagination(1);

  const { data, loading, error, refetch } = useFetch(
    `${import.meta.env.VITE_API_URL}/posts/page/${page}?nb=5&all=true${onlyMyPosts ? `&author=${me?.id}` : ''}`,
    {
      method: "GET",
      headers: { Authorization: localStorage.getItem("token") },
    },
    [page, onlyMyPosts, me?.id]
  );

  const articles = data?.posts || [];
  const totalPages = data?.totalPages || 1;
  const totalPosts = data?.totalPosts || 0;

  const onDeleteArticle = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: localStorage.getItem("token") },
      });
      
      if (response.ok) {
        setOpenDeleteArticle(null);
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
          <span>Articles ({totalPosts})</span>
          <div className="flex gap-2">
            <Button
              variant={onlyMyPosts ? "default" : "outline"}
              onClick={() => setOnlyMyPosts(!onlyMyPosts)}
              
            >
              Mes articles
            </Button>
            <Button asChild>
              <a href="/admin/article/add">
                <Plus className="w-4 h-4 mr-2" />
                Nouvel article
              </a>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Auteur</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell>{article.author?.name}</TableCell>
                <TableCell>{formatDate(article.date || article.createdAt)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${article.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {article.published ? 'Publié' : 'Brouillon'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/blog/${article.id}`}>
                        <Eye className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/admin/article/edit/${article.id}`}>
                        <Edit className="w-4 h-4" />
                      </a>
                    </Button>
                    {(me?.privilege === "admin" || me?.privilege === "owner" || article.author?.id === me?.id) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setOpenDeleteArticle(article)}
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

      {/* Dialog de confirmation de suppression */}
      <Dialog open={!!openDeleteArticle} onOpenChange={() => setOpenDeleteArticle(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l&apos;article &quot;{openDeleteArticle?.title}&quot; ? 
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteArticle(null)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => onDeleteArticle(openDeleteArticle.id)}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ArticleComponent;
