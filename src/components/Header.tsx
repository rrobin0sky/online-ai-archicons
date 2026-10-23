'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Star,
  Moon,
  Sun,
  Globe,
  Search,
  FileCode2,
  Download,
} from 'lucide-react';
import { PalettePopover } from './PalettePopover';

interface HeaderProps {
  lang: 'en' | 'zh';
  onToggleLang: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  themeColor?: string;
  onThemeColorChange?: (color: string) => void;
  favoritesCount?: number;
  showOnlyFavorites?: boolean;
  onToggleShowOnlyFavorites?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenBatchExport?: () => void;
  onExportDrawio?: () => void;
}

const BTN_BASE =
  'h-8 px-3 rounded-lg bg-slate-900/[0.04] hover:bg-slate-900/[0.08] dark:bg-white/[0.05] dark:hover:bg-white/[0.10] border border-slate-200/80 dark:border-white/10 text-slate-700 hover:text-slate-950 dark:text-zinc-200 dark:hover:text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap';

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  darkMode,
  onToggleDarkMode,
  themeColor = '#0284c7',
  onThemeColorChange,
  favoritesCount = 0,
  showOnlyFavorites = false,
  onToggleShowOnlyFavorites,
  searchQuery = '',
  onSearchChange,
  onOpenBatchExport,
  onExportDrawio,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global shortcut ⌘K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (
        e.key === '/' &&
        document.activeElement !== searchInputRef.current &&
        !['INPUT', 'TEXTAREA'].includes(
          (document.activeElement as HTMLElement)?.tagName || ''
        )
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-black/[0.08] dark:border-white/10 px-4 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* 1. Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-7 h-7 rounded-lg bg-slate-900/[0.04] dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-slate-800 dark:text-zinc-200"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2.5 L20.5 7.4 V16.6 L12 21.5 L3.5 16.6 V7.4 Z" />
              <path d="M12 2.5 V12 L20.5 7.4 M12 12 L3.5 7.4 M12 12 V21.5" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            ArchIcons
          </h1>
        </Link>

        {/* 2. Global Search Bar (Centered like NetBOM) */}
        {onSearchChange && (
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={
                  lang === 'zh'
                    ? '搜索设备、厂商、协议 (如: Cisco, 华为, VPC, 核心交换机)...'
                    : 'Search equipment, vendor, protocol (e.g. Cisco, Huawei, VPC)...'
                }
                className="w-full h-8 glass-input rounded-lg pl-9 pr-12 text-xs placeholder:text-slate-400 dark:placeholder:text-zinc-500"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white"
                >
                  ✕
                </button>
              ) : (
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-slate-900/[0.04] dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 text-[10px] font-mono text-slate-400 dark:text-zinc-500 pointer-events-none leading-none">
                  ⌘K
                </span>
              )}
            </div>
          </div>
        )}

        {/* 3. Right Action Buttons (Unified Size & Color like NetBOM) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Palette Popover */}
          {onThemeColorChange && (
            <PalettePopover
              currentColor={themeColor}
              onColorChange={onThemeColorChange}
              lang={lang}
            />
          )}

          {/* Draw.io Stencil Export */}
          {onExportDrawio && (
            <button
              type="button"
              onClick={onExportDrawio}
              className={BTN_BASE}
              title={
                lang === 'zh'
                  ? '下载当前配色 Draw.io 图库文件 (.xml)'
                  : 'Export as Draw.io Stencil (.xml)'
              }
            >
              <FileCode2 className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
              <span className="hidden sm:inline">Draw.io</span>
            </button>
          )}

          {/* Batch Export */}
          {onOpenBatchExport && (
            <button
              type="button"
              onClick={onOpenBatchExport}
              className={BTN_BASE}
              title={lang === 'zh' ? '批量打包导出图标' : 'Batch Export Icons'}
            >
              <Download className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
              <span>{lang === 'zh' ? '导出' : 'Export'}</span>
            </button>
          )}

          {/* Favorites Toggle */}
          {onToggleShowOnlyFavorites && (
            <button
              type="button"
              onClick={onToggleShowOnlyFavorites}
              className={
                showOnlyFavorites
                  ? 'h-8 px-3 rounded-lg bg-slate-900/[0.10] dark:bg-white/[0.14] border border-slate-900/25 dark:border-white/25 text-slate-950 dark:text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap'
                  : BTN_BASE
              }
              title={
                showOnlyFavorites
                  ? lang === 'zh'
                    ? '显示全部图标'
                    : 'Show All'
                  : lang === 'zh'
                  ? '仅看已收藏图标'
                  : 'Show Favorites Only'
              }
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  showOnlyFavorites || favoritesCount > 0
                    ? 'fill-amber-400 text-amber-500'
                    : 'text-slate-400 dark:text-zinc-400'
                }`}
              />
              <span>
                {showOnlyFavorites
                  ? lang === 'zh'
                    ? '已收藏'
                    : 'Saved'
                  : lang === 'zh'
                  ? '收藏'
                  : 'Stars'}
              </span>
              {favoritesCount > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-slate-900/10 dark:bg-white/10 text-slate-700 dark:text-zinc-200 text-[11px] font-mono leading-none">
                  {favoritesCount}
                </span>
              )}
            </button>
          )}

          {/* Standalone Language Switcher */}
          <button
            type="button"
            onClick={onToggleLang}
            className={`b0-hide-in-frame ${BTN_BASE}`}
            title={
              lang === 'zh'
                ? '切换语言 (Switch to English)'
                : 'Switch Language (切换中文)'
            }
          >
            <Globe className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
            <span>{lang === 'zh' ? 'EN' : '中'}</span>
          </button>

          {/* Standalone Dark/Light Mode Switcher */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className={`b0-hide-in-frame ${BTN_BASE} !px-2.5`}
            title={
              darkMode
                ? lang === 'zh'
                  ? '切换为亮色模式'
                  : 'Light Mode'
                : lang === 'zh'
                ? '切换为暗色模式'
                : 'Dark Mode'
            }
          >
            {darkMode ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
