export type MessageRole = 'user' | 'assistant' | 'system';

export type ArtifactType = 'document' | 'code' | 'ats_analysis' | 'email' | 'interview_prep';

export interface Artifact {
  id: string;
  title: string;
  type: ArtifactType;
  content: string;
  language?: string;
  version: number;
  history?: { version: number; content: string; timestamp: string }[];
  createdAt: string;
  metadata?: {
    score?: number;
    targetRole?: string;
    company?: string;
    wordCount?: number;
  };
}

export interface ToolExecution {
  id: string;
  name: string;
  displayName: string;
  status: 'running' | 'completed' | 'failed';
  input: string;
  output?: string;
  durationMs?: number;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  thinking?: string;
  isThinkingExpanded?: boolean;
  toolsUsed?: ToolExecution[];
  artifacts?: Artifact[];
  isStreaming?: boolean;
  modelUsed?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  projectId?: string;
}

export interface AttachedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  content: string;
}

export interface CandidateProfile {
  name: string;
  title: string;
  experienceYears: number;
  email: string;
  phone: string;
  location: string;
  currentCompany: string;
  coreSkills: string[];
  cloudPlatforms: string[];
  devopsTools: string[];
  targetRoles: string[];
}

export type ModelCategory = 'open_source' | 'claude' | 'chatgpt' | 'local_ollama' | 'cloud';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  category: ModelCategory;
  description: string;
  contextWindow: string;
  strengths: string[];
  badge: string;
  isFree: boolean;
  isOpenWeights: boolean;
  defaultEndpoint?: string;
}

export interface AgentSettings {
  selectedModelId: string;
  thinkingDepth: 'standard' | 'deep' | 'exhaustive';
  persona: 'executive_consultant' | 'technical_interviewer' | 'ats_auditor';
  ollamaEndpoint: string;
  webSearchEnabled: boolean;
  autoArtifacts: boolean;
  voiceEnabled: boolean;
}

export type WorkspaceView =
  | 'chat'
  | 'agents'
  | 'workflows'
  | 'research'
  | 'files'
  | 'coding'
  | 'terminal'
  | 'devops'
  | 'git'
  | 'web_auto'
  | 'knowledge'
  | 'activity'
  | 'scheduler'
  | 'mcp'
  | 'analytics'
  | 'settings'
  | 'docs';
