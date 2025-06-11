
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ForumCard } from "./ForumCard";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

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

export const ForumList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const fetchTopics = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('forum_topics')
        .select(`
          *,
          profiles:created_by (full_name)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setTopics(data || []);
    } catch (error: any) {
      console.error("Error fetching forum topics:", error);
      toast({
        title: "Error",
        description: "Gagal memuat topik forum",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  // Filter topics based on search and category
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || topic.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleTopicClick = (topicId: string) => {
    navigate(`/forum/${topicId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-counseling-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cari topik diskusi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="academic">Akademik</SelectItem>
              <SelectItem value="career">Karir</SelectItem>
              <SelectItem value="social">Sosial</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="general">Umum</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Topics List */}
      {filteredTopics.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || categoryFilter !== "all" ? "Tidak ada topik yang sesuai" : "Belum ada topik diskusi"}
          </h3>
          <p className="text-gray-500">
            {searchTerm || categoryFilter !== "all" 
              ? "Coba ubah kata kunci pencarian atau filter kategori"
              : "Jadilah yang pertama untuk memulai diskusi"
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTopics.map((topic) => (
            <div 
              key={topic.id} 
              onClick={() => handleTopicClick(topic.id)}
              className="cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <ForumCard 
                title={topic.title}
                description={topic.description}
                category={topic.category}
                author={topic.profiles?.full_name || 'Anonymous'}
                createdAt={topic.created_at}
                repliesCount={0} // Will be implemented when replies table is created
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
