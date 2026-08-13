import React from 'react';
import { X, Palette, Sun, Moon, Laptop, Check } from 'lucide-react';

export type AppThemeMode = 'light' | 'dark' | 'system';
export type AppAccentColor = 'teal' | 'amber' | 'sapphire' | 'emerald';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppThemeMode;
  currentAccent: AppAccentColor;
  onSelectTheme: (theme: AppThemeMode) => void;
  onSelectAccent: (accent: AppAccentColor) => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  currentAccent,
  onSelectTheme,
  onSelectAccent,
}) => {
  if (!isOpen) return null;

  const themes: { mode: AppThemeMode; label: string; description: string; icon: React.ElementType }[] = [
    {
      mode: 'light',
      label: 'Light Canvas (Default)',
      description: 'Clean executive contrast with Navy headers & soft gray canvas',
      icon: Sun,
    },
    {
      mode: 'dark',
      label: 'Dark Slate',
      description: 'Eye-safe midnight atmosphere for low-light research',
      icon: Moon,
    },
    {
      mode: 'system',
      label: 'System Preference',
      description: 'Automatically adjust based on your OS system theme settings',
      icon: Laptop,
    },
  ];

  const accents: { id: AppAccentColor; label: string; colorClass: string; bgClass: string }[] = [
    { id: 'teal', label: 'Scout Teal', colorClass: '#1FA9A0', bgClass: 'bg-[#1FA9A0]' },
    { id: 'amber', label: 'Gold Accent', colorClass: '#F5A623', bgClass: 'bg-[#F5A623]' },
    { id: 'sapphire', label: 'Royal Sapphire', colorClass: '#2563EB', bgClass: 'bg-blue-600' },
    { id: 'emerald', label: 'Emerald Lead', colorClass: '#059669', bgClass: 'bg-emerald-600' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0B1F3A] text-[#1FA9A0] flex items-center justify-center font-bold">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#0B1F3A]">Theme Preferences</h2>
              <p className="text-xs text-slate-500">Applies immediately to your workspace interface</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Options */}
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Appearance Mode
          </label>

          <div className="space-y-2.5">
            {themes.map((t) => {
              const IconComp = t.icon;
              const isSelected = currentTheme === t.mode;
              return (
                <button
                  key={t.mode}
                  type="button"
                  onClick={() => onSelectTheme(t.mode)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/80 border-[#1FA9A0] ring-1 ring-[#1FA9A0] shadow-sm'
                      : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className={`p-2 rounded-xl mt-0.5 ${isSelected ? 'bg-[#0B1F3A] text-[#1FA9A0]' : 'bg-slate-200 text-slate-600'}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-extrabold ${isSelected ? 'text-[#0B1F3A]' : 'text-slate-800'}`}>
                        {t.label}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] bg-[#1FA9A0] text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{t.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Accent Color Picker */}
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Brand Accent Color
            </label>
            <div className="grid grid-cols-2 gap-2">
              {accents.map((acc) => {
                const isSelected = currentAccent === acc.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => onSelectAccent(acc.id)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0B1F3A] bg-slate-100 font-bold shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full ${acc.bgClass} flex-shrink-0 shadow-sm`} />
                    <span className="text-xs text-slate-800 flex-1 text-left truncate">{acc.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#0B1F3A] flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-[#0B1F3A] hover:bg-[#15345d] text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
