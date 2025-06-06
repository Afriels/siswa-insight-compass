
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";

interface CreateTopicDialogProps {
  onTopicCreated?: () => void;
}

export const CreateTopicDialog = ({ onTopicCreated }: CreateTopicDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general"
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      // Create a simple forum topics table entry
      const { error } = await supabase
        .from('forum_topics')
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          created_by: user.id,
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Topik berhasil dibuat",
        description: "Topik diskusi baru telah ditambahkan ke forum",
      });

      setFormData({ title: "", description: "", category: "general" });
      setIsOpen(false);
      onTopicCreated?.();
    } catch (error: any) {
      console.error("Error creating topic:", error);
      toast({
        title: "Gagal membuat topik",
        description: "Fitur forum akan segera tersedia. Silakan coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-counseling-blue hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 animate-pulse">
          <Plus className="h-4 w-4 mr-2" />
          Buat Topik Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="animate-slideInDown">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Buat Topik Diskusi Baru
          </DialogTitle>
          <DialogDescription>
            Mulai diskusi baru di forum BK Connect
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 animate-slideInUp">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Topik</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Masukkan judul topik diskusi"
              required
              className="transition-all duration-200 hover:border-blue-300 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Umum</SelectItem>
                <SelectItem value="academic">Akademik</SelectItem>
                <SelectItem value="social">Sosial</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="career">Karir</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Jelaskan topik yang ingin didiskusikan..."
              className="min-h-[100px] transition-all duration-200 hover:border-blue-300 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-counseling-blue hover:bg-blue-600 transition-all duration-200"
            >
              {isLoading ? "Membuat..." : "Buat Topik"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
