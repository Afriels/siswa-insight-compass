
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Edit, Trash2, MoveUp, MoveDown } from "lucide-react";
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

interface QuestionManagerProps {
  test: {
    id: string;
    title: string;
    category: string;
  };
  onBack: () => void;
}

export const QuestionManager = ({ test, onBack }: QuestionManagerProps) => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        scoring_config: (q.scoring_config as Record<string, any>) || { category: 'general' }
      }));

      setQuestions(convertedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast({
        title: "Error",
        description: "Gagal memuat pertanyaan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = () => {
    const newOrderIndex = questions.length > 0 ? Math.max(...questions.map(q => q.order_index)) + 1 : 0;
    
    setEditingQuestion({
      id: '',
      question_text: '',
      question_type: 'likert',
      options: getDefaultOptions('likert'),
      order_index: newOrderIndex,
      scoring_config: { category: 'general' }
    });
    setIsDialogOpen(true);
  };

  const getDefaultOptions = (type: string): string[] => {
    switch (type) {
      case 'likert':
        return ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju'];
      case 'yes_no':
        return ['Ya', 'Tidak'];
      case 'frequency':
        return ['Tidak Pernah', 'Jarang', 'Kadang-kadang', 'Sering', 'Selalu'];
      case 'agreement':
        return ['Sangat Tidak Setuju', 'Tidak Setuju', 'Agak Tidak Setuju', 'Agak Setuju', 'Setuju', 'Sangat Setuju'];
      default:
        return ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
    }
  };

  const handleSaveQuestion = async (questionData: Partial<Question>) => {
    try {
      // Ensure scoring_config has category
      const scoringConfig = {
        category: 'general',
        ...questionData.scoring_config
      };

      if (editingQuestion?.id) {
        // Update existing question
        const { error } = await supabase
          .from('psychology_test_questions')
          .update({
            question_text: questionData.question_text || '',
            question_type: questionData.question_type,
            options: questionData.options,
            order_index: questionData.order_index,
            scoring_config: scoringConfig
          })
          .eq('id', editingQuestion.id);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Pertanyaan berhasil diperbarui",
        });
      } else {
        // Create new question
        const { error } = await supabase
          .from('psychology_test_questions')
          .insert({
            test_template_id: test.id,
            question_text: questionData.question_text || '',
            question_type: questionData.question_type,
            options: questionData.options,
            order_index: questionData.order_index,
            scoring_config: scoringConfig
          });

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Pertanyaan berhasil dibuat",
        });
      }

      setIsDialogOpen(false);
      setEditingQuestion(null);
      fetchQuestions();
    } catch (error) {
      console.error("Error saving question:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan pertanyaan",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pertanyaan ini?")) return;

    try {
      const { error } = await supabase
        .from('psychology_test_questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Pertanyaan berhasil dihapus",
      });

      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus pertanyaan",
        variant: "destructive",
      });
    }
  };

  const handleMoveQuestion = async (questionId: string, direction: 'up' | 'down') => {
    const currentIndex = questions.findIndex(q => q.id === questionId);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= questions.length) return;

    const currentQuestion = questions[currentIndex];
    const targetQuestion = questions[targetIndex];

    try {
      // Swap order indices
      await supabase
        .from('psychology_test_questions')
        .update({ order_index: targetQuestion.order_index })
        .eq('id', currentQuestion.id);

      await supabase
        .from('psychology_test_questions')
        .update({ order_index: currentQuestion.order_index })
        .eq('id', targetQuestion.id);

      fetchQuestions();
    } catch (error) {
      console.error("Error moving question:", error);
      toast({
        title: "Error",
        description: "Gagal memindahkan pertanyaan",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-counseling-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Kelola Pertanyaan</h1>
            <p className="text-muted-foreground">{test.title}</p>
          </div>
        </div>
        
        <Button onClick={handleCreateQuestion}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Pertanyaan
        </Button>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Pertanyaan {index + 1}</span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveQuestion(question.id, 'up')}
                    disabled={index === 0}
                  >
                    <MoveUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveQuestion(question.id, 'down')}
                    disabled={index === questions.length - 1}
                  >
                    <MoveDown className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingQuestion(question);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{question.question_text}</p>
              <div className="text-xs text-muted-foreground">
                <p>Tipe: {question.question_type}</p>
                <p>Opsi: {question.options.join(', ')}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">Belum Ada Pertanyaan</h3>
          <p className="text-muted-foreground mb-4">
            Mulai dengan menambahkan pertanyaan pertama untuk tes ini.
          </p>
          <Button onClick={handleCreateQuestion}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Pertanyaan Pertama
          </Button>
        </div>
      )}

      <QuestionFormDialog
        question={editingQuestion}
        testCategory={test.category}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingQuestion(null);
        }}
        onSave={handleSaveQuestion}
        getDefaultOptions={getDefaultOptions}
      />
    </div>
  );
};

