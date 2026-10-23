'use client';

import React, { useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
import { CloudProvider, IconCategory, IconStyle } from '../types/icon';
import { ICONS, PROVIDERS, CATEGORIES, STYLES } from '../data/icons';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStyle: IconStyle | 'all';
  onStyleChange: (style: IconStyle | 'all') => void;
  selectedProvider: CloudProvider | 'all';
  onProviderChange: (provider: CloudProvider | 'all') => void;
  selectedCategory: IconCategory | 'all';
  onCategoryChange: (category: IconCategory | 'all') => void;
  showOnlyFavorites?: boolean;
  onResetAll: () => void;
  lang: 'en' | 'zh';
  totalCount: number;
  filteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedStyle,
  onStyleChange,
  selectedProvider,
  onProviderChange,
  selectedCategory,
  onCategoryChange,
  showOnlyFavorites = false,
  onResetAll,
  lang,
  totalCount,
  filteredCount,
}) => {
  // Available providers based on active style
  const availableProviders = useMemo(() => {
    if (selectedStyle === 'all') return PROVIDERS;
    return PROVIDERS.filter(
      (p) => !p.supportedStyles || p.supportedStyles.includes(selectedStyle)
    );
  }, [selectedStyle]);

  // Style counts
  const styleCounts = useMemo(() => {
    const counts: Record<string, number> = { all: ICONS.length };
    STYLES.forEach((s) => {
      counts[s.id] = ICONS.filter((i) => (i.style || 'isometric') === s.id).length;
    });
    return counts;
  }, []);

  // Category counts (scoped by selectedStyle & selectedProvider)
  const categoryCounts = useMemo(() => {
    const base = ICONS.filter((i) => {
      if (selectedStyle !== 'all' && (i.style || 'isometric') !== selectedStyle) {
        return false;
      }
      if (selectedProvider !== 'all' && i.provider !== selectedProvider) {
        return false;
      }
      return true;
    });
    const counts: Record<string, number> = { all: base.length };
    CATEGORIES.forEach((c) => {
      counts[c.id] = base.filter((i) => i.category === c.id).length;
    });
    return counts;
  }, [selectedStyle, selectedProvider]);

  // Provider counts (scoped by selectedStyle & selectedCategory)
  const providerCounts = useMemo(() => {
    const base = ICONS.filter((i) => {
      if (selectedStyle !== 'all' && (i.style || 'isometric') !== selectedStyle) {
        return false;
      }
      if (selectedCategory !== 'all' && i.category !== selectedCategory) {
        return false;
      }
      return true;
    });
    const counts: Record<string, number> = { all: base.length };
    PROVIDERS.forEach((p) => {
      counts[p.id] = base.filter((i) => i.provider === p.id).length;
    });
    return counts;
  }, [selectedStyle, selectedCategory]);

  const pillClass = (active: boolean) =>
    `h-7 px-2.5 rounded-md text-xs font-medium inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap border ${
      active
        ? 'bg-slate-900/[0.09] border-slate-900/25 text-slate-950 dark:bg-white/[0.12] dark:border-white/25 dark:text-white font-semibold'
        : 'bg-slate-900/[0.02] border-slate-900/[0.06] text-slate-500 hover:text-slate-800 hover:bg-slate-900/[0.05] dark:bg-white/[0.03] dark:border-white/[0.06] dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-white/[0.07]'
    }`;

  const hasActiveFilter =
    Boolean(searchQuery.trim()) ||
    selectedStyle !== 'all' ||
    selectedProvider !== 'all' ||
    selectedCategory !== 'all' ||
    showOnlyFavorites;

  const handleStyleSelect = (style: IconStyle | 'all') => {
    onStyleChange(style);
    if (style !== 'all' && selectedProvider !== 'all') {
      const prov = PROVIDERS.find((p) => p.id === selectedProvider);
      if (prov?.supportedStyles && !prov.supportedStyles.includes(style)) {
        onProviderChange('all');
      }
    }
  };

  return (
    <section className="w-full space-y-2.5">
      {/* Mobile Search Input (matches NetBOM) */}
      <div className="block md:hidden">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={
            lang === 'zh'
              ? '搜索设备、厂商、协议...'
              : 'Search equipment, vendor...'
          }
          className="w-full h-8 glass-input rounded-lg px-3 text-xs"
        />
      </div>

      {/* Horizontal Top Filter Bar (matches NetBOM FilterSidebar) */}
      <div className="glass-panel rounded-xl px-3.5 py-2.5 space-y-2">
        {/* Row 1: Style Mode + Functional Category */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-3">
          {/* Style Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 dark:text-zinc-500 mr-0.5 font-medium">
              {lang === 'zh' ? '风格' : 'Style'}
            </span>
            <button
              type="button"
              onClick={() => handleStyleSelect('all')}
              className={pillClass(selectedStyle === 'all')}
            >
              <span>{lang === 'zh' ? '全部' : 'All'}</span>
              <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                {styleCounts.all}
              </span>
            </button>
            {STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleStyleSelect(s.id)}
                className={pillClass(selectedStyle === s.id)}
                title={s.description[lang]}
              >
                <span>{s.name[lang]}</span>
                <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                  {styleCounts[s.id]}
                </span>
              </button>
            ))}
          </div>

          <div className="hidden xl:block h-4 w-[1px] bg-slate-200 dark:bg-white/10" />

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 dark:text-zinc-500 mr-0.5 font-medium">
              {lang === 'zh' ? '分类' : 'Category'}
            </span>
            <button
              type="button"
              onClick={() => onCategoryChange('all')}
              className={pillClass(selectedCategory === 'all')}
            >
              <span>{lang === 'zh' ? '全部' : 'All'}</span>
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onCategoryChange(c.id)}
                className={pillClass(selectedCategory === c.id)}
              >
                <span>{c.name[lang]}</span>
                <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                  {categoryCounts[c.id]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Vendor / Ecosystem Pills + Right Counter & Reset */}
        <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 dark:text-zinc-500 mr-0.5 font-medium">
              {lang === 'zh' ? '厂商' : 'Vendor'}
            </span>
            <button
              type="button"
              onClick={() => onProviderChange('all')}
              className={pillClass(selectedProvider === 'all')}
            >
              <span>{lang === 'zh' ? '全部' : 'All'}</span>
            </button>
            {availableProviders.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onProviderChange(p.id)}
                className={pillClass(selectedProvider === p.id)}
              >
                <span>{p.name[lang]}</span>
                <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                  {providerCounts[p.id]}
                </span>
              </button>
            ))}
          </div>

          {/* Right Status & Reset */}
          <div className="flex items-center gap-2.5 text-xs ml-auto">
            <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">
              {lang === 'zh'
                ? `${filteredCount} / ${totalCount} 款`
                : `${filteredCount} / ${totalCount}`}
            </span>

            {hasActiveFilter && (
              <button
                type="button"
                onClick={onResetAll}
                className={pillClass(false)}
                title={lang === 'zh' ? '重置所有筛选条件' : 'Reset all filters'}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{lang === 'zh' ? '重置' : 'Reset'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
