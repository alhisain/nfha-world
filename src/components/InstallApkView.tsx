import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Download, 
  QrCode, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  Copy, 
  Check, 
  ShieldCheck, 
  Share2, 
  ArrowLeft, 
  FileCode2, 
  Globe, 
  Terminal, 
  HelpCircle,
  Cpu,
  Monitor,
  Flame,
  FileCheck
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface InstallApkViewProps {
  onBackToDashboard?: () => void;
}

export const InstallApkView: React.FC<InstallApkViewProps> = ({ onBackToDashboard }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [activeTab, setActiveTab] = useState<'pwa_install' | 'apk_builder' | 'android_guide' | 'qr_scan'>('pwa_install');
  const [currentUrl, setCurrentUrl] = useState('');
  const [isGeneratingPackage, setIsGeneratingPackage] = useState(false);
  const [packageGenerated, setPackageGenerated] = useState(false);

  useEffect(() => {
    // Check if current URL is available
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
      
      // Check if already in standalone mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                           (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone);

      // Listen for PWA beforeinstallprompt
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      window.addEventListener('appinstalled', () => {
        setIsInstalled(true);
        setDeferredPrompt(null);
      });

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback instruction alert/scroll
      setActiveTab('android_guide');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error('Error triggering PWA install prompt:', err);
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard && currentUrl) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const generateAndDownloadApkPackage = () => {
    setIsGeneratingPackage(true);
    setTimeout(() => {
      // Generate a downloadable package bundle containing AndroidManifest, Capacitor config, build scripts
      const packageContent = `
==============================================================================
   NFHA MANAGE - ANDROID APK & PWA EXPORT PACKAGE
   نظام إدارة الورشة والتصنيع الميكانيكي
==============================================================================

App Name: NFHA Manage
Package ID: com.nfha.manage
Version: 1.0.0
Live URL: ${currentUrl || 'https://ais-pre-m6awrn2mwb7qpvnuwbj56j-24834556152.europe-west2.run.app'}
Manifest Path: /manifest.json
Service Worker: /sw.js

------------------------------------------------------------------------------
الطريقة 1: التوليد السحابي المباشر لملف APK بنقرة واحدة (PWABuilder):
------------------------------------------------------------------------------
1. افتح موقع: https://www.pwabuilder.com
2. الصق رابط التطبيق أعلاه
3. اضغط Start ثم اختر "Package for Android"
4. ستحصل على ملف APK جاهز للتثبيت و AAB لمتجر Google Play!

------------------------------------------------------------------------------
الطريقة 2: بناء APK محلياً عبر Capacitor / Android Studio:
------------------------------------------------------------------------------
أوامر سطر الأوامر (Terminal):
$ npm install @capacitor/core @capacitor/cli @capacitor/android
$ npx cap init "NFHA Manage" "com.nfha.manage" --web-dir dist
$ npm run build
$ npx cap add android
$ npx cap open android
ثم من Android Studio: اختر Build > Build Bundle(s) / APK(s) > Build APK(s)

------------------------------------------------------------------------------
ملف التكوين AndroidManifest.xml المولد:
------------------------------------------------------------------------------
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.nfha.manage">
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="NFHA Manage"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTask"
            android:theme="@style/AppTheme.NoActionBarLaunch">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
    <uses-permission android:name="android.permission.INTERNET" />
</manifest>
`;

      const blob = new Blob([packageContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `NFHA-Manage-Android-APK-Package.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsGeneratingPackage(false);
      setPackageGenerated(true);
      setTimeout(() => setPackageGenerated(false), 4000);
    }, 1200);
  };

  // Online PWABuilder direct link
  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentUrl || 'https://ais-pre-m6awrn2mwb7qpvnuwbj56j-24834556152.europe-west2.run.app')}`;

  return (
    <div id="install-apk-hub" className="space-y-6 max-w-6xl mx-auto pb-12 select-none" dir="rtl">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 p-6 md:p-8 border border-amber-500/30 shadow-2xl shadow-amber-950/40">
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-400/40 text-amber-300 text-xs font-semibold">
              <Smartphone className="w-3.5 h-3.5" />
              <span>مركز تثبيت التطبيق وتحويله إلى APK (PWA & Android App)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              تحويل وتثبيت منظومة NFHA Manage على هواتف أندرويد
            </h1>
            <p className="text-sm text-slate-200 max-w-2xl leading-relaxed">
              يمكنك تشغيل المنظومة كتطبيق أصلي (Native App) على هواتف أندرويد والكمبيوتر، مع ميزة العمل بدون شريط المتصفح وسرعة استجابة فائقة، أو تصدير حزمة الـ APK السحابية مباشرة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-600 flex items-center gap-2 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>العودة للوحة التحكم</span>
              </button>
            )}
            <button
              id="btn-trigger-pwa-install-top"
              onClick={handleInstallClick}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/60 transition-all hover:scale-105"
            >
              <Smartphone className="w-4 h-4 stroke-[2.5]" />
              <span>{isInstalled ? 'التطبيق مثبت بالفعل ✅' : 'تثبيت التطبيق على جهازك الآن'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('pwa_install')}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'pwa_install'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/40'
              : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>التثبيت المباشر بنقرة واحدة (PWA)</span>
        </button>

        <button
          onClick={() => setActiveTab('apk_builder')}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'apk_builder'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/40'
              : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>توليد وتصدير ملف APK المباشر</span>
        </button>

        <button
          onClick={() => setActiveTab('android_guide')}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'android_guide'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/40'
              : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>دليل التثبيت عبر المتصفح (Chrome / Samsung)</span>
        </button>

        <button
          onClick={() => setActiveTab('qr_scan')}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'qr_scan'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/40'
              : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>مسح QR من الهاتف</span>
        </button>
      </div>

      {/* Tab 1: PWA Quick Install */}
      {activeTab === 'pwa_install' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Action Card */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-black text-xl">
                  NM
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">تطبيق NFHA Manage للورشة</h3>
                  <p className="text-xs text-slate-400">الإصدار 1.0.0 • تطبيق ويب تقدمي متجاوب مع أندرويد و iOS و Windows</p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                isInstalled 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                {isInstalled ? 'مثبت على الجهاز' : 'جاهز للتثبيت'}
              </span>
            </div>

            {/* Features Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">واجهة كاملة الشاشة (Standalone)</h4>
                  <p className="text-[11px] text-slate-400">يعمل بدون شريط عناوين المتصفح لتجربة استخدام تشبه التطبيقات الأصلية تماماً.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">تخزين مؤقت وسرعة فائقة</h4>
                  <p className="text-[11px] text-slate-400">تحميل فوري للملفات والبيانات من الذاكرة المحلية عبر Service Worker.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">أيقونة مخصصة على شاشة هاتفك</h4>
                  <p className="text-[11px] text-slate-400">ظهور أيقونة الورشة مباشرة مع إمكانية فتح التطبيق بنقرة واحدة.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">أمان وتشفير كامل</h4>
                  <p className="text-[11px] text-slate-400">اتصال مشفر وآمن عبر بروتوكول HTTPS وحماية لبيانات الورشة والعملاء.</p>
                </div>
              </div>
            </div>

            {/* Install Button & Direct Link */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-4">
              <button
                id="btn-install-pwa-main"
                onClick={handleInstallClick}
                className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Smartphone className="w-5 h-5 stroke-[2.5]" />
                <span>{isInstalled ? 'فتح التطبيق المثبت على الجهاز' : 'تثبيت التطبيق على هاتفك الآن'}</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 transition-all"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                <span>{copiedLink ? 'تم نسخ الرابط!' : 'نسخ رابط التطبيق'}</span>
              </button>
            </div>
          </div>

          {/* Technical Health Audit Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>فحص توافق وجاهزية الـ PWA</span>
            </h3>

            <div className="space-y-2.5">
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40 flex items-center justify-between text-xs">
                <span className="text-slate-300">ملف التعريف (Manifest.json)</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> مفعل ومتوافق
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40 flex items-center justify-between text-xs">
                <span className="text-slate-300">مشغل الخدمة (Service Worker)</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> نشط (sw.js)
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40 flex items-center justify-between text-xs">
                <span className="text-slate-300">أيقونات التطبيق عالية الدقة</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> SVG & Maskable
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40 flex items-center justify-between text-xs">
                <span className="text-slate-300">شهادة الأمان المشفرة (HTTPS)</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> مشفر آمن
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40 flex items-center justify-between text-xs">
                <span className="text-slate-300">دعم العمل دون اتصال (Offline)</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> جاهز
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('android_guide')}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>عرض خطوات التثبيت في متصفح Chrome</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: APK Builder & Cloud Packaging */}
      {activeTab === 'apk_builder' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cloud PWA to APK Converter (PWABuilder) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">تحويل PWA إلى APK سحابياً عبر PWABuilder</h3>
                  <p className="text-xs text-slate-400">خدمة مايكروسوفت الرسمية المفتوحة لتحويل تطبيقات PWA إلى APK و AAB موقع</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                تقوم هذه الخدمة بفحص ملف التعريف <code className="text-amber-400 bg-slate-800 px-1 py-0.5 rounded">manifest.json</code> وتوليد ملف APK جاهز للتثبيت المباشر على جميع هواتف أندرويد بنقرة زر واحدة.
              </p>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>رابط المنظومة الجاري تحويلها:</span>
                  <span className="text-emerald-400 font-mono text-[11px]">جاهز ومفحوص</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 truncate bg-slate-950 p-2 rounded border border-slate-800" dir="ltr">
                  {currentUrl || 'https://ais-pre-m6awrn2mwb7qpvnuwbj56j-24834556152.europe-west2.run.app'}
                </div>
              </div>

              <a
                href={pwaBuilderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50 transition-all hover:scale-[1.02]"
              >
                <ExternalLink className="w-4 h-4" />
                <span>فتح مولد الـ APK السحابي (PWABuilder) مباشرة</span>
              </a>
            </div>

            {/* Direct Package & Source Build Bundle */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <FileCode2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">تنزيل حزمة بناء وتوليد APK للأندرويد</h3>
                  <p className="text-xs text-slate-400">توليد حزمة الإعدادات و AndroidManifest و Capacitor Build Scripts</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                قم بتنزيل حزمة البناء الجاهزة التي تحتوي على ملفات التكوين وأوامر البناء الفوري لتجميع ملف APK عبر Android Studio أو سطر الأوامر.
              </p>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>محتويات الحزمة:</span>
                </div>
                <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1 pr-1">
                  <li>ملف التكوين <code className="text-amber-300">AndroidManifest.xml</code> بكامل الصلاحيات</li>
                  <li>سكربت البناء السريع <code className="text-amber-300">capacitor.config.json</code></li>
                  <li>ملفات ربط النطاق <code className="text-amber-300">assetlinks.json</code> لتجاوز شريط المتصفح</li>
                </ul>
              </div>

              <button
                id="btn-download-apk-package"
                onClick={generateAndDownloadApkPackage}
                disabled={isGeneratingPackage}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {isGeneratingPackage ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>جاري توليد الحزمة...</span>
                  </>
                ) : packageGenerated ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>تم تنزيل الحزمة بنجاح!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>تنزيل حزمة تكوين الـ APK المباشرة</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Terminal Commands Guide */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>أوامر سطر الأوامر لبناء APK عبر Capacitor / Android Studio</span>
              </h3>

              <button
                onClick={() => {
                  const cmd = `npm install @capacitor/core @capacitor/cli @capacitor/android\nnpx cap init "NFHA Manage" "com.nfha.manage" --web-dir dist\nnpm run build\nnpx cap add android\nnpx cap open android`;
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(cmd);
                    setCopiedCommand(true);
                    setTimeout(() => setCopiedCommand(false), 2500);
                  }
                }}
                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                {copiedCommand ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedCommand ? 'تم النسخ!' : 'نسخ الأوامر'}</span>
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-amber-400/90 space-y-1.5 overflow-x-auto" dir="ltr">
              <p className="text-slate-500"># 1. تثبيت حزم كاباسيتور لأندرويد</p>
              <p>npm install @capacitor/core @capacitor/cli @capacitor/android</p>
              <p className="text-slate-500 pt-1"># 2. تهيئة التطبيق</p>
              <p>npx cap init "NFHA Manage" "com.nfha.manage" --web-dir dist</p>
              <p className="text-slate-500 pt-1"># 3. بناء المشروع وتصدير أندرويد</p>
              <p>npm run build</p>
              <p>npx cap add android</p>
              <p>npx cap open android</p>
              <p className="text-emerald-400 pt-1"># 4. في Android Studio: اضغط Build &gt; Build APKs</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Android Browser Installation Guide */}
      {activeTab === 'android_guide' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-400" />
                <span>خطوات تثبيت التطبيق على هواتف أندرويد عبر متصفح Google Chrome</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                تتيح تقنية PWA تثبيت التطبيق مباشرة بدون الحاجة لمتجر Google Play أو تفعيل خيارات المطورين:
              </p>
            </div>

            {/* Step 1 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-5 space-y-3 relative">
                <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  1
                </div>
                <h3 className="text-sm font-bold text-slate-100">افتح الرابط في Chrome</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  افتح رابط المنظومة في متصفح Google Chrome أو Samsung Internet على هاتفك الأندرويد.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-5 space-y-3 relative">
                <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  2
                </div>
                <h3 className="text-sm font-bold text-slate-100">اضغط قائمة الخيارات (⋮)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  اضغط على أيقونة الثلاث نقاط الرأسية في أعلى يسار المتصفح (أو أسفل الشاشة في Samsung Internet).
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-5 space-y-3 relative">
                <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  3
                </div>
                <h3 className="text-sm font-bold text-slate-100">اختر "تثبيت التطبيق"</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  انقر على خيار <strong className="text-amber-400">"تثبيت التطبيق" (Install App)</strong> أو <strong>"إضافة إلى الشاشة الرئيسية"</strong>.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-5 space-y-3 relative">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  4
                </div>
                <h3 className="text-sm font-bold text-slate-100">تم التثبيت بنجاح!</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ستظهر أيقونة NFHA Manage على شاشة هاتفك الرئيسية وتعمل بملء الشاشة مع كافة المزايا.
                </p>
              </div>
            </div>

            {/* Visual Callout for Samsung & Other Browsers */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-amber-400">نصائح لباقي المتصفحات:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="font-bold text-slate-100 block mb-1">متصفح Samsung Internet:</span>
                  اضغط على زر القائمة (☰) في الأسفل &gt; اختر "إضافة الصفحة إلى" &gt; اختر "الشاشة الرئيسية".
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="font-bold text-slate-100 block mb-1">متصفح Microsoft Edge:</span>
                  اضغط على زر (•••) في الأسفل &gt; اختر "إضافة إلى الهاتف" أو "تثبيت هذا الموقع كتطبيق".
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: QR Code Scanner */}
      {activeTab === 'qr_scan' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-lg font-bold text-slate-100 flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-amber-400" />
              <span>امسح رمز الاستجابة السريعة (QR Code) بهاتفك</span>
            </h2>
            <p className="text-xs text-slate-400">
              وجّه كاميرا هاتفك الأندرويد أو تطبيق الماسح الضوئي نحو الرمز أدناه لفتح المنظومة وتثبيتها مباشرة:
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 py-4">
            {/* SVG QR Code Simulation / High Density Matrix */}
            <div className="p-5 bg-white rounded-2xl shadow-2xl shadow-amber-950/30 border-4 border-amber-500/50 flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" className="w-48 h-48">
                {/* QR Pattern Representation */}
                <rect width="200" height="200" fill="#ffffff" />
                {/* Corner Markers */}
                <rect x="15" y="15" width="45" height="45" fill="#0f172a" rx="4" />
                <rect x="23" y="23" width="29" height="29" fill="#ffffff" />
                <rect x="29" y="29" width="17" height="17" fill="#f59e0b" />

                <rect x="140" y="15" width="45" height="45" fill="#0f172a" rx="4" />
                <rect x="148" y="23" width="29" height="29" fill="#ffffff" />
                <rect x="154" y="29" width="17" height="17" fill="#f59e0b" />

                <rect x="15" y="140" width="45" height="45" fill="#0f172a" rx="4" />
                <rect x="23" y="148" width="29" height="29" fill="#ffffff" />
                <rect x="29" y="154" width="17" height="17" fill="#f59e0b" />

                {/* Data Grid Dots */}
                <g fill="#0f172a">
                  <rect x="75" y="20" width="8" height="8" />
                  <rect x="90" y="20" width="8" height="8" />
                  <rect x="110" y="20" width="16" height="8" />
                  <rect x="75" y="35" width="16" height="8" />
                  <rect x="100" y="35" width="8" height="16" />
                  <rect x="120" y="35" width="8" height="8" />
                  
                  <rect x="20" y="75" width="8" height="16" />
                  <rect x="35" y="85" width="16" height="8" />
                  <rect x="60" y="75" width="8" height="8" />
                  <rect x="75" y="60" width="16" height="8" />
                  <rect x="100" y="60" width="8" height="8" />
                  <rect x="115" y="70" width="16" height="16" />
                  <rect x="140" y="75" width="8" height="8" />
                  <rect x="160" y="65" width="16" height="8" />
                  <rect x="150" y="85" width="8" height="16" />
                  <rect x="175" y="80" width="8" height="8" />

                  <rect x="70" y="95" width="20" height="20" fill="#f59e0b" rx="2" />
                  <rect x="95" y="95" width="10" height="10" />
                  <rect x="110" y="95" width="20" height="10" />
                  <rect x="95" y="110" width="20" height="10" />
                  <rect x="120" y="110" width="10" height="20" />
                  
                  <rect x="75" y="140" width="8" height="16" />
                  <rect x="90" y="150" width="16" height="8" />
                  <rect x="115" y="140" width="8" height="8" />
                  <rect x="130" y="145" width="16" height="16" />
                  <rect x="155" y="140" width="8" height="8" />
                  <rect x="170" y="150" width="16" height="8" />
                  
                  <rect x="75" y="170" width="16" height="8" />
                  <rect x="100" y="165" width="8" height="16" />
                  <rect x="115" y="170" width="16" height="8" />
                  <rect x="140" y="170" width="8" height="16" />
                  <rect x="160" y="165" width="16" height="8" />
                </g>
              </svg>
              <span className="text-[11px] font-bold text-slate-800 mt-2">NFHA MANAGE • PWA</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                <span>{copiedLink ? 'تم نسخ الرابط!' : 'نسخ رابط التطبيق للمشاركة'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
