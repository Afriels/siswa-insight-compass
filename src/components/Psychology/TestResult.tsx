
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Download, RotateCcw } from "lucide-react";

interface TestResultProps {
  test: {
    id: string;
    title: string;
    category: string;
  };
  session: {
    id: string;
    results: Record<string, any>;
    completed_at: string;
  };
  onBack: () => void;
}

export const TestResult = ({ test, session, onBack }: TestResultProps) => {
  const results = session.results;
  
  const getInterpretation = (category: string, categoryScores: Record<string, number>) => {
    // Basic interpretation logic - can be enhanced for each test type
    const scores = Object.values(categoryScores);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    if (test.category === 'Kepribadian') {
      if (avgScore >= 4) return "Tinggi";
      if (avgScore >= 3) return "Sedang";
      return "Rendah";
    }
    
    if (test.category === 'Mental Health') {
      if (avgScore >= 4) return "Tinggi - Perlu Perhatian";
      if (avgScore >= 3) return "Sedang";
      return "Rendah - Baik";
    }
    
    return "Normal";
  };

  const getRecommendations = (category: string, interpretation: string) => {
    const recommendations: Record<string, string[]> = {
      'Kepribadian': [
        "Kenali kekuatan dan kelemahan kepribadian Anda",
        "Kembangkan aspek-aspek yang perlu ditingkatkan",
        "Manfaatkan kekuatan kepribadian dalam karir dan hubungan"
      ],
      'Mental Health': [
        "Praktikkan teknik relaksasi dan mindfulness",
        "Jaga pola tidur dan olahraga teratur",
        "Bicarakan dengan konselor jika diperlukan"
      ],
      'Akademik': [
        "Gunakan gaya belajar yang sesuai dengan Anda",
        "Coba berbagai metode pembelajaran",
        "Konsultasikan dengan guru BK untuk strategi belajar"
      ],
      'Karir': [
        "Eksplorasi bidang karir yang sesuai minat",
        "Kembangkan keterampilan yang relevan",
        "Cari informasi lebih lanjut tentang profesi pilihan"
      ]
    };

    return recommendations[category] || [
      "Konsultasikan hasil tes dengan konselor",
      "Gunakan hasil ini untuk pengembangan diri",
      "Lakukan tes ulang secara berkala"
    ];
  };

  const interpretation = getInterpretation(test.category, results.categoryScores || {});
  const recommendations = getRecommendations(test.category, interpretation);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 print:space-y-4">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Trophy className="h-16 w-16 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Hasil Tes</h2>
        <Badge variant="secondary" className="text-lg px-3 py-1 mb-2">
          {test.title}
        </Badge>
        <p className="text-sm text-muted-foreground">
          Diselesaikan pada: {new Date(session.completed_at).toLocaleDateString('id-ID')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Ringkasan Hasil</span>
            <Badge variant={interpretation.includes('Tinggi') ? 'destructive' : 'default'}>
              {interpretation}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Kelengkapan Tes</span>
              <span>{results.completionPercentage?.toFixed(0) || 100}%</span>
            </div>
            <Progress value={results.completionPercentage || 100} className="w-full" />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p><strong>Total Pertanyaan:</strong> {results.totalQuestions}</p>
            <p><strong>Pertanyaan Dijawab:</strong> {results.answeredQuestions}</p>
          </div>
        </CardContent>
      </Card>

      {results.categoryScores && Object.keys(results.categoryScores).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Skor per Kategori</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(results.categoryScores).map(([category, score]) => (
              <div key={category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{category}</span>
                  <span>{String(score)}/5</span>
                </div>
                <Progress value={(Number(score) / 5) * 100} className="w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Rekomendasi</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-muted-foreground">{rec}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex gap-4 print:hidden">
        <Button onClick={onBack} className="flex-1">
          <RotateCcw className="h-4 w-4 mr-2" />
          Tes Lainnya
        </Button>
        <Button variant="outline" onClick={handlePrint}>
          <Download className="h-4 w-4 mr-2" />
          Cetak Hasil
        </Button>
      </div>
    </div>
  );
};
