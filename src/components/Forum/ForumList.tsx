
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ForumCard } from "./ForumCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Search, Plus } from "lucide-react";

// Mock data for forum posts
const mockPosts = [
  {
    id: "1",
    title: "Tips Mengatasi Stres Belajar",
    content: "Bagaimana cara yang efektif untuk mengatasi stres saat menghadapi ujian? Mohon share pengalaman teman-teman...",
    author: "Siswa Kelas XI",
    category: "Akademik",
    created_at: "2024-01-15T10:30:00Z",
    replies_count: 12,
    views: 156
  },
  {
    id: "2",
    title: "Konsultasi Masalah Keluarga",
    content: "Saya sedang mengalami konflik dengan orang tua mengenai pilihan jurusan kuliah. Ada yang bisa memberikan saran?",
    author: "Ahmad R.",
    category: "Keluarga",
    created_at: "2024-01-14T15:45:00Z",
    replies_count: 8,
    views: 89
  },
  {
    id: "3",
    title: "Cara Meningkatkan Kepercayaan Diri",
    content: "Saya sering merasa minder saat presentasi di depan kelas. Bagaimana cara meningkatkan rasa percaya diri?",
    author: "Sari M.",
    category: "Sosial",
    created_at: "2024-01-13T09:20:00Z",
    replies_count: 15,
    views: 203
  }
];

const categories = ["Semua", "Akademik", "Sosial", "Keluarga", "Karir", "Kesehatan Mental"];

export const ForumList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [posts] = useState(mockPosts);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePostClick = (postId: string) => {
    console.log("Opening post:", postId);
    // Navigate to post detail page
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Forum Diskusi BK</h1>
          <p className="text-muted-foreground">Tempat berbagi dan bertanya seputar bimbingan konseling</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Buat Topik Baru
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari topik diskusi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Topik</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Balasan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.reduce((sum, post) => sum + post.replies_count, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.reduce((sum, post) => sum + post.views, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forum Posts */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <ForumCard
              key={post.id}
              post={post}
              onClick={() => handlePostClick(post.id)}
            />
          ))
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Tidak ada topik yang ditemukan</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