const handleDeleteQuestion = async (questionId: string) => {
  if (!confirm("Apakah Anda yakin ingin menghapus pertanyaan ini?")) return;

  try {
    const { error } = await supabase
      .from('psychology_test_questions')
      .delete()
      .eq('id', questionId);

    if (error) throw error;

    toast({
      title: "Berhasil",
      description: "Pertanyaan berhasil dihapus",
    });

    fetchQuestions();
  } catch (error) {
    console.error("Error deleting question:", error);
    toast({
      title: "Error",
      description: "Gagal menghapus pertanyaan",
      variant: "destructive",
    });
  }
};

const handleMoveQuestion = async (questionId: string, direction: 'up' | 'down') => {
  const currentIndex = questions.findIndex(q => q.id === questionId);
  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  
  if (targetIndex < 0 || targetIndex >= questions.length) return;

  const currentQuestion = questions[currentIndex];
  const targetQuestion = questions[targetIndex];

  try {
    // Swap order indices
    await supabase
      .from('psychology_test_questions')
      .update({ order_index: targetQuestion.order_index })
      .eq('id', currentQuestion.id);

    await supabase
      .from('psychology_test_questions')
      .update({ order_index: currentQuestion.order_index })
      .eq('id', targetQuestion.id);

    fetchQuestions();
  } catch (error) {
    console.error("Error moving question:", error);
    toast({
      title: "Error",
      description: "Gagal memindahkan pertanyaan",
      variant: "destructive",
    });
  }
};

interface QuestionFormDialogProps {
  question: Question | null;
  testCategory: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Question>) => void;
  getDefaultOptions: (type: string) => string[];
}

const QuestionFormDialog = ({ question, testCategory, isOpen, onClose, onSave, getDefaultOptions }: QuestionFormDialogProps) => {
  const [formData, setFormData] = useState({
    question_text: '',
    question_type: 'likert',
    options: getDefaultOptions('likert'),
    scoring_config: { category: 'general' }
  });

  useEffect(() => {
    if (question) {
      setFormData({
        question_text: question.question_text,
        question_type: question.question_type,
        options: question.options,
        scoring_config: question.scoring_config || { category: 'general' }
      });
    } else {
      setFormData({
        question_text: '',
        question_type: 'likert',
        options: getDefaultOptions('likert'),
        scoring_config: { category: 'general' }
      });
    }
  }, [question, getDefaultOptions]);

  const handleTypeChange = (newType: string) => {
    setFormData(prev => ({
      ...prev,
      question_type: newType,
      options: getDefaultOptions(newType)
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {question?.id ? 'Edit Pertanyaan' : 'Tambah Pertanyaan'}
          </DialogTitle>
          <DialogDescription>
            Buat pertanyaan yang relevan untuk tes {testCategory}.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="question_text">Teks Pertanyaan</Label>
            <Textarea
              id="question_text"
              value={formData.question_text}
              onChange={(e) => setFormData(prev => ({ ...prev, question_text: e.target.value }))}
              placeholder="Masukkan pertanyaan..."
              required
            />
          </div>
          
          <div>
            <Label htmlFor="question_type">Tipe Pertanyaan</Label>
            <Select
              value={formData.question_type}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="likert">Skala Likert</SelectItem>
                <SelectItem value="yes_no">Ya/Tidak</SelectItem>
                <SelectItem value="frequency">Frekuensi</SelectItem>
                <SelectItem value="agreement">Tingkat Persetujuan</SelectItem>
                <SelectItem value="multiple_choice">Pilihan Ganda</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Opsi Jawaban</Label>
            <div className="space-y-2">
              {formData.options.map((option, index) => (
                <Input
                  key={index}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Opsi ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              {question?.id ? 'Simpan Perubahan' : 'Tambah Pertanyaan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
