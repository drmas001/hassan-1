import React, { useState } from 'react';
import { Calendar, Download, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import DateRangePicker from '../ui/DateRangePicker';

interface ReportFilters {
  startDate: Date;
  endDate: Date;
  status: string;
  type: 'daily' | 'custom';
}

export default function ReportGenerator() {
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: new Date(),
    endDate: new Date(),
    status: 'all',
    type: 'daily',
  });
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const generateReport = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('patients')
        .select(`
          *,
          vital_signs (
            blood_pressure,
            heart_rate,
            temperature,
            oxygen_saturation
          ),
          medications (
            name,
            dosage,
            frequency
          )
        `);

      if (filters.type === 'daily') {
        query = query.eq('admission_date', filters.startDate.toISOString().split('T')[0]);
      } else {
        query = query
          .gte('admission_date', filters.startDate.toISOString())
          .lte('admission_date', filters.endDate.toISOString());
      }

      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      setReportData(data);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    // Implementation for PDF export
  };

  const exportToCSV = () => {
    // Implementation for CSV export
  };

  return (
    <div>
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Report Settings</h3>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Report Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value as 'daily' | 'custom' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="daily">Daily Report</option>
                  <option value="custom">Custom Date Range</option>
                </select>
              </div>

              {filters.type === 'custom' ? (
                <DateRangePicker
                  startDate={filters.startDate}
                  endDate={filters.endDate}
                  onChange={(start, end) => setFilters({ ...filters, startDate: start, endDate: end })}
                />
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={filters.startDate.toISOString().split('T')[0]}
                    onChange={(e) => setFilters({ ...filters, startDate: new Date(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Patient Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="Stable">Stable</option>
                  <option value="Critical">Critical</option>
                  <option value="Serious">Serious</option>
                  <option value="Discharged">Discharged</option>
                  <option value="Deceased">Deceased</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={generateReport}
              disabled={loading}
              className="btn-primary"
            >
              <FileText className="h-5 w-5 mr-2" />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {reportData && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Report Results</h3>
            <div className="space-x-3">
              <button onClick={exportToPDF} className="btn-secondary">
                <Download className="h-5 w-5 mr-2" />
                Export PDF
              </button>
              <button onClick={exportToCSV} className="btn-secondary">
                <Download className="h-5 w-5 mr-2" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Report display table */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            {/* Table implementation */}
          </div>
        </div>
      )}
    </div>
  );
}