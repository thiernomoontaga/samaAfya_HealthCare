import { useState, useMemo } from "react";
import { PatientLayout } from "@/components/layout/PatientLayout";
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
  AlertTriangle
} from "lucide-react";
import { mockWeekReadings } from "@/data/mockData";
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transform mock data into comprehensive history - generate data for the last 90 days
  const historyData: DailyData[] = useMemo(() => {
    try {
      setIsLoading(true);
      setError(null);

      // Generate data for the last 90 days for comprehensive history
      const today = new Date();
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(today.getDate() - 90);

      const allDays = eachDayOfInterval({ start: ninetyDaysAgo, end: today });

      const result = allDays.map(date => {
        const dateStr = format(date, "yyyy-MM-dd");
        const existingData = mockWeekReadings.find(day => day.date === dateStr);

        if (existingData) {
          const readings = existingData.readings;
          const values = readings.map(r => r.value);
          const average = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
          const min = Math.min(...values);
          const max = Math.max(...values);

          // Determine daily status based on readings
          const hasHigh = readings.some(r => r.status === "high");
          const hasWarning = readings.some(r => r.status === "warning");
          const hasHypo = readings.some(r => r.status === "hypo");

          let status: "good" | "warning" | "critical" = "good";
          if (hasHigh || hasHypo) status = "critical";
          else if (hasWarning) status = "warning";

          return {
            date: dateStr,
            readings,
            completed: existingData.completed,
            average: Math.round(average * 100) / 100,
            min,
            max,
            status
          };
        } else {
          // Generate comprehensive mock data for days without readings
          const mockReadings: GlycemiaReading[] = [];
          const completed = Math.random() > 0.4; // 60% completion rate for more realistic data

          if (completed) {
            // Generate 4-6 readings for completed days (more comprehensive)
            const numReadings = Math.floor(Math.random() * 3) + 4;
            const moments = ["jeun", "apres_petit_dej", "avant_dejeuner", "apres_dejeuner", "avant_diner", "apres_diner"];

            for (let i = 0; i < numReadings && i < moments.length; i++) {
              const baseValue = 5.0 + Math.random() * 3; // Base value between 5.0-8.0
              // Add some variation based on time of day
              let value = baseValue;
              if (moments[i].includes("jeun")) value -= 0.5; // Lower fasting values
              else if (moments[i].includes("apres")) value += 0.8; // Higher post-meal values

              let status: "hypo" | "normal" | "warning" | "high" = "normal";

              if (value < 4.8) status = "hypo";
              else if (value > 7.8) status = "high";
              else if (value > 6.8) status = "warning";

              mockReadings.push({
                id: `mock-${dateStr}-${i}`,
                moment: moments[i] as "jeun" | "apres_petit_dej" | "avant_dejeuner" | "apres_dejeuner" | "avant_diner" | "apres_diner",
                value: Math.round(value * 10) / 10,
                status,
                date: dateStr,
                time: `${7 + i * 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
              });
            }
          }

          const values = mockReadings.map(r => r.value);
          const average = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
          const min = values.length > 0 ? Math.min(...values) : 0;
          const max = values.length > 0 ? Math.max(...values) : 0;

          const hasHigh = mockReadings.some(r => r.status === "high");
          const hasWarning = mockReadings.some(r => r.status === "warning");
          const hasHypo = mockReadings.some(r => r.status === "hypo");

          let status: "good" | "warning" | "critical" = "good";
          if (hasHigh || hasHypo) status = "critical";
          else if (hasWarning) status = "warning";

          return {
            date: dateStr,
            readings: mockReadings,
            completed,
            average: Math.round(average * 100) / 100,
            min,
            max,
            status
          };
        }
      }).reverse(); // Most recent first

      return result;
    } catch (err) {
      console.error("Error loading comprehensive history data:", err);
      setError("Erreur lors du chargement des données d'historique");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      <PatientLayout title="Historique complet">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout title="Historique complet">
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Historique complet des glycémies</h1>
            <p className="text-muted-foreground">
              Consultez toutes vos mesures des 90 derniers jours
            </p>
          </div>

          <div className="flex items-center gap-4">
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
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
        <Card>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par date (JJ/MM/AAAA)..."
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

        {/* Comprehensive Stats */}
        {filteredData.length > 0 && !isLoading && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Statistiques complètes (90 jours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredData.reduce((sum, day) => sum + day.readings.length, 0)}
                  </div>
                  <div className="text-sm text-blue-700">Mesures totales</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredData.filter(day => day.status === "good").length}
                  </div>
                  <div className="text-sm text-green-700">Jours normaux</div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600">
                    {filteredData.filter(day => day.status === "warning").length}
                  </div>
                  <div className="text-sm text-amber-700">Jours attention</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {filteredData.filter(day => day.status === "critical").length}
                  </div>
                  <div className="text-sm text-red-700">Jours critiques</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(filteredData.reduce((sum, day) => sum + day.average, 0) / filteredData.length * 10) / 10}
                  </div>
                  <div className="text-sm text-purple-700">Moyenne globale</div>
                </div>
              </div>

              {/* Additional metrics */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-700">
                    {filteredData.filter(day => day.completed).length}/{filteredData.length}
                  </div>
                  <div className="text-sm text-gray-600">Jours complets</div>
                </div>
                <div className="text-center p-3 bg-cyan-50 rounded-lg">
                  <div className="text-lg font-bold text-cyan-700">
                    {Math.min(...filteredData.filter(d => d.min > 0).map(d => d.min)).toFixed(1)} - {Math.max(...filteredData.map(d => d.max)).toFixed(1)}
                  </div>
                  <div className="text-sm text-cyan-600">Étendue globale</div>
                </div>
                <div className="text-center p-3 bg-indigo-50 rounded-lg">
                  <div className="text-lg font-bold text-indigo-700">
                    {Math.round((filteredData.filter(day => day.status === "good").length / filteredData.length) * 100)}%
                  </div>
                  <div className="text-sm text-indigo-600">Taux de succès</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PatientLayout>
  );
};

export default HistoryPage;