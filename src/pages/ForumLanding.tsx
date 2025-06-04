
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Calendar, TrendingUp, LogIn } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/providers/AuthProvider";

const ForumLanding = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // If user is authenticated, show navigation to dashboard
  if (!loading && user) {
    return (
      <>
        <Helmet>
          <title>BK Connect - Forum Diskusi</title>
          <link rel="icon" href="https://sman1lumbang.sch.id/wp-content/uploads/2022/12/logo-smanilum-60mm.png" type="image/png" />
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {/* Header for authenticated users */}
          <header className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src="https://sman1lumbang.sch.id/wp-content/uploads/2022/12/logo-smanilum-60mm.png" 
                       alt="Logo SMAN 1 Lumbang" 
                       className="h-12 w-auto" />
                  <div>
                    <h1 className="text-2xl font-bold text-counseling-blue">BK Connect</h1>
                    <p className="text-sm text-gray-600">Forum Diskusi & Bimbingan Konseling</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Button onClick={() => navigate("/dashboard")} className="bg-counseling-blue hover:bg-blue-600">
                    Dashboard
                  </Button>
                  <Button onClick={() => navigate("/forum")} variant="outline">
                    Forum Diskusi
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main content for authenticated users */}
          <main className="container mx-auto px-6 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Selamat Datang di Forum BK Connect
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Platform diskusi dan konsultasi untuk siswa SMAN 1 Lumbang
                </p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => navigate("/forum")} size="lg" className="bg-counseling-blue hover:bg-blue-600">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Mulai Diskusi
                  </Button>
                  <Button onClick={() => navigate("/consultation")} size="lg" variant="outline">
                    Konsultasi Pribadi
                  </Button>
                </div>
              </div>

              {/* Quick access cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/forum")}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="mr-2 h-5 w-5 text-counseling-blue" />
                      Forum Diskusi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Bergabung dalam diskusi dengan sesama siswa dan guru BK</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/psychology-test")}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5 text-counseling-green" />
                      Tes Psikologi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Ikuti tes psikologi online untuk mengenal diri lebih baik</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/consultation")}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-counseling-purple" />
                      Konsultasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Konsultasi pribadi dengan guru bimbingan konseling</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  // Show landing page for non-authenticated users
  return (
    <>
      <Helmet>
        <title>BK Connect - Forum Diskusi & Bimbingan Konseling</title>
        <link rel="icon" href="https://sman1lumbang.sch.id/wp-content/uploads/2022/12/logo-smanilum-60mm.png" type="image/png" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src="https://sman1lumbang.sch.id/wp-content/uploads/2022/12/logo-smanilum-60mm.png" 
                     alt="Logo SMAN 1 Lumbang" 
                     className="h-12 w-auto" />
                <div>
                  <h1 className="text-2xl font-bold text-counseling-blue">BK Connect</h1>
                  <p className="text-sm text-gray-600">Forum Diskusi & Bimbingan Konseling</p>
                </div>
              </div>
              <Link to="/login">
                <Button className="bg-counseling-blue hover:bg-blue-600">
                  <LogIn className="mr-2 h-4 w-4" />
                  Masuk
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Selamat Datang di Forum BK Connect
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Platform diskusi dan konsultasi untuk siswa SMAN 1 Lumbang
              </p>
              <Link to="/login">
                <Button size="lg" className="bg-counseling-blue hover:bg-blue-600">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Mulai Diskusi
                </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-counseling-blue" />
                    Forum Diskusi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Bergabung dalam diskusi dengan sesama siswa dan guru BK</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-counseling-green" />
                    Tes Psikologi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Ikuti tes psikologi online untuk mengenal diri lebih baik</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-counseling-purple" />
                    Konsultasi Pribadi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Konsultasi pribadi dengan guru bimbingan konseling</p>
                </CardContent>
              </Card>
            </div>

            {/* Popular Topics Preview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold mb-6 text-center">Topik Diskusi Populer</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div>
                    <h4 className="font-medium">Tips Menghadapi Ujian Nasional</h4>
                    <p className="text-sm text-gray-600">Berbagi strategi belajar efektif untuk UN</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary">Akademik</Badge>
                    <span className="text-sm text-gray-500">24 balasan</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div>
                    <h4 className="font-medium">Cara Mengatasi Kecemasan Sosial</h4>
                    <p className="text-sm text-gray-600">Diskusi tentang mengatasi rasa malu dan cemas</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary">Mental Health</Badge>
                    <span className="text-sm text-gray-500">18 balasan</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div>
                    <h4 className="font-medium">Memilih Jurusan Kuliah yang Tepat</h4>
                    <p className="text-sm text-gray-600">Panduan memilih jurusan sesuai minat dan bakat</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary">Karir</Badge>
                    <span className="text-sm text-gray-500">31 balasan</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <Link to="/login">
                  <Button variant="outline">
                    Lihat Semua Diskusi
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ForumLanding;
