import React from 'react';
import { Heart, Thermometer, Activity, Wind } from 'lucide-react';
import type { VitalSigns as VitalSignsType } from '../../types';

interface VitalSignCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  status?: 'normal' | 'warning' | 'critical';
}

const VitalSignCard = ({ title, value, unit, icon, status = 'normal' }: VitalSignCardProps) => {
  const statusColors = {
    normal: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
    critical: 'bg-red-50 text-red-700',
  };

  return (
    <div className={`${statusColors[status]} rounded-lg p-4`}>
      <div className="flex items-center">
        <div className="mr-4">{icon}</div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold">
            {value} <span className="text-sm">{unit}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default function VitalSigns({ vitals }: { vitals: VitalSignsType }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <VitalSignCard
        title="Blood Pressure"
        value={vitals.bloodPressure}
        unit="mmHg"
        icon={<Activity className="h-6 w-6" />}
        status={vitals.bloodPressure === '120/80' ? 'normal' : 'warning'}
      />
      <VitalSignCard
        title="Heart Rate"
        value={vitals.heartRate}
        unit="bpm"
        icon={<Heart className="h-6 w-6" />}
        status={vitals.heartRate > 100 ? 'warning' : 'normal'}
      />
      <VitalSignCard
        title="Temperature"
        value={vitals.temperature}
        unit="°C"
        icon={<Thermometer className="h-6 w-6" />}
        status={vitals.temperature > 38 ? 'warning' : 'normal'}
      />
      <VitalSignCard
        title="O₂ Saturation"
        value={vitals.oxygenSaturation}
        unit="%"
        icon={<Wind className="h-6 w-6" />}
        status={vitals.oxygenSaturation < 95 ? 'critical' : 'normal'}
      />
    </div>
  );
}