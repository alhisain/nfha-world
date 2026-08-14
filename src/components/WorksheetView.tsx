import React, { useState } from 'react';
import { 
  Kanban as KanbanIcon, 
  Search, 
  Filter, 
  Layers, 
  Calendar, 
  Phone, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Sparkles,
  Maximize2,
  Cpu,
  User,
  Zap,
  Tag,
  Edit3,
  Trash2,
  Database,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { ProjectTask, ViewType } from '../types';

interface WorksheetViewProps {
  projects: ProjectTask[];
  onSelectProject: (projectId: string) => void;
  onSelectView: (view: ViewType) => void;
  onOpenNewProject: () => void;
  onUpdateProjectStatus: (projectId: string, newStatus: ProjectTask['status']) => void;
  onEditProject?: (project: ProjectTask) => void;
  onDeleteProject?: (project: ProjectTask) => void;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  isRealDataMode?: boolean;
  onToggleRealDataMode?: () => void;
  onClearMockProjects?: () => void;
  onRestoreMockProjects?: () => void;
}

export const WorksheetView: React.FC<WorksheetViewProps> = ({
  projects,
  onSelectProject,
  onSelectView,
  onOpenNewProject,
  onUpdateProjectStatus,
  onEditProject,
  onDeleteProject,
  canCreate = true,
  canEdit = true,
  canDelete = true,
  isRealDataMode = false,
  onToggleRealDataMode,
  onClearMockProjects,
  onRestoreMockProjects
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedBlueprint, setSelectedBlueprint] = useState<ProjectTask | null>(null);

  const columns: { id: ProjectTask['status']; title: string; color: string; bg: string }[] = [
    { id: 'new', title: 'جديد وتدقيق CAD', color: 'border-slate-500 text-slate-300', bg: 'bg-slate-800/40' },
    { id: 'design', title: 'إعداد الـ Nesting والبرمجة', color: 'border-amber-500 text-amber-400', bg: 'bg-amber-950/20' },
    { id: 'cutting', title: 'القص بالليزر والتشكيل', color: 'border-blue-500 text-blue-400', bg: 'bg-blue-950/20' },
    { id: 'welding_assembly', title: 'اللحام والتجميع الهيكلي', color: 'border-purple-500 text-purple-400', bg: 'bg-purple-950/20' },
    { id: 'finishing', title: 'الدهان الحراري والمعالجة', color: 'border-teal-500 text-teal-400', bg: 'bg-teal-950/20' },
    { id: 'quality_check', title: 'فحص الجودة والتسليم', color: 'border-emerald-500 text-emerald-400', bg: 'bg-emerald-950/20' },
  ];

  const filteredProjects = projects.filter(p => {
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    const matchesSearch = !searchFilter || 
      p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.material.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getPriorityBadge = (priority: ProjectTask['priority']) => {
    switch (priority) {
      case 'urgent':
        return <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] px-2 py-0.5 rounded font-bold">عاجل جداً</span>;
      case 'high':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded font-bold">أولوية عالية</span>;
      case 'medium':
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] px-2 py-0.5 rounded">عادي</span>;
      default:
        return <span className="bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded">منخفض</span>;
    }
  };

  const getOverallProgress = (task: ProjectTask) => {
    if (!task.stages || task.stages.length === 0) return 0;
    const sum = task.stages.reduce((acc, stage) => acc + (stage.weight * (stage.progressPercent / 100)), 0);
    return Math.round(sum);
  };

  return (
    <div id="view-worksheet" className="space-y-4">
      {/* Real Workshop vs Demo Data Notice Banner */}
      <div className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
        isRealDataMode 
          ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
          : 'bg-amber-950/40 border-amber-800/60 text-amber-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <Database className={`w-4 h-4 ${isRealDataMode ? 'text-emerald-400' : 'text-amber-400'}`} />
          <div className="text-xs">
            <span className="font-bold">
              {isRealDataMode ? 'سجل مشاريع الورشة الفعلي (مفعل)' : 'وضع العرض النموذجي (مشاريع افتراضية تجريبية)'}
            </span>
            <p className="text-[11px] opacity-80">
              {isRealDataMode 
                ? 'يتم عرض وتخزين المشاريع الحقيقية المضافة من المدير والمهندسين استناداً لنشاط الورشة اليومي.'
                : 'المشاريع الحالية هي نماذج افتراضية للعرض. يمكنك تفريغها والبدء بإضافة أوامر الشغل الحقيقية للورشة.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onClearMockProjects && (
            <button
              onClick={onClearMockProjects}
              className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
              title="تفريغ القائمة للبدء بسجل الورشة الفعلي"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>تفريغ وبدء السجل الفعلي</span>
            </button>
          )}

          {onRestoreMockProjects && (
            <button
              onClick={onRestoreMockProjects}
              className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
              title="استعادة نماذج المشاريع الافتراضية"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>استعادة النماذج</span>
            </button>
          )}
        </div>
      </div>

      {/* Control Bar: Filters and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-800/90 border border-slate-700/80 rounded-xl">
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>تصنيف العمليات:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">جميع التصنيفات ({projects.length})</option>
              <option value="هياكل معدنية">هياكل معدنية</option>
              <option value="قطع غيار CNC">قطع غيار CNC</option>
              <option value="قص وتشكيل صاج">قص وتشكيل صاج</option>
              <option value="تصنيع ميكانيكي">تصنيع ميكانيكي</option>
              <option value="أفران ودهان حراري">أفران ودهان حراري</option>
            </select>
          </div>

          {/* Quick Search */}
          <div className="relative w-52">
            <input
              type="text"
              placeholder="فلترة بالخامة أو الكود..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canCreate && (
            <button
              onClick={onOpenNewProject}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>إضافة أمر شغل جديد</span>
            </button>
          )}
        </div>
      </div>

      {/* Empty State when no projects exist in real mode */}
      {filteredProjects.length === 0 && (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-200">لا توجد أوامر تشغيل مسجلة حالياً</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            يمكن للمدير والمهندسين إضافة أوامر الشغل الفعلية حسب نشاط الورشة اليومي وتوزيع مراحلها الإنتاجية.
          </p>
          {canCreate && (
            <button
              onClick={onOpenNewProject}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>إضافة أول مشروع فعلي</span>
            </button>
          )}
        </div>
      )}

      {/* Kanban Board Grid */}
      {filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colProjects = filteredProjects.filter(p => p.status === col.id);
            return (
              <div 
                key={col.id}
                className="rounded-xl border border-slate-700/80 bg-slate-850/70 p-3 flex flex-col min-h-[480px] shadow-sm"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.color.replace('border-', 'bg-').split(' ')[0]}`}></span>
                    <h4 className="text-xs font-bold text-slate-200 truncate">
                      {col.title}
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
                    {colProjects.length}
                  </span>
                </div>

                {/* Tasks List inside Column */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colProjects.length === 0 ? (
                    <div className="h-32 flex flex-col items-center justify-center text-slate-500 text-[11px] border border-dashed border-slate-700/60 rounded-lg p-2 text-center">
                      لا توجد أوامر تشغيل في هذه المرحلة حالياً
                    </div>
                  ) : (
                    colProjects.map((project) => {
                      const progress = getOverallProgress(project);
                      return (
                        <div
                          key={project.id}
                          className="bg-slate-800 border border-slate-700 rounded-xl p-3.5 shadow-sm hover:border-amber-500/60 transition-all group relative space-y-2.5"
                        >
                          {/* Top Code, Priority, and Edit/Delete Actions */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-amber-400">
                              {project.code}
                            </span>
                            
                            <div className="flex items-center gap-1">
                              {getPriorityBadge(project.priority)}
                              
                              {/* Edit Button */}
                              {canEdit && onEditProject && (
                                <button
                                  onClick={() => onEditProject(project)}
                                  className="p-1 rounded bg-slate-700/80 hover:bg-slate-600 text-slate-300 hover:text-amber-300 transition-colors"
                                  title="تعديل بيانات وأمر الشغل"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              )}

                              {/* Delete Button */}
                              {canDelete && onDeleteProject && (
                                <button
                                  onClick={() => onDeleteProject(project)}
                                  className="p-1 rounded bg-slate-700/80 hover:bg-rose-900/80 text-slate-300 hover:text-rose-300 transition-colors"
                                  title="حذف هذا المشروع"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Title */}
                          <h5 className="text-xs font-bold text-slate-100 leading-snug">
                            {project.title}
                          </h5>

                          {/* Material Specs */}
                          <div className="text-[11px] text-slate-300 bg-slate-900/80 p-2 rounded-lg border border-slate-750 space-y-1">
                            <div className="flex items-center gap-1 text-slate-400">
                              <Tag className="w-3 h-3 text-amber-400 shrink-0" />
                              <span className="truncate">{project.material}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-400">
                              <span>الأبعاد: {project.dimensions}</span>
                              <span className="font-mono text-slate-200">الكمية: {project.quantity}</span>
                            </div>
                          </div>

                          {/* Client Info & Financials */}
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span className="truncate">{project.clientName}</span>
                            <span className="font-mono text-amber-300 font-semibold">{project.totalPrice.toLocaleString()} SAR</span>
                          </div>

                          {/* Manufacturing Progress */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span>نسبة الإنجاز الوزني:</span>
                              <span className="font-mono text-emerald-400 font-bold">{progress}%</span>
                            </div>
                            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Blueprint Thumbnail if exists */}
                          {project.blueprintUrl && (
                            <div 
                              onClick={() => setSelectedBlueprint(project)}
                              className="relative h-20 rounded-lg overflow-hidden border border-slate-700 cursor-pointer group/img"
                            >
                              <img 
                                src={project.blueprintUrl} 
                                alt="CAD Drawing"
                                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center text-[10px] text-white opacity-0 group-hover/img:opacity-100 transition-opacity gap-1">
                                <Maximize2 className="w-3 h-3" />
                                <span>معاينة الرسم الهندسي</span>
                              </div>
                            </div>
                          )}

                          {/* Actions: Move Stage / Open Manufacturing */}
                          <div className="pt-2 border-t border-slate-700/70 flex items-center justify-between gap-1.5">
                            <button
                              onClick={() => {
                                onSelectProject(project.id);
                                onSelectView('manufacturing');
                              }}
                              className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                            >
                              <Cpu className="w-3 h-3" />
                              <span>المراحل والتصنيع</span>
                            </button>

                            {/* Quick Advance Status Dropdown */}
                            <select
                              value={project.status}
                              onChange={(e) => onUpdateProjectStatus(project.id, e.target.value as any)}
                              className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-300 focus:outline-none focus:border-amber-500"
                            >
                              <option value="new">جديد</option>
                              <option value="design">برمجة Nesting</option>
                              <option value="cutting">قص بالليزر</option>
                              <option value="welding_assembly">لحام وتجميع</option>
                              <option value="finishing">دهان ومعالجة</option>
                              <option value="quality_check">فحص وتسليم</option>
                              <option value="delivered">تم التسليم</option>
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Blueprint CAD Drawing Modal */}
      {selectedBlueprint && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xs flex items-center justify-center p-4" dir="rtl">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>المخطط الهندسي وأمر الشغل: {selectedBlueprint.code}</span>
                </h3>
                <p className="text-[11px] text-slate-400">{selectedBlueprint.title}</p>
              </div>
              <button 
                onClick={() => setSelectedBlueprint(null)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 h-80 flex items-center justify-center">
              <img 
                src={selectedBlueprint.blueprintUrl} 
                alt="CAD Blueprint"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/80 p-3.5 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">الخامة المطلوبة:</span>
                <span className="font-semibold text-slate-200">{selectedBlueprint.material}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">الأبعاد الكلية:</span>
                <span className="font-semibold text-slate-200">{selectedBlueprint.dimensions}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">الكمية المصنعة:</span>
                <span className="font-semibold text-slate-200">{selectedBlueprint.quantity} قطعة</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">تاريخ التسليم:</span>
                <span className="font-semibold text-amber-400 font-mono">{selectedBlueprint.deadline}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-200">
              <span className="font-bold block mb-1">تعليمات المهندس للورشة:</span>
              <p className="text-[11px] text-amber-300/90">{selectedBlueprint.notes}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedBlueprint(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                إغلاق
              </button>
              <button
                onClick={() => {
                  onSelectProject(selectedBlueprint.id);
                  setSelectedBlueprint(null);
                  onSelectView('manufacturing');
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>الانتقال لمراحل التصنيع (%)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

