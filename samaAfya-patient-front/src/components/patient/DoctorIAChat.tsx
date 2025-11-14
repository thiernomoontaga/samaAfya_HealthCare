import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Send, Heart, Sparkles } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = 'http://localhost:5000';

interface Message {
  id: string;
  content: string;
  sender: 'patient' | 'ia' | 'doctor';
  timestamp: string;
  patientId: string;
}

// Simulated doctor responses
const getDoctorResponse = (userMessage: string, doctorInfo?: { firstname: string; lastname: string }): string => {
  const message = userMessage.toLowerCase();
  const doctorName = doctorInfo ? `Dr. ${doctorInfo.firstname}` : 'Docteur';

  // Glycémie related questions
  if (message.includes('glycémie') || message.includes('glucose') || message.includes('sucre')) {
    if (message.includes('élevée') || message.includes('haute') || message.includes('anormale')) {
      return `Bonjour, je vois que vos glycémies sont un peu élevées. Pourriez-vous me transmettre vos dernières mesures détaillées ? Je vais analyser cela et ajuster votre traitement si nécessaire. En attendant, continuez votre régime alimentaire et votre activité physique. Nous en rediscuterons lors de notre prochain rendez-vous. Prenez soin de vous ! 👨‍⚕️`;
    }
    if (message.includes('normale') || message.includes('stable')) {
      return `Excellente nouvelle ! Vos glycémies sont dans les normes. Continuez ainsi avec votre suivi rigoureux. N'hésitez pas si vous avez des questions sur votre alimentation ou votre traitement. Je reste disponible pour vous accompagner. 💙`;
    }
    return `Vos mesures de glycémie sont importantes pour votre suivi. Partagez-moi vos dernières valeurs et je pourrai vous donner des conseils personnalisés. Comment vous sentez-vous par rapport à vos résultats actuels ? 🤔`;
  }

  // Symptômes inquiétants
  if (message.includes('symptôme') || message.includes('inquiète') || message.includes('problème') || message.includes('douleur')) {
    return `Je comprends votre inquiétude. Pourriez-vous me décrire précisément vos symptômes ? Depuis quand les ressentez-vous ? Avez-vous noté d'autres signes associés ? Il est important que je puisse évaluer la situation. En cas d'urgence, contactez immédiatement les services d'urgence. Je suis là pour vous aider. ⚕️`;
  }

  // Rendez-vous
  if (message.includes('rendez-vous') || message.includes('rdv') || message.includes('consultation')) {
    return `Pour votre prochain rendez-vous, préparez vos mesures de glycémie des 2 dernières semaines et notez toutes vos questions. Nous ferons le point sur votre grossesse et ajusterons votre suivi si nécessaire. Avez-vous des préoccupations particulières à aborder ? 📅`;
  }

  // Grossesse et bébé
  if (message.includes('bébé') || message.includes('grossesse') || message.includes('mouvement') || message.includes('enceinte')) {
    return `Comment se déroule votre grossesse ? Ressentez-vous bien les mouvements de votre bébé ? Vos glycémies sont-elles stables ? N'hésitez pas à partager vos impressions et vos mesures. Je suis là pour vous rassurer et vous accompagner tout au long de ce parcours. 🤰`;
  }

  // Questions générales
  if (message.includes('bonjour') || message.includes('salut') || message.includes('bonsoir')) {
    return `Bonjour ! Comment allez-vous aujourd'hui ? Je suis ${doctorName}, votre médecin référent. Je suis là pour répondre à vos questions et vous accompagner dans votre suivi médical. N'hésitez pas à partager vos préoccupations. 💙`;
  }

  if (message.includes('merci') || message.includes('thank')) {
    return `Avec plaisir ! Prenez bien soin de vous et de votre bébé. N'hésitez pas à me contacter si vous avez la moindre question. Je suis là pour vous accompagner. Prenez soin de vous ! 👨‍⚕️`;
  }

  // Default response
  return `Je comprends votre message. Pourriez-vous m'en dire plus sur ce qui vous préoccupe ? Je suis là pour vous écouter et vous apporter les conseils médicaux adaptés à votre situation. Votre santé et celle de votre bébé sont ma priorité. 🤝`;
};

// Simulated AI responses based on medical knowledge
const getAIResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();

  // Glycémie related questions
  if (message.includes('glycémie') || message.includes('glucose') || message.includes('sucre') || message.includes('diabète')) {
    if (message.includes('normale') || message.includes('normal') || message.includes('bon') || message.includes('stable')) {
      return "Excellente nouvelle ! Vos glycémies sont dans les normes recommandées pour une grossesse avec diabète gestationnel :\n\n• À jeun : 0,6 - 0,95 g/L\n• 1 heure après repas : < 1,4 g/L  \n• 2 heures après repas : < 1,2 g/L\n\nContinuez votre suivi rigoureux ! Votre médecin sera ravi de voir ces bons résultats lors de votre prochain rendez-vous. N'hésitez pas à partager ces mesures avec votre équipe médicale. 💙";
    }
    if (message.includes('élevée') || message.includes('haute') || message.includes('anormale') || message.includes('trop')) {
      return "Je comprends votre préoccupation concernant vos glycémies élevées. Voici des mesures immédiates à prendre :\n\n🚨 **Actions immédiates :**\n• Buvez beaucoup d'eau (au moins 2L/jour)\n• Marchez 15-20 minutes après les repas\n• Vérifiez vos mesures plus fréquemment\n\n⚠️ **Quand consulter d'urgence :**\n• Glycémie > 2,0 g/L à jeun\n• Glycémie > 2,5 g/L après repas\n• Symptômes associés (vision trouble, fatigue)\n\nContactez votre médecin ou votre diabétologue pour ajuster votre traitement. Ils sauront vous conseiller au mieux selon votre profil médical. Prenez soin de vous ! 👨‍⚕️";
    }
    if (message.includes('mesure') || message.includes('comment') || message.includes('faire')) {
      return "Pour mesurer correctement votre glycémie pendant la grossesse :\n\n📏 **Matériel nécessaire :**\n• Lecteur de glycémie\n• Bandelettes réactives\n• Stylo autopiqueur\n• Carnet de suivi\n\n⏰ **Quand mesurer :**\n• À jeun (matin, avant petit-déjeuner)\n• 1h après chaque repas\n• Parfois avant le coucher\n\n💡 **Conseils pratiques :**\n• Lavez-vous les mains avant\n• Alternez les doigts\n• Notez toujours l'heure et le contexte\n• Partagez vos résultats avec votre médecin\n\nVotre suivi régulier est essentiel pour votre santé et celle de votre bébé ! 🤰";
    }
    return "La glycémie est au cœur du suivi du diabète gestationnel. Voici les valeurs cibles recommandées :\n\n🎯 **Objectifs glycémiques :**\n• À jeun : 0,6 - 0,95 g/L\n• 1h après repas : < 1,4 g/L\n• 2h après repas : < 1,2 g/L\n\n📊 **Pourquoi mesurer ?**\n• Prévenir les complications\n• Adapter le traitement\n• Assurer le bien-être du bébé\n\nN'hésitez pas à partager vos mesures avec votre équipe médicale lors de vos consultations. Ils pourront vous donner des conseils personnalisés selon votre situation. 🤝";
  }

  // Alimentation related questions
  if (message.includes('manger') || message.includes('alimentation') || message.includes('repas') || message.includes('nourriture') || message.includes('diète')) {
    if (message.includes('interdit') || message.includes('éviter') || message.includes('pas') || message.includes('non')) {
      return "Pendant la grossesse avec diabète gestationnel, certains aliments sont à limiter :\n\n🚫 **À éviter ou limiter :**\n• Sucres raffinés (bonbons, sodas, pâtisseries)\n• Aliments très transformés\n• Jus de fruits industriels\n• Pains blancs et pâtes raffinées\n• Riz blanc\n• Pommes de terre en frites\n\n✅ **Alternatives saines :**\n• Fruits frais entiers (pas de jus)\n• Légumes à volonté\n• Céréales complètes\n• Produits laitiers natures\n\nRappelez-vous : une alimentation équilibrée aide à stabiliser votre glycémie naturellement ! 🥗";
    }
    if (message.includes('repas') || message.includes('menu') || message.includes('exemple')) {
      return "Voici un exemple de journée alimentaire équilibrée pour diabète gestationnel :\n\n🌅 **Petit-déjeuner :**\n• 2 tranches de pain complet\n• 1 œuf + 1 yaourt nature\n• 1 fruit frais (pomme, poire)\n• Thé ou café sans sucre\n\n🌞 **Déjeuner :**\n• Salade de légumes variés\n• Poisson ou poulet grillé\n• Quinoa ou lentilles\n• Fromage blanc 0%\n\n🌆 **Goûter :**\n• 1 fruit + 1 poignée d'amandes\n• Ou 1 yaourt + 1 carré de chocolat noir\n\n🌙 **Dîner :**\n• Légumes vapeur\n• Viande blanche ou poisson\n• Féculents complets (patate douce)\n• Salade verte\n\n💡 **Règles d'or :**\n• 3 repas + 2 collations\n• Mangez lentement\n• Respectez les portions\n• Buvez de l'eau à chaque repas\n\nAdaptez selon vos goûts et consultez votre diététicien pour un plan personnalisé ! 🍽️";
    }
    return "Une alimentation adaptée est essentielle pour gérer le diabète gestationnel :\n\n🥗 **Bases d'une alimentation saine :**\n• Légumes à chaque repas (50% de l'assiette)\n• Protéines maigres (poisson, poulet, œufs, légumineuses)\n• Glucides complexes (céréales complètes, légumineuses)\n• Graisses saines (huile d'olive, avocat, noix)\n• Produits laitiers natures\n\n⚖️ **Équilibre glycémique :**\n• Répartissez les glucides sur la journée\n• Privilégiez l'index glycémique bas\n• Mangez des fibres à chaque repas\n• Limitez les sucres rapides\n\n🍎 **Fruits autorisés :**\n• Pommes, poires, baies\n• Agrumes (avec modération)\n• Fruits rouges\n• En petites quantités\n\nVotre diététicien peut vous aider à établir un plan alimentaire personnalisé selon vos besoins caloriques et vos préférences alimentaires. 🤝";
  }

  // Activité physique
  if (message.includes('sport') || message.includes('activité') || message.includes('marche') || message.includes('exercice') || message.includes('bouger')) {
    if (message.includes('peux') || message.includes('possible') || message.includes('autorisé')) {
      return "Oui, l'activité physique est recommandée pendant la grossesse avec diabète gestationnel !\n\n✅ **Activités conseillées :**\n• Marche quotidienne (30-45 min)\n• Natation ou aquagym\n• Vélo d'appartement\n• Yoga prénatal\n• Pilates adapté\n• Danse douce\n\n⚠️ **Précautions importantes :**\n• Consultez votre médecin avant de commencer\n• Écoutez votre corps\n• Arrêtez si douleur ou essoufflement\n• Restez hydratée\n• Évitez les sports à risque de chute\n\n💪 **Bénéfices prouvés :**\n• Améliore la sensibilité à l'insuline\n• Aide à contrôler la glycémie\n• Réduit le stress\n• Prépare à l'accouchement\n• Améliore le bien-être général\n\nCommencez doucement et augmentez progressivement. Votre médecin vous guidera selon votre condition physique ! 🏃‍♀️";
    }
    return "L'activité physique est un allié précieux pour gérer le diabète gestationnel :\n\n🎯 **Objectifs quotidiens :**\n• 30 minutes d'activité modérée\n• 10 000 pas par jour minimum\n• 3-4 séances par semaine\n\n🏊‍♀️ **Activités recommandées :**\n• Marche rapide (extérieur ou tapis)\n• Natation (excellente pour les articulations)\n• Vélo stationnaire\n• Exercices de renforcement musculaire doux\n• Étirements et relaxation\n\n📊 **Impact sur la glycémie :**\n• Diminue l'insulinorésistance\n• Améliore l'utilisation du glucose\n• Réduit les pics glycémiques postprandiaux\n• Aide au contrôle du poids\n\n⚕️ **Quand consulter :**\n• Si vous n'avez pas fait de sport récemment\n• Si vous avez des complications\n• Pour un programme personnalisé\n\nN'oubliez pas : l'activité physique doit être adaptée à votre trimestre de grossesse et à votre condition physique. Votre médecin ou sage-femme saura vous conseiller ! 💙";
  }

  // Grossesse et symptômes
  if (message.includes('grossesse') || message.includes('enceinte') || message.includes('bébé') || message.includes('symptôme') || message.includes('nausée') || message.includes('fatigue')) {
    if (message.includes('mouvement') || message.includes('bébé') || message.includes('sentir')) {
      return "Les mouvements du bébé sont un signe rassurant de son bien-être !\n\n👶 **Quand sentir les premiers mouvements :**\n• Primipare : vers 18-20 semaines\n• Multipare : vers 16-18 semaines\n\n⚡ **À surveiller :**\n• Au moins 10 mouvements par période de 2h\n• Rythme régulier\n• Force des mouvements\n• Réponse aux stimuli\n\n🚨 **Quand s'inquiéter :**\n• Moins de 10 mouvements/2h\n• Mouvements très faibles\n• Arrêt brutal des mouvements\n\n📞 **Que faire :**\n• Reposez-vous sur le côté gauche\n• Buvez quelque chose de sucré\n• Comptez les mouvements\n• Appelez votre médecin si anomalie\n\nLes mouvements actifs sont le meilleur signe que votre bébé va bien ! Pendant le diabète gestationnel, un suivi particulier est important pour s'assurer du bon développement de votre bébé. 🤰💕";
    }
    if (message.includes('prise') || message.includes('poids') || message.includes('grossir')) {
      return "La prise de poids pendant la grossesse avec diabète gestationnel doit être surveillée :\n\n⚖️ **Prise de poids recommandée :**\n• IMC normal : 11-16 kg\n• Surpoids : 7-11 kg\n• Obésité : 5-9 kg\n\n📊 **Répartition idéale :**\n• 1er trimestre : 1-2 kg\n• 2ème trimestre : 4-5 kg\n• 3ème trimestre : 4-5 kg\n\n💡 **Conseils pratiques :**\n• Pesée hebdomadaire\n• Alimentation équilibrée\n• Activité physique régulière\n• Suivi par votre équipe médicale\n\n⚠️ **Signes d'alarme :**\n• Prise trop rapide (> 1kg/semaine)\n• Prise insuffisante (< 500g/semaine)\n• Œdèmes importants\n\nVotre médecin ajuste les recommandations selon votre situation personnelle. Le contrôle du poids aide à mieux gérer votre diabète ! 📏";
    }
    return "Votre grossesse avec diabète gestationnel nécessite un suivi particulier :\n\n🤰 **Suivi renforcé :**\n• Consultations plus fréquentes\n• Échographies supplémentaires\n• Surveillance glycémique stricte\n• Contrôle de la prise de poids\n• Évaluation du bien-être fœtal\n\n👶 **Pour le bébé :**\n• Risque de macrosomie (bébé trop gros)\n• Risque d'hypoglycémie néonatale\n• Besoin de surveillance rapprochée\n• Possibilité d'accouchement prématuré\n\n⚕️ **Votre rôle :**\n• Mesures glycémiques régulières\n• Alimentation adaptée\n• Activité physique modérée\n• Signalement des symptômes\n\n🌟 **Points positifs :**\n• Excellent pronostic avec bon contrôle\n• Bébé en bonne santé possible\n• Suivi postnatal important\n\nVous n'êtes pas seule ! Votre équipe médicale vous accompagne à chaque étape. N'hésitez pas à exprimer vos inquiétudes - c'est normal d'avoir des questions. Prenez soin de vous et de votre bébé ! 💕";
  }

  // Traitements et médicaments
  if (message.includes('traitement') || message.includes('médicament') || message.includes('insuline') || message.includes('pilule') || message.includes('métformine')) {
    if (message.includes('insuline') || message.includes('piqûre')) {
      return "L'insuline peut être nécessaire pour contrôler le diabète gestationnel :\n\n💉 **Types d'insuline utilisés :**\n• Insuline rapide (Humalog, Novorapid)\n• Insuline lente (Lantus, Levemir)\n• Parfois association des deux\n\n📏 **Quand commencer :**\n• Si régime seul insuffisant\n• Glycémies trop élevées malgré diète\n• Selon recommandations médicales\n\n💡 **Conseils pratiques :**\n• Apprentissage par infirmière\n• Rotation des sites d'injection\n• Stockage au réfrigérateur\n• Contrôle régulier des glycémies\n\n👨‍⚕️ **Suivi médical :**\n• Adaptation des doses par médecin\n• Contrôle des effets secondaires\n• Surveillance du bébé\n• Préparation à l'accouchement\n\nL'insuline est sûre pendant la grossesse et n'affecte pas négativement le bébé. Votre médecin vous expliquera tout en détail ! ⚕️";
    }
    return "Le traitement du diabète gestationnel est personnalisé :\n\n💊 **Traitements possibles :**\n• Régime alimentaire adapté (1ère ligne)\n• Activité physique régulière\n• Métformine (si contre-indication insuline)\n• Insuline (si régime insuffisant)\n\n📋 **Principe de traitement :**\n• Contrôler la glycémie\n• Prévenir les complications\n• Assurer le bien-être maternel\n• Préparer l'accouchement\n\n⚕️ **Suivi thérapeutique :**\n• Consultations régulières\n• Adaptation des doses\n• Surveillance des effets\n• Préparation post-natale\n\n🎯 **Objectif :**\n• Glycémies stables\n• Grossesse normale\n• Bébé en bonne santé\n• Accouchement sécurisé\n\nVotre médecin choisit le traitement le plus adapté à votre situation. Tous les traitements sont sûrs pour le bébé quand ils sont bien conduits ! 🤝";
  }

  // Complications et risques
  if (message.includes('complication') || message.includes('risque') || message.includes('danger') || message.includes('peur')) {
    return "Le diabète gestationnel bien contrôlé a d'excellents résultats :\n\n✅ **Pronostic favorable :**\n• 90% de grossesses normales\n• Bébé en bonne santé\n• Pas de séquelles à long terme\n• Prévention du diabète type 2\n\n⚠️ **Risques si mal contrôlé :**\n• Macrosomie fœtale\n• Prématurité\n• Hypoglycémie néonatale\n• Complications maternelles\n\n🛡️ **Prévention active :**\n• Suivi glycémique strict\n• Alimentation adaptée\n• Activité physique\n• Consultations régulières\n\n💪 **Votre pouvoir :**\n• Mesures quotidiennes\n• Choix alimentaires sains\n• Activité physique régulière\n• Communication avec votre équipe\n\n🌟 **Points positifs :**\n• Contrôlable par le mode de vie\n• Suivi postnatal recommandé\n• Prévention future du diabète\n\nVous avez le pouvoir de rendre cette grossesse merveilleuse ! Avec un bon contrôle, tout se passe généralement très bien. Votre équipe médicale est là pour vous soutenir. 💙";
  }

  // Examens et dépistage
  if (message.includes('examen') || message.includes('test') || message.includes('dépistage') || message.includes('analyse')) {
    return "Le dépistage et le suivi du diabète gestationnel sont bien codifiés :\n\n🩺 **Dépistage initial :**\n• Entre 24-28 semaines d'aménorrhée\n• Test O'Sullivan (glycémie 1h après 50g glucose)\n• Si positif : hyperglycémie provoquée orale (HGPO)\n\n📊 **Test HGPO complet :**\n• À jeun : prélèvement initial\n• Après 75g de glucose : prélèvements 1h et 2h\n• Diagnostic selon seuils OMS\n\n🔍 **Suivi pendant grossesse :**\n• Glycémies capillaires quotidiennes\n• Consultations mensuelles\n• Échographies supplémentaires\n• Surveillance de la croissance fœtale\n\n📋 **Examens complémentaires :**\n• Échographie morphologique\n• Doppler utérin\n• Enregistrement du rythme cardiaque fœtal\n• Bilan pré-anesthésie si césarienne\n\nCes examens permettent de dépister précocement et de prévenir les complications. Votre médecin vous expliquera tous les résultats en détail ! ⚕️";
  }

  // Questions générales
  if (message.includes('bonjour') || message.includes('salut') || message.includes('hello') || message.includes('coucou')) {
    return "Bonjour ! Je suis l'Assistant IA de SamaAfya, votre compagnon bienveillant pendant cette grossesse avec diabète gestationnel. 💙\n\nJe suis là pour répondre à toutes vos questions sur :\n• La glycémie et son contrôle\n• L'alimentation adaptée\n• L'activité physique recommandée\n• Les symptômes de grossesse\n• Les traitements et médicaments\n• Le suivi médical\n• Le bien-être émotionnel\n\nN'hésitez pas à me poser vos questions - je suis disponible 24/7 pour vous accompagner ! Comment puis-je vous aider aujourd'hui ? 🤗";
  }

  if (message.includes('merci') || message.includes('thank') || message.includes('remercie')) {
    return "Avec grand plaisir ! 😊\n\nRappelez-vous que je suis là pour vous apporter des informations générales et du soutien, mais je ne remplace pas les conseils personnalisés de votre équipe médicale.\n\nContinuez à suivre vos rendez-vous, partagez vos mesures avec vos professionnels de santé, et prenez bien soin de vous et de votre bébé.\n\nVous faites un travail formidable - cette grossesse se déroule sous le meilleur des auspices grâce à votre implication ! 💕\n\nN'hésitez pas à revenir vers moi si vous avez d'autres questions. Prenez soin de vous ! 🌟";
  }

  // Questions sur l'accouchement
  if (message.includes('accouchement') || message.includes('naissance') || message.includes('bébé') || message.includes('césarienne')) {
    return "L'accouchement avec diabète gestationnel nécessite une préparation particulière :\n\n📅 **Moment de l'accouchement :**\n• Terme normal (39-40 semaines)\n• Parfois déclenchement anticipé\n• Selon contrôle glycémique\n• État du bébé\n\n⚕️ **Équipe médicale :**\n• Obstétricien\n• Anesthésiste\n• Pédiatre\n• Diabetologue\n\n💉 **Pendant le travail :**\n• Contrôle glycémique strict\n• Perfusion d'insuline si nécessaire\n• Monitorage continu\n• Prévention de l'hypoglycémie\n\n👶 **Pour le bébé :**\n• Surveillance néonatale\n• Contrôle glycémique\n• Alimentation précoce\n• Suivi pédiatrique\n\n🌟 **Points positifs :**\n• Excellents résultats avec bon contrôle\n• Moins de complications\n• Récupération normale\n• Allaitement possible\n\nVotre équipe médicale vous préparera parfaitement pour ce grand moment ! 🤰💕";
  }

  // Questions sur l'allaitement
  if (message.includes('allaitement') || message.includes('lait') || message.includes('nourrir') || message.includes('sein')) {
    return "L'allaitement est tout à fait possible et recommandé après diabète gestationnel !\n\n🤱 **Avantages pour la mère :**\n• Aide à stabiliser la glycémie\n• Favorise la perte de poids\n• Réduit le risque de diabète type 2\n• Crée un lien unique avec bébé\n\n👶 **Avantages pour le bébé :**\n• Protection contre les infections\n• Développement optimal\n• Prévention de l'obésité\n• Meilleur développement cérébral\n\n💡 **Conseils pratiques :**\n• Commencer dès que possible\n• Allaitement à la demande\n• Bonne position\n• Hydratation maternelle\n• Alimentation équilibrée\n\n⚕️ **Suivi médical :**\n• Contrôle glycémique rapproché\n• Adaptation des traitements\n• Consultation allaitement\n• Suivi pédiatrique\n\n🌟 **Recommandations :**\n• Allaitement exclusif 6 mois\n• Puis diversification progressive\n• Selon recommandations OMS\n\nVotre équipe médicale vous accompagnera pour réussir cet allaitement ! 💙";
  }

  // Default response
  return "Je comprends que vous avez une question importante concernant votre grossesse avec diabète gestationnel. 🤔\n\nPour vous apporter la réponse la plus adaptée, pourriez-vous reformuler votre question ou me donner plus de détails ? Par exemple :\n\n• Concernant la glycémie ?\n• L'alimentation ?\n• L'activité physique ?\n• Les symptômes ?\n• Le traitement ?\n• Le suivi médical ?\n\nJe suis là pour vous aider avec des conseils généraux basés sur les recommandations médicales actuelles. N'oubliez pas que pour des conseils personnalisés, votre équipe médicale est la mieux placée ! 👨‍⚕️\n\nQuelle est votre préoccupation principale ? 💙";
};

