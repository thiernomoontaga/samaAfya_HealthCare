import { useState } from "react";
import { PatientLayout } from "@/components/layout/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Download, Upload, Search, File, Calendar, Pill, Stethoscope, MessageSquare, AlertTriangle } from "lucide-react";
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
      <Card key={doc.id} className="hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-primary" />
              <Badge variant="outline" className={config.color}>
                {config.label}
              </Badge>
            </div>
          </div>
          <CardTitle className="text-base leading-tight">{doc.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(doc.date), "d MMMM yyyy", { locale: fr })}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => handleDownload(doc)}
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger
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
    <PatientLayout title="Mes documents médicaux">
      <div className="space-y-6">
        {/* Header with Upload Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mes documents médicaux</h2>
            <p className="text-muted-foreground">Consultez et gérez vos documents de santé</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Upload className="h-4 w-4 mr-2" />
                Uploader un document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Uploader un document médical</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Formats acceptés: PDF, JPG, PNG, DOC, DOCX (max 10MB)
                  </p>
                </div>

                {uploadedFile && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium text-blue-900">{uploadedFile.name}</p>
                        <p className="text-sm text-blue-700">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setUploadedFile(null)}>
                    Annuler
                  </Button>
                  <Button
                    onClick={handleUploadConfirm}
                    disabled={!uploadedFile}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Uploader
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ordonnances" className="flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Ordonnances
            </TabsTrigger>
            <TabsTrigger value="resultats" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Résultats médicaux
            </TabsTrigger>
            <TabsTrigger value="conseils" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Conseils du médecin
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

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Statistiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {mockDocuments.ordonnances.length}
                </div>
                <div className="text-sm text-blue-700">Ordonnances</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {mockDocuments.resultats.length}
                </div>
                <div className="text-sm text-green-700">Résultats</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">
                  {mockDocuments.conseils.length}
                </div>
                <div className="text-sm text-amber-700">Conseils</div>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {mockDocuments.ordonnances.length + mockDocuments.resultats.length + mockDocuments.conseils.length}
                </div>
                <div className="text-sm text-primary/70">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
};

export default DocumentsPage;