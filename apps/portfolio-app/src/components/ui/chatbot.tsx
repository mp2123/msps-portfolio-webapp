'use client';

import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User, Settings, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<'google' | 'openai'>('google');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('insurance_study_api_key');
    const savedProvider = localStorage.getItem('insurance_study_provider');
    if (savedKey) setApiKey(savedKey);
    if (savedProvider) setProvider(savedProvider as any);
  }, []);

  const saveSettings = (key: string, prov: 'google' | 'openai') => {
    localStorage.setItem('insurance_study_api_key', key);
    localStorage.setItem('insurance_study_provider', prov);
    setShowSettings(false);
  };

  const { messages, sendMessage, status } = useChat();

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ 
      text: input,
    }, {
      body: {
        apiKey,
        provider,
      }
    });
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-16 w-16 rounded-full shadow-2xl bg-primary text-primary-foreground transition-all duration-300"
              size="icon"
            >
              <MessageCircle className="h-8 w-8" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <Card className="flex h-[600px] w-[400px] flex-col overflow-hidden border-border/40 bg-background/80 backdrop-blur-xl shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-muted/50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold tracking-tight">AI Study Guide</CardTitle>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                      {provider === 'google' ? 'Gemini AI' : 'OpenAI'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)} className="h-9 w-9 rounded-full">
                    <Settings className={cn("h-5 w-5 transition-transform", showSettings && "rotate-90")} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-9 w-9 rounded-full hover:bg-background/80">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-hidden p-0 relative">
                {/* Settings Overlay */}
                <AnimatePresence>
                  {showSettings && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute inset-0 z-20 bg-background/95 backdrop-blur-md p-6"
                    >
                      <h3 className="text-lg font-bold mb-4">Chat Settings</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground uppercase block mb-2">Model Provider</label>
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              variant={provider === 'google' ? 'default' : 'outline'} 
                              size="sm" 
                              onClick={() => setProvider('google')}
                              className="w-full"
                            >
                              Gemini (Free)
                            </Button>
                            <Button 
                              variant={provider === 'openai' ? 'default' : 'outline'} 
                              size="sm" 
                              onClick={() => setProvider('openai')}
                              className="w-full"
                            >
                              OpenAI
                            </Button>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-muted-foreground uppercase block mb-2">API Key (Optional)</label>
                          <Input 
                            type="password" 
                            placeholder="Paste your key here..." 
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="bg-muted/50"
                          />
                          <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                            Your key is stored locally in your browser and never sent to our database.
                          </p>
                        </div>

                        <div className="pt-2">
                          <a 
                            href={provider === 'google' ? "https://aistudio.google.com/app/apikey" : "https://platform.openai.com/api-keys"} 
                            target="_blank"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            Get a free {provider === 'google' ? 'Gemini' : 'OpenAI'} API Key <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>

                        <Button className="w-full mt-4" onClick={() => saveSettings(apiKey, provider)}>
                          Save Settings
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <ScrollArea className="h-full px-5 py-6">

                  {messages.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex h-[400px] flex-col items-center justify-center text-center px-10"
                    >
                      <Bot className="h-12 w-12 text-muted-foreground/30 mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Hi! I'm your Arizona 2026 Insurance Assistant. How can I help you study today?
                      </p>
                    </motion.div>
                  )}
                  <div className="space-y-6">
                    {messages.map((m) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          "flex items-start gap-3 text-sm",
                          m.role === 'user' ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        <div className={cn(
                          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full shadow-sm",
                          m.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted border border-border/50"
                        )}>
                          {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div className={cn(
                          "rounded-2xl px-4 py-2.5 shadow-sm ring-1 ring-inset transition-all",
                          m.role === 'user' 
                            ? "bg-primary text-primary-foreground ring-primary/10" 
                            : "bg-muted/30 backdrop-blur-sm ring-border/50"
                        )}>
                          {m.parts.map((part, i) => {
                            if (part.type === 'text') {
                              return <div key={i} className="leading-relaxed">{part.text}</div>;
                            }
                            return null;
                          })}
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground italic">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted border border-border/50">
                          <Bot className="h-4 w-4 animate-pulse" />
                        </div>
                        Thinking...
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="border-t border-border/40 bg-muted/20 p-4">
                <form onSubmit={handleSubmit} className="flex w-full items-center gap-3">
                  <Input
                    placeholder="Ask about MIB, Term, Universal Life..."
                    value={input}
                    onChange={handleInputChange}
                    className="flex-1 rounded-full border-border/50 bg-background/50 focus-visible:ring-primary/20"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={isLoading || !input.trim()}
                    className="rounded-full h-10 w-10 shrink-0 shadow-lg shadow-primary/20"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
