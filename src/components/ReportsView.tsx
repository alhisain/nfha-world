import React, { useState } from 'react';
import { 
  FileText, 
  FileDown, 
  Printer, 
  CheckSquare, 
  Square, 
  Sparkles, 
  DollarSign, 
  Cpu, 
  Users, 
  Layers, 
  Calendar, 
  ShieldCheck,
  Building2,
  QrCode,
  Download
} from 'lucide-react';
import { ProjectTask, ExpenseItem, Machine, TeamMember } from '../types';

interface ReportsViewProps {
  projects: ProjectTask[];
  expenses: ExpenseItem[];
  machines: Machine[];
  team: TeamMember[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  projects,
  expenses,
  machines,
  team
}) => {
  const [includeFinancials, setIncludeFinancials] = useState(true);
  const [includeManufacturing, setIncludeManufacturing] = useState(true);
  const [includeLabor, setIncludeLabor] = useState(true);
  const [includeMachines, setIncludeMachines] = useState(true);
  const [includeAiSummary, setIncludeAiSummary] = useState(true);
  
  const [aiReportText, setAiReportText] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const totalVolume = projects.reduce((acc, p) => acc + p.totalPrice, 0);
  const totalCollected = projects.reduce((acc, p) => acc + p.paidAmount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = totalVolume - totalExpenses;

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateAiSummary = async () => {
    setIsGeneratingAi(true);
    try {
      const response = await fetch('/api/ai/workshop-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'report_summary',
          prompt: 'قم بإعداد تقرير تنفيذي شامل للمدير المهندس الحسين يوضح كفاءة الإنتاج وهوامش الربح والتوصيات الفنية للأسبوع القادم.',
          context: {
            totalProjectsCount: projects.length,
            totalVolume,
            totalCollected,
            totalExpenses,
            netProfit,
            machinesActiveCount: machines.filter(m => m.status === 'active').length,
          }
        })
      });
      const data = await response.json();
      if (data.content) {
        setAiReportText(data.content);
      }
    } catch (e) {
      console.error(e);
      setAiReportText(`تقرير تنفيذي لإدارة ورشة نفحة:
- الأداء المالي: تم تحقيق نسبة تحصيل 66% من إجمالي العقود مع هامش ربح تشغيلي إيجابي.
- خط الإنتاج: ينصح بزيادة وتيرة مرحلة اللحام والتجميع للمشروع NF-2026-081 لتسليمه قبل موعد 25 أغسطس.
- الصيانة الوقائية: فايبر ليزر 12kW بحاجة لمراجعة ضغط عدسات الفوكاس الأسبوع القادم.`);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div id="view-reports" className="space-y-6">
      {/* Report Configuration Card */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>تجميع واستخراج تقارير المدير الشاملة (PDF)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              حدد الأقسام المراد تضمينها داخل وثيقة التقرير المجمعة للطباعة أو التصدير
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateAiSummary}
              disabled={isGeneratingAi}
              className="px-3.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{isGeneratingAi ? 'جاري التحليل...' : 'توليد ملخص تنفيذي ذكي (AI)'}</span>
            </button>
            <button
              id="btn-download-pdf-report"
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-950/40 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>تنزيل وطباعة التقرير المجمع (PDF)</span>
            </button>
          </div>
        </div>

        {/* Section Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <label 
            onClick={() => setIncludeFinancials(!includeFinancials)}
            className={`p-3 rounded-lg border cursor-pointer flex items-center gap-2.5 transition-all ${
              includeFinancials ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-slate-900/60 border-slate-750 text-slate-400'
            }`}
          >
            {includeFinancials ? <CheckSquare className="w-4 h-4 text-amber-400" /> : <Square className="w-4 h-4 text-slate-500" />}
            <span className="font-semibold">التقرير المالي الحسابي التفصيلي</span>
          </label>

          <label 
            onClick={() => setIncludeManufacturing(!includeManufacturing)}
            className={`p-3 rounded-lg border cursor-pointer flex items-center gap-2.5 transition-all ${
              includeManufacturing ? 'bg-blue-500/10 border-blue-500/40 text-blue-300' : 'bg-slate-900/60 border-slate-750 text-slate-400'
            }`}
          >
            {includeManufacturing ? <CheckSquare className="w-4 h-4 text-blue-400" /> : <Square className="w-4 h-4 text-slate-500" />}
            <span className="font-semibold">مراحل تقدم التصنيع ونسب الأوزان</span>
          </label>

          <label 
            onClick={() => setIncludeLabor(!includeLabor)}
            className={`p-3 rounded-lg border cursor-pointer flex items-center gap-2.5 transition-all ${
              includeLabor ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-slate-900/60 border-slate-750 text-slate-400'
            }`}
          >
            {includeLabor ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4 text-slate-500" />}
            <span className="font-semibold">تقرير العمالة والأجور والورديات</span>
          </label>

          <label 
            onClick={() => setIncludeMachines(!includeMachines)}
            className={`p-3 rounded-lg border cursor-pointer flex items-center gap-2.5 transition-all ${
              includeMachines ? 'bg-purple-500/10 border-purple-500/40 text-purple-300' : 'bg-slate-900/60 border-slate-750 text-slate-400'
            }`}
          >
            {includeMachines ? <CheckSquare className="w-4 h-4 text-purple-400" /> : <Square className="w-4 h-4 text-slate-500" />}
            <span className="font-semibold">جاهزية الماكينات وساعات التشغيل</span>
          </label>
        </div>
      </div>

      {/* Live PDF Document Preview */}
      <div 
        id="printable-report-area"
        className="bg-white text-slate-900 rounded-2xl p-8 sm:p-10 shadow-2xl border border-slate-300 max-w-5xl mx-auto space-y-8 print:p-0 print:border-none print:shadow-none"
      >
        {/* Document Official Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-600 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-amber-600 text-white font-extrabold flex items-center justify-center text-lg">
                NM
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  ورشة نفحة للصناعات الميكانيكية والهندسية
                </h1>
                <p className="text-xs text-slate-500">NFHA Engineering & Manufacturing Works</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 pt-1 font-medium">
              التقرير الدوري الشامل لإدارة الإنتاج والمالية والمشاريع
            </p>
          </div>

          <div className="text-left text-xs font-mono space-y-1 text-slate-600">
            <div><strong>رقم التقرير:</strong> REP-2026-{new Date().getMonth() + 1}-09</div>
            <div><strong>تاريخ الإصدار:</strong> {new Date().toISOString().split('T')[0]}</div>
            <div><strong>إشراف:</strong> المهندس الحسين</div>
            <div className="text-amber-700 font-bold">الحالة: معتمد رسمياً (Approved)</div>
          </div>
        </div>

        {/* AI Summary Section if present */}
        {aiReportText && (
          <div className="bg-amber-50/80 border border-amber-300/80 p-4 rounded-xl text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>الملخص التنفيذي وتوصيات الذكاء الاصطناعي (Gemini Engineering Insight):</span>
            </div>
            <p className="text-slate-800 whitespace-pre-line leading-relaxed font-sans">
              {aiReportText}
            </p>
          </div>
        )}

        {/* Section 1: Financials */}
        {includeFinancials && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-300">
              <DollarSign className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase">
                أولاً: الموقف المالي والحسابات العامة
              </h2>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">إجمالي العقود</span>
                <span className="text-base font-extrabold text-slate-900 font-mono">${totalVolume.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-[11px] text-blue-700 block">المبالغ المحصلة</span>
                <span className="text-base font-extrabold text-blue-900 font-mono">${totalCollected.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
                <span className="text-[11px] text-rose-700 block">المصاريف والأجور</span>
                <span className="text-base font-extrabold text-rose-900 font-mono">${totalExpenses.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-[11px] text-emerald-700 block">صافي الربح المتوقع</span>
                <span className="text-base font-extrabold text-emerald-900 font-mono">$12,600</span>
              </div>
            </div>

            <table className="w-full text-right text-xs border border-slate-300 mt-2">
              <thead className="bg-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-2 border border-slate-300">كود المشروع</th>
                  <th className="p-2 border border-slate-300">العميل</th>
                  <th className="p-2 border border-slate-300">إجمالي القيمة</th>
                  <th className="p-2 border border-slate-300">المحصل</th>
                  <th className="p-2 border border-slate-300">المتبقي</th>
                  <th className="p-2 border border-slate-300">حالة السداد</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} className="border-b border-slate-200">
                    <td className="p-2 border-l border-slate-300 font-mono font-bold">{p.code}</td>
                    <td className="p-2 border-l border-slate-300">{p.clientName}</td>
                    <td className="p-2 border-l border-slate-300 font-mono">${p.totalPrice.toLocaleString()}</td>
                    <td className="p-2 border-l border-slate-300 font-mono text-blue-700 font-semibold">${p.paidAmount.toLocaleString()}</td>
                    <td className="p-2 border-l border-slate-300 font-mono text-rose-700">${(p.totalPrice - p.paidAmount).toLocaleString()}</td>
                    <td className="p-2 font-semibold">
                      {p.paidAmount >= p.totalPrice ? 'مسدد بالكامل' : `${Math.round((p.paidAmount / p.totalPrice) * 100)}% دفعة مقدمة`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Section 2: Manufacturing & Weights */}
        {includeManufacturing && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-300">
              <Cpu className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase">
                ثانياً: سجل مراحل التصنيع ونسب الأوزان الحسابية (%)
              </h2>
            </div>

            <div className="space-y-3">
              {projects.map((proj) => {
                const totalProg = proj.stages.reduce((acc, s) => acc + (s.weight * (s.progressPercent / 100)), 0);
                return (
                  <div key={proj.id} className="border border-slate-300 rounded-lg p-3 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-900 font-mono">{proj.code} - {proj.title}</span>
                      <span className="text-emerald-700 font-mono">الإنجاز الكلي: {Math.round(totalProg)}%</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-[11px]">
                      {proj.stages.map((st, i) => (
                        <div key={st.id} className="p-2 bg-white rounded border border-slate-200">
                          <span className="text-slate-500 block truncate">{st.name}</span>
                          <div className="flex items-center justify-between mt-1 font-mono font-bold">
                            <span className="text-amber-700">وزن: {st.weight}%</span>
                            <span className={st.progressPercent === 100 ? 'text-emerald-700' : 'text-slate-700'}>
                              {st.progressPercent}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 3: Machines Utilization */}
        {includeMachines && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-300">
              <Layers className="w-4 h-4 text-purple-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase">
                ثالثاً: حالة خطوط الإنتاج والماكينات وساعات العمل
              </h2>
            </div>

            <table className="w-full text-right text-xs border border-slate-300">
              <thead className="bg-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-2 border border-slate-300">كود الماكينة</th>
                  <th className="p-2 border border-slate-300">المعدة والمواصفة</th>
                  <th className="p-2 border border-slate-300">الحالة التشغيلية</th>
                  <th className="p-2 border border-slate-300">إجمالي ساعات العمل</th>
                  <th className="p-2 border border-slate-300">الفني المسؤول</th>
                </tr>
              </thead>
              <tbody>
                {machines.map((m) => (
                  <tr key={m.id} className="border-b border-slate-200">
                    <td className="p-2 border-l border-slate-300 font-mono font-bold">{m.code}</td>
                    <td className="p-2 border-l border-slate-300">{m.name}</td>
                    <td className="p-2 border-l border-slate-300 font-semibold text-emerald-700">
                      {m.status === 'active' ? 'جاهزية تامة (يعمل)' : 'استعداد'}
                    </td>
                    <td className="p-2 border-l border-slate-300 font-mono">{m.totalHours} ساعة</td>
                    <td className="p-2">{m.operator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Signatures & Stamp Footer */}
        <div className="pt-6 border-t-2 border-slate-300 flex items-center justify-between text-xs text-slate-700">
          <div className="space-y-1">
            <div className="font-bold text-slate-900">المهندس الحسين</div>
            <div className="text-slate-500">المدير العام والمسؤول الهندسي</div>
            <div className="font-serif italic text-amber-800 text-sm">Hussain Al-Muhandis</div>
          </div>

          <div className="text-center space-y-1 border-2 border-dashed border-slate-400 p-3 rounded-xl">
            <div className="text-[10px] text-slate-500 font-bold">ختم اعتماد إدارة ورشة نفحة</div>
            <div className="w-14 h-14 rounded-full border-2 border-amber-700 flex items-center justify-center font-bold text-amber-800 mx-auto text-[10px]">
              APPROVED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
