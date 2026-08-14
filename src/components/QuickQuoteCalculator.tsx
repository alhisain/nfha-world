import React, { useState } from 'react';
import { 
  Calculator, 
  Layers, 
  Zap, 
  Flame, 
  DollarSign, 
  Copy, 
  Check, 
  Scale, 
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const QuickQuoteCalculator: React.FC = () => {
  // Sheet Metal Weight inputs
  const [length, setLength] = useState<number>(2000); // mm
  const [width, setWidth] = useState<number>(1000); // mm
  const [thickness, setThickness] = useState<number>(4); // mm
  const [materialType, setMaterialType] = useState<'steel' | 'stainless' | 'aluminum' | 'brass'>('steel');
  const [quantity, setQuantity] = useState<number>(1);
  const [pricePerKg, setPricePerKg] = useState<number>(1.8); // $ per kg

  // Laser Cutting inputs
  const [cutLengthMeters, setCutLengthMeters] = useState<number>(25); // meters
  const [piercesCount, setPiercesCount] = useState<number>(40);
  const [gasType, setGasType] = useState<'nitrogen' | 'oxygen' | 'air'>('nitrogen');
  const [laserHourlyRate, setLaserHourlyRate] = useState<number>(85); // $ per hour

  // Welding inputs
  const [weldMeters, setWeldMeters] = useState<number>(8); // meters
  const [weldType, setWeldType] = useState<'tig' | 'mig'>('tig');
  const [welderHourlyRate, setWelderHourlyRate] = useState<number>(25); // $ per hour

  const [copied, setCopied] = useState(false);

  // Density kg/dm3 or g/cm3
  const densities = {
    steel: 7.85,
    stainless: 8.00,
    aluminum: 2.70,
    brass: 8.50,
  };

  // Calculations
  // Volume in m3 = (length/1000) * (width/1000) * (thickness/1000)
  // Weight in kg = volume * density * 1000
  const singleWeightKg = ((length / 1000) * (width / 1000) * thickness * densities[materialType]);
  const totalWeightKg = singleWeightKg * quantity;
  const materialCost = totalWeightKg * pricePerKg;

  // Laser speed estimate (meters/min) depending on thickness
  const cutSpeedMpm = Math.max(0.5, (18 / Math.max(1, thickness)));
  const cutMinutes = (cutLengthMeters / cutSpeedMpm) + (piercesCount * (0.5 / 60));
  const cutHours = cutMinutes / 60;
  const gasCostPerMeter = gasType === 'nitrogen' ? 0.35 : gasType === 'oxygen' ? 0.15 : 0.05;
  const laserCost = (cutHours * laserHourlyRate) + (cutLengthMeters * gasCostPerMeter);

  // Welding time estimate: TIG ~ 0.15 m/min -> ~ 7 min per meter; MIG ~ 0.4 m/min -> ~ 3 min per meter
  const weldMinutesPerMeter = weldType === 'tig' ? 7 : 3;
  const totalWeldHours = (weldMeters * weldMinutesPerMeter) / 60;
  const weldingCost = (totalWeldHours * welderHourlyRate) + (weldMeters * 1.5); // 1.5$ wire/gas

  const totalCalculatedQuote = materialCost + laserCost + weldingCost;
  const suggestedSellingPrice = totalCalculatedQuote * 1.35; // 35% margin

  const handleCopySummary = () => {
    const summary = `حساب تسعيرة ورشة نفحة:
- وزن الخامة: ${totalWeightKg.toFixed(2)} كغ (${materialType}) = $${materialCost.toFixed(2)}
- قص الليزر: ${cutLengthMeters} متر (${cutMinutes.toFixed(1)} دقيقة) = $${laserCost.toFixed(2)}
- اللحام: ${weldMeters} متر = $${weldingCost.toFixed(2)}
- إجمالي تكلفة التشغيل: $${totalCalculatedQuote.toFixed(2)}
- سعر البيع المقترح مع هامش الربح: $${suggestedSellingPrice.toFixed(2)}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div id="view-calculator" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-amber-400" />
            <span>حاسبة أوزان الصاج والمعادن وتكلفة التشغيل الفورية</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            حساب وزن الألواح بالكيلوغرام، أزمنة قص الفايبر ليزر، وتكلفة ساعات اللحام والهامش الربحي
          </p>
        </div>

        <button
          onClick={handleCopySummary}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-950/40 transition-all"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'تم نسخ التقرير' : 'نسخ ملخص التسعير'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1: Sheet Metal Weight */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-700 text-slate-100 text-xs font-bold">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>1. حساب وزن وسعر خامة الصاج</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">نوع المعدن:</label>
              <select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500 font-semibold"
              >
                <option value="steel">حديد صلب / صاج أسود (7.85 g/cm³)</option>
                <option value="stainless">ستانلس ستيل SS304/316 (8.00 g/cm³)</option>
                <option value="aluminum">ألومنيوم 6061/5083 (2.70 g/cm³)</option>
                <option value="brass">نحاس أصفر Brass (8.50 g/cm³)</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">الطول (mm):</label>
                <input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">العرض (mm):</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">السماكة (mm):</label>
                <input
                  type="number"
                  step="0.5"
                  value={thickness}
                  onChange={(e) => setThickness(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">العدد (قطع):</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">سعر الكيلو ($):</label>
                <input
                  type="number"
                  step="0.1"
                  value={pricePerKg}
                  onChange={(e) => setPricePerKg(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-750 space-y-1 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>وزن القطعة الواحدة:</span>
                <span className="text-slate-200 font-bold">{singleWeightKg.toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>الوزن الكلي للكمية:</span>
                <span className="text-amber-400 font-bold">{totalWeightKg.toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                <span>تكلفة الخامة الإجمالية:</span>
                <span className="text-emerald-400 font-bold">${materialCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Col 2: Laser Cutting Time & Gas */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-700 text-slate-100 text-xs font-bold">
            <Zap className="w-4 h-4 text-blue-400" />
            <span>2. حساب قص الفايبر ليزر (Fiber Laser)</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">طول مسار القص الإجمالي (متر):</label>
              <input
                type="number"
                value={cutLengthMeters}
                onChange={(e) => setCutLengthMeters(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">عدد الثقوب (Piercing):</label>
                <input
                  type="number"
                  value={piercesCount}
                  onChange={(e) => setPiercesCount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">نوع غاز المساعدة:</label>
                <select
                  value={gasType}
                  onChange={(e) => setGasType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="nitrogen">نيتروجين N2 (نظيف بدون أكسدة)</option>
                  <option value="oxygen">أكسجين O2 (حديد سميك)</option>
                  <option value="air">هواء مضغوط Air (اقتصادي)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">سعر ساعة تشغيل الليزر ($):</label>
              <input
                type="number"
                value={laserHourlyRate}
                onChange={(e) => setLaserHourlyRate(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-750 space-y-1 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>سرعة القص التقديرية:</span>
                <span className="text-slate-200">{cutSpeedMpm.toFixed(1)} م/دقيقة</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>زمن تشغيل الليزر:</span>
                <span className="text-blue-400 font-bold">{cutMinutes.toFixed(1)} دقيقة</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                <span>تكلفة القص والغاز:</span>
                <span className="text-emerald-400 font-bold">${laserCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Col 3: Welding & Total Selling Price */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-700 text-slate-100 text-xs font-bold">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>3. تكلفة اللحام والسعر النهائي</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">أطوال خطوط اللحام (متر):</label>
              <input
                type="number"
                value={weldMeters}
                onChange={(e) => setWeldMeters(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">نوع اللحام:</label>
                <select
                  value={weldType}
                  onChange={(e) => setWeldType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="tig">لحام TIG أرجون نبضي</option>
                  <option value="mig">لحام MIG CO2 سلك</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">أجر الفني بالساعة ($):</label>
                <input
                  type="number"
                  value={welderHourlyRate}
                  onChange={(e) => setWelderHourlyRate(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Total Summary Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-xl border border-amber-500/40 space-y-2 mt-4 font-mono">
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>تكلفة اللحام والأسلاك:</span>
                <span className="text-slate-200 font-bold">${weldingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>إجمالي تكلفة التصنيع الأساسية:</span>
                <span className="text-slate-100 font-bold">${totalCalculatedQuote.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-750">
                <span className="text-amber-400 font-bold font-sans">سعر البيع المقترح (35% هامش):</span>
                <span className="text-lg font-black text-emerald-400 font-mono">
                  ${suggestedSellingPrice.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
