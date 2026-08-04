import { SkillInfo, YouTubeChannel, Agent, GeneratedCut } from '../types';
import { getNextBillingDate } from '../utils/billing';

export const SKILLS_LIST: SkillInfo[] = [
  {
    id: 'new_episodes',
    number: 1,
    name: 'New Episodes',
    shortDescription: 'Generates cuts and vertical/horizontal clips from newly released episodes.',
    fullDescription: 'Monitors the channel in real time. As soon as a new episode or podcast is published, the Agent automatically detects retention spikes, creates compelling hooks, formats for Shorts/Reels, and publishes the top highlights.',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    iconName: 'Zap',
  },
  {
    id: 'revive_old_episodes',
    number: 2,
    name: 'Revive Backlog Episodes',
    shortDescription: 'Generates viral cuts and highlights from older backlog episodes.',
    fullDescription: 'Analyzes the full catalog and archive of older channel episodes. Rescues forgotten valuable content, turning them into optimized new clips to re-engage subscribers and attract new audiences without recording new footage.',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    iconName: 'History',
  },
];

export const INITIAL_CHANNELS: YouTubeChannel[] = [
  {
    id: 'yt_1',
    name: 'PodCastFlow Studio',
    handle: '@podcastflow',
    avatarUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=150&q=80',
    subscribers: '428K',
    videoCount: 312,
  },
  {
    id: 'yt_2',
    name: 'Tech & Innovation Global',
    handle: '@techglobal_official',
    avatarUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=150&q=80',
    subscribers: '185K',
    videoCount: 194,
  },
  {
    id: 'yt_3',
    name: 'Mind & Business Talk',
    handle: '@mindbusinesstalk',
    avatarUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=150&q=80',
    subscribers: '620K',
    videoCount: 540,
  },
];

const nextBillingStr = getNextBillingDate().toISOString();
const hiredDateStr = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString();

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agt_101',
    name: 'Editor Agent Alpha',
    channelId: 'yt_1',
    channelName: 'PodCastFlow Studio',
    channelHandle: '@podcastflow',
    channelAvatarUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=150&q=80',
    skillId: 'new_episodes',
    active: true, // 🟢 Green light
    hiredAt: hiredDateStr,
    operatingUntil: nextBillingStr,
    nextBillingDate: nextBillingStr,
    monthlyCost: 19.0,
    initialProratedPaid: 12.45,
    cutsGeneratedCount: 47,
    lastActive: '12 minutes ago',
  },
  {
    id: 'agt_102',
    name: 'Editor Agent Retro',
    channelId: 'yt_1',
    channelName: 'PodCastFlow Studio',
    channelHandle: '@podcastflow',
    channelAvatarUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=150&q=80',
    skillId: 'revive_old_episodes',
    active: true, // 🟢 Green light
    hiredAt: hiredDateStr,
    operatingUntil: nextBillingStr,
    nextBillingDate: nextBillingStr,
    monthlyCost: 19.0,
    initialProratedPaid: 14.20,
    cutsGeneratedCount: 89,
    lastActive: '1 hour ago',
  },
  {
    id: 'agt_103',
    name: 'Editor Agent Tech',
    channelId: 'yt_2',
    channelName: 'Tech & Innovation Global',
    channelHandle: '@techglobal_official',
    channelAvatarUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=150&q=80',
    skillId: 'new_episodes',
    active: false, // 🔴 Red light - operating until the 5th
    hiredAt: hiredDateStr,
    operatingUntil: nextBillingStr,
    nextBillingDate: nextBillingStr,
    monthlyCost: 19.0,
    initialProratedPaid: 9.80,
    cutsGeneratedCount: 23,
    lastActive: '3 hours ago',
  },
];

export const INITIAL_CUTS: GeneratedCut[] = [
  {
    id: 'cut_1',
    agentId: 'agt_101',
    channelName: 'PodCastFlow Studio',
    title: '🔥 The secret to scaling startups in 2026! #shorts',
    originalEpisode: 'PodCastFlow #142 - Ex-Unicorn Founder Interview',
    skillUsed: 'new_episodes',
    durationSeconds: 58,
    viewsEstimated: '34.2K',
    createdAt: 'Today at 09:30 AM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=400&q=80',
    youtubeUrl: 'https://youtube.com',
  },
  {
    id: 'cut_2',
    agentId: 'agt_102',
    channelName: 'PodCastFlow Studio',
    title: '💡 Backlog Gem: This AI prediction from 2021 shocked everyone!',
    originalEpisode: 'PodCastFlow #045 - Future of Work (Recorded in 2021)',
    skillUsed: 'revive_old_episodes',
    durationSeconds: 45,
    viewsEstimated: '89.1K',
    createdAt: 'Yesterday at 06:15 PM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
    youtubeUrl: 'https://youtube.com',
  },
  {
    id: 'cut_3',
    agentId: 'agt_103',
    channelName: 'Tech & Innovation Global',
    title: '⚡ The new Quantum Chip explained in 40 seconds',
    originalEpisode: 'Tech & Innovation Ep. 88 - Processor Revolution',
    skillUsed: 'new_episodes',
    durationSeconds: 42,
    viewsEstimated: '14.8K',
    createdAt: '2 days ago',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
    youtubeUrl: 'https://youtube.com',
  },
];
