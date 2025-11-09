import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Politique de Protection des Données</h1>
          </div>
        </div>

        {/* Content */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              SamaAfya Healthcare - Protection des Données Personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-gray max-w-none">
              <p className="text-sm text-gray-600 mb-6">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </p>

              <section>
                <h3 className="text-lg font-semibold mb-3">1. Collecte des données</h3>
                <p className="mb-3">
                  Dans le cadre de votre suivi médical pour le diabète gestationnel, nous collectons les données suivantes :
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Informations personnelles : nom, prénom, email, date de naissance</li>
                  <li>Données médicales : type de diabète, semaine de grossesse, mesures glycémiques</li>
                  <li>Données de suivi : messages avec l'équipe médicale, documents partagés</li>
                  <li>Données techniques : adresse IP, logs de connexion</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">2. Utilisation des données</h3>
                <p className="mb-3">
                  Vos données sont utilisées exclusivement pour :
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Assurer votre suivi médical personnalisé</li>
                  <li>Communiquer avec votre équipe médicale</li>
                  <li>Générer des rapports et analyses de tendance</li>
                  <li>Améliorer la qualité de nos services</li>
                  <li>Respecter nos obligations légales et réglementaires</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">3. Partage des données</h3>
                <p className="mb-3">
                  Nous ne partageons vos données qu'avec :
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Votre équipe médicale (médecins, sages-femmes)</li>
                  <li>Les autorités de santé en cas d'urgence vitale</li>
                  <li>Les sous-traitants techniques (hébergement sécurisé)</li>
                  <li>Avec votre consentement explicite pour la recherche médicale</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">4. Sécurité des données</h3>
                <p className="mb-3">
                  Nous mettons en œuvre des mesures de sécurité strictes :
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Chiffrement des données en transit et au repos</li>
                  <li>Accès contrôlé et authentification forte</li>
                  <li>Sauvegarde régulière et plan de continuité</li>
                  <li>Audit et surveillance continue de la sécurité</li>
                  <li>Conformité aux normes médicales (HDS)</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">5. Durée de conservation</h3>
                <p className="mb-4">
                  Vos données médicales sont conservées pendant la durée légale obligatoire :
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Données médicales : 20 ans après la fin du suivi</li>
                  <li>Données administratives : 5 ans</li>
                  <li>Données de connexion : 1 an</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">6. Vos droits</h3>
                <p className="mb-3">
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li><strong>Droit d'accès</strong> : Consulter vos données</li>
                  <li><strong>Droit de rectification</strong> : Corriger vos données inexactes</li>
                  <li><strong>Droit à l'effacement</strong> : Supprimer vos données</li>
                  <li><strong>Droit à la portabilité</strong> : Récupérer vos données</li>
                  <li><strong>Droit d'opposition</strong> : Refuser certains traitements</li>
                  <li><strong>Droit de retrait du consentement</strong> : Retirer votre accord</li>
                </ul>
                <p className="text-sm bg-blue-50 p-3 rounded-lg">
                  Pour exercer ces droits, contactez-nous à : privacy@samaafya.com
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">7. Recherche médicale</h3>
                <p className="mb-4">
                  Avec votre consentement explicite, vos données anonymisées peuvent contribuer à la recherche médicale
                  pour améliorer les soins du diabète gestationnel. Cette participation est entièrement optionnelle
                  et peut être retirée à tout moment.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">8. Cookies et traceurs</h3>
                <p className="mb-4">
                  Nous utilisons uniquement des cookies techniques nécessaires au fonctionnement de la plateforme.
                  Aucun cookie de suivi ou marketing n'est utilisé.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">9. Contact</h3>
                <p className="mb-4">
                  Pour toute question concernant vos données personnelles :
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Délégué à la Protection des Données</strong></p>
                  <p>Email : dpo@samaafya.com</p>
                  <p>Téléphone : +221 XX XXX XX XX</p>
                  <p>Adresse : [Adresse de SamaAfya Healthcare]</p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">10. Mise à jour de la politique</h3>
                <p className="mb-4">
                  Cette politique peut être mise à jour pour refléter les évolutions réglementaires ou techniques.
                  Vous serez informé de tout changement important par email ou via la plateforme.
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="border-t pt-6 mt-8">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Protégé par le RGPD et les normes médicales</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;