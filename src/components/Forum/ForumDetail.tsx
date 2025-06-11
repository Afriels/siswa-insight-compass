
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle, User, Clock, Send } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface ForumTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
  created_by: string;
  profiles?: {
    full_name: string;
  };
}

interface ForumReply {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  profiles?: {
    full_name: string;
  };
}

export const ForumDetail = () => {
  const { id: topicId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchTopicDetail = async () => {
    if (!topicId) return;
    
    try {
      setLoading(true);
      
      // Fetch topic details
      const { data: topicData, error: topicError } = await supabase
        .from('forum_topics')
        .select(`
          *,
          profiles:created_by (full_name)
        `)
        .eq('id', topicId)
        .single();
        
      if (topicError) throw topicError;
      setTopic(topicData);
      
      // For now, we'll use a mock replies system since we don't have a replies table
      // In a real implementation, you would create a forum_replies table
      setReplies([]);
      
    } catch (error: any) {
      console.error("Error fetching topic detail:", error);
      toast({
        title: "Error",
        description: "Gagal memuat detail diskusi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopicDetail();
  }, [topicId]);

  const handleSubmitReply = async () => {
    if (!newReply.trim() || !user) return;
    
    try {
      setSubmitting(true);
      
      // For demo purposes, show a message that replies need a separate table
      toast({
        title: "Info",
        description: "Fitur reply forum akan segera tersedia. Saat ini forum hanya mendukung melihat topik diskusi.",
        duration: 5000,
      });
      
      setNewReply("");
      
    } catch (error: any) {
      console.error("Error submitting reply:", error);
      toast({
        title: "Error",
        description: "Gagal mengirim reply",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryBadge = (category: string) => {
    switch(category) {
      case 'academic':
        return <Badge className="bg-blue-500">Akademik</Badge>;
      case 'career':
        return <Badge className="bg-green-500">Karir</Badge>;
      case 'social':
        return <Badge className="bg-purple-500">Sosial</Badge>;
      case 'personal':
        return <Badge className="bg-orange-500">Personal</Badge>;
      default:
        return <Badge className="bg-gray-500">Umum</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-counseling-blue"></div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Topik diskusi tidak ditemukan</p>
        <Button onClick={() => navigate('/forum')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Forum
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => navigate('/forum')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali ke Forum
      </Button>

      {/* Topic Detail */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{topic.title}</CardTitle>
              {getCategoryBadge(topic.category)}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{topic.profiles?.full_name || 'Anonymous'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{format(new Date(topic.created_at), 'dd MMM yyyy HH:mm', { locale: id })}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-wrap">{topic.description}</p>
        </CardContent>
      </Card>

      {/* Replies Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Diskusi ({replies.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {replies.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Belum ada diskusi. Jadilah yang pertama untuk berdiskusi!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {replies.map((reply) => (
                <div key={reply.id} className="border-l-4 border-blue-200 pl-4 py-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{reply.profiles?.full_name || 'Anonymous'}</span>
                    <span>•</span>
                    <Clock className="h-4 w-4" />
                    <span>{format(new Date(reply.created_at), 'dd MMM yyyy HH:mm', { locale: id })}</span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Reply Form */}
          {user && (
            <div className="border-t pt-4 mt-6">
              <div className="space-y-4">
                <Textarea
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="Tulis komentar atau pertanyaan Anda..."
                  rows={4}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSubmitReply}
                    disabled={!newReply.trim() || submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Kirim Komentar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
