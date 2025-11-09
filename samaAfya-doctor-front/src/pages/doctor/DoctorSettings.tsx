import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DoctorSidebar } from "@/components/doctor/DoctorSidebar";
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
  AlertTriangle
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DoctorSidebar />
        <main className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="flex items-center gap-4 px-6 py-4">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
                <p className="text-sm text-muted-foreground">
                  Gérez votre profil et vos préférences
                </p>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="security">Sécurité</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Informations personnelles
                    </CardTitle>
                    <CardDescription>
                      Mettez à jour vos informations de profil
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstname">Prénom</Label>
                        <Input
                          id="firstname"
                          placeholder="Votre prénom"
                          defaultValue="Moussa"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastname">Nom</Label>
                        <Input
                          id="lastname"
                          placeholder="Votre nom"
                          defaultValue="Ba"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="email">Email professionnel</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="votre.email@hopital.com"
                          defaultValue="moussa.ba@hospital.com"
                        />
                      </div>
                    </div>
                    <Button className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Sauvegarder les modifications
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                {/* Password Change */}
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Changer le mot de passe
                    </CardTitle>
                    <CardDescription>
                      Modifiez votre mot de passe pour renforcer la sécurité
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        {isLoading ? 'Modification...' : 'Changer le mot de passe'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* MFA Settings */}
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Authentification multifacteur (MFA)
                    </CardTitle>
                    <CardDescription>
                      Renforcez la sécurité de votre compte avec l'authentification à deux facteurs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Authentification MFA</p>
                        <p className="text-sm text-gray-600">
                          Activez l'authentification à deux facteurs pour plus de sécurité
                        </p>
                      </div>
                      <Switch
                        checked={mfaEnabled}
                        onCheckedChange={setMfaEnabled}
                      />
                    </div>

                    {mfaEnabled && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-blue-900">MFA activé</p>
                            <p className="text-sm text-blue-700">
                              Votre compte est protégé par l'authentification multifacteur.
                              Un code temporaire vous sera demandé à chaque connexion.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {!mfaEnabled && (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-900">MFA désactivé</p>
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
              <TabsContent value="notifications" className="space-y-6">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Préférences de notifications
                    </CardTitle>
                    <CardDescription>
                      Choisissez comment vous souhaitez être notifié
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Notifications par email</p>
                        <p className="text-sm text-gray-600">
                          Recevez les alertes importantes par email
                        </p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Alertes glycémiques</p>
                        <p className="text-sm text-gray-600">
                          Notifications en temps réel pour les mesures critiques
                        </p>
                      </div>
                      <Switch
                        checked={alertNotifications}
                        onCheckedChange={setAlertNotifications}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Rapports hebdomadaires</p>
                        <p className="text-sm text-gray-600">
                          Résumé automatique des suivis de vos patientes
                        </p>
                      </div>
                      <Switch
                        checked={weeklyReports}
                        onCheckedChange={setWeeklyReports}
                      />
                    </div>

                    <Button onClick={handleSettingsUpdate} disabled={isLoading} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {isLoading ? 'Sauvegarde...' : 'Sauvegarder les préférences'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DoctorSettings;