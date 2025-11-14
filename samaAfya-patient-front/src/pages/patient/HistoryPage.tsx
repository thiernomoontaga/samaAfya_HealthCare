import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CalendarIcon,
  Search,
  Filter,
  Download,
  History,
  BarChart3,
  AlertTriangle,
  Heart,
  Sparkles
} from "lucide-react";
import { useGlycemiaData } from "@/hooks/useGlycemiaData";
import { useToast } from "@/hooks/use-toast";
import { format, isSameDay, eachDayOfInterval } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { DayCard } from "@/components/patient/history/DayCard";
import { Skeleton } from "@/components/ui/skeleton";

interface GlycemiaReading {
  id: string;
  moment: "jeun" | "apres_petit_dej" | "avant_dejeuner" | "apres_dejeuner" | "avant_diner" | "apres_diner" | "coucher";
  value: number;
  status: "hypo" | "normal" | "warning" | "high";
  date: string;
  time: string;
}

interface DailyData {
  date: string;
  readings: GlycemiaReading[];
  completed: boolean;
  average: number;
  min: number;
  max: number;
  status: "good" | "warning" | "critical";
}

const getMealContextLabel = (moment: string) => {
  const labels: Record<string, string> = {
    "jeun": "À jeun",
    "apres_petit_dej": "Après petit-déj",
    "avant_dejeuner": "Avant déjeuner",
    "apres_dejeuner": "Après déjeuner",
    "avant_diner": "Avant dîner",
    "apres_diner": "Après dîner",
    "coucher": "Au coucher"
  };
  return labels[moment] || moment;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "hypo":
      return "text-purple-600 bg-purple-50 border-purple-200";
    case "normal":
      return "text-green-600 bg-green-50 border-green-200";
    case "warning":
      return "text-amber-600 bg-amber-50 border-amber-200";
    case "high":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};


