import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  AlertCircle, 
  Layers, 
  Tag, 
  DollarSign, 
  Calendar, 
  Cpu, 
  ShieldCheck, 
  Clock, 
  FileText,
  User,
  Wrench,
  KeyRound,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { ProjectTask, ManufacturingStage, TeamMember, Machine } from '../types';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectTask | null;
  onSaveProject: (updatedProject: ProjectTask) => void;
  team: TeamMember[];
  machines: Machine[];
  canModifyPrices: boolean;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  onSaveProject,
  team,
  machines,
  canModifyPrices
}) => {
  if (!isOpen || !project) return null;

  // Form State
  const [code, setCode] = useState(project.code);
  const [title, setTitle] = useState(project.title);
  const [clientName, setClientName] = useState(project.clientName);
  const [clientPhone, setClientPhone] = useState(project.clientPhone);
  const [otpCode, setOtpCode] = useState(project.otpCode);
  const [category, setCategory] = useState<ProjectTask['category']>(project.category);
  const [material, setMaterial] = useState(project.material);
  const [dimensions, setDimensions] = useState(project.dimensions);
  const [quantity, setQuantity] = useState<number>(project.quantity);
  const [totalPrice, setTotalPrice] = useState<number>(project.totalPrice);
  const [paidAmount, setPaidAmount] = useState<number>(project.paidAmount);
  const [expenses, setExpenses] = useState<number>(project.expenses);
  const [status, setStatus] = useState<ProjectTask['status']>(project.status);
  const [priority, setPriority] = useState<ProjectTask['priority']>(project.priority);
  const [startDate, setStartDate] = useState(project.startDate);
  const [deadline, setDeadline] = useState(project.deadline);
  const [notes, setNotes] = useState(project.notes);
  const [blueprintUrl, setBlueprintUrl] = useState(project.blueprintUrl || '');
  const [stages, setStages] = useState<ManufacturingStage[]>(JSON.parse(JSON.stringify(project.stages || [])));
  const [activeTab, setActiveTab] = useState<'info' | 'stages' | 'financials'>('info');
  const [validationError, setValidationError] = useState<string | null>(null);

  // New stage inputs
  const [newStageName, setNewStageName] = useState('');
  const [newStageWeight, setNewStageWeight] = useState<number>(10);
  const [newStageTechnician, setNewStageTechnician] = useState(team[0]?.name || 'م. أحمد رضوان');
  const [newStageMachine, setNewStageMachine] = useState(machines[0]?.name || 'فايبر ليزر 12kW');

  // Recalculate weights
  const totalStagesWeight = stages.reduce((acc, s) => acc + (Number(s.weight) || 0), 0);

  const handleRegenerateOtp = () => {
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setOtpCode(randomOtp);
  };

  const handleUpdateStage = (id: string, field: keyof ManufacturingStage, value: any) => {
    setStages(prev => prev.map(s => {
      if (s.id !== id) return s;
      const updated = { ...s, [field]: value };
      if (field === 'completed' && value === true) {
        updated.progressPercent = 100;
        updated.completedAt = new Date().toISOString().split('T')[0];
      } else if (field === 'progressPercent') {
        updated.completed = Number(value) >= 100;
        if (Number(value) >= 100 && !updated.completedAt) {
          updated.completedAt = new Date().toISOString().split('T')[0];
        }
      }
      return updated;
    }));
  };

  const handleRemoveStage = (id: string) => {
    if (stages.length <= 1) {
      alert('يجب الإبقاء على مرحلة تصنيع واحدة على الأقل');
      return;
    }
    setStages(prev => prev.filter(s => s.id !== id));
  };

  const handleAddStage = () => {
    if (!newStageName.trim()) {
      alert('يرجى إدخال اسم مرحلة التصنيع');
      return;
    }
    const newStage: ManufacturingStage = {
      id: `st-${Date.now()}`,
      name: newStageName.trim(),
      weight: Number(newStageWeight) || 10,
      completed: false,
      progressPercent: 0,
      technician: newStageTechnician,
      machine: newStageMachine
    };
    setStages(prev => [...prev, newStage]);
    setNewStageName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientName.trim()) {
      setValidationError('يرجى كتابة اسم المشروع واسم العميل');
      return;
    }

    const updated: ProjectTask = {
      ...project,
      code,
      title: title.trim(),
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      otpCode: otpCode.trim() || project.otpCode,
      category,
      material: material.trim(),
      dimensions: dimensions.trim(),
      quantity: Number(quantity) || 1,
      totalPrice: Number(totalPrice) || 0,
      paidAmount: Number(paidAmount) || 0,
      expenses: Number(expenses) || 0,
      status,
      priority,
      startDate,
      deadline,
      notes: notes.trim(),
      blueprintUrl: blueprintUrl.trim(),
      stages
    };

    onSaveProject(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 my-6 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">تعديل بيانات وأمر الشغل:</h3>
                <span className="font-mono text-xs font-bold text-amber-400 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
                  {code}
                </span>
              </div>
              <p className="text-xs text-slate-400">تحديث تفاصيل العميل، الخامات، الأوزان والمراحل الإنتاجية</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'info'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>البيانات والمواصفات الفنية</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stages')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'stages'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>مراحل التصنيع وتوزيع الأوزان ({stages.length})</span>
            {totalStagesWeight !== 100 && (
              <span className="bg-amber-900/80 text-amber-300 text-[10px] px-1.5 py-0.2 rounded font-mono">
                {totalStagesWeight}%
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('financials')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'financials'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>المالية والمدفوعات</span>
          </button>
        </div>

        {validationError && (
          <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form id="edit-project-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
          
          {/* TAB 1: General & Technical Info */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              {/* Title and Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 mb-1 font-medium">اسم ووصف أمر الشغل:</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">كود المشروع (ID):</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Client Info & OTP */}
              <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-750 space-y-3">
                <h4 className="font-bold text-slate-200 flex items-center gap-2 text-xs">
                  <User className="w-4 h-4 text-blue-400" />
                  <span>بيانات العميل ورمز المتابعة (OTP)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">اسم العميل / المؤسسة:</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">رقم الهاتف / الواتساب:</label>
                    <input
                      type="text"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">كود الدخول للعميل (OTP):</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={handleRegenerateOtp}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                        title="توليد كود عشوائي جديد"
                      >
                        <RefreshCw className="w-4 h-4 text-amber-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">تصنيف العملية:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="هياكل معدنية">هياكل معدنية</option>
                    <option value="قطع غيار CNC">قطع غيار CNC</option>
                    <option value="قص وتشكيل صاج">قص وتشكيل صاج</option>
                    <option value="تصنيع ميكانيكي">تصنيع ميكانيكي</option>
                    <option value="أفران ودهان حراري">أفران ودهان حراري</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">مواصفة الخامة / السبيكة:</label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="مثال: صاج ST-52 سماكة 6mm"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">الأبعاد الكلية:</label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="مثال: 1500 × 800 × 600 mm"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Quantity, Status & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">الكمية المطلوبة (قطعة):</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">حالة أمر الشغل الحالية:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 font-semibold"
                  >
                    <option value="new">جديد وتدقيق CAD</option>
                    <option value="design">إعداد الـ Nesting والبرمجة</option>
                    <option value="cutting">القص بالليزر والتشكيل</option>
                    <option value="welding_assembly">اللحام والتجميع الهيكلي</option>
                    <option value="finishing">الدهان الحراري والمعالجة</option>
                    <option value="quality_check">فحص الجودة والتسليم</option>
                    <option value="delivered">تم التسليم للعميل بالكامل</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">درجة الأولوية:</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 font-semibold"
                  >
                    <option value="urgent">عاجل جداً (أولوية قصوى)</option>
                    <option value="high">أولوية عالية</option>
                    <option value="medium">أولوية عادية</option>
                    <option value="low">منخفض</option>
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">تاريخ بدء التشغيل:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">تاريخ التسليم النهائي (Deadline):</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Blueprint URL */}
              <div>
                <label className="block text-slate-300 mb-1 font-medium">رابط المخطط الهندسي / الرسم التنفيذي CAD (URL):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={blueprintUrl}
                    onChange={(e) => setBlueprintUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                  {blueprintUrl && (
                    <img
                      src={blueprintUrl}
                      alt="Preview"
                      className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-300 mb-1 font-medium">ملاحظات وتعليمات المهندس للورشة:</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Manufacturing Stages & Weights */}
          {activeTab === 'stages' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-850 border border-slate-750 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">توزيع أوزان مراحل التصنيع</h4>
                  <p className="text-[11px] text-slate-400">مجموع الأوزان الحسابية للمراحل يجب أن يساوي 100% لحساب نسبة الإنجاز بدقة</p>
                </div>
                <div className={`px-3 py-1 rounded-lg font-mono font-bold text-xs ${
                  totalStagesWeight === 100 
                    ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' 
                    : 'bg-amber-950 border border-amber-800 text-amber-300 animate-pulse'
                }`}>
                  الإجمالي: {totalStagesWeight}%
                </div>
              </div>

              {/* Existing Stages List */}
              <div className="space-y-2.5">
                {stages.map((stage, idx) => (
                  <div key={stage.id} className="p-3 bg-slate-800 border border-slate-700 rounded-xl space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-slate-400 text-[10px] font-mono flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={stage.name}
                          onChange={(e) => handleUpdateStage(stage.id, 'name', e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-100 font-semibold focus:outline-none focus:border-amber-500 w-48 sm:w-64"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-400">الوزن:</span>
                          <input
                            type="number"
                            min={1}
                            max={100}
                            value={stage.weight}
                            onChange={(e) => handleUpdateStage(stage.id, 'weight', Number(e.target.value))}
                            className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-center text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                          />
                          <span className="text-slate-400 text-xs">%</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-400">الإنجاز:</span>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={stage.progressPercent}
                            onChange={(e) => handleUpdateStage(stage.id, 'progressPercent', Number(e.target.value))}
                            className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-center text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                          />
                          <span className="text-slate-400 text-xs">%</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveStage(stage.id)}
                          className="p-1.5 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60"
                          title="حذف هذه المرحلة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-750 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <User className="w-3.5 h-3.5 text-blue-400" />
                        <span>الفني المشرف:</span>
                        <select
                          value={stage.technician}
                          onChange={(e) => handleUpdateStage(stage.id, 'technician', e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[11px] text-slate-200 flex-1"
                        >
                          {team.map(t => (
                            <option key={t.id} value={t.name}>{t.name} ({t.role})</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Wrench className="w-3.5 h-3.5 text-purple-400" />
                        <span>الماكينة / المحطة:</span>
                        <select
                          value={stage.machine || machines[0]?.name}
                          onChange={(e) => handleUpdateStage(stage.id, 'machine', e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[11px] text-slate-200 flex-1"
                        >
                          {machines.map(m => (
                            <option key={m.id} value={m.name}>{m.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Stage Row */}
              <div className="p-3 bg-slate-900 border border-dashed border-slate-700 rounded-xl space-y-2">
                <span className="font-bold text-slate-300 text-xs block">إضافة مرحلة تصنيع مخصصة للأمر:</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="اسم المرحلة (مثال: جلفنة وتغطيس)"
                    value={newStageName}
                    onChange={(e) => setNewStageName(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 sm:col-span-2"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      placeholder="الوزن %"
                      value={newStageWeight}
                      onChange={(e) => setNewStageWeight(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 font-mono text-center"
                    />
                    <span className="text-slate-400 text-xs">%</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddStage}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs flex items-center justify-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>إضافة</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Financials */}
          {activeTab === 'financials' && (
            <div className="space-y-4">
              {!canModifyPrices && (
                <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-amber-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>تنبيه: تعديل الأسعار محمي، يرجى الحصول على صلاحية من المدير لتعديل الأرقام.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-750 space-y-1.5">
                  <label className="block text-slate-300 font-medium text-xs">إجمالي قيمة العقد / التكلفة:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      disabled={!canModifyPrices}
                      value={totalPrice}
                      onChange={(e) => setTotalPrice(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-amber-400 font-mono font-bold text-sm focus:outline-none focus:border-amber-500 disabled:opacity-60"
                    />
                    <span className="text-slate-400 text-xs">SAR</span>
                  </div>
                </div>

                <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-750 space-y-1.5">
                  <label className="block text-slate-300 font-medium text-xs">الدفعة المحصلة من العميل:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      disabled={!canModifyPrices}
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-emerald-400 font-mono font-bold text-sm focus:outline-none focus:border-amber-500 disabled:opacity-60"
                    />
                    <span className="text-slate-400 text-xs">SAR</span>
                  </div>
                </div>

                <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-750 space-y-1.5">
                  <label className="block text-slate-300 font-medium text-xs">تكاليف وخامات الورشة للمشروع:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      disabled={!canModifyPrices}
                      value={expenses}
                      onChange={(e) => setExpenses(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-rose-400 font-mono font-bold text-sm focus:outline-none focus:border-amber-500 disabled:opacity-60"
                    />
                    <span className="text-slate-400 text-xs">SAR</span>
                  </div>
                </div>
              </div>

              {/* Financial Calculation summary */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">المتبقي على العميل:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {Math.max(0, totalPrice - paidAmount).toLocaleString()} SAR
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">نسبة التحصيل:</span>
                  <span className="font-mono font-bold text-blue-400">
                    {totalPrice > 0 ? Math.round((paidAmount / totalPrice) * 100) : 0}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">صافي الربح المتوقع:</span>
                  <span className={`font-mono font-bold ${
                    totalPrice - expenses >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {(totalPrice - expenses).toLocaleString()} SAR
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">هامش الربح (%):</span>
                  <span className="font-mono font-bold text-amber-400">
                    {totalPrice > 0 ? Math.round(((totalPrice - expenses) / totalPrice) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-700 pt-4 shrink-0">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>تاريخ الإنشاء: {project.createdAt || project.startDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-950/40 transition-all"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>حفظ التعديلات في النظام</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
