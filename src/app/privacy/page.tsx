'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
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
            <Shield className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {lang === 'zh' ? '隐私政策 (Privacy Policy)' : 'Privacy Policy'}
              </h1>
              <p className="text-xs text-slate-500">Last updated: September 2026</p>
            </div>
          </div>

          <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">1. Overview</h2>
              <p>
                At ArchIcons (accessible from icon.bin0sky.tech), one of our main priorities is the privacy of our visitors.
                This Privacy Policy document outlines the types of information that is collected and recorded by ArchIcons and how we use it.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">2. Log Files & Analytics</h2>
              <p>
                ArchIcons follows a standard procedure of using log files. These files log visitors when they visit websites.
                The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP),
                date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">3. Cookies & Web Beacons</h2>
              <p>
                Like any other website, ArchIcons may use &apos;cookies&apos; to store information including visitors&apos; preferences, and the pages on the website that the visitor accessed or visited.
                The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and other information.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">4. Google DoubleClick DART Cookie & Third-Party Advertising</h2>
              <p>
                Google is one of our third-party vendors. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to icon.bin0sky.tech and other sites on the internet.
                Visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL:
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline ml-1"
                >
                  https://policies.google.com/technologies/ads
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">5. Third Party Privacy Policies</h2>
              <p>
                ArchIcons&apos;s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">6. Consent</h2>
              <p>
                By using our website, you hereby consent to our Privacy Policy and agree to its terms.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
