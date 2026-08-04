import React, { useState } from 'react';
import { Bot, Youtube, Zap, History, Calendar, DollarSign, Plus, Play, Power, ChevronDown, ChevronUp, Video, Sparkles } from 'lucide-react';
import { Agent, YouTubeChannel, SkillId, GeneratedCut } from '../types';
import { SKILLS_LIST, INITIAL_CUTS } from '../data/initialData';
import { formatDateEN, calculateProratedPayment } from '../utils/billing';

interface DashboardProps {
  agents: Agent[];
  channels: YouTubeChannel[];
  onToggleAgentStatus: (agentId: string) => void;
  onChangeSkill: (agentId: string, newSkillId: SkillId) => void;
  onOpenHireModal: () => void;
  onOpenAddChannelModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  agents,
  channels,
  onToggleAgentStatus,
  onChangeSkill,
  onOpenHireModal,
  onOpenAddChannelModal,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'deactivated'>('all');
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);
  const [selectedAgentCuts, setSelectedAgentCuts] = useState<GeneratedCut[] | null>(null);
  const [selectedAgentForCuts, setSelectedAgentForCuts] = useState<Agent | null>(null);

  const activeAgents = agents.filter((a) => a.active);
  const deactivatedAgents = agents.filter((a) => !a.active);

  const filteredAgents = agents.filter((a) => {
    if (filter === 'active') return a.active;
    if (filter === 'deactivated') return !a.active;
    return true;
  });

  const nextBilling = calculateProratedPayment(new Date(), 19.0).nextBillingDate;
  const formattedNextBilling = formatDateEN(nextBilling);

  const totalMonthlyInvestment = activeAgents.length * 19.0;

  const toggleExpand = (agentId: string) => {
    setExpandedAgentId((prev) => (prev === agentId ? null : agentId));
  };

  const handleOpenCuts = (agent: Agent, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedAgentForCuts(agent);
    const cuts = INITIAL_CUTS.filter((c) => c.agentId === agent.id || c.channelName === agent.channelName);
    setSelectedAgentCuts(cuts.length > 0 ? cuts : INITIAL_CUTS);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Overview Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Active Agents (Green Light) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 block mb-1">Active Agents (Green Light 🟢)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{activeAgents.length}</span>
              <span className="text-xs text-emerald-400 font-bold">Normal Operation</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
        </div>

        {/* Stat 2: Deactivated Agents (Red Light) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 block mb-1">Deactivated (Red Light 🔴)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{deactivatedAgents.length}</span>
              <span className="text-xs text-rose-400 font-bold">Runs until 5th</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </div>
        </div>

        {/* Stat 3: Next Billing Date */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 block mb-1">Next Monthly Billing Date</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-emerald-400">{formattedNextBilling}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <Calendar className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        {/* Stat 4: Monthly Cost */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 block mb-1">Total Monthly Investment</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">${totalMonthlyInvestment.toFixed(2)}</span>
              <span className="text-xs text-slate-400">/mo</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Agents Management Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Section Header with Actions */}
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-400" />
              <span>Editor Agent Management</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Compact single-line rows. Click on any agent row to expand details and options.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({agents.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  filter === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Active ({activeAgents.length})</span>
              </button>
              <button
                onClick={() => setFilter('deactivated')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  filter === 'deactivated' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Deactivated ({deactivatedAgents.length})</span>
              </button>
            </div>

            <button
              onClick={onOpenHireModal}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Agent ($19/mo)</span>
            </button>
          </div>
        </div>

        {/* Agents List - Compact Single Line Rows */}
        <div className="divide-y divide-slate-800/80">
          {filteredAgents.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Bot className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-base font-bold text-slate-300">No agents found for this filter.</p>
              <button
                onClick={onOpenHireModal}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950"
              >
                Hire New Editor Agent
              </button>
            </div>
          ) : (
            filteredAgents.map((agent) => {
              const currentSkill = SKILLS_LIST.find((s) => s.id === agent.skillId) || SKILLS_LIST[0];
              const isExpanded = expandedAgentId === agent.id;

              return (
                <div key={agent.id} className="transition-all">
                  {/* Single Enxuta Line Row */}
                  <div
                    onClick={() => toggleExpand(agent.id)}
                    className={`px-5 py-3.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/50 transition-colors select-none ${
                      isExpanded ? 'bg-slate-800/40 border-l-4 border-l-emerald-500' : ''
                    }`}
                  >
                    {/* Status Light & Agent Name + ID */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="shrink-0" title={agent.active ? 'Active - Green Light 🟢' : 'Deactivated - Red Light 🔴'}>
                        {agent.active ? (
                          <span className="relative flex h-3.5 w-3.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 shadow-sm shadow-emerald-500"></span>
                          </span>
                        ) : (
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 shadow-sm shadow-rose-500"></span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-2 truncate">
                        <span className="font-bold text-sm text-white truncate">{agent.name}</span>
                        <span className="text-[11px] font-mono text-slate-500 shrink-0">({agent.id})</span>
                      </div>
                    </div>

                    {/* Channel badge */}
                    <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 shrink-0 text-xs">
                      <img src={agent.channelAvatarUrl} alt={agent.channelName} className="w-4 h-4 rounded-full object-cover" />
                      <span className="font-semibold text-slate-300 max-w-[140px] truncate">{agent.channelName}</span>
                    </div>

                    {/* Skill Badge */}
                    <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 shrink-0 text-xs text-slate-300 font-medium">
                      {currentSkill.id === 'new_episodes' ? <Zap className="w-3.5 h-3.5 text-emerald-400" /> : <History className="w-3.5 h-3.5 text-indigo-400" />}
                      <span>{currentSkill.name}</span>
                    </div>

                    {/* Active Status Badge */}
                    <div className="shrink-0 text-right">
                      {agent.active ? (
                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                          Active 🟢 ($19/mo)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20">
                          Deactivated 🔴 (Operates until 5th)
                        </span>
                      )}
                    </div>

                    {/* Expand Arrow Chevron */}
                    <div className="shrink-0 text-slate-400 hover:text-white">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Expanded Accordion Details Panel */}
                  {isExpanded && (
                    <div className="px-6 py-5 bg-slate-950/80 border-t border-b border-slate-800/80 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Detail 1: YouTube Channel Link */}
                        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800/80">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                            Linked YouTube Channel
                          </span>
                          <div className="flex items-center gap-3">
                            <img src={agent.channelAvatarUrl} alt={agent.channelName} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                            <div>
                              <h4 className="font-bold text-white text-sm">{agent.channelName}</h4>
                              <p className="text-xs text-slate-400">{agent.channelHandle}</p>
                            </div>
                          </div>
                        </div>

                        {/* Detail 2: Skill Selector & Description */}
                        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800/80">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                            Agent Skill
                          </span>
                          <div className="space-y-2">
                            <select
                              value={agent.skillId}
                              onChange={(e) => onChangeSkill(agent.id, e.target.value as SkillId)}
                              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
                            >
                              <option value="new_episodes">Skill 1: New Episodes</option>
                              <option value="revive_old_episodes">Skill 2: Revive Backlog</option>
                            </select>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              {currentSkill.shortDescription}
                            </p>
                          </div>
                        </div>

                        {/* Detail 3: Billing & Operational Timeline */}
                        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Contract & Renewal Status (The 5th)
                          </span>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Hired on:</span>
                            <span className="font-bold text-white">{formatDateEN(agent.hiredAt)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Guaranteed operational until:</span>
                            <span className="font-bold text-emerald-400">{formatDateEN(agent.operatingUntil)} (The 5th)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Monthly Price:</span>
                            <span className="font-bold text-white">$19.00 USD / month</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Bar inside Expanded Row */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/60">
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span>Generated cuts: <strong className="text-white">{agent.cutsGeneratedCount} videos</strong></span>
                          <span>•</span>
                          <span>Recent activity: <span className="text-emerald-400 font-medium">{agent.lastActive}</span></span>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => handleOpenCuts(agent, e)}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-2"
                          >
                            <Video className="w-4 h-4 text-emerald-400" />
                            <span>View Generated Clips</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleAgentStatus(agent.id);
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all flex items-center gap-2 ${
                              agent.active
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            }`}
                          >
                            <Power className="w-4 h-4" />
                            <span>{agent.active ? 'Deactivate Agent (Red Light)' : 'Reactivate Agent (Green Light)'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Generated Cuts Modal / Drawer */}
      {selectedAgentCuts && selectedAgentForCuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-emerald-400" />
                  <span>Clips Generated by {selectedAgentForCuts.name}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Channel: <strong className="text-white">{selectedAgentForCuts.channelName}</strong>
                </p>
              </div>

              <button
                onClick={() => setSelectedAgentCuts(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {selectedAgentCuts.map((cut) => (
                <div key={cut.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={cut.thumbnailUrl}
                    alt={cut.title}
                    className="w-full sm:w-32 h-20 rounded-xl object-cover border border-slate-800 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm line-clamp-1">{cut.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{cut.originalEpisode}</p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-medium">
                      <span className="text-emerald-400 font-bold">{cut.viewsEstimated} views</span>
                      <span>•</span>
                      <span>Duration: {cut.durationSeconds}s</span>
                      <span>•</span>
                      <span>Published: {cut.createdAt}</span>
                    </div>
                  </div>

                  <a
                    href={cut.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch on YouTube</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
