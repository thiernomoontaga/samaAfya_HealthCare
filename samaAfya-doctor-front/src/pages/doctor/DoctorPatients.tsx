import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Users, Search, Filter, Eye, AlertTriangle, CheckCircle, Clock, User, Stethoscope, Heart, Activity, TrendingUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = 'http://localhost:3001';

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

  const getPatientStatus = (patient: any) => {
    const patientAlerts = readings.filter((r: any) => r.patientId === patient.id && r.status === 'high').length;
    if (patientAlerts >= 2) return { status: "urgent", label: "Contacter", color: "bg-red-500 text-white", priority: 3 };
    if (patientAlerts > 0) return { status: "warning", label: "À surveiller", color: "bg-amber-500 text-white", priority: 2 };
    return { status: "ok", label: "OK", color: "bg-green-500 text-white", priority: 1 };
  };

  const getPatientStats = (patient: any) => {
    const patientReadings = readings.filter((r: any) => r.patientId === patient.id);
    const totalExpected = 7 * 4; // 7 days * 4 readings per day
    const compliance = patientReadings.length / totalExpected * 100;

    const lastReading = patientReadings.sort((a: any, b: any) =>
      new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime()
    )[0];

    return {
      compliance: Math.round(compliance),
      lastReading,
      totalReadings: patientReadings.length
    };
  };

  const filteredPatients = patients.filter((patient: any) => {
    const matchesSearch = patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || getPatientStatus(patient).status === statusFilter;
    const matchesDiabetes = diabetesFilter === 'all' || patient.diabetesType === diabetesFilter;

    return matchesSearch && matchesStatus && matchesDiabetes;
  });

  const sortedPatients = filteredPatients.sort((a: any, b: any) => {
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Chargement des patientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-8">
          {/* Hero / Welcome Section */}
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <h2 className="text-4xl font-bold text-foreground">
                  Gestion des patientes
                </h2>
                <p className="text-muted-foreground text-xl">
                  Suivez et gérez efficacement vos {patients.length} patientes diabétiques gestationnelles
                </p>
                <div className="flex items-center gap-6 mt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-foreground font-medium">{patients.length} patientes actives</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-accent"></div>
                    <span className="text-foreground font-medium">
                      {Math.round(patients.reduce((sum: number, p: any) => {
                        const { compliance } = getPatientStats(p);
                        return sum + compliance;
                      }, 0) / patients.length) || 0}% compliance moyenne
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-foreground font-medium">
                      {patients.filter((p: any) => getPatientStatus(p).status !== 'ok').length} nécessitent attention
                    </span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="h-16 w-16 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Patientes actives</p>
                    <p className="text-4xl font-bold text-primary">{patients.length}</p>
                    <p className="text-xs text-muted-foreground mt-2">Sous suivi médical</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-primary/20">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-red-200/50 bg-gradient-to-br from-red-50 to-red-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Alertes urgentes</p>
                    <p className="text-4xl font-bold text-red-600">
                      {patients.filter((p: any) => getPatientStatus(p).status === 'urgent').length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Contact immédiat requis</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-red-200">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-amber-200/50 bg-gradient-to-br from-amber-50 to-amber-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">À surveiller</p>
                    <p className="text-4xl font-bold text-amber-600">
                      {patients.filter((p: any) => getPatientStatus(p).status === 'warning').length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Suivi rapproché</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-200">
                    <Clock className="h-8 w-8 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-green-200/50 bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">En bonne santé</p>
                    <p className="text-4xl font-bold text-green-600">
                      {patients.filter((p: any) => getPatientStatus(p).status === 'ok').length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Contrôle optimal</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-green-200">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters Section */}
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Filter className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Filtres avancés</CardTitle>
                  <CardDescription className="text-base">Affinez votre recherche pour trouver rapidement les patientes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Statut médical</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="urgent">Contacter</SelectItem>
                      <SelectItem value="warning">À surveiller</SelectItem>
                      <SelectItem value="ok">OK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Type de diabète</label>
                  <Select value={diabetesFilter} onValueChange={setDiabetesFilter}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Tous types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous types</SelectItem>
                      <SelectItem value="gestationnel">Gestationnel</SelectItem>
                      <SelectItem value="type1">Type 1</SelectItem>
                      <SelectItem value="type2">Type 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Actions</label>
                  <Button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setDiabetesFilter('all');
                    }}
                    variant="outline"
                    className="w-full rounded-xl"
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patients Table */}
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Liste des patientes</CardTitle>
                    <CardDescription className="text-base">
                      {sortedPatients.length} patiente{sortedPatients.length > 1 ? 's' : ''} trouvée{sortedPatients.length > 1 ? 's' : ''} • Page {currentPage} sur {totalPages}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/medecin/dashboard')}
                  variant="outline"
                  className="rounded-xl"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Vue d'ensemble
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border/50">
                      <TableHead className="text-left py-3 px-4 font-semibold text-muted-foreground">Patiente</TableHead>
                      <TableHead className="text-left py-3 px-4 font-semibold text-muted-foreground">Type diabète</TableHead>
                      <TableHead className="text-left py-3 px-4 font-semibold text-muted-foreground">Trimestre</TableHead>
                      <TableHead className="text-left py-3 px-4 font-semibold text-muted-foreground">Dernière mesure</TableHead>
                      <TableHead className="text-left py-3 px-4 font-semibold text-muted-foreground">Compliance</TableHead>
                      <TableHead className="text-left py-3 px-4 font-semibold text-muted-foreground">Statut</TableHead>
                      <TableHead className="text-left py-3 px-4 font-semibold text-muted-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPatients.map((patient: any) => {
                      const { status, label, color } = getPatientStatus(patient);
                      const { compliance, lastReading } = getPatientStats(patient);

                      return (
                        <TableRow key={patient.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                          <TableCell className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-semibold text-primary">
                                  {patient.firstName[0]}{patient.lastName[0]}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{patient.firstName} {patient.lastName}</p>
                                <p className="text-sm text-muted-foreground">{patient.gestationalAge} SA</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-4">
                            <Badge variant="outline" className="rounded-lg">
                              {patient.diabetesType}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4 px-4">
                            <span className="text-sm font-medium">{patient.gestationalAge} SA</span>
                          </TableCell>
                          <TableCell className="py-4 px-4">
                            {lastReading ? (
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${
                                  lastReading.status === 'high' ? 'bg-red-500' :
                                  lastReading.status === 'warning' ? 'bg-amber-500' : 'bg-green-500'
                                }`} />
                                <div>
                                  <span className="font-medium">{lastReading.value} g/L</span>
                                  <p className="text-xs text-muted-foreground">{lastReading.date}</p>
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">Aucune mesure</span>
                            )}
                          </TableCell>
                          <TableCell className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(compliance, 100)}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-semibold text-primary">{compliance}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-4">
                            <Badge className={`${color} px-3 py-1 text-xs font-medium rounded-lg`}>
                              {label}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/medecin/patient/${patient.id}`)}
                              className="rounded-lg hover:bg-primary/10 hover:text-primary"
                            >
                              <Eye className="h-4 w-4 mr-2" />
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
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Aucune patiente trouvée</h3>
                  <p className="text-muted-foreground">Essayez de modifier vos critères de recherche</p>
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
  );
};

export default DoctorPatients;