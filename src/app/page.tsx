'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { IconCard } from '../components/IconCard';
import { IconModal } from '../components/IconModal';
import { FilterBar } from '../components/FilterBar';
import { BatchExportModal } from '../components/BatchExportModal';
import { FloatingHudToast, HudToastState } from '../components/FloatingHudToast';
import { AdSenseSlot } from '../components/AdSenseSlot';
import { ICONS, PROVIDERS } from '../data/icons';
import { IconMeta, IconCategory, IconStyle, CloudProvider } from '../types/icon';
import { Layers, BookOpen, CheckCircle2, Sparkles, FileCode2, Star } from 'lucide-react';
import { downloadDrawioLibrary } from '../lib/drawio';

export default function HomePage() {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<IconStyle | 'all'>('all');
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<IconCategory | 'all'>('all');
  const [themeColor, setThemeColor] = useState<string>('#0284c7');
  const [activeModalIcon, setActiveModalIcon] = useState<IconMeta | null>(null);
  const [hudToast, setHudToast] = useState<HudToastState | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState<boolean>(false);

  // Favorites state with localStorage persistence
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  // Load theme, lang & favorites on mount with BinOS universal synchronization
  useEffect(() => {
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

      try {
        const saved = localStorage.getItem('archicons_favorites');
        if (saved) {
          setFavorites(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Failed to load favorites from localStorage', err);
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

  const handleToggleFavorite = (iconId: string) => {
    setFavorites((prev) => {
      let updated: string[];
      const isAdding = !prev.includes(iconId);
      if (isAdding) {
        updated = [...prev, iconId];
        handleNotify(
          lang === 'zh' ? '★ 已加入收藏' : '★ Added to Favorites',
          undefined,
          'success'
        );
      } else {
        updated = prev.filter((id) => id !== iconId);
        handleNotify(
          lang === 'zh' ? '☆ 已取消收藏' : '☆ Removed from Favorites',
          undefined,
          'copy'
        );
      }
      try {
        localStorage.setItem('archicons_favorites', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save favorites', e);
      }
      return updated;
    });
  };

  const handleNotify = (
    title: string,
    subtitle?: string,
    type: 'copy' | 'download' | 'code' | 'success' = 'copy'
  ) => {
    setHudToast({ show: true, title, subtitle, type });
    setTimeout(() => {
      setHudToast((prev) => (prev?.title === title ? null : prev));
    }, 2000);
  };

  // Draw.io export handler
  const handleExportDrawio = () => {
    try {
      downloadDrawioLibrary(ICONS, 'ArchIcons-Library.xml', {
        themeColor,
        lang,
      });
      handleNotify(
        lang === 'zh' ? '✓ Draw.io 库已导出' : '✓ Draw.io Stencil Exported',
        lang === 'zh' ? '拖入 draw.io 即可使用' : 'Drag into Draw.io to use',
        'download'
      );
    } catch (e) {
      console.error(e);
    }
  };

  // Filter & search logic
  const filteredIcons = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return ICONS.filter((icon) => {
      // 1. Favorite filter
      if (showOnlyFavorites && !favorites.includes(icon.id)) {
        return false;
      }

      // 2. Style filter
      if (selectedStyle !== 'all') {
        const itemStyle = icon.style || 'isometric';
        if (itemStyle !== selectedStyle) return false;
      }

      // 3. Provider/Vendor filter
      if (selectedProvider !== 'all') {
        if (icon.provider !== selectedProvider) return false;
      }

      // 4. Category filter
      if (selectedCategory !== 'all' && icon.category !== selectedCategory) {
        return false;
      }

      // 5. Search query filter
      if (!query) return true;

      const nameEn = icon.name.en.toLowerCase();
      const nameZh = icon.name.zh.toLowerCase();
      if (nameEn.includes(query) || nameZh.includes(query)) return true;

      if (icon.code && icon.code.toLowerCase().includes(query)) return true;

      const hasMatchingTag = icon.tags.some((tag) => tag.toLowerCase().includes(query));
      if (hasMatchingTag) return true;

      const providerObj = PROVIDERS.find((p) => p.id === icon.provider);
      if (providerObj) {
        if (
          providerObj.name.zh.toLowerCase().includes(query) ||
          providerObj.name.en.toLowerCase().includes(query)
        ) {
          return true;
        }
      }

      if (icon.id.toLowerCase().includes(query)) return true;

      return false;
    });
  }, [searchQuery, selectedStyle, selectedProvider, selectedCategory, showOnlyFavorites, favorites]);

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-[#09090b] min-h-screen text-slate-900 dark:text-white transition-colors">
      {/* Floating Apple HUD Toast Notification */}
      <FloatingHudToast toast={hudToast} />

      {/* Top Sticky Header with integrated Style Mode Pills & utility buttons */}
      <Header
        lang={lang}
        onToggleLang={toggleLang}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        themeColor={themeColor}
        onThemeColorChange={setThemeColor}
        favoritesCount={favorites.length}
        showOnlyFavorites={showOnlyFavorites}
        onToggleShowOnlyFavorites={() => setShowOnlyFavorites((prev) => !prev)}
        selectedStyle={selectedStyle}
        onStyleChange={setSelectedStyle}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-16">
        {/* Compact Single-Row Unified Toolbar */}
        <div className="mb-3 sm:mb-4">
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStyle={selectedStyle}
            selectedProvider={selectedProvider}
            onProviderChange={setSelectedProvider}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            lang={lang}
            totalCount={ICONS.length}
            filteredCount={filteredIcons.length}
            onOpenBatchExport={() => setIsBatchModalOpen(true)}
            onExportDrawio={handleExportDrawio}
          />
        </div>

        {/* Reset filter button if filtered */}
        {(searchQuery || selectedStyle !== 'all' || selectedProvider !== 'all' || selectedCategory !== 'all' || showOnlyFavorites) && (
          <div className="flex items-center justify-between py-1 mb-3 text-xs text-slate-500 dark:text-zinc-400">
            <span>
              {showOnlyFavorites
                ? (lang === 'zh' ? `★ 正在展示 ${filteredIcons.length} 款已收藏设备` : `★ Showing ${filteredIcons.length} Favorites`)
                : (lang === 'zh' ? `当前筛选结果：${filteredIcons.length} 款设备` : `Filtered: ${filteredIcons.length} icons`)}
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStyle('all');
                setSelectedProvider('all');
                setSelectedCategory('all');
                setShowOnlyFavorites(false);
              }}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              {lang === 'zh' ? '重置所有筛选' : 'Clear all filters'}
            </button>
          </div>
        )}

        {/* Google AdSense / Sponsor Slot */}
        <AdSenseSlot lang={lang} />

        {/* Icons Grid */}
        {filteredIcons.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 mt-4">
            {filteredIcons.map((icon) => (
              <IconCard
                key={icon.id}
                icon={icon}
                lang={lang}
                themeColor={themeColor}
                preserveAccents={true}
                isFavorite={favorites.includes(icon.id)}
                onToggleFavorite={handleToggleFavorite}
                onSelect={(selected) => setActiveModalIcon(selected)}
                onSwitchIcon={(newIcon) => setActiveModalIcon(newIcon)}
                onNotify={handleNotify}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30">
            {showOnlyFavorites ? (
              <>
                <Star className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                  {lang === 'zh' ? '暂无收藏的图标' : 'No favorites saved yet'}
                </h3>
                <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1 max-w-sm mx-auto">
                  {lang === 'zh'
                    ? '点击任意图标卡片右上角的星标（☆），即可收藏常用画图设备。'
                    : 'Click the star icon (☆) on any card to save frequently used equipment.'}
                </p>
                <button
                  onClick={() => setShowOnlyFavorites(false)}
                  className="mt-4 px-4 py-2 text-xs font-bold rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95 transition-all"
                >
                  {lang === 'zh' ? '查看全部图标' : 'Browse all icons'}
                </button>
              </>
            ) : (
              <>
                <Layers className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                  {lang === 'zh' ? '未找到匹配的设备图标' : 'No matching devices found'}
                </h3>
                <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1 max-w-sm mx-auto">
                  {lang === 'zh'
                    ? '尝试调整风格模式，或搜索核心交换机、Cisco、华为、VPC 等关键词。'
                    : 'Try changing style mode, or searching for Cisco, Huawei, Switch, VPC, etc.'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStyle('all');
                    setSelectedProvider('all');
                    setSelectedCategory('all');
                  }}
                  className="mt-4 px-4 py-2 text-xs font-bold rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95 transition-all"
                >
                  {lang === 'zh' ? '重置所有筛选' : 'Reset all filters'}
                </button>
              </>
            )}
          </div>
        )}

      </main>

      {/* Detail Modal */}
      <IconModal
        icon={activeModalIcon}
        lang={lang}
        themeColor={themeColor}
        preserveAccents={true}
        onClose={() => setActiveModalIcon(null)}
        onSelectIcon={(newIcon) => setActiveModalIcon(newIcon)}
        onNotify={handleNotify}
      />

      {/* Batch Export Modal */}
      <BatchExportModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        lang={lang}
        allIcons={ICONS}
        filteredIcons={filteredIcons}
        currentColor={themeColor}
        onNotify={handleNotify}
      />

      {/* Footer */}
      <Footer lang={lang} />
    </div>
  );
}
