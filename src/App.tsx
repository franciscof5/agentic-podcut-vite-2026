import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { FastAPICodeViewer } from './components/FastAPICodeViewer';
import { HireAgentModal } from './components/HireAgentModal';
import { AddChannelModal } from './components/AddChannelModal';
import { Agent, YouTubeChannel, SkillId } from './types';
import { INITIAL_AGENTS, INITIAL_CHANNELS } from './data/initialData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'landing' | 'dashboard' | 'code'>('dashboard');
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [channels, setChannels] = useState<YouTubeChannel[]>(INITIAL_CHANNELS);

  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [isAddChannelModalOpen, setIsAddChannelModalOpen] = useState(false);

  // Fetch state from server API if available
  useEffect(() => {
    fetch('/api/agents')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data)) setAgents(data);
      })
      .catch(() => {
        // Fallback to client state
      });

    fetch('/api/channels')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data)) setChannels(data);
      })
      .catch(() => {
        // Fallback to client state
      });
  }, []);

  // Handle Hire Agent
  const handleHireAgent = async ({
    name,
    channelId,
    skillId,
  }: {
    name: string;
    channelId: string;
    skillId: SkillId;
  }) => {
    try {
      const res = await fetch('/api/agents/hire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, channelId, skillId }),
      });

      if (res.ok) {
        const { agent } = await res.json();
        setAgents((prev) => [agent, ...prev]);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      // Local fallback creation
      const channel = channels.find((c) => c.id === channelId) || channels[0];
      const today = new Date();
      const nextBilling = new Date(today.getFullYear(), today.getMonth() + 1, 5).toISOString();

      const newAgent: Agent = {
        id: `agt_${Date.now().toString().slice(-4)}`,
        name: name || `Editor - ${channel.name}`,
        channelId: channel.id,
        channelName: channel.name,
        channelHandle: channel.handle,
        channelAvatarUrl: channel.avatarUrl,
        skillId,
        active: true, // 🟢 Luz verde
        hiredAt: today.toISOString(),
        operatingUntil: nextBilling,
        nextBillingDate: nextBilling,
        monthlyCost: 19.0,
        initialProratedPaid: 12.5,
        cutsGeneratedCount: 0,
        lastActive: 'Operation started just now',
      };
      setAgents((prev) => [newAgent, ...prev]);
    }
  };

  // Handle Toggle Agent Status (Green Light 🟢 vs Red Light 🔴)
  const handleToggleAgentStatus = async (agentId: string) => {
    try {
      const res = await fetch(`/api/agents/${agentId}/toggle`, {
        method: 'POST',
      });

      if (res.ok) {
        const { agent } = await res.json();
        setAgents((prev) => prev.map((a) => (a.id === agentId ? agent : a)));
      } else {
        throw new Error('API failed');
      }
    } catch {
      // Local state fallback
      setAgents((prev) =>
        prev.map((a) => {
          if (a.id === agentId) {
            return {
              ...a,
              active: !a.active, // Toggle active state (Green Light <-> Red Light)
            };
          }
          return a;
        })
      );
    }
  };

  // Handle Change Skill
  const handleChangeSkill = async (agentId: string, newSkillId: SkillId) => {
    try {
      const res = await fetch(`/api/agents/${agentId}/skill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId: newSkillId }),
      });

      if (res.ok) {
        const { agent } = await res.json();
        setAgents((prev) => prev.map((a) => (a.id === agentId ? agent : a)));
      } else {
        throw new Error('API failed');
      }
    } catch {
      setAgents((prev) =>
        prev.map((a) => (a.id === agentId ? { ...a, skillId: newSkillId } : a))
      );
    }
  };

  // Handle Add Channel
  const handleAddChannel = async ({ name, handle }: { name: string; handle: string }) => {
    try {
      const res = await fetch('/api/channels/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, handle }),
      });

      if (res.ok) {
        const newChan = await res.json();
        setChannels((prev) => [...prev, newChan]);
      } else {
        throw new Error('API failed');
      }
    } catch {
      const newChan: YouTubeChannel = {
        id: `yt_${Date.now().toString().slice(-4)}`,
        name,
        handle: handle.startsWith('@') ? handle : `@${handle}`,
        avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
        subscribers: '12K',
        videoCount: 18,
      };
      setChannels((prev) => [...prev, newChan]);
    }
  };

  const activeAgentsCount = agents.filter((a) => a.active).length;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Navigation Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeAgentsCount={activeAgentsCount}
        onOpenHireModal={() => setIsHireModalOpen(true)}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onGoToDashboard={() => setCurrentTab('dashboard')}
            onOpenHireModal={() => setIsHireModalOpen(true)}
          />
        )}

        {currentTab === 'dashboard' && (
          <Dashboard
            agents={agents}
            channels={channels}
            onToggleAgentStatus={handleToggleAgentStatus}
            onChangeSkill={handleChangeSkill}
            onOpenHireModal={() => setIsHireModalOpen(true)}
            onOpenAddChannelModal={() => setIsAddChannelModalOpen(true)}
          />
        )}

        {currentTab === 'code' && <FastAPICodeViewer />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © 2026 <strong>AI Agentic Video Editor</strong> • FastAPI & Jinja2 Management System
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Agent Cost: $19.00/month</span>
            <span>•</span>
            <span>Billing: Every 5th</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <HireAgentModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
        channels={channels}
        onHire={handleHireAgent}
        onOpenAddChannel={() => {
          setIsHireModalOpen(false);
          setIsAddChannelModalOpen(true);
        }}
      />

      <AddChannelModal
        isOpen={isAddChannelModalOpen}
        onClose={() => setIsAddChannelModalOpen(false)}
        onAddChannel={handleAddChannel}
      />
    </div>
  );
}
