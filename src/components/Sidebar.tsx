import React from 'react';
import { 
  LayoutDashboard, 
  Kanban, 
  Cpu, 
  FileText, 
  ShieldCheck, 
  Image as ImageIcon, 
  Lightbulb, 
  Calculator,
  ArrowLeftRight,
  Sparkles,
  Activity,
  Globe,
  Smartphone
} from 'lucide-react';
import { AppMode, ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  mode: AppMode;
  onToggleMode: () => void;
  pendingTasksCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  mode,
  onToggleMode,
  pendingTasksCount
}) => {
  const isManage = mode === 'manage';

  const menuItems = [
    { id: 'dashboard' as ViewType, label: 'المالية والتحكم', icon: LayoutDashboard },
    { id: 'worksheet' as ViewType, label: 'وورك شيت والتصاميم', icon: Kanban, badge: pendingTasksCount },
    { id: 'manufacturing' as ViewType, label: 'مراحل التصنيع (%)', icon: Cpu },
    { id: 'reports' as ViewType, label: 'تقارير المدير (PDF)', icon: FileText },
    { id: 'permissions' as ViewType, label: 'الصلاحيات و OTP', icon: ShieldCheck },
    { id: 'gallery' as ViewType, label: 'معرض الماكينات', icon: ImageIcon },
    { id: 'brainstorm' as ViewType, label: 'العصف الذهني والـ AI', icon: Lightbulb },
    { id: 'calculator' as ViewType, label: 'حاسبة أوزان الصاج والتكلفة', icon: Calculator },
    { id: 'install_apk' as ViewType, label: 'تثبيت PWA وتوليد APK', icon: Smartphone, tag: 'APK' },
  ];

  return (
    <aside id="sidebar-main" className="w-64 bg-slate-900 border-l border-slate-700 flex flex-col justify-between p-5 select-none shrink-0 h-screen overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-5 border-b border-slate-700/80">
          <div 
            id="appLogo" 
            className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg transition-all duration-300 ${
              isManage 
                ? 'bg-gradient-to-br from-amber-500 to-amber-700 shadow-amber-900/30' 
                : 'bg-gradient-to-br from-blue-500 to-emerald-600 shadow-blue-900/30'
            }`}
          >
            {isManage ? 'NM' : 'NW'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span id="appTitle" className="text-lg font-bold tracking-tight text-amber-400 capitalize">
                {isManage ? 'nfha manage' : 'nfha world'}
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-xs text-slate-400">
              {isManage ? 'نظام إدارة الورشة والإنتاج' : 'منصة العملاء ومتابعة المشاريع'}
            </p>
          </div>
        </div>

        {/* Mode Switch Banner Button */}
        <div className="mt-4 mb-2">
          <button
            id="btn-mode-toggle-banner"
            onClick={onToggleMode}
            className={`w-full py-2.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
              isManage
                ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700/70 hover:border-amber-500/50'
                : 'bg-blue-950/60 border-blue-600/40 text-blue-200 hover:bg-blue-900/50'
            }`}
          >
            <div className="flex items-center gap-2">
              {isManage ? <Activity className="w-3.5 h-3.5 text-amber-400" /> : <Globe className="w-3.5 h-3.5 text-blue-400" />}
              <span>{isManage ? 'الوضع: إدارة الورشة' : 'الوضع: بوابة العميل'}</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-700 text-amber-300 font-mono">
              تبديل
            </span>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-4">
          <ul className="flex flex-col gap-1.5 list-none">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <li key={item.id}>
                  <button
                    id={`nav-item-${item.id}`}
                    onClick={() => onSelectView(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-right ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-400 border-r-4 border-amber-500 font-semibold'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full font-mono font-semibold">
                        {item.badge}
                      </span>
                    )}
                    {item.tag && (
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                        {item.tag}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Footer Profile & Mode Toggle */}
      <div className="pt-4 border-t border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-xs text-amber-400 shrink-0">
            {isManage ? 'ح.م' : 'ع.ز'}
          </div>
          <div className="truncate">
            <div id="userName" className="text-xs font-bold text-slate-200 truncate">
              {isManage ? 'المهندس الحسين' : 'عميل / زائر'}
            </div>
            <div id="userRole" className="text-[11px] text-slate-400 truncate">
              {isManage ? 'مدير ورشة نفحة (Admin)' : 'حساب جمهور (OTP)'}
            </div>
          </div>
        </div>

        <button
          id="btn-toggle-mode"
          onClick={onToggleMode}
          title="تبديل الوضع (Manage / World)"
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-700 border border-slate-700 transition-colors"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
