import React, { useState } from 'react';
import {
  Bot,
  User,
  ChevronDown,
  ChevronRight,
  Terminal,
  FileText,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Menu,
  PanelRightOpen,
  Search,
  Plus,
  Trash2
} from 'lucide-react';
import { Message, Artifact, CandidateProfile } from '../types/agent';
import { AnimatedAIAvatar } from './AnimatedAIAvatar';

interface ChatViewProps {
  messages: Message[];
  candidate: CandidateProfile;
  isGenerating: boolean;
  onSelectPromptStarter: (prompt: string) => void;
  onOpenArtifact: (artifact: Artifact) => void;
  activeArtifact: Artifact | null;
  onToggleSidebar: () => void;
  conversationTitle: string;
  onOpenSearch: () => void;
  onNewSession?: () => void;
  onDeleteSession?: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  candidate,
  isGenerating,
  onSelectPromptStarter,
  onOpenArtifact,
  activeArtifact,
  onToggleSidebar,
  conversationTitle,
  onOpenSearch,
  onNewSession,
  onDeleteSession
}) => {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({});

  const toggleThinking = (messageId: string) => {
    setExpandedThinking((prev) => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Top Header */}
      <header className="h-14 px-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/80 backdrop-blur-sm z-20">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors shrink-0"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 truncate text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="font-semibold text-slate-200 truncate max-w-[140px] sm:max-w-xs">
              {conversationTitle || 'Session'}
            </span>
          </div>
        </div>

        {/* Right Header items */}
        <div className="flex items-center gap-2">
          {onNewSession && (
            <button
              onClick={onNewSession}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors shadow-xs"
              title="Generate New Session (+)"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">New Session</span>
            </button>
          )}

          {onDeleteSession && (
            <button
              onClick={onDeleteSession}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors shadow-xs"
              title="Delete Active Session"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Delete Session</span>
            </button>
          )}

          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors shadow-xs"
            title="Search Companies, Cloud Stacks, Portals, or Salaries (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Search & Intel</span>
            <kbd className="hidden md:inline px-1 py-0.2 bg-slate-800 rounded text-[10px] text-slate-400 font-mono">⌘K</kbd>
          </button>

          {activeArtifact && (
            <button
              onClick={() => onOpenArtifact(activeArtifact)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Active Artifact</span>
              <PanelRightOpen className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6">
        {messages.length === 0 ? (
          /* Clean Minimalist Zero State / Welcome Screen */
          <div className="max-w-xl mx-auto py-12 md:py-20 text-center flex flex-col items-center justify-center min-h-[45vh]">
            <div className="mb-5 flex flex-col items-center">
              <AnimatedAIAvatar size="xl" isThinking={isGenerating} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
              JobPulseAI
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-md mx-auto mb-6">
              How can JobPulseAI assist your career strategy, technical prep, or outreach today?
            </p>

            {/* Quick Interactive Prompt Starters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg text-left">
              {[
                { title: 'Chat & Discuss Ideas', desc: 'Ask anything in natural conversation like Claude & ChatGPT', prompt: 'Hello! I want to chat and get some insights today.' },
                { title: 'Cloud & Kubernetes Debugging', desc: 'Troubleshoot pod crashloops, EKS failover & ArgoCD', prompt: 'Explain how Kubernetes handles multi-cluster EKS recovery during a regional outage' },
                { title: 'Tailor Resume for DevOps', desc: 'Optimize AWS EKS, Terraform & ArgoCD achievements', prompt: 'Tailor my resume for a Senior Cloud & DevOps Engineer role' },
                { title: 'SRE Mock Technical Interview', desc: 'Interactive grilling with STAR-formatted answers', prompt: 'Give me a challenging technical mock interview question for a Senior SRE role' }
              ].map((card, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectPromptStarter(card.prompt)}
                  className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/40 transition-all text-xs group cursor-pointer shadow-xs hover:shadow-md"
                >
                  <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {card.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {card.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Message List */
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => {
              const isAssistant = message.role === 'assistant';
              const isThinkingOpen = expandedThinking[message.id] ?? false;

              return (
                <div key={message.id} className="space-y-3">
                  {/* Message Header */}
                  <div className="flex items-center gap-2">
                    {isAssistant ? (
                      <AnimatedAIAvatar size="sm" />
                    ) : (
                      <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold bg-slate-700 text-slate-200">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <span className="text-xs font-semibold text-slate-300">
                      {isAssistant ? 'JobPulseAI' : 'You'}
                    </span>
                    <span className="text-[10px] text-slate-400">{message.timestamp}</span>
                  </div>

                  {/* Thinking Process Disclosure (Assistant Only) */}
                  {isAssistant && message.thinking && (
                    <div className="ml-8 rounded-lg border border-slate-800 bg-slate-900/60 overflow-hidden text-xs">
                      <button
                        onClick={() => toggleThinking(message.id)}
                        className="w-full flex items-center justify-between px-3 py-2 text-slate-400 hover:text-slate-200 transition-colors text-left"
                      >
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Thinking Process</span>
                        </div>
                        {isThinkingOpen ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {isThinkingOpen && (
                        <div className="px-3 pb-3 pt-1 border-t border-slate-800/60 text-slate-400 text-xs leading-relaxed font-mono whitespace-pre-line bg-slate-950/40">
                          {message.thinking}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tool Invocations */}
                  {isAssistant && message.toolsUsed && message.toolsUsed.length > 0 && (
                    <div className="ml-8 space-y-1.5">
                      {message.toolsUsed.map((tool) => (
                        <div
                          key={tool.id}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400"
                        >
                          <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-slate-300 font-semibold">{tool.displayName}:</span>
                          <span className="truncate flex-1 text-slate-400">{tool.output}</span>
                          {tool.durationMs && (
                            <span className="text-slate-400 tabular-nums shrink-0">{tool.durationMs}ms</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message Content */}
                  <div
                    className={`ml-8 text-sm leading-relaxed text-slate-200 whitespace-pre-line ${
                      isAssistant
                        ? 'bg-transparent'
                        : 'bg-slate-900 border border-slate-800 p-4 rounded-xl'
                    }`}
                  >
                    {message.content}
                  </div>

                  {/* Interactive Artifact Preview Card */}
                  {isAssistant && message.artifacts && message.artifacts.length > 0 && (
                    <div className="ml-8 space-y-2 pt-1">
                      {message.artifacts.map((art) => (
                        <div
                          key={art.id}
                          onClick={() => onOpenArtifact(art)}
                          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all cursor-pointer flex items-center justify-between group shadow-sm"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-white group-hover:text-indigo-400 transition-colors truncate">
                                {art.title}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                Click to open interactive artifact preview · v{art.version}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 group-hover:translate-x-0.5 transition-transform shrink-0">
                            <span>Open</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message Action Bar (Assistant Only) */}
                  {isAssistant && (
                    <div className="ml-8 flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleCopyText(message.id, message.content)}
                        className="p-1 text-slate-400 hover:text-slate-200 transition-colors text-xs flex items-center gap-1"
                        title="Copy message"
                      >
                        {copiedMessageId === message.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span className="text-[11px]">Copy</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Generating Typing Indicator */}
            {isGenerating && (
              <div className="ml-8 flex items-center gap-2 text-xs text-slate-400 font-mono py-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                <span>JobPulseAI is reasoning & formulating artifacts...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