const fetchChatMessages = async (patientId: string): Promise<Message[]> => {
  const response = await fetch(`${API_BASE_URL}/messages?patientId=${patientId}&_sort=timestamp&_order=asc`);
  if (!response.ok) throw new Error('Failed to fetch chat messages');
  return response.json();
};

const sendChatMessage = async (message: Omit<Message, 'id'>): Promise<Message> => {
  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
};

interface DoctorIAChatProps {
  context?: 'ia' | 'doctor';
  doctorInfo?: { id: string; firstname: string; lastname: string };
}

export const DoctorIAChat: React.FC<DoctorIAChatProps> = ({
  context = 'ia',
  doctorInfo
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Get current patient ID
  const currentPatientId = localStorage.getItem('currentPatientId') || 'P001';

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['iaChatMessages', currentPatientId],
    queryFn: () => fetchChatMessages(currentPatientId),
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendChatMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iaChatMessages'] });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      content: inputMessage,
      sender: 'patient' as const,
      timestamp: new Date().toISOString(),
      patientId: currentPatientId,
    };

    // Send user message
    await sendMessageMutation.mutateAsync(userMessage);

    setInputMessage('');
    setIsTyping(true);

    // Simulate response time (doctor responds faster than IA)
    const responseDelay = context === 'doctor' ? 800 : 1500;

    setTimeout(async () => {
      let responseContent: string;

      if (context === 'doctor') {
        // Simulate doctor response
        responseContent = getDoctorResponse(inputMessage, doctorInfo);
      } else {
        // IA response
        responseContent = getAIResponse(inputMessage);
      }

      const responseMessage = {
        content: responseContent,
        sender: (context === 'doctor' ? 'doctor' : 'ia') as 'patient' | 'ia' | 'doctor',
        timestamp: new Date().toISOString(),
        patientId: currentPatientId,
      };

      await sendMessageMutation.mutateAsync(responseMessage);
      setIsTyping(false);
    }, responseDelay);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-2xl border border-primary/20 shadow-lg overflow-hidden w-full max-w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-accent to-secondary p-4 sm:p-6 text-primary-foreground">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
            {context === 'doctor' ? (
              <User className="h-5 w-5 sm:h-7 sm:w-7" />
            ) : (
              <Bot className="h-5 w-5 sm:h-7 sm:w-7" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-bold">
              {context === 'doctor' && doctorInfo
                ? `Dr. ${doctorInfo.firstname} ${doctorInfo.lastname}`
                : 'Docteur IA'
              }
            </h2>
            <p className="text-primary-foreground/80 text-xs sm:text-sm">
              {context === 'doctor'
                ? 'Communication sécurisée avec votre médecin 👨‍⚕️'
                : 'Votre assistant médical bienveillant 💙'
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-primary-foreground/80">
              {context === 'doctor' ? 'Disponible' : 'En ligne'}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="h-[400px] sm:h-[500px] lg:h-[600px] flex flex-col">
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {/* Welcome message */}
            {messages.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  {context === 'doctor' ? (
                    <User className="h-10 w-10 text-primary" />
                  ) : (
                    <Heart className="h-10 w-10 text-primary" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {context === 'doctor'
                    ? `Bonjour ! Comment allez-vous ? 👋`
                    : 'Bonjour ! Je suis là pour vous aider 🤗'
                  }
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed max-w-lg mx-auto">
                  {context === 'doctor'
                    ? `Vous pouvez me contacter pour toutes vos questions médicales, vos résultats de glycémie, ou tout suivi concernant votre grossesse. Je suis là pour vous accompagner.`
                    : `Posez-moi vos questions sur la glycémie, l'alimentation, l'activité physique, ou tout autre sujet concernant votre grossesse avec diabète gestationnel.`
                  }
                </p>
                {context === 'ia' && (
                  <div className="mt-6 grid grid-cols-2 gap-3 max-w-md mx-auto">
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-3 rounded-xl border border-primary/20">
                      <p className="text-sm font-medium text-primary">📊 Glycémie normale</p>
                    </div>
                    <div className="bg-gradient-to-br from-accent/5 to-accent/10 p-3 rounded-xl border border-accent/20">
                      <p className="text-sm font-medium text-accent-foreground">🥗 Alimentation</p>
                    </div>
                    <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 p-3 rounded-xl border border-secondary/20">
                      <p className="text-sm font-medium text-secondary-foreground">🏃‍♀️ Activité physique</p>
                    </div>
                    <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-3 rounded-xl border border-primary/20">
                      <p className="text-sm font-medium text-primary">🤰 Signes grossesse</p>
                    </div>
                  </div>
                )}
                {context === 'doctor' && (
                  <div className="mt-6 grid grid-cols-2 gap-3 max-w-md mx-auto">
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-3 rounded-xl border border-primary/20">
                      <p className="text-sm font-medium text-primary">📊 Partager glycémie</p>
                    </div>
                    <div className="bg-gradient-to-br from-accent/5 to-accent/10 p-3 rounded-xl border border-accent/20">
                      <p className="text-sm font-medium text-accent-foreground">📅 Prochain RDV</p>
                    </div>
                    <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 p-3 rounded-xl border border-secondary/20">
                      <p className="text-sm font-medium text-secondary-foreground">⚠️ Signes inquiétants</p>
                    </div>
                    <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-3 rounded-xl border border-primary/20">
                      <p className="text-sm font-medium text-primary">💊 Traitements</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Messages */}
            {messages.map((message: Message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
              >
                {(message.sender === 'ia' || message.sender === 'doctor') && (
                  <Avatar className={`w-10 h-10 shadow-lg ${
                    message.sender === 'doctor'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                      : 'bg-gradient-to-br from-primary to-accent'
                  }`}>
                    <AvatarFallback className="bg-transparent text-white font-bold text-sm">
                      {message.sender === 'doctor' ? (
                        <User className="h-5 w-5" />
                      ) : (
                        <Bot className="h-5 w-5" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className="max-w-[80%] sm:max-w-[75%]">
                  <div
                    className={`rounded-2xl px-4 sm:px-5 py-3 sm:py-4 shadow-md ${
                      message.sender === 'patient'
                        ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground ml-8 sm:ml-12'
                        : message.sender === 'doctor'
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-900 mr-8 sm:mr-12'
                        : 'bg-card border border-primary/20 text-card-foreground mr-8 sm:mr-12'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {message.content}
                    </p>
                  </div>
                  <p className={`text-xs mt-2 px-2 ${
                    message.sender === 'patient'
                      ? 'text-right text-primary'
                      : message.sender === 'doctor'
                      ? 'text-left text-blue-600'
                      : 'text-left text-muted-foreground'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {message.sender === 'doctor' && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        Médecin
                      </span>
                    )}
                  </p>
                </div>

                {message.sender === 'patient' && (
                  <Avatar className="w-10 h-10 bg-gradient-to-br from-secondary to-accent shadow-lg">
                    <AvatarFallback className="bg-transparent text-secondary-foreground font-bold text-sm">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-4 justify-start">
                <Avatar className={`w-10 h-10 shadow-lg ${
                  context === 'doctor'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                    : 'bg-gradient-to-br from-primary to-accent'
                }`}>
                  <AvatarFallback className="bg-transparent text-white font-bold text-sm">
                    {context === 'doctor' ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className={`rounded-2xl px-5 py-4 shadow-md mr-12 ${
                  context === 'doctor'
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-card border border-primary/20'
                }`}>
                  <div className="flex gap-1">
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      context === 'doctor' ? 'bg-blue-500' : 'bg-primary'
                    }`}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      context === 'doctor' ? 'bg-blue-500' : 'bg-primary'
                    }`} style={{ animationDelay: '0.1s' }}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      context === 'doctor' ? 'bg-blue-500' : 'bg-primary'
                    }`} style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input area */}
        <div className="p-4 sm:p-6 bg-card/80 backdrop-blur-sm border-t border-primary/20">
          <div className="flex gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Écrivez votre message..."
                className="pr-10 sm:pr-12 py-3 text-sm sm:text-base border-2 border-primary/20 focus:border-primary focus:ring-primary/20 rounded-xl"
                disabled={isTyping}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-4 sm:px-6 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          <div className={`mt-3 sm:mt-4 p-3 rounded-xl border ${
            context === 'doctor'
              ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
              : 'bg-gradient-to-r from-accent/5 to-secondary/5 border-accent/20'
          }`}>
            <p className={`text-xs text-center leading-relaxed ${
              context === 'doctor'
                ? 'text-blue-700'
                : 'text-accent-foreground'
            }`}>
              {context === 'doctor' ? (
                <>
                  👨‍⚕️ <strong>Communication sécurisée :</strong> Cette conversation est confidentielle et fait partie de votre suivi médical.
                  Vos messages sont chiffrés et accessibles uniquement par votre équipe médicale.
                </>
              ) : (
                <>
                  💙 <strong>Important :</strong> Cet assistant fournit des conseils généraux et bienveillants.
                  Il ne remplace pas les consultations médicales personnalisées avec votre équipe de santé.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};