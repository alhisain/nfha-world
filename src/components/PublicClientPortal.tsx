import React, { useState } from 'react';
import { 
  Globe, 
  KeyRound, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Phone, 
  FileText, 
  Layers, 
  Cpu, 
  ShieldCheck,
  Send,
  MessageCircle,
  Building2,
  Smartphone
} from 'lucide-react';
import { ProjectTask, OTPRecord } from '../types';

interface PublicClientPortalProps {
  projects: ProjectTask[];
  otps: OTPRecord[];
  activeOtpCode?: string | null;
  onSwitchToManage: () => void;
}

export const PublicClientPortal: React.FC<PublicClientPortalProps> = ({
  projects,
  otps,
  activeOtpCode,
  onSwitchToManage
}) => {
  const [enteredOtp, setEnteredOtp] = useState(activeOtpCode || '8492');
  const [currentClientProject, setCurrentClientProject] = useState<ProjectTask | null>(
    projects.find(p => p.otpCode === (activeOtpCode || '8492')) || projects[0]
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = enteredOtp.trim();
    const foundProject = projects.find(p => p.otpCode === cleanOtp);
    if (foundProject) {
      setCurrentClientProject(foundProject);
      setErrorMsg(null);
    } else {
      setErrorMsg('رمز التحقق OTP غير صحيح. يرجى مراجعة إدارة ورشة نفحة.');
    }
  };

  const getOverallProgress = (task: ProjectTask) => {
    if (!task?.stages) return 0;
    const sum = task.stages.reduce((acc, s) => acc + (s.weight * (s.progressPercent / 100)), 0);
    return Math.round(sum);
  };

  return (
    <div id="view-public-world" className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 border border-blue-600/30 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500 text-white font-extrabold flex items-center justify-center text-sm">
              NW
            </div>
            <span className="text-xs font-bold text-blue-400 font-mono tracking-wider">NFHA WORLD</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">بوابة العملاء والمتابعة الحية</span>
          </div>
          <h2 className="text-lg font-bold text-slate-100">
            مرحباً بكم في منصة متابعة تشغيل وتصنيع مشاريع ورشة نفحة
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تابع لحظياً تقدم أمر الشغل الهندسي ومراحل القص واللحام واختبار الجودة عبر كود الـ OTP
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if ((window as any).__pwaPrompt) {
                (window as any).__pwaPrompt.prompt();
              } else {
                alert('لتثبيت التطبيق على هاتفك:\nاضغط على قائمة المتصفح (⋮) ثم اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".');
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all"
            title="تثبيت التطبيق على جهازك"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>تثبيت التطبيق على هاتفك</span>
          </button>

          <button
            onClick={onSwitchToManage}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-xs font-bold flex items-center gap-2 transition-all"
          >
            <ArrowRight className="w-4 h-4" />
            <span>لوحة الإدارة (Manage)</span>
          </button>
        </div>
      </div>

      {/* OTP Verification Input Form */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-4">
        <form onSubmit={handleVerify} className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-[280px]">
            <KeyRound className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="flex-1">
              <label className="block text-slate-300 text-xs font-semibold mb-1">
                أدخل كود التحقق OTP الخاص بمشروعك:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="مثال: 8492 أو 4219"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-center text-base font-mono font-black text-amber-400 tracking-widest focus:outline-none focus:border-blue-500 w-44"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md"
                >
                  استعلام ومتابعة
                </button>
              </div>
            </div>
          </div>

          {/* Quick Demo OTP Buttons */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">أكواد تجريبية:</span>
            {projects.slice(0, 3).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setEnteredOtp(p.otpCode);
                  setCurrentClientProject(p);
                  setErrorMsg(null);
                }}
                className={`px-2.5 py-1 rounded-lg border font-mono font-bold text-xs transition-all ${
                  enteredOtp === p.otpCode 
                    ? 'bg-amber-500 text-slate-950 border-amber-400' 
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-750'
                }`}
              >
                {p.otpCode} ({p.code})
              </button>
            ))}
          </div>
        </form>

        {errorMsg && (
          <div className="p-3 bg-rose-950/60 border border-rose-800/60 rounded-xl text-xs text-rose-300 font-semibold">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Active Project Details for the Client */}
      {currentClientProject && (
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-sm space-y-6">
          {/* Project Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-700">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-750">
                  {currentClientProject.code}
                </span>
                <span className="text-xs text-slate-400">العميل: <strong className="text-slate-200">{currentClientProject.clientName}</strong></span>
              </div>
              <h3 className="text-base font-extrabold text-slate-100 mt-1">
                {currentClientProject.title}
              </h3>
            </div>

            <div className="text-left text-xs font-mono">
              <div className="text-slate-400">تاريخ التسليم المقدر:</div>
              <div className="text-sm font-bold text-amber-400">{currentClientProject.deadline}</div>
            </div>
          </div>

          {/* Cumulative Progress Card */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-750 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>نسبة الإنجاز الفعلي في الورشة:</span>
              </span>
              <span className="text-lg font-mono font-extrabold text-emerald-400">
                {getOverallProgress(currentClientProject)}%
              </span>
            </div>

            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${getOverallProgress(currentClientProject)}%` }}
              ></div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-750">
              <span className="text-slate-500 block text-[11px]">مواصفة الخامة:</span>
              <span className="font-semibold text-slate-200">{currentClientProject.material}</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-750">
              <span className="text-slate-500 block text-[11px]">الأبعاد والكمية:</span>
              <span className="font-semibold text-slate-200">{currentClientProject.dimensions} ({currentClientProject.quantity} قطع)</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-750">
              <span className="text-slate-500 block text-[11px]">إشراف المهندس:</span>
              <span className="font-semibold text-amber-300">المهندس الحسين (مدير الورشة)</span>
            </div>
          </div>

          {/* Stages Breakdown for Client */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>مراحل الإنتاج والتصنيع المعتمدة:</span>
            </h4>

            <div className="space-y-2">
              {currentClientProject.stages.map((stage, idx) => (
                <div 
                  key={stage.id}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    stage.completed || stage.progressPercent === 100
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                      : 'bg-slate-900/50 border-slate-750 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                      stage.completed || stage.progressPercent === 100
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{stage.name}</div>
                      <div className="text-[10px] text-slate-400">بواسطة: {stage.technician}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono">
                    <span className="font-bold">{stage.progressPercent}%</span>
                    {stage.completed ? (
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold">مكتمل</span>
                    ) : (
                      <span className="bg-amber-500/20 text-amber-400 text-[10px] px-2 py-0.5 rounded">قيد التنفيذ</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Lead Engineer CTA */}
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-750 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="font-bold text-slate-200">هل لديك استفسار أو تعديل على أمر الشغل؟</div>
                <div className="text-slate-400 text-[11px]">تواصل مباشرة مع المهندس الحسين مدير ورشة نفحة</div>
              </div>
            </div>

            <button
              onClick={() => alert('تم إرسال طلب تواصل للمهندس الحسين وسيتم الرد خلال دقائق.')}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5 rotate-180" />
              <span>طلب محادثة فورية</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
