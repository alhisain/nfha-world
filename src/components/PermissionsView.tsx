import React, { useState } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  UserCheck, 
  Users, 
  Lock, 
  Unlock, 
  Plus, 
  Copy, 
  Check, 
  Eye, 
  Sparkles,
  Smartphone,
  CheckCircle2,
  Clock,
  RefreshCw,
  Globe,
  Trash2,
  Edit3,
  Layers,
  DollarSign
} from 'lucide-react';
import { TeamMember, OTPRecord, ProjectTask } from '../types';

interface PermissionsViewProps {
  team: TeamMember[];
  otps: OTPRecord[];
  projects: ProjectTask[];
  onGenerateOtp: (clientName: string, phone: string, projectCode: string) => void;
  onTogglePermission: (memberId: string, permissionKey: keyof TeamMember['permissions']) => void;
  onSimulateClientLogin: (otpCode: string) => void;
  onUpdateMemberRole?: (memberId: string, role: string) => void;
}

export const PermissionsView: React.FC<PermissionsViewProps> = ({
  team,
  otps,
  projects,
  onGenerateOtp,
  onTogglePermission,
  onSimulateClientLogin
}) => {
  const [copiedOtp, setCopiedOtp] = useState<string | null>(null);
  const [newClientName, setNewClientName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newProjectCode, setNewProjectCode] = useState(projects[0]?.code || 'NF-2026-081');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [testOtpInput, setTestOtpInput] = useState('');
  const [testMessage, setTestMessage] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedOtp(code);
    setTimeout(() => setCopiedOtp(null), 2000);
  };

  const handleGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClientName && newProjectCode) {
      onGenerateOtp(newClientName, newPhone || '+966 50 000 0000', newProjectCode);
      setShowGenerateModal(false);
      setNewClientName('');
      setNewPhone('');
    }
  };

  const handleVerifyTestOtp = () => {
    const record = otps.find(o => o.code === testOtpInput.trim());
    if (record) {
      setTestMessage(`تم التحقق بنجاح! مرحباً ${record.clientName} (مشروع ${record.projectCode})`);
      setTimeout(() => {
        onSimulateClientLogin(record.code);
      }, 1200);
    } else {
      setTestMessage('رمز OTP غير صحيح أو منتهي الصلاحية');
    }
  };

  return (
    <div id="view-permissions" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>نظام الصلاحيات الإدارية وتوليد أكواد التحقق السريعة (OTP)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            التحكم بصلاحيات المدير والمهندسين في (إضافة، تعديل، وحذف المشاريع) مع إدارة أكواد متابعة العملاء
          </p>
        </div>

        <button
          onClick={() => setShowGenerateModal(true)}
          className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>توليد كود OTP لعميل جديد</span>
        </button>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active OTP Registry & Simulator (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* OTP Table */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>سجل أكواد الـ OTP النشطة لعملاء ورشة نفحة</span>
              </h4>
              <span className="text-[11px] font-mono text-slate-400">{otps.length} أكواد مسجلة</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-850 text-slate-400 border-b border-slate-700">
                    <th className="p-3">العميل والمشروع</th>
                    <th className="p-3">رمز الـ OTP</th>
                    <th className="p-3">صلاحية الكود</th>
                    <th className="p-3">الدخول</th>
                    <th className="p-3 text-center">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {otps.map((otp) => (
                    <tr key={otp.id} className="hover:bg-slate-750/50 transition-colors">
                      <td className="p-3">
                        <div className="font-semibold text-slate-200">{otp.clientName}</div>
                        <div className="text-[10px] text-amber-400 font-mono font-bold">{otp.projectCode}</div>
                      </td>
                      <td className="p-3">
                        <span className="font-mono bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold px-2.5 py-1 rounded text-sm tracking-wider">
                          {otp.code}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 font-mono text-[11px]">
                        تنتهي: {otp.expiresAt}
                      </td>
                      <td className="p-3 text-slate-300 font-mono">
                        {otp.accessCount} مرات
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleCopy(otp.code)}
                          className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-medium inline-flex items-center gap-1 transition-colors"
                          title="نسخ الرمز"
                        >
                          {copiedOtp === otp.code ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedOtp === otp.code ? 'تم النسخ' : 'نسخ'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive OTP Simulator */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-700/80 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span>محاكي تسجيل دخول العميل عبر OTP (بوابة NFHA World)</span>
              </h4>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">تجربة حية</span>
            </div>
            <p className="text-[11px] text-slate-400">
              أدخل كود الـ OTP (مثال: <strong className="text-amber-400">{otps[0]?.code || '8492'}</strong>) لتجربة واجهة العميل المخصصة دون كشف الأسعار والمصاريف
            </p>

            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                maxLength={6}
                placeholder="أدخل رمز الـ OTP هنا"
                value={testOtpInput}
                onChange={(e) => setTestOtpInput(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-center text-sm font-mono font-bold text-amber-400 tracking-widest focus:outline-none focus:border-blue-500 flex-1"
              />
              <button
                onClick={handleVerifyTestOtp}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shrink-0"
              >
                تحقق ودخول
              </button>
            </div>

            {testMessage && (
              <div className={`p-2.5 rounded-lg text-xs font-semibold ${
                testMessage.includes('بنجاح') 
                  ? 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-300' 
                  : 'bg-rose-950/60 border border-rose-800/60 text-rose-300'
              }`}>
                {testMessage}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Staff Roles & Permissions Matrix (6 cols) */}
        <div className="lg:col-span-6 bg-slate-800/90 border border-slate-700/80 rounded-xl p-5 space-y-4">
          <div className="border-b border-slate-700 pb-3">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>مصفوفة صلاحيات فريق الورشة والفنيين</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              تحديد من يسمح له بـ (إضافة/تعديل/حذف المشاريع)، ورؤية المالية وتعديل الأسعار
            </p>
          </div>

          <div className="space-y-3.5">
            {team.map((member) => (
              <div key={member.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-750 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center border border-slate-700">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-200">{member.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{member.role}</div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                    {member.badgeCode}
                  </span>
                </div>

                {/* Permissions Toggles Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px] pt-1.5 border-t border-slate-800">
                  {/* Create Projects */}
                  <button
                    onClick={() => onTogglePermission(member.id, 'canCreateProjects')}
                    className={`p-1.5 rounded flex items-center justify-between transition-colors ${
                      member.permissions.canCreateProjects ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800/60 text-slate-500'
                    }`}
                    title="صلاحية إنشاء أوامر شغل ومشاريع جديدة"
                  >
                    <span>إضافة مشاريع</span>
                    {member.permissions.canCreateProjects ? <Plus className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3" />}
                  </button>

                  {/* Edit Projects */}
                  <button
                    onClick={() => onTogglePermission(member.id, 'canEditProjects')}
                    className={`p-1.5 rounded flex items-center justify-between transition-colors ${
                      member.permissions.canEditProjects ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30' : 'bg-slate-800/60 text-slate-500'
                    }`}
                    title="صلاحية تعديل بيانات المشروع والمراحل والأسعار"
                  >
                    <span>تعديل المشاريع</span>
                    {member.permissions.canEditProjects ? <Edit3 className="w-3 h-3 text-blue-400" /> : <Lock className="w-3 h-3" />}
                  </button>

                  {/* Delete Projects */}
                  <button
                    onClick={() => onTogglePermission(member.id, 'canDeleteProjects')}
                    className={`p-1.5 rounded flex items-center justify-between transition-colors ${
                      member.permissions.canDeleteProjects ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' : 'bg-slate-800/60 text-slate-500'
                    }`}
                    title="صلاحية حذف أوامر الشغل نهائياً"
                  >
                    <span>حذف المشاريع</span>
                    {member.permissions.canDeleteProjects ? <Trash2 className="w-3 h-3 text-rose-400" /> : <Lock className="w-3 h-3" />}
                  </button>

                  {/* View Financials */}
                  <button
                    onClick={() => onTogglePermission(member.id, 'canViewFinancials')}
                    className={`p-1.5 rounded flex items-center justify-between transition-colors ${
                      member.permissions.canViewFinancials ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-slate-800/60 text-slate-500'
                    }`}
                  >
                    <span>رؤية المالية</span>
                    {member.permissions.canViewFinancials ? <DollarSign className="w-3 h-3 text-amber-400" /> : <Lock className="w-3 h-3" />}
                  </button>

                  {/* Edit Stages */}
                  <button
                    onClick={() => onTogglePermission(member.id, 'canEditStages')}
                    className={`p-1.5 rounded flex items-center justify-between transition-colors ${
                      member.permissions.canEditStages ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30' : 'bg-slate-800/60 text-slate-500'
                    }`}
                  >
                    <span>نسب المراحل</span>
                    {member.permissions.canEditStages ? <CheckCircle2 className="w-3 h-3 text-purple-400" /> : <Unlock className="w-3 h-3" />}
                  </button>

                  {/* Modify Prices */}
                  <button
                    onClick={() => onTogglePermission(member.id, 'canModifyPrices')}
                    className={`p-1.5 rounded flex items-center justify-between transition-colors ${
                      member.permissions.canModifyPrices ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30' : 'bg-slate-800/60 text-slate-500'
                    }`}
                  >
                    <span>تعديل الأسعار</span>
                    {member.permissions.canModifyPrices ? <CheckCircle2 className="w-3 h-3 text-teal-400" /> : <Lock className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generate OTP Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <span>توليد كود OTP لمتابعة مشروع العميل</span>
              </h3>
              <button 
                onClick={() => setShowGenerateModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">اسم العميل / المؤسسة:</label>
                <input
                  type="text"
                  placeholder="مثال: شركة النقاء للصناعات الغذائية"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">رقم هاتف العميل (لإرسال SMS/WhatsApp):</label>
                <input
                  type="text"
                  placeholder="+966 50 000 0000"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">ربط المشروع:</label>
                <select
                  value={newProjectCode}
                  onChange={(e) => setNewProjectCode(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.code}>
                      {p.code} - {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  توليد الكود فوراً
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
