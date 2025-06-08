
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const AIAssistant = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Halo! Saya adalah asisten AI untuk BK Connect. Saya dapat membantu Anda dengan pertanyaan seputar bimbingan konseling, analisis perilaku siswa, dan penggunaan aplikasi ini. Ada yang bisa saya bantu?',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      // Simulate AI response (replace with actual AI integration)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(input),
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mendapatkan respons dari AI",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('sosiogram')) {
      return 'Sosiogram adalah alat untuk menganalisis hubungan sosial antar siswa dalam kelas. Anda dapat menggunakan fitur Sosiogram di menu untuk melihat pola interaksi siswa dan mengidentifikasi siswa yang mungkin memerlukan perhatian khusus.';
    }
    
    if (input.includes('perilaku')) {
      return 'Untuk mencatat perilaku siswa, gunakan menu "Pendataan Perilaku". Anda dapat mencatat perilaku positif dan negatif, serta melihat riwayat perilaku untuk analisis perkembangan siswa.';
    }
    
    if (input.includes('konsultasi')) {
      return 'Fitur Konsultasi memungkinkan Anda untuk menjadwalkan dan mencatat sesi konseling dengan siswa. Anda dapat membuat janji temu baru, melihat riwayat konsultasi, dan mencatat hasil sesi.';
    }
    
    if (input.includes('tes psikologi')) {
      return 'Tes Psikologi online dapat membantu mengidentifikasi kepribadian, minat, dan potensi siswa. Hasil tes dapat digunakan sebagai dasar untuk memberikan bimbingan yang lebih tepat sasaran.';
    }
    
    return 'Terima kasih atas pertanyaannya. Saya dapat membantu dengan berbagai topik terkait bimbingan konseling seperti sosiogram, pendataan perilaku, konsultasi, tes psikologi, dan penggunaan fitur-fitur di BK Connect. Silakan tanyakan hal yang lebih spesifik agar saya dapat memberikan jawaban yang lebih detail.';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-counseling-blue" />
          Asisten AI BK Connect
        </CardTitle>
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
                <div className={`flex gap-2 max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-counseling-blue text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-counseling-blue text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="rounded-lg p-3 bg-gray-100 text-gray-800">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Sedang mengetik...</span>
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
            placeholder="Tanyakan sesuatu tentang bimbingan konseling..."
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-counseling-blue hover:bg-blue-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
