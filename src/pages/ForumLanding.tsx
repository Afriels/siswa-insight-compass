
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MessageCircle, TestTube, Users, TrendingUp, Search, User, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const ForumLanding = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for recent posts
  const recentPosts = [
    {
      id: "1",
      title: "Tips Mengatasi Stres Belajar",
      excerpt: "Bagaimana cara yang efektif untuk mengatasi stres saat menghadapi ujian?",
      author: "Siswa Kelas XI",
      category: "Akademik",
      created_at: "2024-01-15T10:30:00Z",
      replies: 12,
      views: 156
    },
    {
      id: "2",
      title: "Konsultasi Masalah Keluarga",
      excerpt: "Saya sedang mengalami konflik dengan orang tua mengenai pilihan jurusan kuliah.",
      author: "Ahmad R.",
      category: "Keluarga",
      created_at: "2024-01-14T15:45:00Z",
      replies: 8,
      views: 89
    },
    {
      id: "3",
      title: "Cara Meningkatkan Kepercayaan Diri",
      excerpt: "Saya sering merasa minder saat presentasi di depan kelas.",
      author: "Sari M.",
      category: "Sosial",
      created_at: "2024-01-13T09:20:00Z",
      replies: 15,
      views: 203
    }
  ];

  const categories = [
    { name: "Akademik", count: 25, color: "bg-blue-100 text-blue-800" },
    { name: "Sosial", count: 18, color: "bg-green-100 text-green-800" },
    { name: "Keluarga", count: 12, color: "bg-purple-100 text-purple-800" },
    { name: "Karir", count: 8, color: "bg-orange-100 text-orange-800" },
    { name: "Kesehatan Mental", count: 15, color: "bg-red-100 text-red-800" }
  ];

  const stats = [
    { title: "Total Anggota", value: "1,234", icon: Users },
    { title: "Topik Diskusi", value: "456", icon: MessageCircle },
    { title: "Tes Tersedia", value: "12", icon: TestTube },
    { title: "Konselor Aktif", value: "8", icon: User }
  ];

  return (
    <>
      <Helmet>
        <title>BK Connect - Platform Bimbingan Konseling Digital</title>
        <link rel="icon" href="https://sman1lumbang.sch.id/wp-content/uploads/2022/12/logo-smanilum-60mm.png" type="image/png" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://sman1lumbang.sch.id/wp-content/uploads/2022/12/logo-smanilum-60mm.png" 
                  alt="Logo" 
                  className="h-10 w-10"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">BK Connect</h1>
                  <p className="text-sm text-gray-600">Platform Bimbingan Konseling Digital</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Masuk
                </Button>
                <Button onClick={() => navigate("/login")}>
                  Daftar
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Selamat Datang di Forum BK Connect
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Tempat berbagi, berdiskusi, dan mendapatkan dukungan seputar bimbingan konseling. 
              Bergabunglah dengan komunitas siswa dan konselor untuk saling membantu.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Cari topik diskusi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/login")}>
                <MessageCircle className="h-5 w-5 mr-2" />
                Mulai Diskusi
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
                <TestTube className="h-5 w-5 mr-2" />
                Ikuti Tes Psikologi
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <stat.icon className="h-8 w-8 mx-auto text-primary mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.title}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Recent Discussions */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Diskusi Terbaru</h3>
                  <Button variant="outline" onClick={() => navigate("/login")}>
                    Lihat Semua
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-3">
                          <Badge className={categories.find(c => c.name === post.category)?.color}>
                            {post.category}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(post.created_at), { 
                              addSuffix: true, 
                              locale: id 
                            })}
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h4>
                        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {post.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {post.replies} balasan
                            </div>
                            <span>{post.views} views</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                
                {/* Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle>Kategori Diskusi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <div key={category.name} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category.name}</span>
                          <Badge variant="secondary">{category.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Mulai Sekarang</CardTitle>
                    <CardDescription>
                      Bergabung untuk mengakses semua fitur
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full" onClick={() => navigate("/login")}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Buat Topik Diskusi
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
                      <TestTube className="h-4 w-4 mr-2" />
                      Ikuti Tes Psikologi
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
                      <User className="h-4 w-4 mr-2" />
                      Konsultasi Privat
                    </Button>
                  </CardContent>
                </Card>

                {/* Features */}
                <Card>
                  <CardHeader>
                    <CardTitle>Fitur Unggulan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MessageCircle className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Forum Diskusi</h4>
                          <p className="text-sm text-gray-600">Berbagi pengalaman dan saling mendukung</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <TestTube className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Tes Psikologi Online</h4>
                          <p className="text-sm text-gray-600">Kenali diri Anda lebih dalam</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Konsultasi Pribadi</h4>
                          <p className="text-sm text-gray-600">Bimbingan langsung dari konselor</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src="https://sman1lumbang.sch.id/wp-content/uploads/2022/12/logo-smanilum-60mm.png" 
                    alt="Logo" 
                    className="h-8 w-8"
                  />
                  <h3 className="text-xl font-bold">BK Connect</h3>
                </div>
                <p className="text-gray-400">
                  Platform digital untuk bimbingan konseling yang menghubungkan siswa, konselor, 
                  dan komunitas dalam satu ekosistem yang supportif.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Fitur</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>Forum Diskusi</li>
                  <li>Tes Psikologi</li>
                  <li>Konsultasi Online</li>
                  <li>Manajemen Siswa</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Kontak</h4>
                <div className="space-y-2 text-gray-400">
                  <p>SMAN 1 Lumbang</p>
                  <p>Jl. Raya Lumbang No. 1</p>
                  <p>Email: bk@sman1lumbang.sch.id</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 BK Connect. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ForumLanding;
