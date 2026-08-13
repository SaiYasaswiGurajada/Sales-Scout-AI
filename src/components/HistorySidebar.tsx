import React, { useState } from 'react';
import {
  X,
  Search,
  Bookmark,
  Trash2,
  Building2,
  User,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { BriefingData } from '../types';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  briefings: BriefingData[];
  activeBriefingId?: string;
  onSelectBriefing: (briefing: BriefingData) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteBriefing: (id: string) => void;
  onStartNewSearch: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  briefings,
  activeBriefingId,
  onSelectBriefing,
  onToggleFavorite,
  onDeleteBriefing,
  onStartNewSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  if (!isOpen) return null;

  const filteredBriefings = briefings.filter((b) => {
    const matchesSearch =
      b.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.stakeholderName && b.stakeholderName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.stakeholderTitle && b.stakeholderTitle.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFav = onlyFavorites ? b.isFavorite : true;

    return matchesSearch && matchesFav;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0B1F3A]/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-5 bg-[#0B1F3A] text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#1FA9A0]/20 text-[#1FA9A0]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-lg">Briefing History</h2>
                <p className="text-xs text-slate-400">Past research & saved prospects</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search history by company or name..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1FA9A0]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                  onlyFavorites
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-600' : ''}`} />
                <span>Favorites Only ({briefings.filter((b) => b.isFavorite).length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onStartNewSearch();
                  onClose();
                }}
                className="text-[#1FA9A0] font-bold hover:underline"
              >
                + New Briefing
              </button>
            </div>
          </div>

          {/* Briefings List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredBriefings.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-700">No briefings found</p>
                <p className="text-xs text-slate-400 mt-1">
                  {searchTerm || onlyFavorites
                    ? 'Try clearing your search or favorite filters.'
                    : 'Generate your first briefing to see it listed here.'}
                </p>
              </div>
            ) : (
              filteredBriefings.map((briefing) => {
                const isActive = briefing.id === activeBriefingId;

                return (
                  <div
                    key={briefing.id}
                    className={`p-4 rounded-xl border transition-all relative group flex flex-col justify-between ${
                      isActive
                        ? 'bg-[#1FA9A0]/10 border-[#1FA9A0] ring-1 ring-[#1FA9A0]'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div
                      onClick={() => {
                        onSelectBriefing(briefing);
                        onClose();
                      }}
                      className="cursor-pointer pr-16"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-extrabold text-sm text-[#0B1F3A] group-hover:text-[#1FA9A0] transition-colors">
                          {briefing.companyName}
                        </span>
                      </div>

                      {briefing.stakeholderName && (
                        <p className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          {briefing.stakeholderName}
                          {briefing.stakeholderTitle && (
                            <span className="text-slate-400 font-normal">
                              • {briefing.stakeholderTitle}
                            </span>
                          )}
                        </p>
                      )}

                      <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(briefing.createdAt).toLocaleDateString()} at{' '}
                        {new Date(briefing.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    {/* Card Actions */}
                    <div className="absolute top-4 right-3 flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(briefing.id);
                        }}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          briefing.isFavorite
                            ? 'bg-amber-100 text-amber-600 border-amber-300'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-400 border-slate-200'
                        }`}
                        title="Favorite"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${briefing.isFavorite ? 'fill-amber-500' : ''}`} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete briefing for ${briefing.companyName}?`)) {
                            onDeleteBriefing(briefing.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 border border-slate-200 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Saved locally in browser • {briefings.length} Total Briefing{briefings.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
