
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, Bot, User, Loader2, Shield, Search, Database, Settings } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  searchResults?: any[];
  dbOperations?: string[];
}

interface UserProfile {
  role: string;
  full_name: string;
}

export const EnhancedAIAssistant = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Halo! Saya adalah asisten AI Enhanced BK Connect. Saya memiliki akses ke database dan internet untuk memberikan bantuan yang lebih komprehensif. Sebagai administrator, Anda memiliki akses penuh ke semua fitur. Ada yang bisa saya bantu?',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [adminMode, setAdminMode] = useState(false);
  const [internetSearch, setInternetSearch] = useState(true);
  const [dbAccess, setDbAccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        setUserProfile(data);
        // Enable admin features for admin and counselor roles
        if (data.role === 'admin' || data.role === 'counselor') {
          setAdminMode(true);
          setDbAccess(true);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call enhanced AI function
      const response = await fetch('/api/enhanced-ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          adminMode,
          internetSearch,
          dbAccess,
          userRole: userProfile?.role,
          userId: user?.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
        searchResults: data.searchResults,
        dbOperations: data.dbOperations
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI Error:', error);
      
      // Fallback to local AI
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getEnhancedAIResponse(input),
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackResponse]);
      
      toast({
        title: "Menggunakan Mode Offline",
        description: "Terhubung ke AI lokal karena server tidak tersedia",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getEnhancedAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('admin') || input.includes('administrator')) {
      if (adminMode) {
        return `Sebagai administrator, Anda memiliki akses penuh ke:
        
🔧 **Manajemen Database**: Saya dapat membantu membuat, mengubah, atau menghapus data
🌐 **Pencarian Internet**: Saya dapat mencari informasi terkini dari internet
📊 **Analisis Data**: Saya dapat menganalisis pola dan tren dari data siswa
⚙️ **Konfigurasi Sistem**: Saya dapat membantu mengatur parameter aplikasi
🔐 **Manajemen User**: Saya dapat membantu mengelola akun pengguna

Silakan berikan perintah atau pertanyaan yang lebih spesifik.`;
      } else {
        return 'Maaf, fitur administrator hanya tersedia untuk pengguna dengan role admin atau counselor.';
      }
    }
    
    if (input.includes('cari') || input.includes('search')) {
      return `🔍 **Mode Pencarian Aktif**
      
Saya dapat membantu mencari informasi dari:
- Database siswa dan records konseling
- Internet untuk best practices dan research terbaru
- Dokumentasi dan panduan BK
- Artikel dan jurnal pendidikan

Apa yang ingin Anda cari?`;
    }
    
    if (input.includes('database') || input.includes('data')) {
      if (dbAccess) {
        return `💾 **Akses Database Tersedia**
        
Saya dapat membantu dengan:
- Query data siswa dan perilaku
- Membuat laporan analitik
- Update records konseling
- Import/export data
- Backup dan restore

Operasi apa yang ingin dilakukan?`;
      } else {
        return 'Akses database terbatas. Hubungi administrator untuk akses penuh.';
      }
    }
    
    return `Saya adalah Enhanced AI Assistant dengan kemampuan:

🤖 **AI Cerdas**: Pemahaman konteks yang mendalam
🌐 **Internet Search**: Pencarian informasi real-time
💾 **Database Access**: ${dbAccess ? 'Tersedia' : 'Terbatas'}
🛡️ **Admin Mode**: ${adminMode ? 'Aktif' : 'Tidak Aktif'}

Bagaimana saya bisa membantu Anda hari ini?`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[700px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Enhanced AI BK Connect
          {adminMode && <Badge variant="destructive" className="ml-2"><Shield className="h-3 w-3 mr-1" />Admin</Badge>}
        </CardTitle>
        
        {(userProfile?.role === 'admin' || userProfile?.role === 'counselor') && (
          <div className="flex gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="internet-search"
                checked={internetSearch}
                onCheckedChange={setInternetSearch}
              />
              <Label htmlFor="internet-search" className="flex items-center gap-1">
                <Search className="h-3 w-3" />
                Internet Search
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="db-access"
                checked={dbAccess}
                onCheckedChange={setDbAccess}
              />
              <Label htmlFor="db-access" className="flex items-center gap-1">
                <Database className="h-3 w-3" />
                Database Access
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="admin-mode"
                checked={adminMode}
                onCheckedChange={setAdminMode}
              />
              <Label htmlFor="admin-mode" className="flex items-center gap-1">
                <Settings className="h-3 w-3" />
                Admin Mode
              </Label>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex flex-col flex-1 p-4">
        <ScrollArea className="flex-1 mb-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className={`flex gap-2 max-w-[85%] ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    
                    {message.searchResults && message.searchResults.length > 0 && (
                      <div className="mt-2 p-2 bg-muted rounded text-xs">
                        <div className="font-semibold mb-1">🔍 Search Results:</div>
                        {message.searchResults.slice(0, 3).map((result, idx) => (
                          <div key={idx} className="mb-1">• {result.title}</div>
                        ))}
                      </div>
                    )}
                    
                    {message.dbOperations && message.dbOperations.length > 0 && (
                      <div className="mt-2 p-2 bg-muted rounded text-xs">
                        <div className="font-semibold mb-1">💾 Database Operations:</div>
                        {message.dbOperations.map((op, idx) => (
                          <div key={idx} className="mb-1">• {op}</div>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="rounded-lg p-3 bg-secondary text-secondary-foreground">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Memproses dengan AI Enhanced...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={adminMode ? "Berikan perintah admin atau pertanyaan..." : "Tanyakan sesuatu tentang bimbingan konseling..."}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
