import React from 'react';
import { Trash2, AlertTriangle, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { ProjectTask } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectTask | null;
  onConfirmDelete: (projectId: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  project,
  onConfirmDelete
}) => {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="bg-slate-900 border border-rose-800/80 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
          <div className="flex items-center gap-2.5 text-rose-400">
            <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-800/80 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">تأكيد حذف أمر الشغل</h3>
              <p className="text-[11px] text-slate-400">إجراء إداري دائم لا يمكن التراجع عنه</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Snapshot */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-amber-400 bg-slate-850 px-2 py-0.5 rounded border border-slate-750">
              {project.code}
            </span>
            <span className="text-[11px] text-slate-400">{project.category}</span>
          </div>

          <div className="font-bold text-slate-200">{project.title}</div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-850">
            <div>
              <span>العميل: </span>
              <strong className="text-slate-300">{project.clientName}</strong>
            </div>
            <div>
              <span>القيمة: </span>
              <strong className="font-mono text-emerald-400">{project.totalPrice.toLocaleString()} SAR</strong>
            </div>
          </div>
        </div>

        <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-xl text-rose-300 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <div>
            <span className="font-bold block">تحذير من المدير:</span>
            <span>سيتم حذف هذا المشروع وكافة مراحل التصنيع المرتبطة به وسجل OTP الخاص بالعميل نهائياً من قاعدة بيانات الورشة.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmDelete(project.id);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-950/50 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>تأكيد الحذف النهائي</span>
          </button>
        </div>

      </div>
    </div>
  );
};
