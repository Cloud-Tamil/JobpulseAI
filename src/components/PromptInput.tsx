import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Square,
  Mic,
  MicOff,
  Paperclip,
  Sparkles,
  ChevronDown,
  X
} from 'lucide-react';
import { AttachedFile, AIModel } from '../types/agent';

interface PromptInputProps {
  onSendMessage: (message: string, attachments: AttachedFile[]) => void;
  isGenerating: boolean;
  onStopGenerating?: () => void;
  selectedModel: AIModel;
  onOpenModelSelector: () => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  onSendMessage,
  isGenerating,
  onStopGenerating,
  selectedModel,
  onOpenModelSelector
}) => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  // Web Speech API Voice Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      console.warn('Speech recognition is not supported in this browser environment.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if ((!input.trim() && attachments.length === 0) || isGenerating) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    onSendMessage(input.trim(), attachments);
    setInput('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const sizeStr =
        file.size < 1024
          ? `${file.size} B`
          : file.size < 1024 * 1024
          ? `${(file.size / 1024).toFixed(1)} KB`
          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

      const reader = new FileReader();
      reader.onload = () => {
        const textContent = typeof reader.result === 'string' ? reader.result : '';
        const newFile: AttachedFile = {
          id: 'file-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
          name: file.name,
          size: sizeStr,
          type: file.type || 'application/octet-stream',
          content: textContent || `Uploaded Document: ${file.name} (${sizeStr})`
        };
        setAttachments((prev) => [...prev, newFile]);
      };

      // Read file content
      reader.readAsText(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const getModelIcon = (id: string) => {
    if (id.includes('claude')) return '🟠';
    if (id.includes('gpt') || id.includes('o1') || id.includes('o3')) return '🟢';
    if (id.includes('deepseek')) return '🐋';
    if (id.includes('llama')) return '🦙';
    if (id.includes('qwen')) return '⚡';
    if (id.includes('mistral') || id.includes('codestral')) return '🌪️';
    if (id.includes('command')) return '🎯';
    if (id.includes('ollama')) return '🖥️';
    if (id.includes('phi')) return '🔬';
    if (id.includes('gemma')) return '💎';
    return '✨';
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      <div className="relative rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl focus-within:border-slate-700 transition-all">
        {/* Attachment chips */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-3 pt-3">
            {attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-slate-800 border border-slate-700 text-slate-300"
              >
                <Paperclip className="w-3 h-3 text-indigo-400" />
                <span className="font-medium text-[11px] truncate max-w-[200px]">{file.name}</span>
                <span className="text-[10px] text-slate-400">{file.size}</span>
                <button
                  onClick={() => removeAttachment(file.id)}
                  className="hover:text-white p-0.5"
                  aria-label="Remove attachment"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask JobPulseAI anything, search companies, tailor resumes, or run mock interviews..."
          rows={1}
          className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm md:text-base px-4 pt-3.5 pb-2 resize-none focus:outline-none max-h-48 leading-relaxed"
        />

        {/* Input Controls Bar */}
        <div className="flex items-center justify-between px-3 pb-3 pt-1">
          {/* Left actions */}
          <div className="flex items-center gap-1.5">
            {/* Hidden native file input for local system attachments */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.md,.json,.yaml,.yml,.csv"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload resume or document from your local system"
            />

            <button
              type="button"
              onClick={handleAttachClick}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer"
              title="Attach Resume or Documents from your device"
            >
              <Paperclip className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline text-xs">Attach</span>
            </button>

            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`p-1.5 rounded-lg transition-colors text-xs flex items-center gap-1 ${
                isListening
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title={isListening ? 'Stop Voice Recording' : 'Dictate with Voice'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span className="hidden sm:inline text-xs">
                {isListening ? 'Listening...' : 'Voice'}
              </span>
            </button>

            {/* Open Source / Multi-Model Hub Button */}
            <button
              type="button"
              onClick={onOpenModelSelector}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs group"
              title="Click to switch AI Model (Claude, ChatGPT, DeepSeek, Llama, Qwen, Mistral, Ollama)"
            >
              <span className="text-sm">{getModelIcon(selectedModel.id)}</span>
              <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-[200px]">
                {selectedModel.name}
              </span>
              {selectedModel.isOpenWeights && (
                <span className="hidden md:inline text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/20">
                  Open
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Right submit action */}
          <div className="flex items-center gap-2">
            {isGenerating ? (
              <button
                type="button"
                onClick={onStopGenerating}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center justify-center shadow-sm"
                title="Stop generation"
              >
                <Square className="w-4 h-4 fill-white" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!input.trim() && attachments.length === 0}
                className={`p-2 rounded-lg transition-colors flex items-center justify-center shadow-sm ${
                  input.trim() || attachments.length > 0
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                    : 'bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="text-center mt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
        <span>Powered by <strong>{selectedModel.name}</strong> ({selectedModel.badge})</span>
        <span>·</span>
        <button
          onClick={onOpenModelSelector}
          className="text-indigo-400 hover:underline cursor-pointer"
        >
          Switch Model (Claude, ChatGPT, Open Source & Ollama)
        </button>
      </div>
    </div>
  );
};
