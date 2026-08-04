import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_AGENTS, INITIAL_CHANNELS, INITIAL_CUTS, SKILLS_LIST } from './src/data/initialData';
import { calculateProratedPayment, getNextBillingDate } from './src/utils/billing';
import { Agent, YouTubeChannel, SkillId } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory data store for server-side state
  let agentsStore: Agent[] = [...INITIAL_AGENTS];
  let channelsStore: YouTubeChannel[] = [...INITIAL_CHANNELS];

  // API Routes
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Prorated Billing calculation endpoint
  app.get('/api/prorate', (req: Request, res: Response) => {
    const startDateParam = req.query.date ? new Date(req.query.date as string) : new Date();
    const calculation = calculateProratedPayment(startDateParam, 19.0);
    res.json(calculation);
  });

  // Get all agents
  app.get('/api/agents', (req: Request, res: Response) => {
    res.json(agentsStore);
  });

  // Hire a new agent with prorated calculation
  app.post('/api/agents/hire', (req: Request, res: Response) => {
    const { name, channelId, skillId } = req.body;

    if (!channelId || !skillId) {
      res.status(400).json({ error: 'channelId and skillId are required' });
      return;
    }

    const channel = channelsStore.find((c) => c.id === channelId);
    if (!channel) {
      res.status(404).json({ error: 'YouTube Channel not found' });
      return;
    }

    const today = new Date();
    const prorate = calculateProratedPayment(today, 19.0);
    const nextBilling = getNextBillingDate(today).toISOString();

    const newAgent: Agent = {
      id: `agt_${Date.now().toString().slice(-4)}`,
      name: name || `Editor ${channel.name.split(' ')[0]}`,
      channelId: channel.id,
      channelName: channel.name,
      channelHandle: channel.handle,
      channelAvatarUrl: channel.avatarUrl,
      skillId: skillId as SkillId,
      active: true, // 🟢 Luz verde
      hiredAt: today.toISOString(),
      operatingUntil: nextBilling,
      nextBillingDate: nextBilling,
      monthlyCost: 19.0,
      initialProratedPaid: prorate.proratedPrice,
      cutsGeneratedCount: 0,
      lastActive: 'Initializing operation...',
    };

    agentsStore.unshift(newAgent);
    res.status(201).json({ agent: newAgent, prorateInfo: prorate });
  });

  // Toggle agent active status (Active -> Deactivated or Deactivated -> Active)
  app.post('/api/agents/:id/toggle', (req: Request, res: Response) => {
    const { id } = req.params;
    const agent = agentsStore.find((a) => a.id === id);

    if (!agent) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }

    agent.active = !agent.active; // 🟢 <-> 🔴
    // If deactivated, operatingUntil remains nextBillingDate (5th of month)
    const nextBilling = getNextBillingDate().toISOString();
    agent.operatingUntil = nextBilling;

    res.json({
      agent,
      message: agent.active
        ? 'Agent reactivated (Green light 🟢)'
        : 'Agent deactivated (Red light 🔴 - Operates until the 5th)',
    });
  });

  // Update agent's skill
  app.post('/api/agents/:id/skill', (req: Request, res: Response) => {
    const { id } = req.params;
    const { skillId } = req.body;

    const agent = agentsStore.find((a) => a.id === id);
    if (!agent) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }

    agent.skillId = skillId as SkillId;
    res.json({ agent, message: 'Skill updated successfully' });
  });

  // Get Channels
  app.get('/api/channels', (req: Request, res: Response) => {
    res.json(channelsStore);
  });

  // Add new YouTube Channel link
  app.post('/api/channels/add', (req: Request, res: Response) => {
    const { name, handle } = req.body;
    if (!name || !handle) {
      res.status(400).json({ error: 'Name and handle are required' });
      return;
    }

    const newChannel: YouTubeChannel = {
      id: `yt_${Date.now().toString().slice(-4)}`,
      name,
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      avatarUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80`,
      subscribers: '10K',
      videoCount: 12,
    };

    channelsStore.push(newChannel);
    res.status(201).json(newChannel);
  });

  // Vite middleware in dev / Static files in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
