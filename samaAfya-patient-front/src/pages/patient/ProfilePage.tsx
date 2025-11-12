import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Settings,
  Bell,
  Shield,
  Save,
  Camera,
  Sparkles,
  Flower2,
  Moon,
  Star,
  CheckCircle,
  Lock,
  Award,
  Baby
} from "lucide-react";
import { currentPatient } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const ProfilePage = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentPatient.firstName,
    lastName: currentPatient.lastName,
    email: "amina.ndiaye@email.com",
    phone: "+221 77 123 45 67",
    address: "Dakar, Sénégal",
    emergencyContact: "Mamadou Ndiaye - Père",
    emergencyPhone: "+221 76 987 65 43",
    allergies: "Aucune connue",
    medications: "Metformine 500mg - 2x/jour",
    notes: "Suivi diabète gestationnel depuis 12 semaines"
  });

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
      });

      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8 mt-8">
      {/* Hero / Welcome Section */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-foreground">
              Mon Espace Personnel
            </h2>
            <p className="text-muted-foreground text-xl">
              Gérez vos informations personnelles et médicales en toute sécurité
            </p>
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-foreground font-medium">Données sécurisées</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <span className="text-foreground font-medium">RGPD compliant</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="text-foreground font-medium">Mise à jour facile</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-16 w-16 text-primary" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="shadow-sm border-border/50">
          <CardContent className="pt-8 pb-6">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage src="" alt={currentPatient.firstName} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {currentPatient.firstName[0]}{currentPatient.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-center lg:text-left flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {currentPatient.firstName} {currentPatient.lastName}
                  </h1>
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-sm">ID Patient: {currentPatient.id}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Baby className="h-4 w-4 mr-2" />
                    {currentPatient.gestationalAge} semaines
                  </Badge>
                  <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                    <Heart className="h-4 w-4 mr-2" />
                    Diabète gestationnel
                  </Badge>
                  <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground">
                    Mode {currentPatient.monitoringMode}
                  </Badge>
                </div>

                <div className="text-sm text-muted-foreground">
                  Membre depuis le {format(new Date('2024-01-15'), 'dd MMMM yyyy', { locale: fr })}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Informations
            </TabsTrigger>
            <TabsTrigger value="medical" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Médical
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Urgences
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Préférences
            </TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal">
            <Card className="shadow-sm border-border/50">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Informations personnelles</CardTitle>
                    <CardDescription className="text-base">
                      Gérez vos coordonnées et informations de base
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="firstName" className="text-sm font-semibold text-foreground">
                      Prénom
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="lastName" className="text-sm font-semibold text-foreground">
                      Nom
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-sm font-semibold text-foreground">
                      Téléphone
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="address" className="text-sm font-semibold text-foreground">
                      Adresse
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span className="font-medium">Sécurité garantie</span>
                    <span>•</span>
                    <span>Toutes vos données sont chiffrées et confidentielles</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Medical Information */}
          <TabsContent value="medical">
            <Card className="border-2 border-green-200 bg-gradient-to-br from-white to-green-50/30">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                    Informations médicales
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="allergies" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      Allergies
                    </Label>
                    <Textarea
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => handleInputChange("allergies", e.target.value)}
                      disabled={!isEditing}
                      rows={2}
                      className="border-2 border-green-200 rounded-xl focus:border-green-400 focus:ring-green-100 bg-white/80 backdrop-blur-sm resize-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="medications" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-green-500" />
                      Médicaments actuels
                    </Label>
                    <Textarea
                      id="medications"
                      value={formData.medications}
                      onChange={(e) => handleInputChange("medications", e.target.value)}
                      disabled={!isEditing}
                      rows={2}
                      className="border-2 border-green-200 rounded-xl focus:border-green-400 focus:ring-green-100 bg-white/80 backdrop-blur-sm resize-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="notes" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-500" />
                      Notes médicales
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      disabled={!isEditing}
                      rows={3}
                      className="border-2 border-green-200 rounded-xl focus:border-green-400 focus:ring-green-100 bg-white/80 backdrop-blur-sm resize-none"
                    />
                  </div>
                </div>

                <Separator className="bg-green-200" />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <h4 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                      Mes cibles glycémiques
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <div className="text-sm text-blue-700 font-semibold">À jeun</div>
                      </div>
                      <div className="text-2xl font-bold text-blue-900 mb-1">
                        {currentPatient.targetGlycemia.jeun.min} - {currentPatient.targetGlycemia.jeun.max}
                      </div>
                      <div className="text-xs text-blue-600">mmol/L • Matin</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                        <div className="text-sm text-green-700 font-semibold">Après repas</div>
                      </div>
                      <div className="text-2xl font-bold text-green-900 mb-1">
                        {currentPatient.targetGlycemia.postprandial.min} - {currentPatient.targetGlycemia.postprandial.max}
                      </div>
                      <div className="text-xs text-green-600">mmol/L • 2h après repas</div>
                    </div>
                  </div>

                  {/* Health Insights */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">Conseil médical</span>
                    </div>
                    <p className="text-sm text-green-700 leading-relaxed">
                      Ces valeurs sont définies par votre équipe médicale selon vos besoins spécifiques.
                      Contactez votre médecin si vous avez des questions sur vos cibles glycémiques.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emergency Contacts */}
          <TabsContent value="emergency">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-red-600" />
                  Contacts d'urgence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Contact d'urgence</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Téléphone d'urgence</Label>
                    <Input
                      id="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  Préférences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Notifications par email</div>
                      <div className="text-sm text-muted-foreground">
                        Recevoir des rappels par email
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Activé
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Notifications push</div>
                      <div className="text-sm text-muted-foreground">
                        Recevoir des notifications sur l'appareil
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Activé
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Rappels de mesure</div>
                      <div className="text-sm text-muted-foreground">
                        Rappels automatiques pour les glycémies
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Activé
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Mode de surveillance</Label>
                  <Select defaultValue={currentPatient.monitoringMode}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classique">Classique (4 mesures/jour)</SelectItem>
                      <SelectItem value="lean">Lean (2 mesures/jour)</SelectItem>
                      <SelectItem value="strict">Strict (6 mesures/jour)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;