import React, { useState } from 'react';
import { Code2, Copy, Check, FileText, Download, Terminal, Cpu } from 'lucide-react';
import { FASTAPI_MAIN_PY, FASTAPI_JINJA_DASHBOARD_HTML } from '../data/fastapiCodeTemplates';

export const FastAPICodeViewer: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'main' | 'html' | 'readme'>('main');
  const [copied, setCopied] = useState(false);

  const getActiveCode = () => {
    if (activeFile === 'main') return FASTAPI_MAIN_PY;
    if (activeFile === 'html') return FASTAPI_JINJA_DASHBOARD_HTML;
    return `# README.md - How to run the FastAPI + Jinja2 project

1. Install Python dependencies:
   pip install fastapi uvicorn jinja2 python-multipart pydantic

2. Directory structure:
   ├── main.py
   ├── templates/
   │   ├── landing.html
   │   └── dashboard.html
   └── static/

3. Launch Uvicorn development server:
   uvicorn main:app --reload --port 8000

4. Access in your browser:
   http://127.0.0.1:8000/dashboard
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = activeFile === 'main' ? 'main.py' : activeFile === 'html' ? 'dashboard.html' : 'README.md';
    const blob = new Blob([getActiveCode()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Info Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              FastAPI + Jinja2 Source Code (Python)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Contains the complete implementation of routes, Pydantic models, Jinja2 template rendering, prorated billing calculations, and green/red status light logic.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download File</span>
          </button>
        </div>
      </div>

      {/* Code File Switcher & Display */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFile('main')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeFile === 'main'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>main.py (FastAPI)</span>
            </button>

            <button
              onClick={() => setActiveFile('html')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeFile === 'html'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>dashboard.html (Jinja2)</span>
            </button>

            <button
              onClick={() => setActiveFile('readme')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeFile === 'readme'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>README.md</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-500">
            {activeFile === 'main' ? 'Python 3.10+ / FastAPI' : activeFile === 'html' ? 'Jinja2 + HTML5' : 'Markdown'}
          </span>
        </div>

        {/* Code Editor Window */}
        <div className="p-6 overflow-x-auto max-h-[600px] bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed selection:bg-emerald-500/30">
          <pre>{getActiveCode()}</pre>
        </div>
      </div>
    </div>
  );
};
