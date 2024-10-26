import React, { useState } from 'react';
import UserManagement from '../components/admin/UserManagement';
import ReportGenerator from '../components/admin/ReportGenerator';
import { Tabs } from '../components/ui/Tabs';
import { useAuthStore } from '../stores/useAuthStore';
import { Users, FileText } from 'lucide-react';

const tabs = [
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'reports', label: 'Reports', icon: FileText },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('users');
  const { user } = useAuthStore();

  // Redirect if not admin
  if (!user || user.user_metadata.role !== 'Admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
          
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          
          <div className="mt-8">
            {activeTab === 'users' ? (
              <UserManagement />
            ) : (
              <ReportGenerator />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}