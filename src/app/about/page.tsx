'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ArrowLeft, CheckCircle, ShieldCheck, Mail, Sparkles, FileCode2, CheckCircle2, Layers } from 'lucide-react';

export default function AboutPage() {
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
          const l = raw.toLowerCase();
          setLang(l.startsWith('zh') ? 'zh' : 'en');
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

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'zh' ? '返回图标库' : 'Back to Icons Library'}
        </Link>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
          {lang === 'zh' ? '关于 ArchIcons 与设计指南' : 'About ArchIcons & Architecture Design Guide'}
        </h1>
        <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed mb-8">
          {lang === 'zh'
            ? 'ArchIcons 是专为网络工程师、系统架构师和开发者打造的高清矢量架构拓扑图标库与设计辅助工具箱。'
            : 'ArchIcons is a high-performance vector architecture icon directory built for software engineers, cloud architects, and sysadmins.'}
        </p>

        <div className="space-y-8 text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
          {/* 1. Topology & Architecture Design Guide */}
          <section className="p-6 rounded-2xl bg-slate-50/70 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-500" />
              {lang === 'zh' ? '网络拓扑与架构图三大设计范式' : 'Three Major Topology Design Paradigms'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/80 space-y-2">
                <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{lang === 'zh' ? '💎 2.5D 等轴测 (售前方案)' : '2.5D Isometric'}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-normal">
                  {lang === 'zh'
                    ? '统一 30° 立体机架视角，极具空间冲击力。专为售前技术标书、方案建议书（RFP）与高管汇报 PPT 打造。'
                    : 'Unified 30-degree isometric projection designed for executive PPT presentations and technical tenders.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/80 space-y-2">
                <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-bold text-xs">
                  <FileCode2 className="w-4 h-4 text-blue-500" />
                  <span>{lang === 'zh' ? '📐 2D 逻辑拓扑 (L2/L3规划)' : '2D Modern Flat'}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-normal">
                  {lang === 'zh'
                    ? '规范的现代扁平 2D 矢量标准（涵盖 Cisco CCIE 与华为标准规范）。适合大型复杂网络规划与路由协议走向分析。'
                    : 'Industry standard 2D flat vector icons for L2/L3 topology designs, protocol flows, and routing maps.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/80 space-y-2">
                <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{lang === 'zh' ? '☁️ 云服务架构 (公有云/云原生)' : 'Cloud Architecture'}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-normal">
                  {lang === 'zh'
                    ? '公有云与云原生架构标准组件（AWS、阿里云、Kubernetes 等），强调服务拓扑与微服务调用，完美支持混合云场景。'
                    : 'Standard cloud service icons for AWS, Alibaba Cloud, and Kubernetes hybrid infrastructure designs.'}
                </p>
              </div>
            </div>
          </section>

          {/* 2. Core Mission */}
          <section className="p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              {lang === 'zh' ? '三大核心体验' : 'Core Features'}
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>
                  <strong>{lang === 'zh' ? '1-Click 复制 SVG 源码：' : '1-Click SVG Copy: '}</strong>
                  {lang === 'zh'
                    ? '无需保存本地文件，点击即可在剪贴板中获取干净矢量代码，直接粘贴进 Draw.io、Figma、PPT。'
                    : 'Copy clean SVG code with a single click and paste directly into diagram tools.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>
                  <strong>{lang === 'zh' ? '跨厂商等价物秒切：' : 'Cross-Vendor Equivalence: '}</strong>
                  {lang === 'zh'
                    ? '查看通用防火墙或存储时，支持原地切换华为、飞塔、AWS、阿里云等同类设备版本，方案选型一目了然。'
                    : 'Instantly view counterpart services across Cisco, Huawei, AWS, and Alibaba Cloud.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>
                  <strong>{lang === 'zh' ? '全局动态光影调色盘：' : 'Dynamic Palette Engine: '}</strong>
                  {lang === 'zh'
                    ? '中立设备支持商务蓝、信创红、极客青等行业主题实时改色，自动生成顶面、侧面与阴影。'
                    : 'Customize colors on neutral symbols with real-time isometric lighting.'}
                </span>
              </li>
            </ul>
          </section>

          {/* 3. Contact */}
          <section className="p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              {lang === 'zh' ? '意见反馈与交流' : 'Contact & Suggestions'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
              {lang === 'zh'
                ? '如果您需要增加特定厂商的设备图标或对排版有优化建议，欢迎通过 GitHub Issue 或邮件与我们交流。'
                : 'For custom equipment icon requests or layout improvements, feel free to open a GitHub issue or contact us.'}
            </p>
          </section>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
