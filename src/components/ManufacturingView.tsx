import React, { useState } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  Circle, 
  Layers, 
  User, 
  Wrench, 
  Percent, 
  Sparkles, 
  Clock, 
  AlertTriangle,
  Plus,
  Save,
  CheckCheck,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Edit3,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProjectTask, ManufacturingStage, ViewType } from '../types';

interface ManufacturingViewProps {
  projects: ProjectTask[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  onUpdateStageProgress: (projectId: string, stageId: string, progress: number, completed: boolean) => void;
  onAddCustomStage: (projectId: string, newStage: Omit<ManufacturingStage, 'id'>) => void;
  onSelectView: (view: ViewType) => void;
  onEditProject?: (project: ProjectTask) => void;
  onDeleteProject?: (project: ProjectTask) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const ManufacturingView: React.FC<ManufacturingViewProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  onUpdateStageProgress,
  onAddCustomStage,
  onSelectView,
  onEditProject,
  onDeleteProject,
  canEdit = true,
  canDelete = true
}) => {
  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];


  const [showAddStageModal, setShowAddStageModal] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [newStageWeight, setNewStageWeight] = useState<number>(10);
  const [newStageTechnician, setNewStageTechnician] = useState('م. أحمد رضوان');
  const [newStageMachine, setNewStageMachine] = useState('فايبر ليزر 12kW');

  // Calculate Cumulative Weighted Progress
  const calculateTotalProgress = (task: ProjectTask) => {
    if (!task?.stages || task.stages.length === 0) return 0;
    const total = task.stages.reduce((acc, s) => acc + (s.weight * (s.progressPercent / 100)), 0);
    return Math.min(100, Math.round(total));
  };

  const currentOverallProgress = calculateTotalProgress(currentProject);
  const totalWeightConfigured = currentProject?.stages?.reduce((acc, s) => acc + s.weight, 0) || 0;

  const handleStageToggle = (stage: ManufacturingStage) => {
    const nextCompleted = !stage.completed;
    const nextProgress = nextCompleted ? 100 : 0;
    onUpdateStageProgress(currentProject.id, stage.id, nextProgress, nextCompleted);

    // If reaching 100% on total project
    const simulatedTotal = currentProject.stages.reduce((acc, s) => {
      const p = s.id === stage.id ? nextProgress : s.progressPercent;
      return acc + (s.weight * (p / 100));
    }, 0);

    if (simulatedTotal >= 99.5) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleSliderChange = (stageId: string, val: number) => {
    const isDone = val >= 100;
    onUpdateStageProgress(currentProject.id, stageId, val, isDone);

    if (val >= 100) {
      const simulatedTotal = currentProject.stages.reduce((acc, s) => {
        const p = s.id === stageId ? 100 : s.progressPercent;
        return acc + (s.weight * (p / 100));
      }, 0);
      if (simulatedTotal >= 99.5) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleAddStageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStageName && newStageWeight > 0) {
      onAddCustomStage(currentProject.id, {
        name: newStageName,
        weight: newStageWeight,
        completed: false,
        progressPercent: 0,
        technician: newStageTechnician,
        machine: newStageMachine,
      });
      setShowAddStageModal(false);
      setNewStageName('');
    }
  };

  return (
    <div id="view-manufacturing" className="space-y-6">
      {/* Project Selector & Overview Header */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-amber-400 font-semibold flex items-center gap-1.5 mb-1">
              <Cpu className="w-4 h-4" /> نظام تتبع مراحل التصنيع الوزنية
            </span>
            <h3 className="text-lg font-extrabold text-slate-100">
              {currentProject?.title} ({currentProject?.code})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              العميل: <span className="text-slate-200 font-semibold">{currentProject?.clientName}</span> | الخامة: <span className="text-slate-200">{currentProject?.material}</span>
            </p>
          </div>

          {/* Project Switcher Dropdown & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400">تبديل المشروع:</span>
            <select
              value={currentProject?.id}
              onChange={(e) => onSelectProject(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-amber-400 focus:outline-none focus:border-amber-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.title.slice(0, 30)}...
                </option>
              ))}
            </select>

            {/* Direct Edit Button */}
            {canEdit && onEditProject && currentProject && (
              <button
                onClick={() => onEditProject(currentProject)}
                className="px-3 py-2 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-slate-200 hover:text-amber-300 text-xs font-semibold flex items-center gap-1 transition-all"
                title="تعديل تفاصيل وأسعار ومراحل المشروع"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>تعديل المشروع</span>
              </button>
            )}

            {/* Direct Delete Button */}
            {canDelete && onDeleteProject && currentProject && (
              <button
                onClick={() => onDeleteProject(currentProject)}
                className="px-3 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-1 transition-all"
                title="حذف هذا المشروع نهائياً"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف</span>
              </button>
            )}
          </div>
        </div>

        {/* Overall Cumulative Progress Meter */}
        <div className="bg-slate-900/80 border border-slate-750 p-4 rounded-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-200">الإنجاز التراكمي الموزون للورشة:</span>
              <span className="text-xl font-extrabold font-mono text-emerald-400">
                {currentOverallProgress}%
              </span>
              {currentOverallProgress >= 100 && (
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <CheckCheck className="w-3 h-3" /> تم اكتمال كافة مراحل التصنيع
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <span>مجموع أوزان المراحل: <strong className={totalWeightConfigured === 100 ? 'text-emerald-400' : 'text-amber-400'}>{totalWeightConfigured}%</strong></span>
              <span>المراحل المكتملة: <strong className="text-slate-200">{currentProject?.stages?.filter(s => s.completed).length} من {currentProject?.stages?.length}</strong></span>
            </div>
          </div>

          {/* Large Progress Bar */}
          <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500 h-full rounded-full transition-all duration-700 shadow-inner"
              style={{ width: `${currentOverallProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Stages Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>قائمة مراحل التصنيع والأوزان الحسابية (Step Weights)</span>
          </h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddStageModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>إضافة مرحلة تصنيع مخصصة</span>
            </button>
            <button
              onClick={() => onSelectView('reports')}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-semibold text-amber-300 flex items-center gap-1.5 transition-all"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>تصدير تقرير التصنيع (PDF)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {currentProject?.stages?.map((stage, index) => {
            const isFinished = stage.completed || stage.progressPercent === 100;
            const weightedValue = ((stage.weight * stage.progressPercent) / 100).toFixed(1);

            return (
              <div
                key={stage.id}
                className={`p-4 rounded-xl border transition-all ${
                  isFinished 
                    ? 'bg-slate-850/80 border-emerald-500/40 shadow-xs' 
                    : 'bg-slate-800/90 border-slate-700/90 hover:border-slate-600'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  {/* Stage Title and Number */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleStageToggle(stage)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                        isFinished 
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40' 
                          : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                      }`}
                      title={isFinished ? 'اضغط لتعيين غير مكتمل' : 'اضغط للإنهاء التلقائي 100%'}
                    >
                      {isFinished ? <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> : <Circle className="w-4 h-4" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 font-mono">#{index + 1}</span>
                        <h5 className={`text-sm font-bold ${isFinished ? 'text-emerald-300' : 'text-slate-100'}`}>
                          {stage.name}
                        </h5>
                      </div>
                      {stage.notes && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{stage.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Weight and Calculated Contribution */}
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <div className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-750 text-slate-300">
                      وزن المرحلة: <strong className="text-amber-400">{stage.weight}%</strong>
                    </div>
                    <div className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-750 text-slate-300">
                      المساهمة الفعلية: <strong className="text-emerald-400">{weightedValue}%</strong>
                    </div>
                  </div>
                </div>

                {/* Slider and Resource Details */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-slate-900/60 p-3 rounded-lg border border-slate-750">
                  {/* Slider Progress (7 cols) */}
                  <div className="lg:col-span-7 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>نسبة إنجاز المرحلة:</span>
                      <span className="font-bold text-slate-200">{stage.progressPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={stage.progressPercent}
                      onChange={(e) => handleSliderChange(stage.id, Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  {/* Machine & Technician Info (5 cols) */}
                  <div className="lg:col-span-5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 border-t lg:border-t-0 lg:border-r border-slate-700/60 pt-2 lg:pt-0 lg:pr-4">
                    <div className="flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-slate-400">المعدة:</span>
                      <span className="font-semibold text-slate-200">{stage.machine || 'خط التجميع اليدوي'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-slate-400">الفني:</span>
                      <span className="font-semibold text-slate-200">{stage.technician}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Stage Modal */}
      {showAddStageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>إضافة مرحلة تصنيع جديدة للمشروع</span>
              </h3>
              <button 
                onClick={() => setShowAddStageModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStageSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">اسم مرحلة التصنيع:</label>
                <input
                  type="text"
                  placeholder="مثال: المعايرة بجهاز CMM أو التغليف والتلميع"
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">الوزن النسبي (%):</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newStageWeight}
                    onChange={(e) => setNewStageWeight(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono font-bold focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">الفني المسؤول:</label>
                  <input
                    type="text"
                    value={newStageTechnician}
                    onChange={(e) => setNewStageTechnician(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">ماكينة أو خط التشغيل:</label>
                <input
                  type="text"
                  value={newStageMachine}
                  onChange={(e) => setNewStageMachine(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStageModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  إضافة المرحلة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
