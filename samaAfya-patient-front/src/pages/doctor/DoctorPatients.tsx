import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DoctorSidebar } from "@/components/doctor/DoctorSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Users, Search, Filter, Eye, AlertTriangle, CheckCircle, Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Patient, GlycemieReading } from "@/types/patient";

const API_BASE_URL = 'http://localhost:5000';

const fetchPatients = async () => {
  const response = await fetch(`${API_BASE_URL}/patients`);
  if (!response.ok) throw new Error('Failed to fetch patients');
  return response.json();
};

const fetchGlycemiaReadings = async () => {
  const response = await fetch(`${API_BASE_URL}/glycemiaReadings`);
  if (!response.ok) throw new Error('Failed to fetch glycemia readings');
  return response.json();
};

const ITEMS_PER_PAGE = 10;

const DoctorPatients: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [diabetesFilter, setDiabetesFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: patients = [], isLoading: patientsLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients,
  });

  const { data: readings = [], isLoading: readingsLoading } = useQuery({
    queryKey: ['glycemiaReadings'],
    queryFn: fetchGlycemiaReadings,
  });

  const getPatientStatus = (patient: Patient) => {
    const patientAlerts = readings.filter((r: GlycemieReading) => r.patientId === patient.id && r.status === 'high').length;
    if (patientAlerts >= 2) return { status: "urgent", label: "Contacter", color: "bg-red-500 text-white", priority: 3 };
    if (patientAlerts > 0) return { status: "warning", label: "À surveiller", color: "bg-amber-500 text-white", priority: 2 };
    return { status: "ok", label: "OK", color: "bg-green-500 text-white", priority: 1 };
  };

  const getPatientStats = (patient: Patient) => {
    const patientReadings = readings.filter((r: GlycemieReading) => r.patientId === patient.id);
    const totalExpected = 7 * 4; // 7 days * 4 readings per day
    const compliance = patientReadings.length / totalExpected * 100;

    const lastReading = patientReadings.sort((a: GlycemieReading, b: GlycemieReading) =>
      new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime()
    )[0];

    return {
      compliance: Math.round(compliance),
      lastReading,
      totalReadings: patientReadings.length
    };
  };

  const filteredPatients = patients.filter((patient: Patient) => {
    const matchesSearch = patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || getPatientStatus(patient).status === statusFilter;
    const matchesDiabetes = diabetesFilter === 'all' || patient.diabetesType === diabetesFilter;

    return matchesSearch && matchesStatus && matchesDiabetes;
  });

  const sortedPatients = filteredPatients.sort((a: Patient, b: Patient) => {
    return getPatientStatus(b).priority - getPatientStatus(a).priority;
  });

  const totalPages = Math.ceil(sortedPatients.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPatients = sortedPatients.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const isLoading = patientsLoading || readingsLoading;

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <DoctorSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des patientes...</p>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

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
                <h1 className="text-2xl font-bold text-foreground">Mes patientes</h1>
                <p className="text-sm text-muted-foreground">Gestion et suivi des patientes</p>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total patientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-primary" />
                    <p className="text-3xl font-bold">{patients.length}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Alertes actives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                    <p className="text-3xl font-bold text-red-600">
                      {patients.filter((p: Patient) => getPatientStatus(p).status === 'urgent').length}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    À surveiller
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Clock className="h-6 w-6 text-amber-500" />
                    <p className="text-3xl font-bold text-amber-600">
                      {patients.filter((p: Patient) => getPatientStatus(p).status === 'warning').length}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    En bonne santé
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <p className="text-3xl font-bold text-green-600">
                      {patients.filter((p: Patient) => getPatientStatus(p).status === 'ok').length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres et recherche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher une patiente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="urgent">Contacter</SelectItem>
                      <SelectItem value="warning">À surveiller</SelectItem>
                      <SelectItem value="ok">OK</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={diabetesFilter} onValueChange={setDiabetesFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type de diabète" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous types</SelectItem>
                      <SelectItem value="gestationnel">Gestationnel</SelectItem>
                      <SelectItem value="type1">Type 1</SelectItem>
                      <SelectItem value="type2">Type 2</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setDiabetesFilter('all');
                    }}
                  >
                    Réinitialiser
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Patients Table */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Liste des patientes ({sortedPatients.length})
                </CardTitle>
                <CardDescription>
                  Page {currentPage} sur {totalPages} • Cliquez sur "Voir détails" pour accéder au profil complet d'une patiente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patiente</TableHead>
                        <TableHead>Type diabète</TableHead>
                        <TableHead>Trimestre</TableHead>
                        <TableHead>Dernière mesure</TableHead>
                        <TableHead>Compliance</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedPatients.map((patient: Patient) => {
                        const { status, label, color } = getPatientStatus(patient);
                        const { compliance, lastReading } = getPatientStats(patient);

                        return (
                          <TableRow key={patient.id} className="hover:bg-muted/50">
                            <TableCell>
                              <div>
                                <p className="font-semibold">{patient.firstName} {patient.lastName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(patient.dateOfBirth).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {patient.diabetesType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {patient.gestationalAge ? `${patient.gestationalAge} SA` : 'N/A'}
                            </TableCell>
                            <TableCell>
                              {lastReading ? (
                                <div>
                                  <p className="font-medium">{lastReading.value} g/L</p>
                                  <p className="text-sm text-muted-foreground">
                                    {lastReading.date} à {lastReading.time}
                                  </p>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">Aucune mesure</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full"
                                    style={{ width: `${Math.min(compliance, 100)}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{compliance}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={color}>{label}</Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/medecin/patient/${patient.id}`)}
                                className="flex items-center gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                Voir détails
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {paginatedPatients.length === 0 && sortedPatients.length > 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucune patiente trouvée avec ces critères</p>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DoctorPatients;