
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TestTube, Clock, Users } from "lucide-react";

interface Question {
  id: number;
  text: string;
  options: string[];
}

interface TestResult {
  category: string;
  score: number;
  description: string;
  recommendations: string[];
}

const psychologyTests = [
  {
    id: "personality",
    title: "Tes Kepribadian Big Five",
    description: "Mengetahui tipe kepribadian berdasarkan 5 dimensi utama",
    duration: "15-20 menit",
    questions: 50,
    category: "Kepribadian"
  },
  {
    id: "stress",
    title: "Tes Tingkat Stres",
    description: "Mengukur tingkat stres dan tekanan yang dialami",
    duration: "10-15 menit", 
    questions: 30,
    category: "Mental Health"
  },
  {
    id: "learning-style",
    title: "Tes Gaya Belajar",
    description: "Mengetahui gaya belajar yang paling efektif untuk Anda",
    duration: "10 menit",
    questions: 25,
    category: "Akademik"
  },
  {
    id: "career",
    title: "Tes Minat Karir",
    description: "Mengetahui bidang karir yang sesuai dengan minat dan bakat",
    duration: "20-25 menit",
    questions: 60,
    category: "Karir"
  }
];

const sampleQuestions: Question[] = [
  {
    id: 1,
    text: "Saya merasa mudah bergaul dengan orang baru",
    options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
  },
  {
    id: 2,
    text: "Saya lebih suka bekerja sendiri daripada dalam tim",
    options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
  }
];

export const PsychologyTest = () => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const handleStartTest = (testId: string) => {
    setSelectedTest(testId);
    setCurrentQuestion(0);
    setAnswers([]);
    setIsCompleted(false);
    setTestResult(null);
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);

    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Complete test and calculate result
      const mockResult: TestResult = {
        category: "Ekstrovert",
        score: 75,
        description: "Anda memiliki kecenderungan kepribadian ekstrovert yang cukup tinggi. Anda mudah bergaul dan merasa nyaman dalam interaksi sosial.",
        recommendations: [
          "Manfaatkan kemampuan sosial Anda untuk membangun jaringan",
          "Coba kegiatan yang melibatkan teamwork",
          "Pertimbangkan peran leadership dalam organisasi"
        ]
      };
      setTestResult(mockResult);
      setIsCompleted(true);
    }
  };

  const resetTest = () => {
    setSelectedTest(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setIsCompleted(false);
    setTestResult(null);
  };

  if (selectedTest && !isCompleted) {
    const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;
    const question = sampleQuestions[currentQuestion];

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            {psychologyTests.find(t => t.id === selectedTest)?.title}
          </h2>
          <p className="text-muted-foreground">
            Pertanyaan {currentQuestion + 1} dari {sampleQuestions.length}
          </p>
        </div>

        <Progress value={progress} className="w-full" />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{question.text}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start h-auto p-4"
                onClick={() => handleAnswer(index)}
              >
                {option}
              </Button>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={resetTest}>
            Batal
          </Button>
          {currentQuestion > 0 && (
            <Button 
              variant="outline" 
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
            >
              Sebelumnya
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (isCompleted && testResult) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Hasil Tes</h2>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {testResult.category}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Skor Anda: {testResult.score}/100</CardTitle>
            <Progress value={testResult.score} className="w-full" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{testResult.description}</p>
            
            <h4 className="font-semibold mb-2">Rekomendasi:</h4>
            <ul className="list-disc list-inside space-y-1">
              {testResult.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-muted-foreground">{rec}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={resetTest} className="flex-1">
            Ambil Tes Lain
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            Cetak Hasil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Tes Psikologi Online</h1>
        <p className="text-muted-foreground">
          Pilih tes psikologi yang ingin Anda ikuti untuk mengetahui lebih dalam tentang diri Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {psychologyTests.map((test) => (
          <Card key={test.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <TestTube className="h-8 w-8 text-primary" />
                <Badge>{test.category}</Badge>
              </div>
              <CardTitle className="text-lg">{test.title}</CardTitle>
              <CardDescription>{test.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {test.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {test.questions} pertanyaan
                </div>
              </div>
              <Button 
                className="w-full"
                onClick={() => handleStartTest(test.id)}
              >
                Mulai Tes
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
