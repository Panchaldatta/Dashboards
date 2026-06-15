import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Code, Sparkles, AlertCircle } from 'lucide-react';
import { getAISuggestion } from '../utils/mockDataEngine';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  code?: string;
  time: string;
}

export const AIDashboard: React.FC = () => {
  // Chat States
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'Hello! I am your WowDash AI Assistant. How can I help you optimize your codebase or generate new designs today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Code Generator States
  const [sourceCode, setSourceCode] = useState(`function findDuplicates(items) {
  let dupes = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (items[i] === items[j] && !dupes.includes(items[i])) {
        dupes.push(items[i]);
      }
    }
  }
  return dupes;
}`);
  const [optimizedCode, setOptimizedCode] = useState('');
  const [codeReview, setCodeReview] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleQuickPromptClick = async (prompt: string) => {
    if (chatLoading) return;
    setInputMessage(prompt);
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages(prev => [...prev, { sender: 'user', text: prompt, time: timeString }]);
    setChatLoading(true);

    try {
      const response = await getAISuggestion(prompt, 'chat');
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: response.message, 
        time: response.timestamp || timeString 
      }]);
      setInputMessage('');
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Failed to process AI query.', time: timeString }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setInputMessage('');
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages(prev => [...prev, { sender: 'user', text: userMsg, time: timeString }]);
    setChatLoading(true);

    try {
      const response = await getAISuggestion(userMsg, 'chat');
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: response.message, 
        time: response.timestamp || timeString 
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Failed to process AI query.', time: timeString }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleOptimizeCode = async () => {
    setCodeLoading(true);
    setOptimizedCode('');
    setCodeReview('');

    try {
      const response = await getAISuggestion(sourceCode, 'code');
      setCodeReview(response.message);
      setOptimizedCode(response.code);
    } catch (err) {
      console.error(err);
      setCodeReview('Failed to process optimization.');
    } finally {
      setCodeLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
          <Sparkles className="text-primary-600 dark:text-primary-400 animate-pulse" />
          WowDash AI Assistant
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Leverage on-device artificial intelligence mock endpoints to boost productivity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section 1: Chat Assistant */}
        <div className="flex flex-col h-[550px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex items-center gap-3">
            <div className="p-2 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 rounded-xl">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">AI Copilot</h3>
              <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                Online
              </p>
            </div>
          </div>

          {/* Messages Log */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg, idx) => {
              const isBot = msg.sender === 'bot';
              return (
                <div key={idx} className={`flex gap-3 max-w-[85%] ${isBot ? '' : 'ml-auto flex-row-reverse'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                    isBot ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}>
                    {isBot ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className="space-y-1">
                    <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      isBot 
                        ? 'bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 border border-zinc-100 dark:border-zinc-800/30' 
                        : 'bg-primary-600 text-white'
                    }`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-zinc-400 block px-1">{msg.time}</span>
                  </div>
                </div>
              );
            })}
            
            {chatLoading && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center animate-pulse">
                  <Bot size={16} />
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-950 text-zinc-500 rounded-2xl flex items-center gap-1 shadow-sm border border-zinc-100 dark:border-zinc-800/30">
                  <span className="w-2 h-2 rounded-full bg-primary-600 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-primary-600 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-primary-600 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-6 py-2.5 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/20 dark:bg-zinc-950/10 flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Try:</span>
            {['Optimize loops', 'Explain dark mode', 'Generate mock SQL'].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleQuickPromptClick(prompt)}
                disabled={chatLoading}
                className="text-[11px] px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-primary-500 dark:hover:border-primary-500 text-zinc-600 dark:text-zinc-350 transition-all font-medium disabled:opacity-50 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Form Control */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-zinc-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-xl shadow-md shadow-primary-600/10 hover:bg-primary-700 transition-colors shrink-0 disabled:opacity-55"
            >
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* Section 2: Code Optimizer */}
        <div className="flex flex-col h-[550px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 rounded-xl">
              <Code size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">AI Code Generator</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Optimize and refactor slow algorithms instantly.</p>
            </div>
          </div>

          <div className="flex-1 grid grid-rows-2 gap-4 min-h-0">
            {/* Input Code */}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-400 mb-1.5">Source Code</span>
              <textarea
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                className="flex-1 p-3 bg-zinc-950 text-zinc-200 font-mono text-xs rounded-xl border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none leading-relaxed"
              />
            </div>

            {/* Output suggestions */}
            <div className="flex flex-col min-h-0">
              <span className="text-xs font-semibold text-zinc-400 mb-1.5">AI Suggestion & Output</span>
              <div className="flex-1 p-4 bg-zinc-950 text-zinc-200 rounded-xl border border-zinc-800 overflow-y-auto font-mono text-xs leading-relaxed space-y-3">
                {codeLoading ? (
                  <div className="flex items-center gap-2 text-zinc-500 py-4">
                    <Sparkles className="animate-spin text-primary-400" size={16} />
                    <span>Analyzing optimization vectors...</span>
                  </div>
                ) : optimizedCode || codeReview ? (
                  <>
                    <p className="text-zinc-400 text-xs font-sans leading-relaxed">{codeReview}</p>
                    {optimizedCode && (
                      <pre className="text-emerald-400 bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/30 overflow-x-auto">
                        <code>{optimizedCode}</code>
                      </pre>
                    )}
                  </>
                ) : (
                  <div className="text-zinc-500 py-8 text-center flex flex-col items-center">
                    <AlertCircle size={24} className="mb-2 opacity-50" />
                    <p className="font-sans">Click 'Optimize Code' to generate suggested improvements.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleOptimizeCode}
            disabled={codeLoading}
            className="w-full py-2.5 bg-primary-600 text-white rounded-xl shadow-md shadow-primary-600/10 hover:bg-primary-700 transition-all font-semibold text-sm disabled:opacity-55"
          >
            Optimize Code
          </button>
        </div>

      </div>
    </div>
  );
};
