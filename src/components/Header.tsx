'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Moon, Sun, Globe } from 'lucide-react';
import { PalettePopover } from './PalettePopover';
import { IconStyle } from '../types/icon';
import { STYLES } from '../data/icons';

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
  // Style switcher integrated in header
  selectedStyle?: IconStyle | 'all';
  onStyleChange?: (style: IconStyle | 'all') => void;
}

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
  selectedStyle = 'all',
  onStyleChange,
}) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Scroll detection for dynamic backdrop & border
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-md shadow-xs border-b border-slate-200/80 dark:border-zinc-800/80'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-13 sm:h-[52px] flex items-center justify-between gap-2 sm:gap-4">
        {/* 1. Left: Unified Official Brand Super-Symbol (1:1 with Favicon) */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-8 h-8 rounded-xl shadow-xs transition-transform group-hover:scale-105 active:scale-95 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="header-arch-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#1d4ed8"/>
                  <stop offset="50%" stop-color="#3b82f6"/>
                  <stop offset="100%" stop-color="#7c3aed"/>
                </linearGradient>
                <filter id="header-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000000" flood-opacity="0.3"/>
                </filter>
              </defs>
              <rect width="32" height="32" rx="7.5" fill="url(#header-arch-bg)"/>
              <rect width="32" height="32" rx="7.5" fill="none" stroke="#ffffff" stroke-width="1" stroke-opacity="0.25"/>
              <g filter="url(#header-glow)">
                <path
                  d="M16 5.5 L25 10.7 V21.3 L16 26.5 L7 21.3 V10.7 Z"
                  fill="none"
                  stroke="#ffffff"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
                <path
                  d="M16 5.5 V16 L25 10.7 M16 16 L7 10.7 M16 16 V26.5"
                  fill="none"
                  stroke="#ffffff"
                  stroke-width="1.8"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                />
                <circle cx="16" cy="16" r="2.6" fill="#38bdf8"/>
                <circle cx="16" cy="16" r="1.4" fill="#ffffff"/>
              </g>
            </svg>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
              ArchIcons
            </span>
          </div>
        </Link>

        {/* 2. Middle: Integrated Top Style Mode Segmented Pill Control */}
        {onStyleChange && (
          <div className="flex items-center justify-center overflow-x-auto scrollbar-none py-1">
            <div className="inline-flex p-0.5 sm:p-1 rounded-xl bg-slate-100/90 dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800 shadow-inner">
              <button
                type="button"
                onClick={() => onStyleChange('all')}
                className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all ${
                  selectedStyle === 'all'
                    ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lang === 'zh' ? '全部' : 'All'}
              </button>

              {STYLES.map((style) => {
                const isSelected = selectedStyle === style.id;
                // Short name for mobile
                const displayName = style.name[lang];

                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => onStyleChange(style.id)}
                    className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title={style.description[lang]}
                  >
                    {displayName}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Right: Utility Tools (Palette, Lang, Dark/Light, Favorites) */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          {/* Button 1: Palette Popover */}
          {onThemeColorChange && (
            <PalettePopover
              currentColor={themeColor}
              onColorChange={onThemeColorChange}
              lang={lang}
            />
          )}

          {/* Button 2: Language Switcher (中 / EN) */}
          <button
            type="button"
            onClick={onToggleLang}
            className="b0-hide-in-frame flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 active:scale-95 transition-all"
            title={lang === 'zh' ? '切换语言 (Switch to English)' : 'Switch Language (切换中文)'}
          >
            <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
            <span>{lang === 'zh' ? 'EN' : '中'}</span>
          </button>

          {/* Button 3: Dark/Light Mode Switcher */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="b0-hide-in-frame p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 active:scale-95 transition-all"
            title={darkMode ? (lang === 'zh' ? '切换为亮色模式' : 'Light Mode') : (lang === 'zh' ? '切换为暗色模式' : 'Dark Mode')}
          >
            {darkMode ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700" />
            )}
          </button>

          {/* Button 4: Favorites Filter Button */}
          {onToggleShowOnlyFavorites && (
            <button
              type="button"
              onClick={onToggleShowOnlyFavorites}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl border text-xs font-bold active:scale-95 transition-all ${
                showOnlyFavorites
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                  : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
              title={
                showOnlyFavorites
                  ? (lang === 'zh' ? '显示全部图标' : 'Show All')
                  : (lang === 'zh' ? '仅看已收藏图标' : 'Show Favorites Only')
              }
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  showOnlyFavorites || favoritesCount > 0
                    ? 'fill-amber-400 text-amber-500'
                    : 'text-slate-400 dark:text-zinc-500'
                }`}
              />
              <span className="hidden sm:inline">
                {showOnlyFavorites ? (lang === 'zh' ? '已收藏' : 'Saved') : (lang === 'zh' ? '收藏' : 'Stars')}
              </span>
              {favoritesCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-mono font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
