import React from 'react';
import { 
  Plus, 
  Search, 
  Layers, 
  CheckCircle2, 
  Globe, 
  Smartphone, 
  UserCheck,
  Shield,
  Lock,
  Unlock
} from 'lucide-react';
import { AppMode, ViewType, TeamMember } from '../types';

interface TopNavbarProps {
  currentView: ViewType;
  mode: AppMode;
  onOpenNewProject: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleMode: () => void;
  onOpenInstallApk?: () => void;
  team?: TeamMember[];
  activeUserId?: string;
  onSelectActiveUser?: (userId: string) => void;
  canCreateProjects?: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentView,
  mode,
  onOpenNewProject,
  searchQuery,
  onSearchChange,
  onToggleMode,
  onOpenInstallApk,
  team = [],
  activeUserId,
  onSelectActiveUser,
  canCreateProjects = true
}) => {
  const activeUser = team.find(t => t.id === activeUserId) || team[0];

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return {
          title: 'لوحة التحكم والمالية العامة',
          subtitle: 'ملخص الإيرادات والمصروفات وصافي الأرباح ومؤشرات الأداء للورشة'
        };
      case 'worksheet':
        return {
          title: 'وورك شيت وجداول التصاميم الهندسية',
          subtitle: 'إدارة تدفق المهام، رسومات الـ CAD، ومواصفات خامات التشغيل (إضافة، تعديل، حذف)'
        };
      case 'manufacturing':
        return {
          title: 'مراحل التصنيع ونسب الأوزان الحسابية (%)',
          subtitle: 'تتبع تقدم المراحل وتخصيص الماكينات وحساب الإنجاز التراكمي'
        };
      case 'reports':
        return {
          title: 'مركز تقارير المدير الشاملة (PDF)',
          subtitle: 'تجميع البيانات المالية، ساعات التشغيل، ونسب التصنيع وتصديرها رسمياً'
        };
      case 'permissions':
        return {
          title: 'إدارة الصلاحيات ورموز التحقق (OTP)',
          subtitle: 'تحديد صلاحيات إضافة وتعديل وحذف المشاريع، وتوليد أكواد متابعة العملاء'
        };
      case 'gallery':
        return {
          title: 'معرض الماكينات وخطوط الإنتاج',
          subtitle: 'حالة الليزر، مراكز الـ CNC، المكابس، سجلات الصيانة والمشغلين'
        };
      case 'brainstorm':
        return {
          title: 'مختبر العصف الذهني والذكاء الاصطناعي',
          subtitle: 'اقتراح حلول هندسية، تقليل الفاقد، وتحسين أساليب التشغيل عبر Gemini'
        };
      case 'calculator':
        return {
          title: 'حاسبة أوزان المعادن والتكلفة الفورية',
          subtitle: 'حساب أوزان الصاج، أطوال قص الليزر، وتكلفة الغاز وساعات العمالة'
        };
      case 'install_apk':
        return {
          title: 'مركز تثبيت التطبيق وتوليد ملف APK',
          subtitle: 'تثبيت PWA على أجهزة أندرويد وتصدير حزم التثبيت وروابط التحميل المباشرة'
        };
      default:
        return {
          title: 'نظام إدارة ورشة نفحة',
          subtitle: 'المنظومة الهندسية المتكاملة'
        };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <header id="top-navbar" className="h-16 bg-slate-900 border-b border-slate-700/80 px-4 sm:px-6 flex items-center justify-between shrink-0 select-none">
      {/* Title Area */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h2 id="pageTitle" className="text-sm sm:text-base md:text-lg font-bold text-slate-100 truncate">
            {title}
          </h2>
          {mode === 'world' && (
            <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded border border-blue-500/30 flex items-center gap-1">
              <Globe className="w-3 h-3" /> بوابة الجمهور (World)
            </span>
          )}
        </div>
        <p className="text-[11px] sm:text-[12px] text-slate-400 hidden sm:block truncate">
          {subtitle}
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Active User Switcher / Manager Profile */}
        {team.length > 0 && onSelectActiveUser && (
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-2.5 py-1 rounded-lg text-xs">
            <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[11px] text-slate-400">المستخدم النشط:</span>
            <select
              value={activeUser?.id}
              onChange={(e) => onSelectActiveUser(e.target.value)}
              className="bg-transparent text-slate-100 font-bold text-xs focus:outline-none cursor-pointer"
            >
              {team.map((member) => (
                <option key={member.id} value={member.id} className="bg-slate-900 text-slate-200">
                  {member.name} ({member.role})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Search Input */}
        <div className="relative hidden xl:block w-52">
          <input
            id="global-search-input"
            type="text"
            placeholder="بحث بالمشروع أو العميل..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* APK / PWA Quick Action */}
        {onOpenInstallApk && (
          <button
            id="btn-navbar-install-apk"
            onClick={onOpenInstallApk}
            className="bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="تثبيت التطبيق على جهازك أو توليد ملف APK"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">تثبيت / APK</span>
          </button>
        )}

        {/* Action Button: Add New Project / Task */}
        {canCreateProjects ? (
          <button
            id="btn-add-new-project"
            onClick={onOpenNewProject}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-lg shadow-amber-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
            <span>إضافة أمر شغل</span>
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 text-[11px]">
            <Lock className="w-3 h-3 text-slate-500" />
            <span>إضافة مقيدة</span>
          </div>
        )}
      </div>
    </header>
  );
};
