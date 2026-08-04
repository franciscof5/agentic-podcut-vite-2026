import React, { useState } from 'react';
import { X, Youtube, Plus } from 'lucide-react';

interface AddChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChannel: (data: { name: string; handle: string }) => void;
}

export const AddChannelModal: React.FC<AddChannelModalProps> = ({
  isOpen,
  onClose,
  onAddChannel,
}) => {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !handle) return;

    onAddChannel({ name, handle });
    setName('');
    setHandle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Link New YouTube Channel</h3>
              <p className="text-xs text-slate-400">Enter your channel name and handle</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
              Channel Name
            </label>
            <input
              type="text"
              required
              placeholder="E.g.: Podcast Masterclass"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
              Channel Handle (@handle)
            </label>
            <input
              type="text"
              required
              placeholder="E.g.: @podcastmaster"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Link YouTube Channel</span>
          </button>
        </form>
      </div>
    </div>
  );
};
