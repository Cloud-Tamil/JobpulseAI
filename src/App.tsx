import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatView } from './components/ChatView';
import { PromptInput } from './components/PromptInput';
import { ArtifactPanel } from './components/ArtifactPanel';
import { ProjectKnowledgeModal } from './components/ProjectKnowledgeModal';
import { ModelSelectorModal } from './components/ModelSelectorModal';
import { UniversalSearchModal } from './components/UniversalSearchModal';
import { DEFAULT_CANDIDATE } from './data/candidateData';
import { AI_MODELS, DEFAULT_MODEL_ID } from './data/modelsData';
import { Conversation, Message, Artifact, CandidateProfile, AttachedFile, AIModel, WorkspaceView } from './types/agent';
import { processAgentTurn } from './services/agentEngine';
import { WorkspaceViews } from './components/WorkspaceViews';
import { Menu, MessageSquare } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<WorkspaceView>('chat');
  const [candidate, setCandidate] = useState<CandidateProfile>(DEFAULT_CANDIDATE);
  const [selectedModelId, setSelectedModelId] = useState<string>(DEFAULT_MODEL_ID);
  const [ollamaEndpoint, setOllamaEndpoint] = useState<string>('http://localhost:11434');
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  const selectedModel = AI_MODELS.find((m) => m.id === selectedModelId) || AI_MODELS[0];

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      title: 'New Session',
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleTimeString(),
      messages: []
    }
  ]);
  const [activeConversationId, setActiveConversationId] = useState<string>('conv-1');
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isKnowledgeModalOpen, setIsKnowledgeModalOpen] = useState<boolean>(false);

  // Keyboard shortcut listener: Cmd+K / Ctrl+K opens Universal Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Active conversation
  const currentConversation =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  // Starred / all generated artifacts across conversations
  const allArtifacts = conversations.flatMap((c) =>
    c.messages.flatMap((m) => m.artifacts || [])
  );

  const handleSendMessage = async (userText: string, attachments: AttachedFile[]) => {
    if (!userText.trim() && attachments.length === 0) return;

    let displayContent = userText;
    if (attachments.length > 0) {
      const fileBadge = attachments.map((a) => `📎 ${a.name} (${a.size})`).join(', ');
      displayContent = userText ? `${userText}\n\n[Attached: ${fileBadge}]` : `[Attached: ${fileBadge}]`;
    }

    const userMessage: Message = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: displayContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let promptWithAttachments = userText;
    if (attachments.length > 0) {
      const fileDetails = attachments
        .map((a) => `File: ${a.name} (${a.size})\nContent snippet:\n${a.content ? a.content.slice(0, 2000) : ''}`)
        .join('\n\n');
      promptWithAttachments = userText
        ? `${userText}\n\n[User uploaded file(s) from local device]:\n${fileDetails}`
        : `[User uploaded file(s) from local device]:\n${fileDetails}\nPlease analyze and review this resume/document.`;
    }

    // Update conversation with user message
    const updatedMessages = [...currentConversation.messages, userMessage];
    const updatedTitle =
      currentConversation.messages.length === 0 && userText
        ? userText.slice(0, 32) + '...'
        : currentConversation.messages.length === 0 && attachments.length > 0
        ? attachments[0].name.slice(0, 32)
        : currentConversation.title;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === currentConversation.id
          ? { ...c, title: updatedTitle, messages: updatedMessages, updatedAt: new Date().toLocaleTimeString() }
          : c
      )
    );

    setIsGenerating(true);

    try {
      // Execute intelligent reasoning with chosen model like Claude/ChatGPT
      const result = await processAgentTurn(
        promptWithAttachments,
        candidate,
        selectedModel.id,
        ollamaEndpoint,
        currentConversation.messages
      );

      const assistantMessage: Message = {
        id: 'msg-' + (Date.now() + 1),
        role: 'assistant',
        content: result.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        thinking: result.thinking,
        isThinkingExpanded: false,
        toolsUsed: result.toolsUsed,
        artifacts: result.artifacts,
        modelUsed: result.modelUsed
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentConversation.id
            ? { ...c, messages: [...updatedMessages, assistantMessage] }
            : c
        )
      );

      // If an artifact was generated, automatically open it in the split-panel
      if (result.artifacts.length > 0) {
        setActiveArtifact(result.artifacts[0]);
      }
    } catch (err) {
      const errorMessage: Message = {
        id: 'msg-' + (Date.now() + 1),
        role: 'assistant',
        content: 'I encountered an error processing your query. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentConversation.id
            ? { ...c, messages: [...updatedMessages, errorMessage] }
            : c
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewConversation = () => {
    const nextNum = conversations.length + 1;
    const newConv: Conversation = {
      id: 'conv-' + Date.now(),
      title: conversations.length === 0 ? 'New Session' : `New Session ${nextNum}`,
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleTimeString(),
      messages: []
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setActiveArtifact(null);
  };

  const handleDeleteConversation = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setConversations((prev) => {
      const remaining = prev.filter((c) => c.id !== id);
      if (remaining.length === 0) {
        // If all conversations are deleted, create a clean fresh session
        const freshId = 'conv-' + Date.now();
        const freshConv: Conversation = {
          id: freshId,
          title: 'New Session',
          createdAt: new Date().toLocaleDateString(),
          updatedAt: new Date().toLocaleTimeString(),
          messages: []
        };
        setActiveConversationId(freshId);
        setActiveArtifact(null);
        return [freshConv];
      }
      if (activeConversationId === id) {
        setActiveConversationId(remaining[0].id);
        setActiveArtifact(null);
      }
      return remaining;
    });
  };

  const handleUpdateArtifact = (updatedArtifact: Artifact) => {
    setActiveArtifact(updatedArtifact);
    setConversations((prev) =>
      prev.map((c) => ({
        ...c,
        messages: c.messages.map((m) => ({
          ...m,
          artifacts: m.artifacts?.map((art) => (art.id === updatedArtifact.id ? updatedArtifact : art))
        }))
      }))
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100 antialiased selection:bg-indigo-500/30">
      {/* Left Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={(id) => {
          setActiveConversationId(id);
          setCurrentView('chat');
          setIsSidebarOpen(false);
        }}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        candidate={candidate}
        starredArtifacts={allArtifacts}
        onOpenArtifact={(art) => {
          setActiveArtifact(art);
          setCurrentView('chat');
        }}
        onOpenKnowledge={() => setIsKnowledgeModalOpen(true)}
        selectedModel={selectedModel}
        onOpenModelSelector={() => setIsModelSelectorOpen(true)}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
      />

      {/* Main Workspace (Split View: Chat + Artifact Panel OR Workspace Views) */}
      <div className="flex-1 flex overflow-hidden md:ml-64 lg:ml-72 transition-all">
        {currentView === 'chat' ? (
          <>
            {/* Left Column: Chat Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <ChatView
                messages={currentConversation.messages}
                candidate={candidate}
                isGenerating={isGenerating}
                onSelectPromptStarter={(prompt) => handleSendMessage(prompt, [])}
                onOpenArtifact={(art) => setActiveArtifact(art)}
                activeArtifact={activeArtifact}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                conversationTitle={currentConversation.title}
                onOpenSearch={() => setIsSearchModalOpen(true)}
                onNewSession={handleNewConversation}
                onDeleteSession={() => handleDeleteConversation(activeConversationId)}
              />

              <PromptInput
                onSendMessage={handleSendMessage}
                isGenerating={isGenerating}
                onStopGenerating={() => setIsGenerating(false)}
                selectedModel={selectedModel}
                onOpenModelSelector={() => setIsModelSelectorOpen(true)}
              />
            </div>

            {/* Right Column: Split-Screen Artifact Panel (When Active) */}
            {activeArtifact && (
              <ArtifactPanel
                artifact={activeArtifact}
                onClose={() => setActiveArtifact(null)}
                onUpdateArtifact={handleUpdateArtifact}
              />
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Top Bar for Workspace Views */}
            <header className="h-14 px-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/80 backdrop-blur-sm z-20">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSidebarOpen((prev) => !prev)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors md:hidden"
                  aria-label="Toggle Sidebar"
                >
                  <Menu className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <span className="text-slate-400">Workspace /</span>
                  <span className="capitalize text-indigo-400 font-mono">
                    {currentView.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('chat')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Return to AI Chat</span>
                </button>
              </div>
            </header>

            <WorkspaceViews
              currentView={currentView}
              onNavigateToChat={(prompt) => {
                setCurrentView('chat');
                if (prompt) {
                  handleSendMessage(prompt, []);
                }
              }}
              candidate={candidate}
              selectedModel={selectedModel}
              onOpenModelSelector={() => setIsModelSelectorOpen(true)}
            />
          </div>
        )}
      </div>

      {/* Candidate Knowledge Base Modal */}
      <ProjectKnowledgeModal
        isOpen={isKnowledgeModalOpen}
        onClose={() => setIsKnowledgeModalOpen(false)}
        candidate={candidate}
        onSaveCandidate={(updated) => setCandidate(updated)}
      />

      {/* Model Selector Hub Modal */}
      <ModelSelectorModal
        isOpen={isModelSelectorOpen}
        onClose={() => setIsModelSelectorOpen(false)}
        selectedModelId={selectedModelId}
        onSelectModel={(model) => setSelectedModelId(model.id)}
        ollamaEndpoint={ollamaEndpoint}
        onChangeOllamaEndpoint={setOllamaEndpoint}
      />

      {/* Universal Search & Knowledge Modal */}
      <UniversalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onExecuteSearch={(query) => handleSendMessage(query, [])}
      />
    </div>
  );
}
