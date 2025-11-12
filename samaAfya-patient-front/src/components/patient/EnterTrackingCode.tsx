import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link2, CheckCircle, AlertCircle, User } from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = 'http://localhost:3000';

const EnterTrackingCode = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formatTrackingCode = (value: string) => {
    // Remove any existing formatting and convert to uppercase
    const cleanValue = value.replace(/[^A-Z0-9]/g, '').toUpperCase();

    // Add "AFYA-" prefix if not present
    if (cleanValue.startsWith('AFYA')) {
      return cleanValue;
    } else if (cleanValue.length > 0) {
      return 'AFYA-' + cleanValue.substring(0, 5);
    }
    return cleanValue;
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTrackingCode(e.target.value);
    setTrackingCode(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingCode.trim()) {
      toast.error("Veuillez saisir un code de suivi");
      return;
    }

    // Validate format
    if (!/^AFYA-[A-Z0-9]{5}$/.test(trackingCode)) {
      toast.error("Format de code invalide. Le code doit être au format AFYA-XXXXX");
      return;
    }

    setIsLoading(true);

    try {
      // Get current patient ID
      const currentPatientId = localStorage.getItem('currentPatientId');
      if (!currentPatientId) {
        toast.error("Session expirée. Veuillez vous reconnecter.");
        return;
      }

      // Check if tracking code exists and is active
      const trackingResponse = await fetch(`${API_BASE_URL}/trackingCodes?code=${trackingCode}&isActive=true`);
      const trackingCodes = await trackingResponse.json();

      if (trackingCodes.length === 0) {
        toast.error("Code de suivi invalide ou expiré");
        return;
      }

      const trackingCodeData = trackingCodes[0];

      // Get doctor information
      const doctorResponse = await fetch(`${API_BASE_URL}/doctors/${trackingCodeData.doctorId}`);
      if (!doctorResponse.ok) {
        toast.error("Médecin introuvable");
        return;
      }

      const doctor = await doctorResponse.json();

      // Update patient with doctor association
      const updateResponse = await fetch(`${API_BASE_URL}/patients/${currentPatientId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: doctor.id,
          trackingCode: trackingCode,
          doctorName: `${doctor.firstName} ${doctor.lastName}`,
          associatedAt: new Date().toISOString(),
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update patient');
      }

      // Mark tracking code as used (optional - could be kept for reference)
      await fetch(`${API_BASE_URL}/trackingCodes/${trackingCodeData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: false, // Mark as used
          usedBy: currentPatientId,
          usedAt: new Date().toISOString(),
        }),
      });

      setIsSuccess(true);
      toast.success(`Association réussie avec le Dr ${doctor.firstName} ${doctor.lastName}`);

      // Close dialog after success
      setTimeout(() => {
        setIsOpen(false);
        setTrackingCode('');
        setIsSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error associating with doctor:', error);
      toast.error("Erreur lors de l'association. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl border-primary/20 hover:bg-primary/5">
          <Link2 className="h-4 w-4 mr-2" />
          Associer à un médecin
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-sm sm:max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Associer à un médecin
          </DialogTitle>
          <DialogDescription>
            Saisissez le code de suivi médical que votre médecin vous a fourni pour vous associer à son suivi.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trackingCode">Code de suivi médical</Label>
            <Input
              id="trackingCode"
              value={trackingCode}
              onChange={handleCodeChange}
              placeholder="AFYA-XXXXX"
              className="text-center text-lg font-mono tracking-wider uppercase"
              maxLength={10}
              disabled={isLoading || isSuccess}
            />
            <p className="text-xs text-muted-foreground text-center">
              Format attendu : AFYA-XXXXX (lettres et chiffres)
            </p>
          </div>

          {isSuccess && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-800 font-medium">
                Association réussie ! Vous êtes maintenant suivi par votre médecin.
              </span>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isLoading || isSuccess}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Association...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Associer
                </div>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800">
              <p className="font-medium mb-1">Comment obtenir un code de suivi ?</p>
              <p>Demander à votre médecin de générer un code de suivi médical dans son espace professionnel.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnterTrackingCode;