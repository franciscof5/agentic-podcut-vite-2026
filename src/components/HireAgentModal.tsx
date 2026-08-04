import React, { useState } from 'react';
import { X, Bot, Youtube, Zap, History, DollarSign, Calendar, CheckCircle2, ArrowRight, Sparkles, Plus } from 'lucide-react';
import { YouTubeChannel, SkillId } from '../types';
import { SKILLS_LIST } from '../data/initialData';
import { calculateProratedPayment, formatDateEN } from '../utils/billing';

interface HireAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  channels: YouTubeChannel[];
  onHire: (data: { name: string; channelId: string; skillId: SkillId }) => void;
  onOpenAddChannel: () => void;
}

export const HireAgentModal: React.FC<HireAgentModalProps> = ({
  isOpen,
  onClose,
  channels,
  onHire,
  onOpenAddChannel,
}) => {
  const [selectedChannelId, setSelectedChannelId] = useState<string>(channels[0]?.id || '');
  const [selectedSkillId, setSelectedSkillId] = useState<SkillId>('new_episodes');
  const [customAgentName, setCustomAgentName] = useState<string>('');

  if (!isOpen) return null;

  const prorate = calculateProratedPayment(new Date(), 19.0);
  const selectedChannel = channels.find((c) => c.id === selectedChannelId) || channels[0];
  const selectedSkill = SKILLS_LIST.find((s) => s.id === selectedSkillId) || SKILLS_LIST[0];

  const defaultName = customAgentName || (selectedChannel ? `Editor Agent - ${selectedChannel.name}` : 'New Editor Agent');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChannelId) return;

    onHire({
      name: defaultName,
      channelId: selectedChannelId,
      skillId: selectedSkillId,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">Hire AI Video Editor Agent</h3>
              <p className="text-xs text-slate-400">Cost: $19.00/mo • Billing on the 5th of every month</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Step 1: Link YouTube Channel */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Youtube className="w-4 h-4 text-rose-500" />
                <span>1. Select Linked YouTube Channel</span>
              </label>

              <button
                type="button"
                onClick={onOpenAddChannel}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register New Channel</span>
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {channels.map((ch) => {
                const isSelected = ch.id === selectedChannelId;
                return (
                  <div
                    key={ch.id}
                    onClick={() => setSelectedChannelId(ch.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={ch.avatarUrl}
                      alt={ch.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-white truncate">{ch.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{ch.handle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Choose Skill (2 Skills) */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>2. Choose Agent Skill</span>
            </label>

            <div className="grid sm:grid-cols-2 gap-4">
              {SKILLS_LIST.map((skill) => {
                const isSelected = skill.id === selectedSkillId;
                return (
                  <div
                    key={skill.id}
                    onClick={() => setSelectedSkillId(skill.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${
                      isSelected
                        ? 'bg-slate-950 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${skill.badgeColor}`}>
                        Skill #{skill.number}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>

                    <h4 className="font-bold text-sm text-white mb-1 flex items-center gap-2">
                      {skill.id === 'new_episodes' ? <Zap className="w-4 h-4 text-emerald-400" /> : <History className="w-4 h-4 text-indigo-400" />}
                      <span>{skill.name}</span>
                    </h4>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {skill.shortDescription}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Agent Name */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
              3. Custom Agent Name (Optional)
            </label>
            <input
              type="text"
              placeholder={`E.g.: Editor Agent - ${selectedChannel?.name || 'Channel'}`}
              value={customAgentName}
              onChange={(e) => setCustomAgentName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Step 4: Transparent Prorated Payment Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Financial Summary & Renewal Date (Every 5th)
              </span>
              <span className="text-[11px] font-semibold text-emerald-400">
                Prorated Billing Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-slate-400">Full Monthly Price:</div>
              <div className="font-bold text-right text-white">$19.00 USD / month</div>

              <div className="text-slate-400">Next Invoice Date:</div>
              <div className="font-bold text-right text-emerald-400">
                {formatDateEN(prorate.nextBillingDate)} (The 5th)
              </div>

              <div className="text-slate-400">Days Remaining until 5th:</div>
              <div className="font-bold text-right text-white">{prorate.daysRemaining} days</div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-white block">Initial Prorated Fee Today:</span>
                <span className="text-[10px] text-slate-400">One-time payment until upcoming 5th</span>
              </div>
              <span className="text-2xl font-black text-emerald-400">${prorate.proratedPrice.toFixed(2)} USD</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl font-extrabold text-xs bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 shadow-xl shadow-emerald-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 transform active:scale-95"
          >
            <Bot className="w-4 h-4" />
            <span>Confirm & Hire Agent (${prorate.proratedPrice.toFixed(2)} Today)</span>
          </button>
        </form>
      </div>
    </div>
  );
};
