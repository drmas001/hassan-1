import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FileText, 
  Archive, 
  Settings,
  Activity,
  Bell,
  UserPlus,
  LineChart
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', icon: Home, path: '/' },
  { name: 'Patients', icon: Users, path: '/patients' },
  { name: 'Add Patient', icon: UserPlus, path: '/add-patient' },
  { name: 'Reports', icon: FileText, path: '/reports' },
  { name: 'Monitoring', icon: Activity, path: '/monitoring' },
  { name: 'Analytics', icon: LineChart, path: '/analytics' },
  { name: 'Archive', icon: Archive, path: '/archive' },
  { name: 'Notifications', icon: Bell, path: '/notifications' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow bg-white pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <Activity className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">ICU Manager</span>
        </div>
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}