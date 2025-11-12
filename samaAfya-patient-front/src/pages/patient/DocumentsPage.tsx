import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Download, Upload, Search, File, Calendar, Pill, Stethoscope, MessageSquare, AlertTriangle, Heart, Sparkles, FolderOpen, FileCheck, Clock, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const documentCategories = {
  ordonnances: {
    label: "Ordonnances",
    icon: Pill,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    description: "Vos prescriptions médicales"
  },
  resultats: {
    label: "Résultats médicaux",
    icon: Stethoscope,
    color: "bg-green-100 text-green-800 border-green-200",
    description: "Analyses et examens"
  },
  conseils: {
    label: "Conseils du médecin",
    icon: MessageSquare,
    color: "bg-amber-100 text-amber-800 border-amber-200",
    description: "Recommandations et consignes"
  }
};

// Mock data for documents
const mockDocuments = {
  ordonnances: [
    {
      id: "ord1",
      title: "Ordonnance initiale - Diabète gestationnel",
      date: "2024-12-15",
      type: "ordonnance",
      url: "#"
    },
    {
      id: "ord2",
      title: "Prescription - Contrôle glycémique",
      date: "2025-01-10",
      type: "ordonnance",
      url: "#"
    }
  ],
  resultats: [
    {
      id: "res1",
      title: "Résultats glycémie à jeun",
      date: "2025-01-10",
      type: "resultat",
      url: "#"
    },
    {
      id: "res2",
      title: "Échographie T3 - Développement fœtal",
      date: "2025-01-05",
      type: "resultat",
      url: "#"
    },
    {
      id: "res3",
      title: "Bilan sanguin complet",
      date: "2024-12-20",
      type: "resultat",
      url: "#"
    }
  ],
  conseils: [
    {
      id: "cons1",
      title: "Consignes alimentaires - Diabète gestationnel",
      date: "2024-12-20",
      type: "consigne",
      url: "#"
    },
    {
      id: "cons2",
      title: "Guide d'autosurveillance glycémique",
      date: "2024-12-15",
      type: "consigne",
      url: "#"
    }
  ]
};

const DocumentsPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("ordonnances");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDownload = async (doc: { title: string }) => {
    try {
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Téléchargement réussi",
        description: `${doc.title} a été téléchargé.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "Fichier sélectionné",
        description: `${file.name} prêt à être uploadé.`,
      });
    }
  };

  const handleUploadConfirm = async () => {
    if (!uploadedFile) return;

    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Upload réussi",
        description: `${uploadedFile.name} a été ajouté à vos documents.`,
      });
      setUploadedFile(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'uploader le document.",
        variant: "destructive",
      });
    }
  };

  const renderDocumentCard = (doc: { id: string; title: string; date: string }, category: string) => {
    const config = documentCategories[category as keyof typeof documentCategories];
    const Icon = config.icon;

    return (
      <Card key={doc.id} className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-primary/20 bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{doc.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(doc.date), "d MMMM yyyy", { locale: fr })}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
              {config.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => handleDownload(doc)}
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
            <Button variant="ghost" size="sm">
              👁️
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const getFilteredDocuments = (category: string) => {
    const docs = mockDocuments[category as keyof typeof mockDocuments] || [];
    return docs.filter(doc =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="space-y-8 mt-8">
      {/* Hero / Welcome Section */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-foreground">
              Mes documents médicaux
            </h2>
            <p className="text-muted-foreground text-xl">
              Accès sécurisé à tous vos documents de santé - {Object.values(mockDocuments).flat().length} document{Object.values(mockDocuments).flat().length !== 1 ? 's' : ''} stocké{Object.values(mockDocuments).flat().length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-foreground font-medium">Chiffrés</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <span className="text-foreground font-medium">RGPD compliant</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="text-foreground font-medium">24/7 accessible</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-16 w-16 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Ordonnances</p>
                <p className="text-2xl font-bold text-primary">{mockDocuments.ordonnances.length}</p>
                <p className="text-xs text-muted-foreground mt-2">Documents actifs</p>
              </div>
              <div className="p-4 rounded-2xl bg-primary/20">
                <Pill className="h-8 w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-accent/20 bg-gradient-to-br from-accent/10 to-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Résultats</p>
                <p className="text-2xl font-bold text-accent-foreground">{mockDocuments.resultats.length}</p>
                <p className="text-xs text-muted-foreground mt-2">Examens médicaux</p>
              </div>
              <div className="p-4 rounded-2xl bg-accent/30">
                <Stethoscope className="h-8 w-8 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-secondary/20 bg-gradient-to-br from-secondary/10 to-secondary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Conseils</p>
                <p className="text-2xl font-bold text-secondary-foreground">{mockDocuments.conseils.length}</p>
                <p className="text-xs text-muted-foreground mt-2">Recommandations</p>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/30">
                <MessageSquare className="h-8 w-8 text-secondary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-green-200/50 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Sécurité</p>
                <p className="text-2xl font-bold text-green-600">RGPD</p>
                <p className="text-xs text-muted-foreground mt-2">Données protégées</p>
              </div>
              <div className="p-4 rounded-2xl bg-green-200">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestion de mes documents</h2>
          <p className="text-muted-foreground">Organisez et sécurisez vos documents de santé</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Ajouter un document
            </Button>
          </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-white" />
                  </div>
                  Ajouter un document médical
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors cursor-pointer bg-gray-50 hover:bg-purple-50/50">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm font-medium text-gray-700 mb-2">Cliquez pour sélectionner un fichier</p>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileUpload}
                      className="cursor-pointer opacity-0 absolute inset-0 w-full h-full"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Shield className="h-3 w-3" />
                    <span>Formats acceptés: PDF, JPG, PNG, DOC, DOCX (max 10MB)</span>
                  </div>
                </div>

                {uploadedFile && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
                        <FileCheck className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-600">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Prêt à uploader
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUploadedFile(null)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setUploadedFile(null)} className="border-gray-300">
                    Annuler
                  </Button>
                  <Button
                    onClick={handleUploadConfirm}
                    disabled={!uploadedFile}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Uploader le document
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

      {/* Search */}
      <Card className="shadow-sm border-border/50">
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher un document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Document Categories */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ordonnances" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            Ordonnances ({mockDocuments.ordonnances.length})
          </TabsTrigger>
          <TabsTrigger value="resultats" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Résultats ({mockDocuments.resultats.length})
          </TabsTrigger>
          <TabsTrigger value="conseils" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Conseils ({mockDocuments.conseils.length})
          </TabsTrigger>
        </TabsList>

          {/* Ordonnances Tab */}
          <TabsContent value="ordonnances" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredDocuments("ordonnances").map((doc) => renderDocumentCard(doc, "ordonnances"))}
            </div>
            {getFilteredDocuments("ordonnances").length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Pill className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      Aucune ordonnance trouvée
                    </h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? "Essayez de modifier vos critères de recherche." : "Vous n'avez encore aucune ordonnance."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Résultats médicaux Tab */}
          <TabsContent value="resultats" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredDocuments("resultats").map((doc) => renderDocumentCard(doc, "resultats"))}
            </div>
            {getFilteredDocuments("resultats").length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      Aucun résultat trouvé
                    </h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? "Essayez de modifier vos critères de recherche." : "Vous n'avez encore aucun résultat médical."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Conseils du médecin Tab */}
          <TabsContent value="conseils" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredDocuments("conseils").map((doc) => renderDocumentCard(doc, "conseils"))}
            </div>
            {getFilteredDocuments("conseils").length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      Aucun conseil trouvé
                    </h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? "Essayez de modifier vos critères de recherche." : "Vous n'avez encore aucun conseil médical."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

      {/* Summary */}
      <Card className="shadow-sm border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-8 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-foreground">Dossier médical sécurisé</h3>
              <p className="text-muted-foreground text-lg">
                {mockDocuments.ordonnances.length + mockDocuments.resultats.length + mockDocuments.conseils.length} documents stockés en toute sécurité
              </p>
            </div>
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-foreground font-medium">Chiffrés</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <span className="text-foreground font-medium">RGPD compliant</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="text-foreground font-medium">24/7 accessible</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsPage;