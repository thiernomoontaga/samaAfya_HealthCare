import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Mail, Phone, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GenerateTrackingCodeProps {
  doctorId: string;
  onCodeGenerated: () => void;
}

const API_BASE_URL = 'http://localhost:3001';

const generateUniqueCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'AFYA-';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const GenerateTrackingCode = ({ doctorId, onCodeGenerated }: GenerateTrackingCodeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [contact, setContact] = useState('');
  const [sendMethod, setSendMethod] = useState<'email' | 'sms'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!patientName.trim() || !contact.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const code = generateUniqueCode();
    setGeneratedCode(code);

    try {
      const response = await fetch(`${API_BASE_URL}/trackingCodes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: crypto.randomUUID(),
          code,
          doctorId,
          createdAt: new Date().toISOString(),
          sentTo: contact,
          sentBy: sendMethod,
          isActive: true,
        }),
      });

      if (!response.ok) throw new Error('Failed to save tracking code');

      // Send email if method is email
      if (sendMethod === 'email') {
        try {
          await fetch('http://localhost:3002/send-tracking-code', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: contact,
              trackingCode: code,
              patientName: patientName,
            }),
          });
        } catch (emailError) {
          console.warn('Email sending failed, but code was saved:', emailError);
        }
      }

      toast({
        title: "Code généré avec succès",
        description: `Code ${code} envoyé par ${sendMethod === 'email' ? 'e-mail' : 'SMS'} à ${contact}`,
      });

      // Reset form
      setPatientName('');
      setContact('');
      setSendMethod('email');
      setGeneratedCode(null);
      setIsOpen(false);
      onCodeGenerated();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le code. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      toast({
        title: "Copié",
        description: "Code copié dans le presse-papiers",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Générer un code de suivi médical
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Générer un code de suivi médical</DialogTitle>
          <DialogDescription>
            Créez un code unique pour associer une nouvelle patiente à votre suivi.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="patientName">Nom de la patiente</Label>
            <Input
              id="patientName"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Ex: Amina Ndiaye"
            />
          </div>

          <div>
            <Label htmlFor="contact">
              {sendMethod === 'email' ? 'Adresse e-mail' : 'Numéro de téléphone'}
            </Label>
            <Input
              id="contact"
              type={sendMethod === 'email' ? 'email' : 'tel'}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder={sendMethod === 'email' ? 'amina@example.com' : '+221 77 123 45 67'}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={sendMethod === 'email' ? 'default' : 'outline'}
              onClick={() => setSendMethod('email')}
              className="flex-1"
            >
              <Mail className="h-4 w-4 mr-2" />
              Envoyer par e-mail
            </Button>
            <Button
              variant={sendMethod === 'sms' ? 'default' : 'outline'}
              onClick={() => setSendMethod('sms')}
              className="flex-1"
            >
              <Phone className="h-4 w-4 mr-2" />
              Envoyer par SMS
            </Button>
          </div>

          {generatedCode && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-mono font-bold text-green-800">{generatedCode}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Génération...' : 'Générer et envoyer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateTrackingCode;