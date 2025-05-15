
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type Consultation = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'ongoing' | 'resolved';
  created_at: string;
  student: {
    full_name: string;
  } | null;
}

type Message = {
  id: string;
  message: string;
  created_at: string;
  sender: {
    full_name: string;
    role: string;
  } | null;
}

export function ConsultationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsultation = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Check user authentication
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Akses Ditolak",
            description: "Anda harus login untuk melihat konsultasi",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }
        
        // Get user role
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
          
        setUserRole(profileData?.role || null);
        
        // Fetch consultation data
        const { data: consultationData, error: consultationError } = await supabase
          .from('consultations')
          .select('id, title, description, status, created_at, student:profiles!consultations_student_id_fkey(full_name)')
          .eq('id', id)
          .single();
          
        if (consultationError) throw consultationError;
        
        // Fetch messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('consultation_messages')
          .select('id, message, created_at, sender:profiles!consultation_messages_sender_id_fkey(full_name, role)')
          .eq('consultation_id', id)
          .order('created_at', { ascending: true });
          
        if (messagesError) throw messagesError;
        
        // Cast status to the correct type and set consultation
        const typedConsultation = {
          ...consultationData,
          status: consultationData.status as 'pending' | 'ongoing' | 'resolved'
        };
        
        setConsultation(typedConsultation);
        
        // Handle potentially missing properties in messagesData
        const processedMessages = messagesData?.map(msg => {
          // If sender is an error object or missing properties, provide default values
          if (!msg.sender || typeof msg.sender === 'string' || 'error' in msg.sender) {
            return {
              ...msg,
              sender: {
                full_name: 'Unknown',
                role: 'unknown'
              }
            };
          }
          return msg;
        }) || [];
        
        setMessages(processedMessages);
        
        // If status is pending and user is counselor, update to ongoing
        if (consultationData.status === 'pending' && (profileData?.role === 'counselor' || profileData?.role === 'admin')) {
          await supabase
            .from('consultations')
            .update({ status: 'ongoing' })
            .eq('id', id);
            
          typedConsultation.status = 'ongoing';
          setConsultation(typedConsultation);
        }
        
      } catch (error: any) {
        console.error("Error fetching consultation:", error);
        toast({
          title: "Gagal mengambil data",
          description: error.message || "Terjadi kesalahan saat mengambil data konsultasi",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchConsultation();
  }, [id, toast, navigate]);
  
  const sendMessage = async () => {
    if (!newMessage.trim() || !id) return;
    
    try {
      setSending(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Anda harus login untuk mengirim pesan");
      
      // Insert message
      const { error } = await supabase
        .from('consultation_messages')
        .insert([
          {
            consultation_id: id,
            sender_id: user.id,
            message: newMessage.trim(),
          },
        ]);
        
      if (error) throw error;
      
      // Update consultation status if it's resolved by counselor
      if (userRole === 'counselor' || userRole === 'admin') {
        if (newMessage.toLowerCase().includes('[resolved]') || newMessage.toLowerCase().includes('[selesai]')) {
          await supabase
            .from('consultations')
            .update({ status: 'resolved' })
            .eq('id', id);
            
          if (consultation) {
            setConsultation({...consultation, status: 'resolved'});
          }
          
          toast({
            title: "Konsultasi ditandai selesai",
            description: "Status konsultasi telah diubah menjadi selesai",
          });
        }
      }
      
      // Clear the message input
      setNewMessage("");
      
      // Refresh messages
      const { data: messagesData } = await supabase
        .from('consultation_messages')
        .select('id, message, created_at, sender:profiles!consultation_messages_sender_id_fkey(full_name, role)')
        .eq('consultation_id', id)
        .order('created_at', { ascending: true });
        
      // Process messages to ensure they match the expected type
      const processedMessages = messagesData?.map(msg => {
        if (!msg.sender || typeof msg.sender === 'string' || 'error' in msg.sender) {
          return {
            ...msg,
            sender: {
              full_name: 'Unknown',
              role: 'unknown'
            }
          };
        }
        return msg;
      }) || [];
      
      setMessages(processedMessages);
      
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Gagal mengirim pesan",
        description: error.message || "Terjadi kesalahan saat mengirim pesan",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Menunggu</Badge>;
      case 'ongoing':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Berlangsung</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500 hover:bg-green-600">Selesai</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-counseling-blue"></div>
      </div>
    );
  }
  
  if (!consultation) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Konsultasi tidak ditemukan atau Anda tidak memiliki akses untuk melihatnya.
      </div>
    );
  }
  
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold">{consultation.title}</CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              Oleh: {consultation.student?.full_name || 'Unknown'} - 
              {format(new Date(consultation.created_at), ' dd/MM/yyyy HH:mm')}
            </div>
          </div>
          <div>{getStatusBadge(consultation.status)}</div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-muted p-4 rounded-md">
          <h3 className="font-medium mb-2">Deskripsi:</h3>
          <p className="whitespace-pre-line">{consultation.description}</p>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Riwayat Pesan:</h3>
          
          {messages.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              Belum ada pesan dalam konsultasi ini
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                const isAdmin = message.sender?.role === 'admin' || message.sender?.role === 'counselor';
                
                return (
                  <div 
                    key={message.id} 
                    className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-lg ${
                        isAdmin ? 'bg-muted text-foreground' : 'bg-counseling-blue text-white'
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">
                        {message.sender?.full_name || 'Unknown'}
                        <span className="text-xs opacity-70 ml-2">
                          {format(new Date(message.created_at), 'HH:mm')}
                        </span>
                      </div>
                      <div className="whitespace-pre-line">{message.message}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        {consultation.status !== 'resolved' ? (
          <div className="w-full space-y-2">
            <Textarea
              placeholder="Ketik pesan Anda di sini..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={4}
            />
            <div className="flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                {userRole === 'counselor' || userRole === 'admin' ? 
                  "Tip: Tambahkan [Selesai] di pesan untuk menandai konsultasi sebagai selesai." : ""}
              </div>
              <Button 
                onClick={sendMessage} 
                className="bg-counseling-blue hover:bg-blue-600"
                disabled={sending || !newMessage.trim()}
              >
                {sending ? 'Mengirim...' : 'Kirim Pesan'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full text-center p-4 text-muted-foreground">
            Konsultasi ini telah ditutup dan ditandai sebagai selesai.
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
