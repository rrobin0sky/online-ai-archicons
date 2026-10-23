'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, X } from 'lucide-react';
import { PRESET_THEMES, generateIsometricShades } from '../lib/colorEngine';

interface PalettePopoverProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  lang: 'en' | 'zh';
}

export const PalettePopover: React.FC<PalettePopoverProps> = ({
  currentColor,
  onColorChange,
  lang,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  // Status LEDs / semantic accents permanently enabled as default
  const shades = generateIsometricShades(currentColor, true);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={popoverRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`h-8 px-3 rounded-lg border text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
          isOpen
            ? 'bg-slate-900/[0.10] border-slate-900/25 text-slate-950 dark:bg-white/[0.14] dark:border-white/25 dark:text-white'
            : 'bg-slate-900/[0.04] hover:bg-slate-900/[0.08] border-slate-200/80 text-slate-700 hover:text-slate-950 dark:bg-white/[0.05] dark:hover:bg-white/[0.10] dark:border-white/10 dark:text-zinc-200 dark:hover:text-white'
        }`}
        title={lang === 'zh' ? '全局调色板' : 'Color Palette'}
      >
        <span
          className="w-3 h-3 rounded-full border border-black/20 dark:border-white/25 flex-shrink-0"
          style={{ backgroundColor: currentColor }}
        />
        <span>{lang === 'zh' ? '配色' : 'Color'}</span>
      </button>

      {/* Popover Dropdown Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 text-slate-900 dark:text-white">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold tracking-tight">
                {lang === 'zh' ? '全局设备配色' : 'Equipment Color'}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Color Presets */}
          <div className="mt-2.5">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 block mb-1.5">
              {lang === 'zh' ? '推荐场景预设' : 'Presets'}
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {PRESET_THEMES.map((preset) => {
                const isSelected = currentColor.toLowerCase() === preset.color.toLowerCase();
                return (
                  <button
                    key={preset.id}
                    onClick={() => onColorChange(preset.color)}
                    className={`flex items-center gap-1.5 p-1.5 rounded-xl border text-[11px] font-medium transition-all active:scale-95 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                        : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/60'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/10 shadow-xs flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: preset.color }}
                    >
                      {isSelected && <Check className="w-2 h-2 text-white" />}
                    </span>
                    <span className="truncate">{preset.name[lang]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Hex Color & Shading Preview */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500">
                Hex:
              </span>
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-zinc-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-zinc-700">
                <input
                  ref={colorInputRef}
                  type="color"
                  value={currentColor}
                  onChange={(e) => onColorChange(e.target.value)}
                  className="w-4 h-4 rounded cursor-pointer border-0 p-0 bg-transparent"
                />
                <span className="font-mono text-xs font-bold uppercase">{currentColor}</span>
              </div>
            </div>

            {/* Shading micro preview */}
            <div className="flex items-center gap-1" title="Top / Left / Right 3D Shading">
              <span className="w-2.5 h-2.5 rounded-xs border border-black/10" style={{ backgroundColor: shades.topLight }} />
              <span className="w-2.5 h-2.5 rounded-xs border border-black/10" style={{ backgroundColor: shades.leftFace }} />
              <span className="w-2.5 h-2.5 rounded-xs border border-black/10" style={{ backgroundColor: shades.rightFace }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
