import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: string[];
  order_index: number;
  scoring_config: Record<string, any>;
}

interface TestSessionProps {
  test: {
    id: string;
    title: string;
    instructions: string;
  };
  session: {
    id: string;
    status: string;
    answers: Record<string, any>;
  };
  onComplete: (results: Record<string, any>) => void;
  onBack: () => void;
}

export const TestSession = ({ test, session, onComplete, onBack }: TestSessionProps) => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(session.answers || {});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [test.id]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('psychology_test_questions')
        .select('*')
        .eq('test_template_id', test.id)
        .order('order_index', { ascending: true });

      if (error) throw error;

      // Convert the Json types to proper types
      const convertedQuestions: Question[] = (data || []).map(q => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: Array.isArray(q.options) ? q.options as string[] : [],
        order_index: q.order_index,
        scoring_config: (q.scoring_config as Record<string, any>) || {}
      }));

      setQuestions(convertedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast({
        title: "Error",
        description: "Gagal memuat pertanyaan tes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (value: string) => {
    const questionId = questions[currentQuestionIndex].id;
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    // Auto-save answers
    saveAnswers(newAnswers);
  };

  const saveAnswers = async (answersToSave: Record<string, string>) => {
    try {
      await supabase
        .from('psychology_test_sessions')
        .update({ answers: answersToSave })
        .eq('id', session.id);
    } catch (error) {
      console.error("Error saving answers:", error);
    }
  };

  const calculateResults = (finalAnswers: Record<string, string>) => {
    // Basic scoring logic - can be enhanced based on test type
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(finalAnswers).length;
    
    // Calculate category scores based on question scoring configs
    const categoryScores: Record<string, number> = {};
    
    questions.forEach((question) => {
      const answer = finalAnswers[question.id];
      if (answer && question.scoring_config) {
        const category = question.scoring_config.category || 'general';
        const score = parseInt(answer) || 0;
        
        if (!categoryScores[category]) {
          categoryScores[category] = 0;
        }
        categoryScores[category] += score;
      }
    });

    return {
      totalQuestions,
      answeredQuestions,
      categoryScores,
      completionPercentage: (answeredQuestions / totalQuestions) * 100
    };
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const results = calculateResults(answers);
      
      await supabase
        .from('psychology_test_sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          answers,
          results
        })
        .eq('id', session.id);

      onComplete(results);
      
      toast({
        title: "Tes Selesai",
        description: "Tes berhasil diselesaikan. Lihat hasil Anda!",
      });
    } catch (error) {
      console.error("Error submitting test:", error);
      toast({
        title: "Error",
        description: "Gagal menyelesaikan tes",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-counseling-blue"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Tidak Ada Pertanyaan</h3>
        <p className="text-muted-foreground mb-4">
          Tes ini belum memiliki pertanyaan yang tersedia.
        </p>
        <Button onClick={onBack}>Kembali</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const currentAnswer = answers[currentQuestion.id];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{test.title}</h2>
        <p className="text-muted-foreground">
          Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
        </p>
      </div>

      {test.instructions && currentQuestionIndex === 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Petunjuk</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700">{test.instructions}</p>
          </CardContent>
        </Card>
      )}

      <Progress value={progress} className="w-full" />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.question_text}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={currentAnswer || ""} onValueChange={handleAnswer}>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Keluar
        </Button>
        
        <div className="flex gap-2">
          {currentQuestionIndex > 0 && (
            <Button variant="outline" onClick={handlePrevious}>
              Sebelumnya
            </Button>
          )}
          
          {isLastQuestion ? (
            <Button 
              onClick={handleSubmit} 
              disabled={!currentAnswer || isSubmitting}
            >
              {isSubmitting ? "Menyelesaikan..." : "Selesai"}
            </Button>
          ) : (
            <Button 
              onClick={handleNext} 
              disabled={!currentAnswer}
            >
              Selanjutnya
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
