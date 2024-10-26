import React, { useEffect, useState } from 'react';
import SearchBar from '../components/dashboard/SearchBar';
import QuickStats from '../components/dashboard/QuickStats';
import PatientList from '../components/dashboard/PatientList';
import { usePatientStore } from '../stores/usePatientStore';
import type { Patient } from '../types';

export default function Dashboard() {
  const { patients, loading, fetchPatients, subscribeToPatients } = usePatientStore();
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

  useEffect(() => {
    fetchPatients();
    const unsubscribe = subscribeToPatients();
    return () => unsubscribe();
  }, [fetchPatients, subscribeToPatients]);

  useEffect(() => {
    setFilteredPatients(patients);
  }, [patients]);

  const handleSearch = (query: string) => {
    const filtered = patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(query.toLowerCase()) ||
        patient.personalCode.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  const stats = {
    totalPatients: patients.length,
    criticalPatients: patients.filter((p) => p.status === 'Critical').length,
    stablePatients: patients.filter((p) => p.status === 'Stable').length,
    newAdmissions: patients.filter(
      (p) => new Date(p.admissionDate).toDateString() === new Date().toDateString()
    ).length,
    dischargedToday: patients.filter(
      (p) => 
        p.status === 'Discharged' && 
        p.dischargeDate && 
        new Date(p.dischargeDate).toDateString() === new Date().toDateString()
    ).length,
    deathsToday: patients.filter(
      (p) => 
        p.status === 'Deceased' && 
        p.deathDate && 
        new Date(p.deathDate).toDateString() === new Date().toDateString()
    ).length,
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <QuickStats stats={stats} />
      
      <div className="mt-8">
        <PatientList patients={filteredPatients} />
      </div>
    </div>
  );
}