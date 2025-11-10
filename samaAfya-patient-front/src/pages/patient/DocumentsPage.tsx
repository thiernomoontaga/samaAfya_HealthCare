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
      <Card key={doc.id} className="hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-purple-200 bg-gradient-to-br from-white to-gray-50/50 group cursor-pointer">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className="h-5 w-5 text-purple-600" />
              </div>
              <Badge variant="outline" className={`${config.color} font-medium`}>
                {config.label}
              </Badge>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Download className="h-4 w-4 text-gray-600" />
            </div>
          </div>
          <CardTitle className="text-lg leading-tight text-gray-900 group-hover:text-purple-900 transition-colors">
            {doc.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="font-medium">
                {format(new Date(doc.date), "d MMMM yyyy", { locale: fr })}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
                onClick={() => handleDownload(doc)}
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="px-3 text-gray-500 hover:text-purple-600"
              >
                👁️
              </Button>
            </div>
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
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center mx-auto shadow-lg">
              <Heart className="h-10 w-10 text-white animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-spin">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Mes documents médicaux 💕
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Tous vos documents de santé en un seul endroit, sécurisés et accessibles à tout moment
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FolderOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-blue-800 mb-2">Consulter</h3>
              <p className="text-sm text-blue-600">Accédez à vos documents médicaux</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Download className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-green-800 mb-2">Télécharger</h3>
              <p className="text-sm text-green-600">Sauvegardez vos documents</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-purple-800 mb-2">Uploader</h3>
              <p className="text-sm text-purple-600">Ajoutez vos propres documents</p>
            </CardContent>
          </Card>
        </div>

        {/* Header with Upload Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion de mes documents</h2>
            <p className="text-muted-foreground">Organisez et sécurisez vos documents de santé</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
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

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-blue-50 to-purple-50 p-1 rounded-xl">
            <TabsTrigger
              value="ordonnances"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <Pill className="h-3 w-3 text-blue-600" />
              </div>
              <span className="font-medium">Ordonnances</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs ml-1">
                {mockDocuments.ordonnances.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="resultats"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
            >
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <Stethoscope className="h-3 w-3 text-green-600" />
              </div>
              <span className="font-medium">Résultats</span>
              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs ml-1">
                {mockDocuments.resultats.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="conseils"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
            >
              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                <MessageSquare className="h-3 w-3 text-amber-600" />
              </div>
              <span className="font-medium">Conseils</span>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs ml-1">
                {mockDocuments.conseils.length}
              </Badge>
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

        {/* Enhanced Statistics */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              Aperçu de votre dossier médical
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-3">
                  <Pill className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-blue-700 mb-1">
                  {mockDocuments.ordonnances.length}
                </div>
                <div className="text-sm text-blue-600 font-medium">Ordonnances</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-3">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-green-700 mb-1">
                  {mockDocuments.resultats.length}
                </div>
                <div className="text-sm text-green-600 font-medium">Résultats</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-amber-700 mb-1">
                  {mockDocuments.conseils.length}
                </div>
                <div className="text-sm text-amber-600 font-medium">Conseils</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mx-auto mb-3">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-purple-700 mb-1">
                  {mockDocuments.ordonnances.length + mockDocuments.resultats.length + mockDocuments.conseils.length}
                </div>
                <div className="text-sm text-purple-600 font-medium">Total sécurisé</div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-white/80 rounded-xl border border-purple-200">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-purple-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Sécurité garantie</p>
                  <p className="text-xs text-gray-600">Tous vos documents sont chiffrés et stockés en toute confidentialité</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
};

export default DocumentsPage;