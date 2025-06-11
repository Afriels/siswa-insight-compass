
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Brain, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIRecommendationsProps {
  testResults: any;
  testType: string;
  studentData?: any;
}

export const AIRecommendations = ({ testResults, testType, studentData }: AIRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateRecommendations = async () => {
    try {
      setLoading(true);
      
      // Prepare context for AI
      const context = {
        testType: testType,
        results: testResults,
        student: studentData,
        timestamp: new Date().toISOString()
      };

      let prompt = '';
      
      if (testType === 'holland') {
        prompt = `Sebagai konselor profesional, berikan rekomendasi karir berdasarkan hasil tes minat Holland berikut:

Hasil Tes: ${JSON.stringify(testResults)}
Data Siswa: ${studentData ? `Nama: ${studentData.name}, Kelas: ${studentData.class}` : 'Data tidak tersedia'}

Berikan:
1. Analisis kepribadian berdasarkan tipe Holland
2. Rekomendasi karir yang sesuai (minimal 5 pilihan)
3. Jurusan kuliah yang relevan
4. Langkah-langkah pengembangan diri
5. Saran untuk mengeksplorasi minat lebih lanjut

Format dalam bahasa Indonesia yang mudah dipahami siswa SMA.`;
      } else {
        prompt = `Sebagai psikolog profesional, berikan rekomendasi berdasarkan hasil tes psikologi berikut:

Jenis Tes: ${testType}
Hasil Tes: ${JSON.stringify(testResults)}
Data Siswa: ${studentData ? `Nama: ${studentData.name}, Kelas: ${studentData.class}` : 'Data tidak tersedia'}

Berikan:
1. Interpretasi hasil tes secara professional
2. Kekuatan dan area yang perlu dikembangkan
3. Rekomendasi strategi belajar yang sesuai
4. Saran untuk pengembangan soft skills
5. Rekomendasi aktivitas atau program pengembangan

Gunakan bahasa yang supportif dan mudah dipahami siswa SMA. Fokus pada aspek positif dan growth mindset.`;
      }

      const response = await fetch('/api/enhanced-ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          adminMode: false,
          internetSearch: true,
          dbAccess: false,
          userRole: 'student',
          aiProvider: 'openai'
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi AI service');
      }

      const data = await response.json();
      setRecommendations(data.response || 'Tidak dapat menghasilkan rekomendasi saat ini.');
      
    } catch (error: any) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Error",
        description: "Gagal menghasilkan rekomendasi AI",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Rekomendasi AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!recommendations ? (
          <div className="text-center py-6">
            <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Dapatkan rekomendasi personal dari AI berdasarkan hasil tes Anda
            </p>
            <Button onClick={generateRecommendations} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Menganalisis...' : 'Generate Rekomendasi AI'}
            </Button>
          </div>
        ) : (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-blue-800 mb-2">🤖 Rekomendasi dari AI Assistant</h4>
              <div className="text-sm text-blue-700 whitespace-pre-wrap">
                {recommendations}
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={generateRecommendations} 
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Menganalisis...' : 'Generate Ulang Rekomendasi'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
