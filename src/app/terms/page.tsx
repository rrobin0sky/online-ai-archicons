'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const b0Theme = localStorage.getItem('b0_theme') || (document.cookie.match(/(^|;\s*)b0_theme=([^;]*)/)?.[2]);
      const savedTheme = b0Theme || localStorage.getItem('archicons_theme_mode');
      const isDark = savedTheme
        ? savedTheme === 'dark'
        : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }

      // Load saved language with BinOS root cookie fallback
      try {
        const b0Lang = localStorage.getItem('b0_lang') || (document.cookie.match(/(^|;\s*)b0_lang=([^;]*)/)?.[2]);
        const rawLang = b0Lang || localStorage.getItem('archicons_lang');
        if (rawLang) {
          const l = rawLang.toLowerCase();
          setLang(l.startsWith('zh') ? 'zh' : 'en');
        }
      } catch (err) {
        console.error('Failed to load lang from localStorage', err);
      }

      // Universal Theme & Lang Event Listeners
      const handleThemeEvent = (e: any) => {
        const dark = e.detail?.isDark ?? (e.data?.theme === 'dark');
        if (typeof dark === 'boolean') {
          setDarkMode(dark);
          document.documentElement.classList.toggle('dark', dark);
          document.documentElement.classList.toggle('light', !dark);
        }
      };

      const handleLangEvent = (e: any) => {
        const raw = e.detail?.lang || e.data?.lang;
        if (raw) {
          const isZh = raw.toLowerCase().startsWith('zh');
          const target = isZh ? 'zh' : 'en';
          setLang(target);
          try {
            localStorage.setItem('archicons_lang', target);
            localStorage.setItem('b0_lang', isZh ? 'zh-CN' : 'en');
          } catch(err) {}
          document.documentElement.setAttribute('lang', target);
        }
      };

      const handlePostMessage = (e: MessageEvent) => {
        if (!e.data) return;
        if (e.data.type === 'B0_THEME_CHANGE') {
          handleThemeEvent(e);
        } else if (e.data.type === 'B0_LANG_CHANGE') {
          handleLangEvent(e);
        }
      };

      window.addEventListener('b0-theme-change', handleThemeEvent as EventListener);
      window.addEventListener('b0-lang-change', handleLangEvent as EventListener);
      window.addEventListener('message', handlePostMessage);

      return () => {
        window.removeEventListener('b0-theme-change', handleThemeEvent as EventListener);
        window.removeEventListener('b0-lang-change', handleLangEvent as EventListener);
        window.removeEventListener('message', handlePostMessage);
      };
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
      try {
        localStorage.setItem('archicons_theme_mode', next ? 'dark' : 'light');
        localStorage.setItem('b0_theme', next ? 'dark' : 'light');
        const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
        const domainStr = isLocal ? '' : '; domain=.bin0sky.tech';
        document.cookie = `b0_theme=${next ? 'dark' : 'light'}; path=/${domainStr}; max-age=31536000; SameSite=Lax`;
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === 'zh' ? 'en' : 'zh';
      try {
        localStorage.setItem('archicons_lang', next);
        localStorage.setItem('b0_lang', next === 'zh' ? 'zh-CN' : 'en');
        const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
        const domainStr = isLocal ? '' : '; domain=.bin0sky.tech';
        document.cookie = `b0_lang=${next === 'zh' ? 'zh-CN' : 'en'}; path=/${domainStr}; max-age=31536000; SameSite=Lax`;
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-[#09090b] min-h-screen text-slate-900 dark:text-white transition-colors">
      <Header
        lang={lang}
        onToggleLang={toggleLang}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'zh' ? '返回首页' : 'Back to Home'}
        </Link>

        <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {lang === 'zh' ? '服务条款 (Terms of Service)' : 'Terms of Service'}
              </h1>
              <p className="text-xs text-slate-500">Last updated: September 2026</p>
            </div>
          </div>

          <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">1. Terms</h2>
              <p>
                By accessing this website, accessible from icon.bin0sky.tech, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">2. Use License & Trademark Disclaimer</h2>
              <p>
                Permission is granted to freely browse and copy SVG code and download icon assets for architecture diagramming and design purposes.
                All product names, logos, and brands (including China Telecom, China Unicom, China Mobile, Cisco, Huawei, H3C, AWS, Microsoft Azure, Google Cloud, Alibaba Cloud, Kubernetes) are property of their respective owners.
                All company, product, and carrier service names used in this website are for identification, network topology illustration, and informational purposes only.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">3. Disclaimer</h2>
              <p>
                All the materials on ArchIcons are provided &apos;as is&apos;. ArchIcons makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, ArchIcons does not make any representations concerning the accuracy or reliability of the use of the materials on its website.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
