import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Droplet, Save, Heart } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

const glycemiaSchema = z.object({
  date: z.date({
    required_error: "La date est requise",
  }),
  time: z.string().min(1, "L'heure est requise"),
  value: z.number().min(0.1, "La valeur doit être supérieure à 0").max(20, "Valeur trop élevée"),
  mealType: z.enum(["fasting", "breakfast", "lunch", "dinner"], {
    required_error: "Le type de repas est requis",
  }),
  mealTiming: z.enum(["before", "after"], {
    required_error: "Le moment par rapport au repas est requis",
  }),
  notes: z.string().optional(),
});

type GlycemiaFormData = z.infer<typeof glycemiaSchema>;

interface GlycemiaInputProps {
  onSubmit?: (data: GlycemiaFormData) => void;
  className?: string;
}

export const GlycemiaInput = ({ onSubmit, className = "" }: GlycemiaInputProps) => {
  const [date, setDate] = useState<Date>(new Date());

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GlycemiaFormData>({
    resolver: zodResolver(glycemiaSchema),
    defaultValues: {
      date: new Date(),
      time: format(new Date(), "HH:mm"),
      mealType: "fasting",
      mealTiming: "before",
    },
  });

  const value = watch("value");
  const mealType = watch("mealType");
  const mealTiming = watch("mealTiming");

  // Determine status based on value and context
  const getStatus = () => {
    if (!value) return null;

    if (mealType === "fasting") {
      if (value < 0.6) return "hypo";
      if (value <= 0.95) return "normal";
      if (value <= 1.05) return "warning";
      return "high";
    } else {
      if (value < 0.6) return "hypo";
      if (value <= 1.2) return "normal";
      if (value <= 1.4) return "warning";
      return "high";
    }
  };

  const status = getStatus();

  const getStatusColor = () => {
    switch (status) {
      case "normal":
        return "text-medical-success bg-medical-success/10 border-medical-success/20";
      case "warning":
        return "text-medical-caution bg-medical-caution/10 border-medical-caution/20";
      case "high":
        return "text-medical-danger bg-medical-danger/10 border-medical-danger/20";
      case "hypo":
        return "text-medical-hypo bg-medical-hypo/10 border-medical-hypo/20";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "normal":
        return "Dans la cible";
      case "warning":
        return "Attention";
      case "high":
        return "Élevé";
      case "hypo":
        return "Hypoglycémie";
      default:
        return "À vérifier";
    }
  };

  const onFormSubmit = async (data: GlycemiaFormData) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
      reset({
        date: new Date(),
        time: format(new Date(), "HH:mm"),
        mealType: "fasting",
        mealTiming: "before",
      });
      setDate(new Date());
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  return (
    <Card className={`${className} overflow-hidden`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
            <Droplet className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">Nouvelle mesure de glycémie</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
          {/* Date and Time */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <CalendarIcon className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Date et heure de la mesure</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="date" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  📅 Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 border-2 border-gray-200 hover:border-blue-300 transition-all duration-200",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                      {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        if (newDate) {
                          setDate(newDate);
                          setValue("date", newDate);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    ⚠️ {errors.date.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="time" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  🕐 Heure
                </Label>
                <Input
                  id="time"
                  type="time"
                  {...register("time")}
                  className={cn(
                    "h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-400 transition-all duration-200",
                    errors.time && "border-red-500"
                  )}
                />
                {errors.time && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    ⚠️ {errors.time.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Value and Context */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <Droplet className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Taux de glycémie et contexte</h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-3">
                <Label htmlFor="value" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  💉 Taux glycémique (mmol/L)
                </Label>
                <Input
                  id="value"
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  placeholder="Ex: 5.2"
                  {...register("value", { valueAsNumber: true })}
                  className={cn(
                    "h-12 text-lg border-2 border-gray-200 hover:border-purple-300 focus:border-purple-400 transition-all duration-200",
                    errors.value && "border-red-500"
                  )}
                />
                {errors.value && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    ⚠️ {errors.value.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Meal Type */}
                <div className="space-y-3">
                  <Label htmlFor="mealType" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    🍽️ Type de repas
                  </Label>
                  <Select
                    onValueChange={(value: string) => setValue("mealType", value as "fasting" | "breakfast" | "lunch" | "dinner")}
                    defaultValue="fasting"
                  >
                    <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-green-300 focus:border-green-400 transition-all duration-200">
                      <SelectValue placeholder="Sélectionner le repas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fasting">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <span className="text-sm">🌅</span>
                          </div>
                          <span className="font-medium">À jeun</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="breakfast">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                            <span className="text-sm">☕</span>
                          </div>
                          <span className="font-medium">Petit-déjeuner</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="lunch">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                            <span className="text-sm">🍽️</span>
                          </div>
                          <span className="font-medium">Déjeuner</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="dinner">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                            <span className="text-sm">🌙</span>
                          </div>
                          <span className="font-medium">Dîner</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.mealType && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      ⚠️ {errors.mealType.message}
                    </p>
                  )}
                </div>

                {/* Meal Timing */}
                <div className="space-y-3">
                  <Label htmlFor="mealTiming" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    ⏰ Moment
                  </Label>
                  <Select
                    onValueChange={(value: string) => setValue("mealTiming", value as "before" | "after")}
                    defaultValue="before"
                  >
                    <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-400 transition-all duration-200">
                      <SelectValue placeholder="Avant ou après le repas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="before">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                            <span className="text-sm">⏰</span>
                          </div>
                          <span className="font-medium">Avant le repas</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="after">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                            <span className="text-sm">✅</span>
                          </div>
                          <span className="font-medium">Après le repas</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.mealTiming && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      ⚠️ {errors.mealTiming.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status Display */}
          {status && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Évaluation de votre mesure</h3>
              </div>

              <div className={cn("p-6 rounded-2xl border-2 shadow-lg", getStatusColor())}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center">
                      <span className="text-2xl">
                        {status === "normal" ? "✅" : status === "warning" ? "⚠️" : status === "hypo" ? "🚨" : "❓"}
                      </span>
                    </div>
                    <div>
                      <span className="text-xl font-bold">{getStatusLabel()}</span>
                      <p className="text-sm opacity-90">
                        {value} mmol/L
                        {mealType === "fasting" ? " (à jeun)" : ` (${mealTiming === "before" ? "avant" : "après"} ${mealType === "breakfast" ? "petit-déj" : mealType === "lunch" ? "déjeuner" : "dîner"})`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-sm opacity-80 leading-relaxed">
                  {status === "normal" && "🎉 Excellent ! Votre glycémie est dans la cible recommandée."}
                  {status === "warning" && "⚠️ Attention, surveillez votre glycémie et consultez votre médecin si nécessaire."}
                  {status === "high" && "🚨 Valeur élevée détectée. Contactez votre équipe médicale."}
                  {status === "hypo" && "🚨 Hypoglycémie détectée ! Prenez des mesures immédiates."}
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                <span className="text-white text-sm">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Notes complémentaires (optionnel)</h3>
            </div>

            <Textarea
              id="notes"
              placeholder="Ex: repas copieux, activité physique, stress, médicaments..."
              {...register("notes")}
              rows={4}
              className="border-2 border-gray-200 hover:border-gray-300 focus:border-gray-400 transition-all duration-200 resize-none"
            />
            <p className="text-sm text-gray-500 flex items-center gap-2">
              💡 Ces informations aideront votre équipe médicale à mieux comprendre votre mesure
            </p>
          </div>

          {/* Insulin Tracking Section */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm">💉</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Suivi Insuline</h3>
              <div className="ml-auto flex items-center gap-1 text-sm text-muted-foreground">
                <span>🔒</span>
                <span>Bientôt disponible</span>
              </div>
            </div>

            {/* Basale (Long-acting insulin) */}
            <div className="bg-gray-50/50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs">🌙</span>
                </div>
                <h4 className="font-medium text-gray-700">Basale (insuline lente)</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Dose (unités)</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 10"
                    disabled
                    className="bg-gray-100 cursor-not-allowed opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Heure d'injection</Label>
                  <Input
                    type="time"
                    disabled
                    className="bg-gray-100 cursor-not-allowed opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* Bolus (Fast-acting insulin) */}
            <div className="bg-gray-50/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-xs">⚡</span>
                </div>
                <h4 className="font-medium text-gray-700">Bolus (insuline rapide)</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Dose (unités)</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 4"
                    disabled
                    className="bg-gray-100 cursor-not-allowed opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Heure d'injection</Label>
                  <Input
                    type="time"
                    disabled
                    className="bg-gray-100 cursor-not-allowed opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* Info message */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">ℹ️</span>
                </div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Cette fonctionnalité sera disponible lors du suivi par un médecin.</p>
                  <p>Le suivi de l'insulinothérapie (Basale & Bolus) sera activé automatiquement lorsque votre traitement évoluera vers l'insuline.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              disabled={isSubmitting}
            >
              <Save className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Enregistrement en cours...
                </>
              ) : (
                "💾 Enregistrer la mesure"
              )}
            </Button>
          </div>

          {/* Future feature banner */}
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                <span className="text-white text-lg">💡</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Fonctionnalité à venir</h4>
                <p className="text-sm text-gray-600">
                  Suivi de l'insulinothérapie (Basale & Bolus) pour les patientes sous traitement insulinique.
                </p>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};