const HistoryPage = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [mealFilter, setMealFilter] = useState<string>("all");

  // Get real data from the hook
  const { readings, isLoading, error } = useGlycemiaData();

  // Transform real readings into daily data structure
  const historyData: DailyData[] = useMemo(() => {
    try {
      // Group readings by date
      const readingsByDate = readings.reduce((acc, reading) => {
        const date = reading.timestamp.split('T')[0]; // Extract date part
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(reading);
        return acc;
      }, {} as Record<string, typeof readings>);

      // Convert to DailyData format
      const result = Object.entries(readingsByDate).map(([dateStr, dayReadings]) => {
        const values = dayReadings.map(r => r.value);
        const average = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
        const min = values.length > 0 ? Math.min(...values) : 0;
        const max = values.length > 0 ? Math.max(...values) : 0;

        // Convert readings to the expected format
        const formattedReadings: GlycemiaReading[] = dayReadings.map(reading => ({
          id: reading.id,
          moment: reading.mealContext === "fasting" ? "jeun" :
                  reading.mealContext === "after_meal" ? "apres_dejeuner" : "avant_dejeuner",
          value: reading.value,
          status: reading.status === "critical" ? "high" :
                  reading.status === "warning" ? "warning" : "normal",
          date: dateStr,
          time: reading.timestamp.split('T')[1]?.split('.')[0] || "00:00:00"
        }));

        // Determine daily status
        const hasHigh = formattedReadings.some(r => r.status === "high");
        const hasWarning = formattedReadings.some(r => r.status === "warning");
        const hasHypo = formattedReadings.some(r => r.status === "hypo");

        let status: "good" | "warning" | "critical" = "good";
        if (hasHigh || hasHypo) status = "critical";
        else if (hasWarning) status = "warning";

        return {
          date: dateStr,
          readings: formattedReadings,
          completed: formattedReadings.length >= 4, // Consider completed if 4+ readings
          average: Math.round(average * 100) / 100,
          min: Math.round(min * 100) / 100,
          max: Math.round(max * 100) / 100,
          status
        };
      }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Most recent first

      return result;
    } catch (err) {
      console.error("Error processing glycemia history data:", err);
      return [];
    }
  }, [readings]);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return historyData.filter(day => {
      // Date filter
      if (selectedDate && !isSameDay(new Date(day.date), selectedDate)) {
        return false;
      }

      // Search filter (by date or readings count)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const dateMatch = format(new Date(day.date), "dd/MM/yyyy").includes(searchLower);
        const readingsMatch = day.readings.length.toString().includes(searchLower);
        if (!dateMatch && !readingsMatch) return false;
      }

      // Status filter
      if (statusFilter !== "all") {
        if (statusFilter === "completed" && !day.completed) return false;
        if (statusFilter === "incomplete" && day.completed) return false;
        if (statusFilter === "good" && day.status !== "good") return false;
        if (statusFilter === "warning" && day.status !== "warning") return false;
        if (statusFilter === "critical" && day.status !== "critical") return false;
      }

      return true;
    });
  }, [historyData, selectedDate, searchTerm, statusFilter]);

  // Get selected day's detailed readings
  const selectedDayData = selectedDate
    ? historyData.find(day => isSameDay(new Date(day.date), selectedDate))
    : null;

  const handleExportHistory = () => {
    const csvData = [
      ['Date', 'Heure', 'Contexte', 'Valeur', 'Statut'],
      ...historyData.flatMap(day =>
        day.readings.map(reading => [
          day.date,
          reading.time,
          getMealContextLabel(reading.moment),
          reading.value,
          reading.status
        ])
      )
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historique-glycemique-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();

    toast({
      title: "Export réussi",
      description: "L'historique a été exporté au format CSV.",
    });
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{String(error)}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8 mt-8">
      {/* Hero / Welcome Section */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-foreground">
              Historique glycémique complet
            </h2>
            <p className="text-muted-foreground text-xl">
              Suivi détaillé de vos mesures des 90 derniers jours - {filteredData.length} jour{filteredData.length !== 1 ? 's' : ''} analysé{filteredData.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-foreground font-medium">Données complètes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <span className="text-foreground font-medium">Analyse automatique</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="text-foreground font-medium">Export disponible</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-16 w-16 text-primary" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Historique complet des glycémies</h2>
            <p className="text-muted-foreground">
              Consultez toutes vos mesures des 90 derniers jours
            </p>
          </div>

          <div className="flex items-center gap-4">
            {!isLoading && (
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{filteredData.length}</div>
                <div className="text-sm text-muted-foreground">Jours affichés</div>
              </div>
            )}
            <Button onClick={handleExportHistory} variant="outline" size="sm" disabled={isLoading}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Controls */}
        <Card className="shadow-sm border-border/50">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Date Picker */}
              <div className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : "Filtrer par date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher par date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les jours</SelectItem>
                  <SelectItem value="completed">Jours complets</SelectItem>
                  <SelectItem value="incomplete">Jours incomplets</SelectItem>
                  <SelectItem value="good">Jours normaux</SelectItem>
                  <SelectItem value="warning">Jours attention</SelectItem>
                  <SelectItem value="critical">Jours critiques</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>


        {/* History Accordion */}
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))
          ) : filteredData.length > 0 ? (
            filteredData.map((day) => (
              <DayCard
                key={day.date}
                date={day.date}
                readings={day.readings}
                completed={day.completed}
                average={day.average}
                min={day.min}
                max={day.max}
                status={day.status}
              />
            ))
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <History className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Aucune donnée trouvée
                  </h3>
                  <p className="text-muted-foreground">
                    Essayez de modifier vos critères de recherche ou vérifiez que des mesures ont été enregistrées.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Summary Stats */}
        {filteredData.length > 0 && !isLoading && (
          <Card className="shadow-sm border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8 text-center">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-foreground">Analyse complète (90 jours)</h3>
                  <p className="text-muted-foreground text-lg">
                    {filteredData.reduce((sum, day) => sum + day.readings.length, 0)} mesures analysées avec {Math.round((filteredData.filter(day => day.status === "good").length / filteredData.length) * 100)}% de jours dans les normes
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {filteredData.filter(day => day.status === "good").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Jours normaux</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-foreground">
                      {filteredData.filter(day => day.status === "warning").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Jours attention</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-destructive">
                      {filteredData.filter(day => day.status === "critical").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Jours critiques</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary-foreground">
                      {Math.round(filteredData.reduce((sum, day) => sum + day.average, 0) / filteredData.length * 10) / 10}
                    </div>
                    <div className="text-sm text-muted-foreground">Moyenne globale</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
