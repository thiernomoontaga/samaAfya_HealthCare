import { useQuery } from "@tanstack/react-query";
import { mockDocuments } from "@/data/mockData";
import { Document } from "@/types/patient";

// API functions
const API_BASE_URL = 'http://localhost:3000';

const fetchDocuments = async (patientId: string = 'P001'): Promise<Document[]> => {
  const response = await fetch(`${API_BASE_URL}/documents?patientId=${patientId}`);
  if (!response.ok) throw new Error('Failed to fetch documents');
  return response.json();
};

export const useDocuments = () => {
  const { data: documents = [], isLoading, error } = useQuery({
    queryKey: ['documents'],
    queryFn: () => fetchDocuments(),
  });

  const downloadDocument = async (document: Document) => {
    try {
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 1000));

      const link = window.document.createElement('a');
      link.href = document.url;
      link.download = document.title;
      link.click();

      return true;
    } catch (err) {
      console.error("Erreur lors du téléchargement", err);
      throw err;
    }
  };

  const getDocumentsByType = (type: string) => {
    return documents.filter(doc => doc.type === type);
  };

  const searchDocuments = (query: string) => {
    return documents.filter(doc =>
      doc.title.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getStats = () => {
    const stats = {
      total: documents.length,
      ordonnances: documents.filter(d => d.type === "ordonnance").length,
      resultats: documents.filter(d => d.type === "resultat").length,
      consignes: documents.filter(d => d.type === "consigne").length,
      autres: documents.filter(d => d.type === "autre").length,
    };
    return stats;
  };

  return {
    documents,
    isLoading,
    error,
    downloadDocument,
    getDocumentsByType,
    searchDocuments,
    getStats: getStats()
  };
};