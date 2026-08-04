import React from 'react';
import { Bot, Zap, History, Youtube, CheckCircle2, DollarSign, Calendar, ArrowRight, Play, ShieldCheck, Cpu } from 'lucide-react';
import { SKILLS_LIST } from '../data/initialData';
import { calculateProratedPayment, formatDateEN } from '../utils/billing';

interface LandingPageProps {
  onGoToDashboard: () => void;
  onOpenHireModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoToDashboard,
  onOpenHireModal,
}) => {
  const prorateDemo = calculateProratedPayment(new Date());
  const nextBillingFormatted = formatDateEN(prorateDemo.nextBillingDate);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden border-b border-slate-800/60 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
            <Bot className="w-4 h-4" />
            <span>Autonomous AI Video Editing Platform for YouTube Channels</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Hire AI Agents That <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Edit & Publish Viral Clips</span> Automatically
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Link your YouTube channel, pick a skill, and let AI agents mine your episodes 24/7 for just <strong className="text-emerald-400 font-bold">$19/mo per agent</strong>.
          </p>

          {/* Key Selling Highlights */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Monthly Billing Date: <strong>Every 5th</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Prorated Initial Billing</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
              <Youtube className="w-4 h-4 text-rose-500" />
              <span>Direct YouTube Integration</span>
            </div>
          </div>

          {/* Primary CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenHireModal}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-extrabold bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 shadow-xl shadow-emerald-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-3 transform active:scale-95"
            >
              <Bot className="w-5 h-5" />
              <span>Hire Agent Now ($19/mo)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onGoToDashboard}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-3"
            >
              <span>Go to Dashboard</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2 Agent Skills Showcase */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xs uppercase font-bold tracking-widest text-emerald-400 mb-2">
            Specialized Skills
          </h2>
          <p className="text-3xl font-extrabold text-white">
            2 Exclusive Skills to Supercharge Your Channel
          </p>
          <p className="mt-3 text-slate-400 text-sm max-w-xl mx-auto">
            Select the agent skill that matches your current YouTube channel strategy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Skill 1: New Episodes */}
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-8 relative overflow-hidden group hover:border-emerald-500/60 transition-all shadow-xl shadow-emerald-950/20">
            <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-black text-[11px] uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl">
              Skill #1
            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 text-emerald-400">
              <Zap className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">
              New Episodes
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Monitors new uploads and episode releases on your channel. As soon as a new video or podcast goes live, the agent isolates peak retention segments and formats vertical Shorts and horizontal clips.
            </p>

            <ul className="space-y-3 mb-8 text-xs text-slate-300 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cuts published within 15 minutes of episode upload</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Animated captions and automatic viral hook detection</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Keep subscribers engaged in real-time</span>
              </li>
            </ul>

            <button
              onClick={onOpenHireModal}
              className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Hire with New Episodes Skill</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Skill 2: Revive Old Episodes */}
          <div className="bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-8 relative overflow-hidden group hover:border-indigo-500/60 transition-all shadow-xl shadow-indigo-950/20">
            <div className="absolute top-0 right-0 bg-indigo-500 text-white font-black text-[11px] uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl">
              Skill #2
            </div>

            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-6 text-indigo-400">
              <History className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">
              Revive Backlog Episodes
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Mines your catalog of past episodes. Rescues timeless discussions, gems, and forgotten debates from your archives and turns them into viral clips to drive ongoing algorithm growth.
            </p>

            <ul className="space-y-3 mb-8 text-xs text-slate-300 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Continuous video generation without recording new footage</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Additional monetization from your historical catalog</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Re-engage dormant subscribers</span>
              </li>
            </ul>

            <button
              onClick={onOpenHireModal}
              className="w-full py-3 rounded-xl font-bold text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Hire with Revive Backlog Skill</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Transparent Pricing & Billing Model Explanation */}
      <section className="py-16 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Fair & Prorated Billing Model</span>
              </div>

              <h2 className="text-3xl font-extrabold text-white">
                How Do Billing Dates & Deactivations Work?
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed">
                Each agent costs exactly <strong className="text-emerald-400">$19.00 USD per month</strong>. Billing for all agents on the platform occurs on the <strong className="text-white">5th of every month</strong>.
              </p>

              <div className="space-y-4 text-xs font-medium">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Prorated Initial Fee</h4>
                    <p className="text-slate-400 mt-1">
                      When hiring an agent on any day of the month, you only pay for the remaining days until the upcoming 5th.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Green Light 🟢 (Active Agent)</h4>
                    <p className="text-slate-400 mt-1">
                      Indicates the agent is running normally with automatic monthly renewal on the 5th.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-sm shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Red Light 🔴 (Deactivated Agent)</h4>
                    <p className="text-slate-400 mt-1">
                      When deactivated, the light turns red and won't renew next month. However, the agent <strong className="text-white">continues operating until the 5th</strong> for the period already paid!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Prorated Pricing Simulator Card */}
            <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div>
                  <h3 className="font-bold text-white text-lg">Live Prorated Calculation Example</h3>
                  <p className="text-xs text-slate-400">Calculated in real-time based on today's date</p>
                </div>
                <span className="text-2xl font-black text-emerald-400">$19<span className="text-xs font-medium text-slate-400">/mo</span></span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-slate-900">
                  <span className="text-slate-400">Hire Date:</span>
                  <span className="font-bold text-white">{formatDateEN(prorateDemo.startDate)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-900">
                  <span className="text-slate-400">Next Monthly Billing Date:</span>
                  <span className="font-bold text-emerald-400">{nextBillingFormatted} (The 5th)</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-900">
                  <span className="text-slate-400">Days Remaining in Cycle:</span>
                  <span className="font-bold text-white">{prorateDemo.daysRemaining} of {prorateDemo.totalDaysInCycle} days</span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">Initial Prorated Payment Today:</span>
                    <span className="text-2xl font-black text-emerald-400">${prorateDemo.proratedPrice.toFixed(2)} USD</span>
                  </div>
                  <p className="text-[11px] text-emerald-400/80 mt-1">
                    Prorated formula: (${prorateDemo.fullMonthlyPrice} ÷ {prorateDemo.totalDaysInCycle} days) × {prorateDemo.daysRemaining} days
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenHireModal}
                className="mt-6 w-full py-4 rounded-2xl font-extrabold text-xs bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Hire an Agent for ${prorateDemo.proratedPrice.toFixed(2)} Today</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
