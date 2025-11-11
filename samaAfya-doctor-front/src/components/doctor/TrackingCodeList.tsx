import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Mail, Phone, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TrackingCode {
  id: string;
  code: string;
  doctorId: string;
  createdAt: string;
  sentTo: string;
  sentBy: 'email' | 'sms';
  isActive: boolean;
}

interface TrackingCodeListProps {
  codes: TrackingCode[];
}

const TrackingCodeList = ({ codes }: TrackingCodeListProps) => {
  const { toast } = useToast();

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

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Codes de suivi médicaux</CardTitle>
            <CardDescription className="text-base">
              Liste des codes générés pour vos patientes
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {codes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm">Aucun code généré pour le moment</p>
          </div>
        ) : (
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
                {codes.map((code) => (
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
        )}
      </CardContent>
    </Card>
  );
};

export default TrackingCodeList;