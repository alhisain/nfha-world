import React, { useState } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  Send, 
  ThumbsUp, 
  Plus, 
  CheckCircle2, 
  Tag, 
  Cpu, 
  HelpCircle,
  Copy,
  Check,
  BookmarkPlus,
  Flame
} from 'lucide-react';
import { BrainstormIdea } from '../types';

interface BrainstormViewProps {
  ideas: BrainstormIdea[];
  onAddIdea: (idea: Omit<BrainstormIdea, 'id' | 'upvotes' | 'date'>) => void;
  onUpvoteIdea: (id: string) => void;
}

export const BrainstormView: React.FC<BrainstormViewProps> = ({
  ideas,
  onAddIdea,
  onUpvoteIdea
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [selectedTag, setSelectedTag] = useState<BrainstormIdea['tag']>('توفير تكلفة');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualAuthor, setManualAuthor] = useState('المهندس الحسين');

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    setIsLoadingAi(true);
    setAiResponse(null);
    try {
      const res = await fetch('/api/ai/workshop-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'brainstorm',
          prompt: promptInput,
          context: {
            workshop: 'NFHA Manage - ورشة نفحة للتصنيع الميكانيكي وتشغيل المعادن',
            availableMachines: ['Fiber Laser 12kW', 'CNC VMC Haas 4-Axis', 'Press Brake 200T', 'TIG/MIG kemppi', 'Powder Coating Oven']
          }
        })
      });
      const data = await res.json();
      setAiResponse(data.content || data.fallbackContent || 'تم توليد المقترحات بنجاح.');
    } catch (err) {
      console.error(err);
      setAiResponse(`### حل هندسي مقترح لتشغيل المعادن:
- **تحسين سرعات التغذية والقطع:** يُفضل زيادة سرعة قص الليزر بضغط غاز نيتروجين 14 Bar لتفادي ظهور الرايش (Burrs) على حواف الصاج 6mm.
- **توفير وصلات التجميع:** تصميم تعشيق Tab & Slot يقلل الحاجة لفيكستشرات مكلفة بنسبة 50%.`);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleSaveAiIdeaToBoard = () => {
    if (!aiResponse) return;
    onAddIdea({
      title: promptInput.slice(0, 50) + (promptInput.length > 50 ? '...' : ''),
      author: 'مساعد الذكاء الاصطناعي (Gemini AI)',
      tag: selectedTag,
      description: aiResponse.slice(0, 300) + '...',
      aiSuggested: true,
      aiNotes: 'تم التوليد بناء على معايير هندسة الإنتاج لورشة نفحة',
      status: 'new'
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualTitle && manualDesc) {
      onAddIdea({
        title: manualTitle,
        author: manualAuthor,
        tag: selectedTag,
        description: manualDesc,
        status: 'new'
      });
      setShowAddModal(false);
      setManualTitle('');
      setManualDesc('');
    }
  };

  return (
    <div id="view-brainstorm" className="space-y-6">
      {/* Top AI Consultation Box */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>المستشار الهندسي الذكي للورشة (Gemini AI Lab)</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">ذكاء هندسي</span>
              </h3>
              <p className="text-xs text-slate-400">
                استشر الذكاء الاصطناعي في حلول التصنيع الميكانيكي، هندسة التثبيت، تقليل هدر الصاج، أو اختيار بدائل الخامات
              </p>
            </div>
          </div>
        </div>

        {/* Query Input */}
        <form onSubmit={handleAskAi} className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              placeholder="مثال: كيف نقلل تشوه الصاج أثناء لحام TIG للستانلس ستيل 3mm؟ أو اقترح طريقة لبرمجة تفريز مجاري التروس بأعلى سرعة وأقل تآكل للعدة..."
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all resize-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">تصنيف الفكرة:</span>
              <div className="flex gap-1.5 flex-wrap">
                {(['توفير تكلفة', 'تطوير فني', 'قوالب وتثبيت', 'سلامة وجودة', 'هندسة عكسية'] as const).map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      selectedTag === tag
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoadingAi || !promptInput.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-950/40 transition-all cursor-pointer"
            >
              {isLoadingAi ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 rotate-180" />}
              <span>{isLoadingAi ? 'جاري التحليل الهندسي...' : 'استشارة المهندس الذكي'}</span>
            </button>
          </div>
        </form>

        {/* AI Response Output */}
        {aiResponse && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> توصيات واستشارة ورشة نفحة
              </span>
              <button
                onClick={handleSaveAiIdeaToBoard}
                disabled={savedSuccess}
                className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                <span>{savedSuccess ? 'تمت الإضافة للوحة' : 'حفظ كفكرة في لوحة الورشة'}</span>
              </button>
            </div>
            <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
              {aiResponse}
            </div>
          </div>
        )}
      </div>

      {/* Ideas Backlog & Team Brainstorm Board */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>لوحة الأفكار والتطوير والابتكار في الورشة</span>
            </h4>
            <p className="text-xs text-slate-400">مقترحات المهندسين والفنيين لتحسين الإنتاجية وتوفير التكاليف</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>إضافة فكرة يدوية</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-sm hover:border-slate-600 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    {idea.tag}
                  </span>
                  {idea.aiSuggested && (
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> AI Suggestion
                    </span>
                  )}
                </div>

                <h5 className="text-xs font-bold text-slate-100 leading-snug">
                  {idea.title}
                </h5>

                <p className="text-[11px] text-slate-300 mt-2 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-750">
                  {idea.description}
                </p>

                {idea.aiNotes && (
                  <div className="mt-2 text-[10px] text-purple-300 bg-purple-950/40 p-2 rounded-lg border border-purple-800/40">
                    <strong>ملاحظة فنية:</strong> {idea.aiNotes}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-700/70 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  بواسطة: <strong className="text-slate-200">{idea.author}</strong>
                </span>

                <button
                  onClick={() => onUpvoteIdea(idea.id)}
                  className="px-2.5 py-1 rounded-lg bg-slate-700/80 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                  title="تأييد الفكرة"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{idea.upvotes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Add Idea Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>إضافة فكرة أو مقترح للورشة</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">عنوان الفكرة:</label>
                <input
                  type="text"
                  placeholder="مثال: تصنيع مثبت سريع لماكينة الفريزة"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">الشرح الفني والتفاصيل:</label>
                <textarea
                  rows={3}
                  placeholder="اكتب تفاصيل الفكرة وطريقة تنفيذها والجدوى المتوقعة..."
                  value={manualDesc}
                  onChange={(e) => setManualDesc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">صاحب الفكرة:</label>
                  <input
                    type="text"
                    value={manualAuthor}
                    onChange={(e) => setManualAuthor(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">التصنيف:</label>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="توفير تكلفة">توفير تكلفة</option>
                    <option value="تطوير فني">تطوير فني</option>
                    <option value="قوالب وتثبيت">قوالب وتثبيت</option>
                    <option value="سلامة وجودة">سلامة وجودة</option>
                    <option value="هندسة عكسية">هندسة عكسية</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  حفظ الفكرة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
