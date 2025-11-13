import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Lock,
  Shield,
  Bell,
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
  Settings,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { toast } from 'sonner';

const DoctorSettings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Settings state
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [alertNotifications, setAlertNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (newPassword !== confirmPassword) {
        toast.error('Les mots de passe ne correspondent pas');
        setIsLoading(false);
        return;
      }

      if (newPassword.length < 8) {
        toast.error('Le mot de passe doit contenir au moins 8 caractères');
        setIsLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Mot de passe modifié avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('Erreur lors de la modification du mot de passe');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsUpdate = async () => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Paramètres mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des paramètres');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 mt-8">
          {/* Hero / Welcome Section */}
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <h2 className="text-4xl font-bold text-foreground">
                  Paramètres du compte
                </h2>
                <p className="text-muted-foreground text-xl">
                  Gérez votre profil, la sécurité et vos préférences de notifications
                </p>
                <div className="flex items-center gap-6 mt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-foreground font-medium">Profil à jour</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-accent"></div>
                    <span className="text-foreground font-medium">Sécurité renforcée</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-foreground font-medium">Notifications actives</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-16 w-16 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Settings Tabs */}
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-6">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3 rounded-xl bg-muted/50 p-1">
                  <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <User className="h-4 w-4 mr-2" />
                    Profil
                  </TabsTrigger>
                  <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Sécurité
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="mt-8 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Informations personnelles</CardTitle>
                      <CardDescription className="text-base">Mettez à jour vos informations de profil professionnel</CardDescription>
                    </div>
                  </div>

                  <Card className="shadow-sm border-border/50">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="firstname" className="text-sm font-semibold text-foreground">
                            Prénom
                          </Label>
                          <Input
                            id="firstname"
                            placeholder="Votre prénom"
                            defaultValue="Moussa"
                            className="h-12 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="lastname" className="text-sm font-semibold text-foreground">
                            Nom
                          </Label>
                          <Input
                            id="lastname"
                            placeholder="Votre nom"
                            defaultValue="Ba"
                            className="h-12 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div className="space-y-3 md:col-span-2">
                          <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                            Email professionnel
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="votre.email@hopital.com"
                            defaultValue="moussa.ba@hospital.com"
                            className="h-12 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-6">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-200">
                          <Save className="h-4 w-4 mr-2" />
                          Sauvegarder les modifications
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="mt-8 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Sécurité du compte</CardTitle>
                      <CardDescription className="text-base">Protégez votre accès et vos données médicales</CardDescription>
                    </div>
                  </div>

                  {/* Password Change */}
                  <Card className="shadow-sm border-border/50">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Lock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Changer le mot de passe</CardTitle>
                          <CardDescription>Modifiez votre mot de passe pour renforcer la sécurité</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-3">
                          <Label htmlFor="currentPassword" className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Mot de passe actuel
                          </Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="h-12 pr-12 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="newPassword" className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Nouveau mot de passe
                          </Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showNewPassword ? 'text' : 'password'}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="h-12 pr-12 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Confirmer le mot de passe
                          </Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="h-12 pr-12 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {isLoading ? 'Modification...' : 'Changer le mot de passe'}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  {/* MFA Settings */}
                  <Card className="shadow-sm border-border/50">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Authentification multifacteur (MFA)</CardTitle>
                          <CardDescription>Double vérification pour une sécurité renforcée</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20">
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">Authentification MFA</p>
                          <p className="text-sm text-muted-foreground">
                            Activez l'authentification à deux facteurs pour plus de sécurité
                          </p>
                        </div>
                        <Switch
                          checked={mfaEnabled}
                          onCheckedChange={setMfaEnabled}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>

                      {mfaEnabled && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                              <p className="font-semibold text-green-900">MFA activé</p>
                              <p className="text-sm text-green-700">
                                Votre compte est protégé par l'authentification multifacteur.
                                Un code temporaire vous sera demandé à chaque connexion.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {!mfaEnabled && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                            <div>
                              <p className="font-semibold text-amber-900">MFA désactivé</p>
                              <p className="text-sm text-amber-700">
                                Il est recommandé d'activer l'authentification multifacteur pour protéger vos données médicales sensibles.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="mt-8 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Bell className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Préférences de notifications</CardTitle>
                      <CardDescription className="text-base">Choisissez comment vous souhaitez être notifié des événements importants</CardDescription>
                    </div>
                  </div>

                  <Card className="shadow-sm border-border/50">
                    <CardContent className="p-6 space-y-6">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">Notifications par email</p>
                          <p className="text-sm text-muted-foreground">
                            Recevez les alertes importantes par email
                          </p>
                        </div>
                        <Switch
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>

                      <Separator className="my-4" />

                      <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">Alertes glycémiques</p>
                          <p className="text-sm text-muted-foreground">
                            Notifications en temps réel pour les mesures critiques
                          </p>
                        </div>
                        <Switch
                          checked={alertNotifications}
                          onCheckedChange={setAlertNotifications}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>

                      <Separator className="my-4" />

                      <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">Rapports hebdomadaires</p>
                          <p className="text-sm text-muted-foreground">
                            Résumé automatique des suivis de vos patientes
                          </p>
                        </div>
                        <Switch
                          checked={weeklyReports}
                          onCheckedChange={setWeeklyReports}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button
                          onClick={handleSettingsUpdate}
                          disabled={isLoading}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isLoading ? 'Sauvegarde...' : 'Sauvegarder les préférences'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
    </div>
  );
};

export default DoctorSettings;