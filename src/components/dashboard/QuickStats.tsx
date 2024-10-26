import React from 'react';
import { Activity, Users, UserPlus, Heart, UserMinus, AlertTriangle } from 'lucide-react';
import type { QuickStats } from '../../types';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatsCard = ({ title, value, icon, color }: StatsCardProps) => (
  <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
    <div className={`${color} p-4 rounded-lg`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default function QuickStats({ stats }: { stats: QuickStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
      <StatsCard
        title="Total Patients"
        value={stats.totalPatients}
        icon={<Users className="w-6 h-6 text-blue-600" />}
        color="bg-blue-50"
      />
      <StatsCard
        title="Critical Patients"
        value={stats.criticalPatients}
        icon={<Activity className="w-6 h-6 text-red-600" />}
        color="bg-red-50"
      />
      <StatsCard
        title="Stable Patients"
        value={stats.stablePatients}
        icon={<Heart className="w-6 h-6 text-green-600" />}
        color="bg-green-50"
      />
      <StatsCard
        title="New Admissions"
        value={stats.newAdmissions}
        icon={<UserPlus className="w-6 h-6 text-purple-600" />}
        color="bg-purple-50"
      />
      <StatsCard
        title="Discharged Today"
        value={stats.dischargedToday}
        icon={<UserMinus className="w-6 h-6 text-teal-600" />}
        color="bg-teal-50"
      />
      <StatsCard
        title="Deaths Today"
        value={stats.deathsToday}
        icon={<AlertTriangle className="w-6 h-6 text-gray-600" />}
        color="bg-gray-50"
      />
    </div>
  );
}