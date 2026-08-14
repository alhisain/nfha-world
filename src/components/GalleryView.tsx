import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Zap, 
  Cpu, 
  Layers, 
  RotateCcw, 
  Flame, 
  Sun, 
  Clock, 
  Wrench, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  Gauge,
  Power
} from 'lucide-react';
import { Machine } from '../types';

interface GalleryViewProps {
  machines: Machine[];
  onToggleMachineStatus: (machineId: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  machines,
  onToggleMachineStatus
}) => {
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  const getMachineIcon = (type: Machine['type']) => {
    switch (type) {
      case 'fiber_laser':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'cnc_milling':
        return <Cpu className="w-5 h-5 text-blue-400" />;
      case 'press_brake':
        return <Layers className="w-5 h-5 text-purple-400" />;
      case 'lathe':
        return <RotateCcw className="w-5 h-5 text-teal-400" />;
      case 'welding_station':
        return <Flame className="w-5 h-5 text-rose-400" />;
      case 'powder_oven':
        return <Sun className="w-5 h-5 text-yellow-400" />;
      default:
        return <Wrench className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: Machine['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            تشغيل نشط
          </span>
        );
      case 'maintenance':
        return (
          <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            صيانة دورية
          </span>
        );
      case 'standby':
        return (
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            جاهز للاستخدام (Standby)
          </span>
        );
    }
  };

  return (
    <div id="view-gallery" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span>معرض الأسطول الصناعي وماكينات ورشة نفحة</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            متابعة الحالة التشغيلية، ساعات العمل، وقدرات ماكينات الليزر والـ CNC والمكابس الهيدروليكية
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-300 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-750">
          <div>الماكينات النشطة: <strong className="text-emerald-400">{machines.filter(m => m.status === 'active').length}</strong> / {machines.length}</div>
          <div className="border-r border-slate-700 pr-4">إجمالي ساعات التشغيل: <strong className="text-amber-400 font-bold">{machines.reduce((a, b) => a + b.totalHours, 0).toLocaleString()} ساعة</strong></div>
        </div>
      </div>

      {/* Grid of Machines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {machines.map((machine) => (
          <div
            key={machine.id}
            className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-sm hover:border-slate-600 transition-all flex flex-col justify-between space-y-4 group"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-750 flex items-center justify-center shadow-inner">
                    {getMachineIcon(machine.type)}
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-amber-400 font-bold">{machine.code}</span>
                    <h4 className="text-xs font-bold text-slate-100">{machine.name}</h4>
                  </div>
                </div>
                {getStatusBadge(machine.status)}
              </div>

              {/* Specs & Capacity */}
              <div className="mt-3.5 space-y-2.5 text-xs">
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-750 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>العلامة والموديل:</span>
                    <span className="font-semibold text-slate-200">{machine.brand}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>القدرة / الطاقة:</span>
                    <span className="font-semibold text-amber-300 font-mono">{machine.power}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                    <span className="block text-slate-500 font-medium">المدى والقدرة التشغيلية:</span>
                    <p className="text-slate-300 mt-0.5">{machine.capacity}</p>
                  </div>
                </div>

                {/* Operating Stats */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-750">
                    <span className="text-slate-500 block">ساعات العمل:</span>
                    <span className="font-bold text-slate-200">{machine.totalHours.toLocaleString()} ساعة</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-750">
                    <span className="text-slate-500 block">الصيانة القادمة:</span>
                    <span className="font-bold text-amber-400">{machine.nextMaintenance}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Operator & Status Toggle Button */}
            <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between">
              <div className="text-xs">
                <span className="text-slate-500 block text-[10px]">المشغل الرئيسي:</span>
                <span className="font-semibold text-slate-300">{machine.operator}</span>
              </div>

              <button
                onClick={() => onToggleMachineStatus(machine.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  machine.status === 'active'
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{machine.status === 'active' ? 'تبديل للاستعداد' : 'تفعيل التشغيل'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
