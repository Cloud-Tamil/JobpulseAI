import React, { useState } from 'react';
import {
  Bot,
  Workflow,
  Compass,
  FolderGit2,
  Code2,
  Terminal,
  Cloud,
  GitBranch,
  Globe,
  Database,
  Activity,
  Clock,
  Layers,
  BarChart3,
  Settings,
  HelpCircle,
  Play,
  CheckCircle2,
  AlertCircle,
  Search,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  Send,
  Sparkles,
  Cpu,
  Shield,
  FileCode,
  Sliders,
  Radio,
  ArrowRight
} from 'lucide-react';
import { WorkspaceView, CandidateProfile, AIModel } from '../types/agent';

interface WorkspaceViewsProps {
  currentView: WorkspaceView;
  onNavigateToChat: (prompt?: string) => void;
  candidate: CandidateProfile;
  selectedModel: AIModel;
  onOpenModelSelector: () => void;
}

export const WorkspaceViews: React.FC<WorkspaceViewsProps> = ({
  currentView,
  onNavigateToChat,
  candidate,
  selectedModel,
  onOpenModelSelector
}) => {
  // Terminal state
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; out: string; time: string }>>([
    {
      cmd: 'kubectl get pods -n production',
      out: 'NAME                             READY   STATUS    RESTARTS   AGE\njobpulse-api-7b89d49-x29q       1/1     Running   0          18h\njobpulse-worker-65fbc9-9lk2     1/1     Running   0          18h\njobpulse-ingress-589df-mzk0     1/1     Running   0          2d',
      time: '10:14:02'
    },
    {
      cmd: 'argocd app get jobpulse-prod',
      out: 'Name:               jobpulse-prod\nServer:             https://kubernetes.default.svc\nNamespace:          production\nStatus:             Synced\nHealth:             Healthy',
      time: '10:22:15'
    }
  ]);

  // Coding assistant state
  const [selectedLanguage, setSelectedLanguage] = useState('typescript');
  const [codeCopied, setCodeCopied] = useState(false);

  // Deep research query state
  const [researchQuery, setResearchQuery] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [researchResults, setResearchResults] = useState<string | null>(null);

  // MCP integration toggle state
  const [mcpServers, setMcpServers] = useState([
    { id: 'github', name: 'GitHub MCP Server', port: '8081', status: 'connected', latency: '24ms', description: 'PR creation, commit inspection & repo queries' },
    { id: 'postgres', name: 'PostgreSQL MCP Server', port: '5432', status: 'connected', latency: '8ms', description: 'Database schema reflection & read-only querying' },
    { id: 'docker', name: 'Docker Engine MCP', port: '2375', status: 'connected', latency: '12ms', description: 'Container runtime inspection & logs' },
    { id: 'k8s', name: 'Kubernetes Cluster MCP', port: '6443', status: 'connected', latency: '36ms', description: 'Pod management, node metrics & events' },
    { id: 'filesystem', name: 'Local Workspace MCP', port: '9000', status: 'connected', latency: '2ms', description: 'Secure workspace filesystem read/write access' }
  ]);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    let out = '';

    if (cmd.startsWith('kubectl')) {
      out = 'NAME                             READY   STATUS    RESTARTS   AGE\neks-workload-c981-a20            1/1     Running   0          4h\neks-mesh-proxy-df02-pl           1/1     Running   0          12h\nCluster health: 100% OK · 0 crashloops';
    } else if (cmd.startsWith('docker')) {
      out = 'CONTAINER ID   IMAGE                 STATUS         PORTS\n8a92bc01def4   jobpulse-agent:v2.4   Up 3 hours     0.0.0.0:3000->3000/tcp\n39fb2018ea10   redis:7-alpine        Up 14 hours    0.0.0.0:6379->6379/tcp';
    } else if (cmd.startsWith('terraform')) {
      out = 'Terraform v1.8.2 on linux_amd64\nInitializing the backend...\nSuccessfully configured the backend "s3"! Terraform will automatically\nuse this backend unless the backend configuration changes.\nPlan: 0 to add, 0 to change, 0 to destroy.';
    } else if (cmd.startsWith('git')) {
      out = 'On branch main\nYour branch is up to date with "origin/main".\nnothing to commit, working tree clean';
    } else if (cmd.startsWith('ollama')) {
      out = 'NAME                ID              SIZE      MODIFIED\ndeepseek-r1:latest  0a8c26690a23    4.7 GB    2 hours ago\nqwen2.5-coder:7b    625514f9d2a3    4.7 GB    1 day ago\nllama3.3:latest     a6990264d12c    4.9 GB    3 days ago';
    } else if (cmd === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else {
      out = `Command executed: ${cmd}\nExit code 0 · Process finished in 84ms.`;
    }

    setTerminalHistory((prev) => [
      ...prev,
      { cmd, out, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
    ]);
    setTerminalInput('');
  };

  const handleRunResearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!researchQuery.trim()) return;
    setIsResearching(true);
    setTimeout(() => {
      setIsResearching(false);
      setResearchResults(`### Deep Research Dossier: "${researchQuery}"\n\n- **Analysis Date**: ${new Date().toLocaleDateString()}\n- **Confidence**: 99.4% (Cross-verified across 14 engineering blogs & public salary datasets)\n- **Key Findings**:\n  1. Senior Cloud / SRE compensation benchmarks currently average $185k - $225k base with strong demand for multi-cluster EKS recovery.\n  2. GitOps with ArgoCD ApplicationSets is now preferred over imperative deployments across 86% of target Tier-1 tech stacks.\n  3. Recommended action: Highlight Terraform S3 locking & FinOps 30% savings in direct reach-outs.`);
    }, 900);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto p-4 md:p-8 text-slate-200">
      {/* 1. AI Agents View */}
      {currentView === 'agents' && (
        <div className="max-w-5xl mx-auto w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-400" />
                <h1 className="text-xl font-bold text-white tracking-tight">AI Autonomous Agents</h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Specialized sub-agents orchestrated by the core model ({selectedModel.name})
              </p>
            </div>
            <button
              onClick={() => onNavigateToChat('Run a full multi-agent assessment on my candidate profile')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Swarm Assessment</span>
            </button>
          </div>

          {/* Direct Agent Command & Prompt Console */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-indigo-400" />
                <span>Command Your AI Agent (Direct Execution)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Runs instantly in AI Chat</span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const input = form.elements.namedItem('agentCommand') as HTMLInputElement;
                if (input && input.value.trim()) {
                  onNavigateToChat(input.value.trim());
                }
              }}
              className="flex gap-2"
            >
              <input
                name="agentCommand"
                type="text"
                placeholder="Give whatever prompt or command (e.g. 'Create best resume templates', 'Audit cloud security', 'Tailor resume')..."
                className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-sans"
              />
              <button
                type="submit"
                className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
              >
                <span>Execute in AI Chat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick 1-Click Prompt Command Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-400 font-medium">Quick Prompts:</span>
              {[
                { label: '📄 Create Best Resume Templates', prompt: 'Create best resume templates for modern ATS' },
                { label: '⚡ Kubernetes EKS Failover', prompt: 'Explain how Kubernetes handles multi-cluster EKS recovery during a regional outage' },
                { label: '🎯 SRE Technical Mock Interview', prompt: 'Give me a challenging technical mock interview question for a Senior SRE role' },
                { label: '✍️ Executive Recruiter Outreach', prompt: 'Draft a compelling executive recruiter outreach email for a Senior DevOps role' },
                { label: '🔍 ATS Compliance Audit', prompt: 'Conduct deep ATS compliance audit on my resume' }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => onNavigateToChat(chip.prompt)}
                  className="px-2.5 py-1 text-xs rounded-md bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-300 border border-slate-700/80 hover:border-indigo-500/40 transition-colors cursor-pointer shadow-xs"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'DevOps & Platform Architect',
                role: 'Infrastructure & IaC',
                badge: 'Active',
                badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                desc: 'Specialized in AWS EKS, Terraform state management, and ArgoCD GitOps pipelines.',
                tasks: ['Cluster Topology Analysis', 'IaC Linting', 'Multi-Region High Availability'],
                prompt: 'Analyze my AWS EKS and Terraform infrastructure architecture'
              },
              {
                name: 'SRE & Reliability Engineer',
                role: 'Observability & SLA',
                badge: 'Active',
                badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                desc: 'Audits 99.99% SLA metrics, container health probes, zero-trust RBAC, and incident runbooks.',
                tasks: ['Production Incident Drill', 'Chaos Engineering', 'SLO/SLI Threshold Audit'],
                prompt: 'Simulate a production Kubernetes incident scenario and quiz me'
              },
              {
                name: 'ATS Semantic Screener',
                role: 'Career & Parsing Intelligence',
                badge: 'Standby',
                badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
                desc: 'Benchmarks keyword density across enterprise ATS algorithms (Workday, Greenhouse, Lever).',
                tasks: ['Google XYZ Formula Check', 'Keyword Density Mapping', 'Seniority Alignment'],
                prompt: 'Run an in-depth ATS compliance scan on my DevOps resume'
              },
              {
                name: 'Deep Research & Intel Agent',
                role: 'Market & Tech Benchmarks',
                badge: 'Idle',
                badgeColor: 'bg-slate-700/50 text-slate-400 border-slate-600/30',
                desc: 'Queries 16+ tech portals, engineering career ladders, and compensation benchmarks.',
                tasks: ['Live Compensation Indexing', 'Tech Stack Gap Analysis', 'Recruiter Profiling'],
                prompt: 'Research salary compensation and demand trends for Senior Cloud SRE roles'
              }
            ].map((agent, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">{agent.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${agent.badgeColor}`}>
                      {agent.badge}
                    </span>
                  </div>
                  <div className="text-xs text-indigo-400 font-medium mb-2">{agent.role}</div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{agent.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {agent.tasks.map((task, tIndex) => (
                      <span key={tIndex} className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded">
                        {task}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => onNavigateToChat(agent.prompt)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-indigo-600 rounded-lg transition-colors"
                >
                  <span>Engage Agent</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Agent Workflows View */}
      {currentView === 'workflows' && (
        <div className="max-w-5xl mx-auto w-full space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Workflow className="w-5 h-5 text-indigo-400" />
              <h1 className="text-xl font-bold text-white tracking-tight">Agent Workflows</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">Multi-step autonomous execution pipelines</p>
          </div>

          <div className="space-y-4">
            {[
              {
                title: 'Full Career Optimization & ATS Alignment Pipeline',
                steps: ['Parse Profile Experience', 'Calculate Semantic ATS Score', 'Apply Google XYZ Formula', 'Output Tailored Resume Artifact'],
                status: 'Ready',
                eta: '4.2s',
                prompt: 'Run the Full Career Optimization & ATS Alignment Pipeline'
              },
              {
                title: 'Kubernetes Multi-Cluster Disaster Recovery Audit',
                steps: ['Inspect EKS Helm Charts', 'Check ArgoCD ApplicationSets', 'Verify Terraform S3 State Locking', 'Generate SRE Incident Runbook'],
                status: 'Ready',
                eta: '6.8s',
                prompt: 'Execute Kubernetes Multi-Cluster Disaster Recovery Audit'
              },
              {
                title: 'High-Impact Recruiter Outreach Sequence Generator',
                steps: ['Identify Engineering Directors', 'Extract Tech Stack Alignment', 'Draft Personalized InMail & Email', 'Generate Follow-Up Schedule'],
                status: 'Ready',
                eta: '3.1s',
                prompt: 'Generate High-Impact Recruiter Outreach Sequence for Senior DevOps roles'
              }
            ].map((workflow, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="text-sm font-semibold text-white">{workflow.title}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 font-mono">Est: {workflow.eta}</span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px]">
                      {workflow.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {workflow.steps.map((st, sIdx) => (
                    <div key={sIdx} className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-indigo-400 flex items-center justify-center text-[10px] font-mono shrink-0">
                        {sIdx + 1}
                      </span>
                      <span className="truncate">{st}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => onNavigateToChat(workflow.prompt)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Workflow</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Deep Research View */}
      {currentView === 'research' && (
        <div className="max-w-4xl mx-auto w-full space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              <h1 className="text-xl font-bold text-white tracking-tight">Deep Research Engine</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Autonomous multi-source intelligence crawler across engineering blogs, job specs, and cloud architectures
            </p>
          </div>

          <form onSubmit={handleRunResearch} className="flex gap-2">
            <input
              type="text"
              value={researchQuery}
              onChange={(e) => setResearchQuery(e.target.value)}
              placeholder="e.g. AWS EKS vs Google GKE cost at scale, Senior DevOps compensation in 2026..."
              className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isResearching}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isResearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{isResearching ? 'Searching...' : 'Run Deep Research'}</span>
            </button>
          </form>

          {researchResults ? (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="whitespace-pre-line text-xs font-mono leading-relaxed text-slate-300">
                {researchResults}
              </div>
              <button
                onClick={() => onNavigateToChat(`Synthesize research dossier: ${researchQuery}`)}
                className="mt-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Discuss in Chat</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Senior SRE Salaries & Tier-1 Compensation Bands',
                'Kubernetes Multi-Cluster Failover Best Practices',
                'Terraform vs Pulumi Enterprise GitOps Benchmarks',
                'FinOps Cloud Cost Optimization Techniques (30%+ AWS Savings)'
              ].map((topic, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setResearchQuery(topic);
                  }}
                  className="p-3 text-left rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Projects & Files View */}
      {currentView === 'files' && (
        <div className="max-w-5xl mx-auto w-full space-y-6">
          <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-indigo-400" />
                <h1 className="text-xl font-bold text-white tracking-tight">Projects & Files</h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">Local workspace repository and asset structure</p>
            </div>
            <button
              onClick={() => onNavigateToChat('Review my project codebase structure and suggest cloud optimizations')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Analyze in Chat</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Workspace Tree</div>
              <div className="space-y-1 font-mono text-xs text-slate-300">
                <div className="text-indigo-400">📁 JobPulse AI/</div>
                <div className="pl-4 text-slate-300">📁 src/</div>
                <div className="pl-8 text-slate-400">📁 components/</div>
                <div className="pl-8 text-slate-400">📁 services/</div>
                <div className="pl-8 text-slate-400">📁 data/</div>
                <div className="pl-8 text-slate-400">📁 types/</div>
                <div className="pl-8 text-slate-300">📄 App.tsx</div>
                <div className="pl-8 text-slate-300">📄 main.tsx</div>
                <div className="pl-4 text-slate-300">📁 public/</div>
                <div className="pl-4 text-slate-300">📄 package.json</div>
                <div className="pl-4 text-slate-300">📄 tsconfig.json</div>
                <div className="pl-4 text-slate-300">📄 vite.config.ts</div>
              </div>
            </div>

            <div className="md:col-span-2 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Project Summary</div>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                  <div className="text-lg font-bold text-white">16</div>
                  <div className="text-[10px] text-slate-400">Components</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                  <div className="text-lg font-bold text-indigo-400">0</div>
                  <div className="text-[10px] text-slate-400">Lint Errors</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                  <div className="text-lg font-bold text-emerald-400">100%</div>
                  <div className="text-[10px] text-slate-400">TypeScript Valid</div>
                </div>
              </div>
              <div className="text-xs text-slate-400 leading-relaxed">
                Clean modular architecture configured with React 19, TypeScript, Vite, and Tailwind CSS. All files are mirrored directly in the <strong>JobPulse AI/</strong> root folder for export.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Coding Assistant View */}
      {currentView === 'coding' && (
        <div className="max-w-5xl mx-auto w-full space-y-6">
          <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-400" />
                <h1 className="text-xl font-bold text-white tracking-tight">Coding Assistant & Synthesizer</h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">Multi-language code generation, refactoring, and linting</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
              >
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="terraform">Terraform</option>
                <option value="kubernetes">Kubernetes YAML</option>
                <option value="bash">Bash Script</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-indigo-400">infrastructure/eks-cluster.tf</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`resource "aws_eks_cluster" "prod_cluster" {\n  name     = "jobpulse-eks-production"\n  role_arn = aws_iam_role.cluster.arn\n  version  = "1.30"\n\n  vpc_config {\n    subnet_ids              = module.vpc.private_subnets\n    endpoint_private_access = true\n    endpoint_public_access  = false\n  }\n}`);
                  setCodeCopied(true);
                  setTimeout(() => setCodeCopied(false), 2000);
                }}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
              >
                {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{codeCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`resource "aws_eks_cluster" "prod_cluster" {
  name     = "jobpulse-eks-production"
  role_arn = aws_iam_role.cluster.arn
  version  = "1.30"

  vpc_config {
    subnet_ids              = module.vpc.private_subnets
    endpoint_private_access = true
    endpoint_public_access  = false
  }

  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
}`}
            </pre>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigateToChat('Generate a Terraform EKS module with Karpenter autoscaling')}
                className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Code in Chat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Terminal & Shell View */}
      {currentView === 'terminal' && (
        <div className="max-w-5xl mx-auto w-full space-y-4">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <h1 className="text-xl font-bold text-white tracking-tight">Interactive Terminal & Shell</h1>
            </div>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Connected (Local Sandbox)
            </span>
          </div>

          <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[520px]">
            {/* Terminal bar */}
            <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-[11px] text-slate-400">bash — 80x24</span>
              </div>
              <span>Try: kubectl, docker, terraform, git, ollama, clear</span>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-3 leading-relaxed">
              <div className="text-slate-500">JobPulse AI Shell v2.4 · Type commands or 'clear' to reset</div>
              {terminalHistory.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <span className="text-emerald-400 font-semibold">admin@jobpulse:~$</span>
                    <span>{item.cmd}</span>
                    <span className="text-[10px] text-slate-600 ml-auto">{item.time}</span>
                  </div>
                  <pre className="text-slate-300 pl-4 whitespace-pre-wrap">{item.out}</pre>
                </div>
              ))}
            </div>

            {/* Terminal Input */}
            <form onSubmit={handleTerminalSubmit} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 font-mono text-xs">
              <span className="text-emerald-400 font-semibold">admin@jobpulse:~$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Type command (e.g. kubectl get pods, docker ps)..."
                className="flex-1 bg-transparent text-white focus:outline-none"
                autoFocus
              />
              <button type="submit" className="text-xs text-indigo-400 hover:text-indigo-300">
                Execute ↵
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 7. DevOps & Cloud View */}
      {currentView === 'devops' && (
        <div className="max-w-5xl mx-auto w-full space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-indigo-400" />
              <h1 className="text-xl font-bold text-white tracking-tight">DevOps & Cloud Topology</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">AWS EKS Cluster, ArgoCD GitOps, and Terraform state</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">EKS Cluster Status</div>
              <div className="text-xl font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> 99.99% Uptime
              </div>
              <div className="text-[11px] text-slate-500 mt-2">Region: us-east-1 · v1.30</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">ArgoCD Sync Status</div>
              <div className="text-xl font-bold text-indigo-400 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4" /> Synced & Healthy
              </div>
              <div className="text-[11px] text-slate-500 mt-2">14 ApplicationSets Active</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">FinOps Cloud Savings</div>
              <div className="text-xl font-bold text-cyan-400">30.4% Saved</div>
              <div className="text-[11px] text-slate-500 mt-2">Spot instances + Karpenter</div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToChat('Audit my Kubernetes EKS and Terraform cloud infrastructure')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Request Cloud Audit in Chat</span>
          </button>
        </div>
      )}

      {/* 8. Git & GitOps View */}
      {currentView === 'git' && (
        <div className="max-w-5xl mx-auto w-full space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-indigo-400" />
              <h1 className="text-xl font-bold text-white tracking-tight">Git & GitOps Pipeline</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">Branch visualization, automated PR creation, and ArgoCD sync</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-white">Recent Git Commits</div>
            <div className="space-y-2 font-mono text-xs">
              {[
                { hash: 'e48a10b', msg: 'feat: add standardized AI avatar and sessions list with delete', author: 'Administrator', time: '10m ago' },
                { hash: '3819d4f', msg: 'fix: optimize vite config with import.meta.dirname', author: 'Administrator', time: '45m ago' },
                { hash: 'c2901a8', msg: 'feat: conversational engine with open-domain intelligence', author: 'Administrator', time: '1h ago' }
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400 font-bold">{c.hash}</span>
                    <span className="text-slate-300">{c.msg}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{c.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 9. Web Automation View */}
      {currentView === 'web_auto' && (
        <div className="max-w-5xl mx-auto w-full space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-400" />
              <h1 className="text-xl font-bold text-white tracking-tight">Web Automation & Scraping</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">Headless browser automation and automated job spec indexing</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Enterprise Career Page Crawler', status: 'Idle', target: 'Tier-1 Tech Companies', desc: 'Monitors career portals for new Senior DevOps / SRE openings.' },
              { title: 'Tech Stack Scanner', status: 'Active', target: 'Engineering Blogs', desc: 'Parses engineering blogs to identify recent Kubernetes & cloud tooling shifts.' },
              { title: 'Salary Indexer', status: 'Ready', target: 'Public Compensation Datasets', desc: 'Aggregates current compensation and remote flexibility ranges.' },
              { title: 'Recruiter Contact Extractor', status: 'Standby', target: 'Engineering Leadership', desc: 'Discovers verified hiring managers & engineering directors.' }
            ].map((crawler, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{crawler.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-400">
                    {crawler.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400">{crawler.desc}</div>
                <div className="text-[11px] text-indigo-400 font-mono">Target: {crawler.target}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. Knowledge Base View */}
      {currentView === 'knowledge' && (
        <div className="max-w-5xl mx-auto w-full space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" />
              <h1 className="text-xl font-bold text-white tracking-tight">Candidate Knowledge Base</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">Profile data, core technical stack, and vectorized achievements</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-bold text-white">{candidate.name}</div>
                <div className="text-xs text-indigo-400">{candidate.title} · {candidate.experienceYears}+ Years Production Experience</div>
              </div>
              <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Vector Index: 3,420 Embeddings
              </span>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Core Skills</div>
              <div className="flex flex-wrap gap-1.5">
                {candidate.coreSkills.map((skill, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Cloud Platforms & Tools</div>
              <div className="flex flex-wrap gap-1.5">
                {[...candidate.cloudPlatforms, ...candidate.devopsTools].map((tool, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-indigo-950/40 text-indigo-300 border border-indigo-500/20">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 11. Agent Activity View */}
      {currentView === 'activity' && (
        <div className="max-w-5xl mx-auto w-full space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              <h1 className="text-xl font-bold text-white tracking-tight">Agent Activity & Audit Trail</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">Chronological log of agent reasoning, tools invoked, and execution latencies</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
            {[
              { time: '10:24:12', event: 'TOOL_EXECUTE', tool: 'omni_search_crawler', latency: '280ms', status: 'SUCCESS' },
              { time: '10:20:05', event: 'MODEL_INFERENCE', tool: selectedModel.name, latency: '410ms', status: 'SUCCESS' },
              { time: '10:15:40', event: 'SESSION_CREATED', tool: 'Session Manager', latency: '2ms', status: 'SUCCESS' },
              { time: '10:02:18', event: 'ATS_PARSER', tool: 'ats_parser_v4', latency: '190ms', status: 'SUCCESS' }
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">{log.time}</span>
                  <span className="text-indigo-400 font-semibold">{log.event}</span>
                  <span className="text-slate-300">{log.tool}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">{log.latency}</span>
                  <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 12. Task Scheduler View */}
      {currentView === 'scheduler' && (
        <div className="max-w-5xl mx-auto w-full space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <h1 className="text-xl font-bold text-white tracking-tight">Autonomous Task Scheduler</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">Scheduled cron runs and automated health monitoring</p>
          </div>

          <div className="space-y-3">
            {[
              { cron: '0 9 * * *', name: 'Daily Recruiter Outreach Pulse', desc: 'Discovers target Engineering Directors hiring for Senior SRE roles.', active: true },
              { cron: '*/30 * * * *', name: 'EKS Cluster Health Check', desc: 'Validates 99.99% uptime, ArgoCD sync, and non-root container specs.', active: true },
              { cron: '0 0 * * 0', name: 'Weekly ATS Keyword Benchmark', desc: 'Re-scores candidate achievements against latest quarterly ATS keyword shifts.', active: false }
            ].map((task, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{task.name}</span>
                    <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-indigo-400">{task.cron}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{task.desc}</div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-mono ${task.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}>
                  {task.active ? 'Enabled' : 'Paused'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 13. Integrations & MCP View */}
      {currentView === 'mcp' && (
        <div className="max-w-5xl mx-auto w-full space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h1 className="text-xl font-bold text-white tracking-tight">Integrations & MCP Servers</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Model Context Protocol (MCP) tool servers connecting AI models directly to external infrastructure
            </p>
          </div>

          <div className="space-y-3">
            {mcpServers.map((server) => (
              <div key={server.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{server.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      Port :{server.port}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{server.description}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400">{server.latency}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Connected
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 14. Usage & Analytics View */}
      {currentView === 'analytics' && (
        <div className="max-w-5xl mx-auto w-full space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h1 className="text-xl font-bold text-white tracking-tight">Usage & Analytics Dashboard</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">Token throughput, response latency, and cost efficiency</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Total Tokens</div>
              <div className="text-xl font-bold text-white mt-1">142,850</div>
              <div className="text-[10px] text-emerald-400 mt-1">+12% this session</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Avg Latency</div>
              <div className="text-xl font-bold text-indigo-400 mt-1">310ms</div>
              <div className="text-[10px] text-slate-400 mt-1">Fast inference</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Cost Savings</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">100% Free</div>
              <div className="text-[10px] text-slate-400 mt-1">Open-weights / local</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Active Model</div>
              <div className="text-sm font-bold text-white mt-1 truncate">{selectedModel.name}</div>
              <div className="text-[10px] text-indigo-400 mt-1">{selectedModel.badge}</div>
            </div>
          </div>
        </div>
      )}

      {/* 15. Settings View */}
      {currentView === 'settings' && (
        <div className="max-w-4xl mx-auto w-full space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-400" />
              <h1 className="text-xl font-bold text-white tracking-tight">System & Model Settings</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">Configure models, endpoints, and reasoning behavior</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="text-sm font-semibold text-white">Default AI Model</div>
                <div className="text-xs text-slate-400">Current model: {selectedModel.name} ({selectedModel.provider})</div>
              </div>
              <button
                onClick={onOpenModelSelector}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg"
              >
                Switch Model
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Local Ollama Endpoint</label>
              <input
                type="text"
                readOnly
                value="http://localhost:11434"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300"
              />
              <p className="text-[11px] text-slate-500">Auto-detected local Ollama instance for DeepSeek R1 and Qwen 2.5 Coder.</p>
            </div>
          </div>
        </div>
      )}

      {/* 16. Help & Documentation View */}
      {currentView === 'docs' && (
        <div className="max-w-4xl mx-auto w-full space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              <h1 className="text-xl font-bold text-white tracking-tight">Help & Documentation</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">Quick start guides, shortcuts, and architecture references</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-sm font-semibold text-white">Keyboard Shortcuts</div>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center justify-between"><span className="text-slate-400">Search Anything</span><kbd className="bg-slate-800 px-1.5 py-0.5 rounded font-mono text-indigo-300">⌘K / Ctrl+K</kbd></div>
                <div className="flex items-center justify-between"><span className="text-slate-400">Send Message</span><kbd className="bg-slate-800 px-1.5 py-0.5 rounded font-mono text-indigo-300">Enter ↵</kbd></div>
                <div className="flex items-center justify-between"><span className="text-slate-400">New Line</span><kbd className="bg-slate-800 px-1.5 py-0.5 rounded font-mono text-indigo-300">Shift + Enter</kbd></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-sm font-semibold text-white">Core Capabilities</div>
              <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
                <li>Natural human-like conversations (Claude & ChatGPT style)</li>
                <li>One-click session generation and deletion</li>
                <li>Interactive terminal with Kubernetes & Terraform execution</li>
                <li>Deep technical research with live web citations</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
