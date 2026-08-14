import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  Layers, 
  DollarSign, 
  Calendar, 
  Tag, 
  ShieldCheck, 
  Cpu, 
  Wrench, 
  User, 
  FileText,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { ProjectTask, ManufacturingStage, TeamMember, Machine } from '../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: ProjectTask) => void;
  nextProjectNumber: number;
  team?: TeamMember[];
  machines?: Machine[];
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
  nextProjectNumber,
  team = [],
  machines = []
}) => {
  const generatedCode = `NF-2026-0${nextProjectNumber}`;
  const [customOtp, setCustomOtp] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());

  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('+966 50 ');
  const [category, setCategory] = useState<ProjectTask['category']>('هياكل معدنية');
  const [material, setMaterial] = useState('فولاذ ST-52 سماكة 6mm');
  const [dimensions, setDimensions] = useState('1500 × 1000 × 800 mm');
  const [quantity, setQuantity] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(8500);
  const [paidAmount, setPaidAmount] = useState<number>(4500);
  const [expenses, setExpenses] = useState<number>(3800);
  const [priority, setPriority] = useState<ProjectTask['priority']>('high');
  const [deadline, setDeadline] = useState('2026-09-10');
  const [blueprintUrl, setBlueprintUrl] = useState('https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80');
  const [notes, setNotes] = useState('مراعاة استقامة الأبعاد والتثبيت الدقيق قبل اللحام النهائي وفحص الجودة.');
  const [workflowTemplate, setWorkflowTemplate] = useState<'standard' | 'cnc' | 'sheet' | 'custom'>('standard');

  if (!isOpen) return null;

  const handleRegenerateOtp = () => {
    setCustomOtp(Math.floor(1000 + Math.random() * 9000).toString());
  };

  const getPresetStages = (type: string): ManufacturingStage[] => {
    switch (type) {
      case 'cnc':
        return [
          { id: 's1', name: 'القطع الأولي والخراطة CNC', weight: 25, completed: false, progressPercent: 0, technician: 'فني ماهر الكردي', machine: 'مخرطة ميكانيكية دقيقة CNC Lathe' },
          { id: 's2', name: 'التفريز والتشغيل 4-Axis VMC', weight: 35, completed: false, progressPercent: 0, technician: 'م. أحمد رضوان', machine: 'مركز تشغيل فريزة عمودية 4 محاور' },
          { id: 's3', name: 'المعالجة الحرارية والتصليد', weight: 20, completed: false, progressPercent: 0, technician: 'فني طارق سالم', machine: 'فرن التصليد' },
          { id: 's4', name: 'التجليخ وفحص الجودة والمعايرة', weight: 20, completed: false, progressPercent: 0, technician: 'المهندس الحسين', machine: 'جهاز CMM للمعايرة' }
        ];
      case 'sheet':
        return [
          { id: 's1', name: 'برمجة Nesting وقص الليزر', weight: 30, completed: false, progressPercent: 0, technician: 'م. أحمد رضوان', machine: 'فايبر ليزر 12kW عالية السرعة' },
          { id: 's2', name: 'الثني على مكبح 200T', weight: 25, completed: false, progressPercent: 0, technician: 'فني طارق سالم', machine: 'مكبح ثني هيدروليكي CNC Press Brake' },
          { id: 's3', name: 'اللحام الخفيف والتنظيف', weight: 25, completed: false, progressPercent: 0, technician: 'فني حسام الدين', machine: 'محطة لحام نبضي TIG/MIG' },
          { id: 's4', name: 'الدهان الحراري والفرن', weight: 20, completed: false, progressPercent: 0, technician: 'فني بلال', machine: 'فرن معالجة ودهان بودرة حراري' }
        ];
      default:
        return [
          { id: 's1', name: 'القص بالليزر Fiber Laser', weight: 20, completed: false, progressPercent: 0, technician: 'م. أحمد رضوان', machine: 'فايبر ليزر 12kW عالية السرعة' },
          { id: 's2', name: 'الثني والتشكيل CNC Press Brake', weight: 15, completed: false, progressPercent: 0, technician: 'فني طارق سالم', machine: 'مكبح ثني هيدروليكي CNC Press Brake' },
          { id: 's3', name: 'الخراطة والتفريز CNC', weight: 20, completed: false, progressPercent: 0, technician: 'فني ماهر الكردي', machine: 'مركز تشغيل فريزة عمودية 4 محاور' },
          { id: 's4', name: 'اللحام والتجميع الهيكلي TIG/MIG', weight: 25, completed: false, progressPercent: 0, technician: 'فني حسام الدين', machine: 'محطة لحام نبضي TIG/MIG' },
          { id: 's5', name: 'المعالجة السطحية والدهان الحراري', weight: 10, completed: false, progressPercent: 0, technician: 'فني بلال', machine: 'فرن معالجة ودهان بودرة حراري' },
          { id: 's6', name: 'فحص الجودة والمعايرة والتسليم', weight: 10, completed: false, progressPercent: 0, technician: 'المهندس الحسين', machine: 'جهاز CMM للمعايرة' }
        ];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientName.trim()) {
      alert('يرجى كتابة اسم المشروع واسم العميل');
      return;
    }

    const stages = getPresetStages(workflowTemplate);

    const newProject: ProjectTask = {
      id: `proj-${Date.now()}`,
      code: generatedCode,
      title: title.trim(),
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      otpCode: customOtp,
      category,
      material: material.trim(),
      dimensions: dimensions.trim(),
      quantity: Number(quantity) || 1,
      totalPrice: Number(totalPrice) || 0,
      paidAmount: Number(paidAmount) || 0,
      expenses: Number(expenses) || Math.round(Number(totalPrice) * 0.45),
      status: 'new',
      priority,
      startDate: new Date().toISOString().split('T')[0],
      deadline,
      stages,
      notes: notes.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      blueprintUrl: blueprintUrl.trim()
    };

    onCreateProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-100">إضافة أمر شغل ومشروع هندسي جديد</span>
              <span className="text-xs font-mono font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {generatedCode}
              </span>
            </div>
            <p className="text-xs text-slate-400">تسجيل أمر تشغيل واقعي للورشة مع توليد كود OTP للعميل</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Project Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 mb-1 font-medium">اسم ووصف أمر الشغل:</label>
              <input
                type="text"
                placeholder="مثال: شاسيه ميكانيكي لخط تعبئة أوتوماتيكي"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
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
          </div>

          {/* Client Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-850 p-3 rounded-xl border border-slate-750">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">اسم العميل / الشركة:</label>
              <input
                type="text"
                placeholder="مثال: شركة النقاء للصناعات الغذائية"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">رقم الهاتف والتواصل:</label>
              <input
                type="text"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Material & Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">الخامة المطلوبة:</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">الأبعاد التقريبية:</label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">الكمية (قطع):</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Workflow Preset */}
          <div>
            <label className="block text-slate-300 mb-1 font-medium">قالب مراحل التصنيع المقترح:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setWorkflowTemplate('standard')}
                className={`p-2 rounded-lg border text-xs font-semibold text-center transition-all ${
                  workflowTemplate === 'standard'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                شامل (ليزر + ثني + لحام + دهان)
              </button>
              <button
                type="button"
                onClick={() => setWorkflowTemplate('cnc')}
                className={`p-2 rounded-lg border text-xs font-semibold text-center transition-all ${
                  workflowTemplate === 'cnc'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                تشغيل CNC (فريزة + مخرطة + معالجة)
              </button>
              <button
                type="button"
                onClick={() => setWorkflowTemplate('sheet')}
                className={`p-2 rounded-lg border text-xs font-semibold text-center transition-all ${
                  workflowTemplate === 'sheet'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                صاج وديكور (قص ليزر + ثني + فرن)
              </button>
            </div>
          </div>

          {/* Financials & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-850 p-3 rounded-xl border border-slate-750 font-mono">
            <div>
              <label className="block text-slate-300 mb-1 font-sans text-xs">إجمالي السعر (SAR):</label>
              <input
                type="number"
                value={totalPrice}
                onChange={(e) => {
                  const p = Number(e.target.value);
                  setTotalPrice(p);
                  setExpenses(Math.round(p * 0.45));
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-amber-300 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-sans text-xs">الدفعة المقدمة (SAR):</label>
              <input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-sans text-xs">الأولوية:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500 font-sans"
              >
                <option value="urgent">عاجل جداً</option>
                <option value="high">أولوية عالية</option>
                <option value="medium">عادي</option>
                <option value="low">منخفض</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-sans text-xs">تاريخ التسليم:</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-amber-300 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-300 mb-1 font-medium">ملاحظات وتعليمات المهندس للورشة:</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Generated OTP Preview Banner */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300">
              <ShieldCheck className="w-4 h-4" />
              <span>كود الـ OTP المخصص للعميل: <strong className="font-mono text-base">{customOtp}</strong></span>
            </div>
            <button
              type="button"
              onClick={handleRegenerateOtp}
              className="p-1 rounded text-slate-400 hover:text-amber-300 flex items-center gap-1 text-[10px]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>تغيير</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold flex items-center gap-1.5 shadow-lg shadow-amber-950/50"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>اعتماد وإنشاء أمر الشغل</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
