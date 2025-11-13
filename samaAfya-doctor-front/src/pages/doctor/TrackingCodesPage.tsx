import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Copy, Mail, Phone, CheckCircle, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import GenerateTrackingCode from '@/components/doctor/GenerateTrackingCode';

interface TrackingCode {
  id: string;
  code: string;
  doctorId: string;
  createdAt: string;
  sentTo: string;
  sentBy: 'email' | 'sms';
  isActive: boolean;
}

const ITEMS_PER_PAGE = 10;

const TrackingCodesPage = () => {
  const [codes, setCodes] = useState<TrackingCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const API_BASE_URL = 'http://localhost:3001';

  const fetchCodes = async () => {
    try {
      const doctorAuth = localStorage.getItem('doctorAuth');
      if (!doctorAuth) return;

      const { id: doctorId } = JSON.parse(doctorAuth);
      const response = await fetch(`${API_BASE_URL}/trackingCodes?doctorId=${doctorId}`);
      const data = await response.json();
      setCodes(data);
    } catch (error) {
      console.error('Error fetching codes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les codes de suivi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copié",
      description: `Code ${code} copié dans le presse-papiers`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalPages = Math.ceil(codes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCodes = codes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-8 mt-8">
      {/* Hero / Welcome Section */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-foreground">
              Gestion des codes de suivi médical
            </h2>
            <p className="text-muted-foreground text-xl">
              Créez et gérez les codes de suivi pour lier vos patientes à votre suivi médical - {codes.length} code{codes.length !== 1 ? 's' : ''} généré{codes.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-foreground font-medium">Codes uniques</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <span className="text-foreground font-medium">Suivi sécurisé</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="text-foreground font-medium">Liaison automatique</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-16 w-16 text-primary" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Generate Code Section */}
        <Card className="lg:col-span-1 shadow-sm border-border/50">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Nouveau code</CardTitle>
                <CardDescription className="text-sm">
                  Générer un code pour une nouvelle patiente
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <GenerateTrackingCode
              doctorId={JSON.parse(localStorage.getItem('doctorAuth') || '{}').id}
              onCodeGenerated={fetchCodes}
            />
          </CardContent>
        </Card>

        {/* Codes List */}
        <Card className="lg:col-span-3 shadow-sm border-border/50">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Codes générés</CardTitle>
                <CardDescription className="text-base">
                  {codes.length === 0
                    ? 'Aucun code généré'
                    : `${codes.length} code${codes.length > 1 ? 's' : ''} • Page ${currentPage} sur ${totalPages}`
                  }
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
                <p className="text-muted-foreground">Chargement des codes...</p>
              </div>
            ) : codes.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Aucun code généré
                </h3>
                <p className="text-gray-500 text-sm">
                  Commencez par générer votre premier code de suivi médical
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Code</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Date de création</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Mode d'envoi</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Destinataire</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Statut</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCodes.map((code) => (
                        <tr key={code.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-primary">{code.code}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-muted-foreground">
                              {formatDate(code.createdAt)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {code.sentBy === 'email' ? (
                                <Mail className="h-4 w-4 text-blue-500" />
                              ) : (
                                <Phone className="h-4 w-4 text-green-500" />
                              )}
                              <span className="text-sm capitalize">{code.sentBy}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-muted-foreground">{code.sentTo}</span>
                          </td>
                          <td className="py-4 px-4">
                            <Badge
                              className={`px-3 py-1 text-xs font-medium ${
                                code.isActive
                                  ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                              }`}
                            >
                              {code.isActive ? 'Actif' : 'Expiré'}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(code.code)}
                              className="rounded-lg hover:bg-primary/10"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackingCodesPage;