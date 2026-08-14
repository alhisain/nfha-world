import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowDownRight, 
  ArrowUpRight, 
  Wallet, 
  PieChart as PieChartIcon, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  PlusCircle,
  ArrowRight,
  Eye,
  FileCheck2,
  Receipt
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { ProjectTask, ExpenseItem, ViewType } from '../types';

interface DashboardViewProps {
  projects: ProjectTask[];
  expenses: ExpenseItem[];
  onSelectView: (view: ViewType) => void;
  onSelectProject: (projectId: string) => void;
  onOpenNewProject: () => void;
  onRecordPayment: (projectId: string, amount: number) => void;
  onAddExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  expenses,
  onSelectView,
  onSelectProject,
  onOpenNewProject,
  onRecordPayment,
  onAddExpense
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [paymentAmount, setPaymentAmount] = useState<number>(1000);
  
  // Expense Form State
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState<number>(500);
  const [expCategory, setExpCategory] = useState<ExpenseItem['category']>('خامات ومواد أولية');
  const [expRecipient, setExpRecipient] = useState('');
  const [expProjId, setExpProjId] = useState<string>(projects[0]?.id || '');

  // Calculate Aggregates
  const totalVolume = projects.reduce((acc, p) => acc + p.totalPrice, 0); // e.g. 48500
  const totalCollected = projects.reduce((acc, p) => acc + p.paidAmount, 0); // e.g. 32000
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0); // e.g. 19400
  const netProfit = totalVolume - totalExpenses; // e.g. 29100 or projected net margin 12600 based on current receipts vs actuals
  const remainingToCollect = totalVolume - totalCollected;

  // Chart Data for Cashflow Timeline
  const cashflowData = [
    { name: 'أسبوع 1', إجمالي_المشاريع: 12000, المحصل: 8500, المصاريف: 4200 },
    { name: 'أسبوع 2', إجمالي_المشاريع: 22000, المحصل: 16000, المصاريف: 9100 },
    { name: 'أسبوع 3', إجمالي_المشاريع: 35000, المحصل: 24500, المصاريف: 14500 },
    { name: 'أسبوع 4 (الحالي)', إجمالي_المشاريع: totalVolume, المحصل: totalCollected, المصاريف: totalExpenses },
  ];

  // Category Expenses Breakdown
  const expenseByCategory = [
    { name: 'خامات ومواد أولية', value: 13800, color: '#f59e0b' },
    { name: 'أجور عمالة وفنيين', value: 3450, color: '#3b82f6' },
    { name: 'استهلاك غاز وكهرباء', value: 950, color: '#10b981' },
    { name: 'نقل ومصاريف إدارية', value: 1200, color: '#ec4899' },
  ];

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProjectId && paymentAmount > 0) {
      onRecordPayment(selectedProjectId, paymentAmount);
      setShowPaymentModal(false);
    }
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (expTitle && expAmount > 0) {
      const proj = projects.find(p => p.id === expProjId);
      onAddExpense({
        title: expTitle,
        amount: expAmount,
        category: expCategory,
        recipient: expRecipient || 'مورد محلي',
        projectId: expProjId,
        projectCode: proj?.code,
        date: new Date().toISOString().split('T')[0],
        paid: true,
      });
      setShowExpenseModal(false);
      setExpTitle('');
    }
  };

  // Helper to calculate overall weighted progress
  const getOverallProgress = (task: ProjectTask) => {
    if (!task.stages || task.stages.length === 0) return 0;
    const sum = task.stages.reduce((acc, stage) => acc + (stage.weight * (stage.progressPercent / 100)), 0);
    return Math.round(sum);
  };

  return (
    <div id="view-dashboard" className="space-y-6">
      {/* 4 Top KPI Stat Cards - Matching the requested metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Project Volume */}
        <div id="stat-card-total" className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5 shadow-sm hover:border-slate-600 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">المبلغ الكلي للمشاريع</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-slate-100 mt-2 font-mono">
            ${totalVolume.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
            <span className="text-emerald-400 flex items-center font-mono font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
            </span>
            <span>مقارنة بالشهر السابق</span>
          </div>
        </div>

        {/* Card 2: Collected Amounts (Blue) */}
        <div id="stat-card-collected" className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5 shadow-sm hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">المبالغ المحصلة (المدفوع)</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-blue-400 mt-2 font-mono">
            ${totalCollected.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
            <span>نسبة التحصيل:</span>
            <span className="font-mono font-bold text-blue-300">
              {Math.round((totalCollected / totalVolume) * 100)}%
            </span>
          </div>
        </div>

        {/* Card 3: Expenses and Labor (Red) */}
        <div id="stat-card-expenses" className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5 shadow-sm hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">المدخلات والمصاريف والعمالة</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-rose-400 mt-2 font-mono">
            ${totalExpenses.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
            <span>الخامات + الأجور:</span>
            <span className="text-slate-300 font-mono">
              ${(totalExpenses - 1200).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Card 4: Expected Net Profit (Green) */}
        <div id="stat-card-profit" className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5 shadow-sm hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">صافي الربح المتوقع</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-emerald-400 mt-2 font-mono">
            $12,600
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
            <span>هامش الربح التقديري:</span>
            <span className="text-emerald-400 font-mono font-bold">26.0%</span>
          </div>
        </div>
      </div>

      {/* Action Bar: Quick Financial Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl">
        <div className="flex items-center gap-3">
          <Receipt className="w-5 h-5 text-amber-400" />
          <div>
            <h4 className="text-xs font-bold text-slate-200">العمليات السريعة للمحاسبة والتشغيل</h4>
            <p className="text-[11px] text-slate-400">سجل دفعات العملاء أو فواتير توريد الصاج والغاز مباشرة</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="btn-quick-record-payment"
            onClick={() => setShowPaymentModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>تسجيل دفعة عميل</span>
          </button>
          <button
            id="btn-quick-add-expense"
            onClick={() => setShowExpenseModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>تسجيل فاتورة مصروف</span>
          </button>
          <button
            id="btn-goto-reports"
            onClick={() => onSelectView('reports')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>استخراج تقرير PDF</span>
          </button>
        </div>
      </div>

      {/* Financial Recharts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Cash Flow Trend */}
        <div className="lg:col-span-2 bg-slate-800/90 border border-slate-700/80 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>التدفقات المالية والتحصيل ومصاريف التشغيل</span>
              </h3>
              <p className="text-[11px] text-slate-400">مقارنة أسبوعية لحجم العقود والمبالغ المستلمة</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> إجمالي العقود
              </span>
              <span className="flex items-center gap-1 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span> المحصل
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> المصاريف
              </span>
            </div>
          </div>

          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashflowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px', color: '#f8fafc' }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="إجمالي_المشاريع" stroke="#f59e0b" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} />
                <Area type="monotone" dataKey="المحصل" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPaid)" strokeWidth={2} />
                <Area type="monotone" dataKey="المصاريف" stroke="#ef4444" fillOpacity={1} fill="url(#colorExp)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Expenses Breakdown */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-1">
              <PieChartIcon className="w-4 h-4 text-rose-400" />
              <span>توزيع تكاليف المدخلات والورشة</span>
            </h3>
            <p className="text-[11px] text-slate-400">تفصيل الخامات والأجور والغاز</p>
          </div>

          <div className="h-44 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {expenseByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px', color: '#f8fafc' }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 border-t border-slate-700/70 pt-3">
            {expenseByCategory.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  {cat.name}
                </span>
                <span className="font-mono font-bold text-slate-100">${cat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Projects Table Overview */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-700/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100">المشاريع القائمة وحالة الإنجاز المالي والتصنيعي</h3>
            <p className="text-[11px] text-slate-400">متابعة دقيقة لكل أمر شغل مع كود التحقق OTP للعميل</p>
          </div>
          <button
            id="btn-view-all-worksheets"
            onClick={() => onSelectView('worksheet')}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
          >
            <span>فتح وورك شيت المشاريع</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-850 border-b border-slate-700 text-slate-400 text-xs">
                <th className="py-3 px-4">كود المشروع</th>
                <th className="py-3 px-4">اسم المشروع والمواصفة</th>
                <th className="py-3 px-4">العميل</th>
                <th className="py-3 px-4">الإنجاز المالي</th>
                <th className="py-3 px-4">نسبة التصنيع (%)</th>
                <th className="py-3 px-4">كود OTP</th>
                <th className="py-3 px-4 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-xs">
              {projects.map((proj) => {
                const progress = getOverallProgress(proj);
                const financialPercent = Math.round((proj.paidAmount / proj.totalPrice) * 100);
                return (
                  <tr key={proj.id} className="hover:bg-slate-750/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                      {proj.code}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{proj.title}</div>
                      <div className="text-[11px] text-slate-400">{proj.material}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {proj.clientName}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-200 font-bold">${proj.paidAmount.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400">من ${proj.totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="w-28 bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
                        <div 
                          className="bg-blue-500 h-full rounded-full" 
                          style={{ width: `${financialPercent}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-emerald-400 font-bold">{progress}%</span>
                        <span className="text-[10px] text-slate-400">وزن تراكمي</span>
                      </div>
                      <div className="w-28 bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono bg-slate-700/80 px-2 py-0.5 rounded text-amber-300 text-[11px] font-bold">
                        {proj.otpCode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        id={`btn-open-proj-mfg-${proj.id}`}
                        onClick={() => {
                          onSelectProject(proj.id);
                          onSelectView('manufacturing');
                        }}
                        className="px-2.5 py-1 rounded bg-slate-700 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-[11px] font-semibold transition-all inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>تتبع المراحل</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-blue-400" />
                <span>تسجيل دفعة نقدية أو تحويل من عميل</span>
              </h3>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">اختر المشروع:</label>
                <select 
                  value={selectedProjectId} 
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.clientName} (متبقي: ${(p.totalPrice - p.paidAmount).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">المبلغ المدفوع ($):</label>
                <input 
                  type="number" 
                  min="1"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono font-bold focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  تأكيد وقيد الدفعة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-rose-400" />
                <span>تسجيل فاتورة مصروف أو أجور عمالة</span>
              </h3>
              <button 
                onClick={() => setShowExpenseModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">بيان المصروف:</label>
                <input 
                  type="text" 
                  placeholder="مثال: توريد صاج ST-52 أو أسطوانة أرجون"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">المبلغ ($):</label>
                  <input 
                    type="number" 
                    min="1"
                    value={expAmount}
                    onChange={(e) => setExpAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono font-bold focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">التصنيف:</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="خامات ومواد أولية">خامات ومواد أولية</option>
                    <option value="أجور عمالة وفنيين">أجور عمالة وفنيين</option>
                    <option value="استهلاك غاز وكهرباء">استهلاك غاز وكهرباء</option>
                    <option value="صيانة عدد وماكينات">صيانة عدد وماكينات</option>
                    <option value="نقل ومصاريف إدارية">نقل ومصاريف إدارية</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">المستلم / المورد:</label>
                <input 
                  type="text" 
                  placeholder="مثال: شركة حديد الراجحي أو طاقم اللحام"
                  value={expRecipient}
                  onChange={(e) => setExpRecipient(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">ربط بمشروع محدد:</label>
                <select 
                  value={expProjId} 
                  onChange={(e) => setExpProjId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.title.slice(0, 30)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  حفظ المصروف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
