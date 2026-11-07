import React from 'react';
import {
  Plus,
  MessageSquare,
  Trash2,
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
  ShieldCheck
} from 'lucide-react';
import { Conversation, CandidateProfile, Artifact, AIModel, WorkspaceView } from '../types/agent';
import { AnimatedAIAvatar } from './AnimatedAIAvatar';

interface SidebarProps {
  currentView: WorkspaceView;
  onSelectView: (view: WorkspaceView) => void;
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string, e: React.MouseEvent) => void;
  candidate: CandidateProfile;
  starredArtifacts: Artifact[];
  onOpenArtifact: (artifact: Artifact) => void;
  onOpenKnowledge: () => void;
  selectedModel: AIModel;
  onOpenModelSelector: () => void;
  isOpen: boolean;
  onToggle: () => void;
  onOpenSearch: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen,
  onToggle
}) => {
  const mainWorkspaceItems = [
    { id: 'chat' as WorkspaceView, label: 'AI Chat', icon: MessageSquare, badge: 'Core' },
    { id: 'agents' as WorkspaceView, label: 'AI Agents', icon: Bot },
    { id: 'workflows' as WorkspaceView, label: 'Agent Workflows', icon: Workflow },
    { id: 'research' as WorkspaceView, label: 'Deep Research', icon: Compass },
    { id: 'files' as WorkspaceView, label: 'Projects & Files', icon: FolderGit2 }
  ];

  const aiCapabilitiesItems = [
    { id: 'coding' as WorkspaceView, label: 'Coding Assistant', icon: Code2 },
    { id: 'terminal' as WorkspaceView, label: 'Terminal & Shell', icon: Terminal },
    { id: 'devops' as WorkspaceView, label: 'DevOps & Cloud', icon: Cloud },
    { id: 'git' as WorkspaceView, label: 'Git & GitOps', icon: GitBranch },
    { id: 'web_auto' as WorkspaceView, label: 'Web Automation', icon: Globe },
    { id: 'knowledge' as WorkspaceView, label: 'Knowledge Base', icon: Database }
  ];

  const managementItems = [
    { id: 'activity' as WorkspaceView, label: 'Agent Activity', icon: Activity },
    { id: 'scheduler' as WorkspaceView, label: 'Task Scheduler', icon: Clock },
    { id: 'mcp' as WorkspaceView, label: 'Integrations & MCP', icon: Layers },
    { id: 'analytics' as WorkspaceView, label: 'Usage & Analytics', icon: BarChart3 }
  ];

  const utilityItems = [
    { id: 'settings' as WorkspaceView, label: 'Settings', icon: Settings },
    { id: 'docs' as WorkspaceView, label: 'Help & Documentation', icon: HelpCircle }
  ];

  const renderNavItem = (item: { id: WorkspaceView; label: string; icon: React.ElementType; badge?: string }) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;

    return (
      <button
        key={item.id}
        onClick={() => onSelectView(item.id)}
        className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors text-left group ${
          isActive
            ? 'bg-indigo-600/20 text-white font-medium border border-indigo-500/40 shadow-xs'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <Icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
          <span className="truncate">{item.label}</span>
        </div>

        {item.badge && (
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 md:w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 px-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <AnimatedAIAvatar size="sm" />
          <div>
            <div className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
              <span>JobPulse</span>
              <span className="text-indigo-400 font-mono text-xs">AI</span>
            </div>
            <div className="text-[11px] text-slate-400">Local AI Workspace</div>
          </div>
        </div>

        <button
          onClick={onToggle}
          className="md:hidden text-slate-400 hover:text-white p-1 rounded-md"
          aria-label="Close Sidebar"
        >
          ✕
        </button>
      </div>

      {/* New Session Action */}
      <div className="p-3 pb-2 shrink-0">
        <button
          onClick={() => {
            onNewConversation();
            onSelectView('chat');
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all shadow-sm active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" />
          <span>New Session</span>
        </button>
      </div>

      {/* Sessions list with always-visible delete option */}
      {conversations && conversations.length > 0 && (
        <div className="px-3 pb-2 shrink-0">
          <div className="px-2 mb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Sessions</span>
            <span className="text-[10px] text-slate-400 font-mono">{conversations.length}</span>
          </div>
          <div className="space-y-1 max-h-36 overflow-y-auto pr-0.5">
            {conversations.map((c) => {
              const isConvActive = c.id === activeConversationId && currentView === 'chat';
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectConversation(c.id);
                    onSelectView('chat');
                  }}
                  className={`group relative w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer select-none ${
                    isConvActive
                      ? 'bg-slate-800 text-white font-medium border border-indigo-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate flex-1 min-w-0 pr-1">
                    <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isConvActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span className="truncate text-[11px]">{c.title}</span>
                  </div>

                  {/* Always-visible delete option */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(c.id, e);
                    }}
                    title={`Delete session "${c.title}"`}
                    className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition-colors shrink-0 ml-1 opacity-70 group-hover:opacity-100"
                    aria-label={`Delete session ${c.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3.5">
        {/* MAIN WORKSPACE */}
        <div>
          <div className="px-2 mb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Main Workspace
          </div>
          <div className="space-y-0.5">
            {mainWorkspaceItems.map(renderNavItem)}
          </div>
        </div>

        {/* AI CAPABILITIES */}
        <div>
          <div className="px-2 mb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            AI Capabilities
          </div>
          <div className="space-y-0.5">
            {aiCapabilitiesItems.map(renderNavItem)}
          </div>
        </div>

        {/* MANAGEMENT */}
        <div>
          <div className="px-2 mb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Management
          </div>
          <div className="space-y-0.5">
            {managementItems.map(renderNavItem)}
          </div>
        </div>

        {/* UTILITIES: Settings & Help */}
        <div className="pt-2 border-t border-slate-800/60">
          <div className="space-y-0.5">
            {utilityItems.map(renderNavItem)}
          </div>
        </div>
      </div>

      {/* Administrator / Local AI Workspace Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/95 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="truncate flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
              <span>Administrator</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Online" />
            </div>
            <div className="text-[10px] text-slate-400 truncate">Local AI Workspace</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
