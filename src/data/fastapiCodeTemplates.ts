export const FASTAPI_MAIN_PY = `# main.py - FastAPI + Jinja2 Video Editor AI Agents Portal
from fastapi import FastAPI, Request, Form, HTTPException, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date, timedelta
import math

app = FastAPI(
    title="AI Agentic Video Editor Dashboard",
    description="Hiring and management portal for YouTube AI editor agents with billing on the 5th",
    version="1.0.0"
)

# Setup Jinja2 Templates
templates = Jinja2Templates(directory="templates")

# Models & Schemas
class YouTubeChannel(BaseModel):
    id: str
    name: str
    handle: str
    avatar_url: str

class AgentSkillEnum:
    NEW_EPISODES = "new_episodes" # Skill 1: New episodes cuts
    REVIVE_OLD = "revive_old_episodes" # Skill 2: Revive backlog episodes

class Agent(BaseModel):
    id: str
    name: str
    channel_id: str
    channel_name: str
    skill_id: str
    active: bool # True = Green Light 🟢, False = Red Light 🔴
    hired_at: date
    operating_until: date # Until the 5th of next billing date
    next_billing_date: date
    monthly_cost: float = 19.00
    initial_prorated_paid: float

# In-memory Database Mock
db_channels = [
    {"id": "yt_1", "name": "PodCastFlow Studio", "handle": "@podcastflow", "avatar_url": "/static/yt1.jpg"},
    {"id": "yt_2", "name": "Tech & Innovation Global", "handle": "@techglobal_official", "avatar_url": "/static/yt2.jpg"}
]

db_agents = [
    {
        "id": "agt_101",
        "name": "Editor Agent Alpha",
        "channel_id": "yt_1",
        "channel_name": "PodCastFlow Studio",
        "skill_id": "new_episodes",
        "active": True, # 🟢 Green Light
        "hired_at": date(2026, 7, 20),
        "operating_until": date(2026, 9, 5),
        "next_billing_date": date(2026, 9, 5),
        "monthly_cost": 19.00,
        "initial_prorated_paid": 12.45
    },
    {
        "id": "agt_102",
        "name": "Editor Agent Tech",
        "channel_id": "yt_2",
        "channel_name": "Tech & Innovation Global",
        "skill_id": "revive_old_episodes",
        "active": False, # 🔴 Red Light - Operates until 09/05/2026
        "hired_at": date(2026, 7, 10),
        "operating_until": date(2026, 9, 5),
        "next_billing_date": date(2026, 9, 5),
        "monthly_cost": 19.00,
        "initial_prorated_paid": 9.80
    }
]

# Helper logic for 5th of Month Billing & Prorated Calculation
def get_next_billing_date(today: date) -> date:
    if today.day < 5:
        return date(today.year, today.month, 5)
    else:
        # Move to 5th of next month
        if today.month == 12:
            return date(today.year + 1, 1, 5)
        else:
            return date(today.year, today.month + 1, 5)

def get_cycle_start_date(today: date) -> date:
    if today.day < 5:
        if today.month == 1:
            return date(today.year - 1, 12, 5)
        else:
            return date(today.year, today.month - 1, 5)
    else:
        return date(today.year, today.month, 5)

def calculate_prorated_price(today: date, monthly_cost: float = 19.00):
    next_billing = get_next_billing_date(today)
    cycle_start = get_cycle_start_date(today)
    
    total_days = (next_billing - cycle_start).days
    days_remaining = max(1, (next_billing - today).days)
    
    daily_rate = monthly_cost / total_days
    prorated_amount = round(daily_rate * days_remaining, 2)
    
    return {
        "next_billing": next_billing,
        "days_remaining": days_remaining,
        "total_days": total_days,
        "prorated_amount": prorated_amount
    }

# Routes
@app.get("/", response_class=HTMLResponse)
async def landing_page(request: Request):
    """Landing Page"""
    return templates.TemplateResponse("landing.html", {
        "request": request,
        "monthly_cost": 19.00
    })

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard_page(request: Request):
    """Main User Dashboard"""
    today = date.today()
    prorate_info = calculate_prorated_price(today)
    
    return templates.TemplateResponse("dashboard.html", {
        "request": request,
        "agents": db_agents,
        "channels": db_channels,
        "prorate_info": prorate_info,
        "today": today
    })

@app.post("/agents/hire")
async def hire_agent(
    channel_id: str = Form(...),
    skill_id: str = Form(...),
    agent_name: str = Form(...)
):
    """Hiring new agent with prorated calculation until the 5th"""
    today = date.today()
    prorate = calculate_prorated_price(today)
    channel = next((c for c in db_channels if c["id"] == channel_id), None)
    
    if not channel:
        raise HTTPException(status_code=400, detail="YouTube Channel not found")
        
    new_agent = {
        "id": f"agt_{len(db_agents) + 101}",
        "name": agent_name,
        "channel_id": channel["id"],
        "channel_name": channel["name"],
        "skill_id": skill_id,
        "active": True, # 🟢 Green Light
        "hired_at": today,
        "operating_until": prorate["next_billing"],
        "next_billing_date": prorate["next_billing"],
        "monthly_cost": 19.00,
        "initial_prorated_paid": prorate["prorated_amount"]
    }
    
    db_agents.append(new_agent)
    return RedirectResponse(url="/dashboard", status_code=303)

@app.post("/agents/{agent_id}/toggle")
async def toggle_agent_status(agent_id: str):
    """
    Activates or deactivates the agent.
    If deactivated, turns light to red (active=False), 
    however the robot CONTINUES OPERATING until the 5th billing date!
    """
    agent = next((a for a in db_agents if a["id"] == agent_id), None)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
        
    # Toggle active state (Green Light vs Red Light)
    agent["active"] = not agent["active"]
    return RedirectResponse(url="/dashboard", status_code=303)
`;

