import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Heart, TrendingUp, MessageCircle, FileText, Shield, Users, Calendar, Sparkles, Flower2, Moon, Baby, ArrowRight, Star } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/80 via-pink-50/60 via-purple-50/40 to-blue-50/60 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-rose-200/30 to-pink-200/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-400 via-pink-400 to-purple-400 flex items-center justify-center shadow-2xl animate-bounce">
                <Heart className="h-12 w-12 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-spin">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <Badge variant="secondary" className="mb-4 bg-rose-100 text-rose-700 border-rose-200 px-4 py-2 text-sm font-medium">
              <Flower2 className="h-4 w-4 mr-2" />
              Santé maternelle & bien-être 💕
            </Badge>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              SamaAfya Care
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Moon className="h-5 w-5 text-purple-500" />
              <p className="text-2xl text-gray-700 font-medium">
                Pour un suivi maternel connecté, continu et serein
              </p>
              <Moon className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Découvrez une nouvelle façon de prendre soin de vous pendant votre grossesse.
              Notre plateforme bienveillante vous accompagne dans votre suivi du diabète gestationnel
              avec douceur et expertise médicale.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Pourquoi nous choisir ?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Une approche bienveillante et moderne pour prendre soin de votre santé maternelle
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            <div className="text-center group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Sécurité & Confiance</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Vos données médicales sont chiffrées et sécurisées selon les normes les plus strictes
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Accompagnement Bienveillant</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Une équipe médicale à votre écoute avec notre Docteur IA disponible 24/7
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Communauté Solidaire</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Rejoignez une communauté de futures mamans partageant la même expérience
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Témoignages de nos patientes</h2>
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-rose-100 bg-gradient-to-br from-white to-rose-50/50 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">
                  "Grâce à SamaAfya, je me sens accompagnée et en sécurité pendant ma grossesse.
                  L'application est si douce et facile à utiliser ! 💕"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">A</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Amina K.</p>
                    <p className="text-sm text-gray-600">Mamane de 2 enfants</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50/50 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">
                  "Le Docteur IA m'a rassurée quand j'avais des questions la nuit.
                  C'est comme avoir une sage-femme dans ma poche ! 🌙"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">F</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Fatou D.</p>
                    <p className="text-sm text-gray-600">Future maman pour la première fois</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Patient Access Card */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="border-2 border-rose-200 hover:border-rose-300 transition-all duration-500 hover:shadow-2xl cursor-pointer group bg-gradient-to-br from-white to-rose-50/30">
            <CardHeader className="text-center pb-4">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Activity className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center animate-bounce">
                  <Baby className="h-4 w-4 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl text-gray-800 mb-2">Mon Espace Santé 💕</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Votre compagnon bienveillant pour un suivi maternel serein et personnalisé
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <Button
                onClick={() => navigate("/auth/login")}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group text-lg py-4"
                size="lg"
              >
                Commencer mon suivi maternel
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 p-4 bg-rose-50 rounded-xl border border-rose-100">
                  <div className="w-3 h-3 rounded-full bg-rose-400 animate-pulse"></div>
                  <span className="text-gray-700 font-medium">Suivi glycémique quotidien</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl border border-pink-100">
                  <div className="w-3 h-3 rounded-full bg-pink-400 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <span className="text-gray-700 font-medium">Graphiques de tendance</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse" style={{animationDelay: '1s'}}></div>
                  <span className="text-gray-700 font-medium">Docteur IA disponible 24/7</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" style={{animationDelay: '1.5s'}}></div>
                  <span className="text-gray-700 font-medium">Messagerie sécurisée</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20 mb-16">
          <div className="bg-gradient-to-r from-rose-100 via-pink-100 to-purple-100 rounded-3xl p-8 border border-rose-200 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Prête à commencer votre suivi ? 🌸
            </h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
              Rejoignez des milliers de futures mamans qui nous font confiance pour leur suivi médical.
              Votre santé et celle de votre bébé sont notre priorité absolue.
            </p>
            <Button
              onClick={() => navigate("/auth/login")}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
              size="lg"
            >
              Créer mon compte patient
              <Heart className="h-5 w-5 ml-2 group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-white/80 border border-rose-200 shadow-lg backdrop-blur-sm">
            <Shield className="h-5 w-5 text-rose-500" />
            <p className="text-sm text-gray-700 font-medium">
              Plateforme sécurisée et conforme aux normes médicales 💙
            </p>
            <Shield className="h-5 w-5 text-rose-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