export const FASTAPI_JINJA_DASHBOARD_HTML = `<!-- templates/dashboard.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>AI Video Editor Portal - FastAPI & Jinja2</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen">
    <!-- Header -->
    <header class="border-b border-slate-800 bg-slate-900/50 p-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <h1 class="text-xl font-bold text-emerald-400">🤖 AI Video Editor Panel (FastAPI + Jinja)</h1>
            <span class="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium">
                Billing Date: 5th of each month ($19/mo)
            </span>
        </div>
    </header>

    <main class="max-w-7xl mx-auto p-6 space-y-8">
        <!-- Agents Table -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 class="text-lg font-semibold mb-4">My Hired Agents</h2>
            <div class="space-y-4">
                {% for agent in agents %}
                <div class="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg">
                    <div class="flex items-center gap-4">
                        <!-- Status Light -->
                        {% if agent.active %}
                            <span class="relative flex h-4 w-4">
                              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span class="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" title="Active - Green Light 🟢"></span>
                            </span>
                        {% else %}
                            <span class="relative inline-flex rounded-full h-4 w-4 bg-rose-500" title="Deactivated - Red Light 🔴 (Operates until the 5th)"></span>
                        {% endif %}

                        <div>
                            <h3 class="font-bold text-slate-100">{{ agent.name }}</h3>
                            <p class="text-xs text-slate-400">Channel: {{ agent.channel_name }}</p>
                        </div>
                    </div>

                    <!-- Active Skill -->
                    <div class="text-sm">
                        {% if agent.skill_id == 'new_episodes' %}
                            <span class="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-md text-xs font-semibold">
                                Skill 1: New Episodes
                            </span>
                        {% else %}
                            <span class="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-md text-xs font-semibold">
                                Skill 2: Revive Backlog
                            </span>
                        {% endif %}
                    </div>

                    <!-- Operational Status until 5th -->
                    <div class="text-xs text-slate-400">
                        {% if agent.active %}
                            <span class="text-emerald-400">🟢 Active (Renews on 05/{{ agent.next_billing_date.strftime('%m') }})</span>
                        {% else %}
                            <span class="text-rose-400">🔴 Deactivated (Operates until 05/{{ agent.next_billing_date.strftime('%m') }})</span>
                        {% endif %}
                    </div>

                    <!-- Toggle Action -->
                    <form action="/agents/{{ agent.id }}/toggle" method="POST">
                        <button type="submit" class="px-4 py-2 text-xs font-bold rounded-lg border {% if agent.active %}border-rose-500/50 text-rose-400 hover:bg-rose-500/10{% else %}border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10{% endif %}">
                            {% if agent.active %}Deactivate Agent{% else %}Reactivate Agent{% endif %}
                        </button>
                    </form>
                </div>
                {% endfor %}
            </div>
        </div>
    </main>
</body>
</html>
`;
