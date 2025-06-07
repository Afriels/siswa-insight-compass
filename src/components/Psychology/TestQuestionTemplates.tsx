
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Wand2 } from "lucide-react";

interface QuestionTemplate {
  category: string;
  questions: {
    text: string;
    type: string;
    options: string[];
  }[];
}

const questionTemplates: Record<string, QuestionTemplate> = {
  "Kepribadian": {
    category: "Kepribadian",
    questions: [
      {
        text: "Saya merasa nyaman berbicara di depan kelompok besar",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya lebih suka bekerja sendiri daripada dalam tim",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya mudah merasa cemas dalam situasi baru",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya sering mencari pengalaman baru dan menantang",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya merasa mudah bergaul dengan orang baru",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya cenderung perfeksionis dalam mengerjakan tugas",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya lebih suka merencanakan segala sesuatu dengan detail",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya mudah memaafkan kesalahan orang lain",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya merasa optimis terhadap masa depan",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya sering merasa tidak sabar menunggu hasil",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      }
    ]
  },
  "Mental Health": {
    category: "Mental Health",
    questions: [
      {
        text: "Seberapa sering Anda merasa sedih atau murung dalam 2 minggu terakhir?",
        type: "frequency",
        options: ["Tidak Pernah", "Jarang", "Kadang-kadang", "Sering", "Selalu"]
      },
      {
        text: "Seberapa sering Anda merasa cemas atau khawatir berlebihan?",
        type: "frequency",
        options: ["Tidak Pernah", "Jarang", "Kadang-kadang", "Sering", "Selalu"]
      },
      {
        text: "Apakah Anda mengalami kesulitan tidur atau insomnia?",
        type: "frequency",
        options: ["Tidak Pernah", "Jarang", "Kadang-kadang", "Sering", "Selalu"]
      },
      {
        text: "Seberapa sering Anda merasa kehilangan minat pada aktivitas yang biasa Anda nikmati?",
        type: "frequency",
        options: ["Tidak Pernah", "Jarang", "Kadang-kadang", "Sering", "Selalu"]
      },
      {
        text: "Apakah Anda merasa mudah lelah atau kehilangan energi?",
        type: "frequency",
        options: ["Tidak Pernah", "Jarang", "Kadang-kadang", "Sering", "Selalu"]
      },
      {
        text: "Seberapa sering Anda merasa sulit berkonsentrasi?",
        type: "frequency",
        options: ["Tidak Pernah", "Jarang", "Kadang-kadang", "Sering", "Selalu"]
      },
      {
        text: "Apakah Anda merasa tidak berharga atau bersalah?",
        type: "frequency",
        options: ["Tidak Pernah", "Jarang", "Kadang-kadang", "Sering", "Selalu"]
      },
      {
        text: "Seberapa sering Anda merasa gelisah atau tidak bisa diam?",
        type: "frequency",
        options: ["Tidak Pernah", "Jarang", "Kadang-kadang", "Sering", "Selalu"]
      },
      {
        text: "Apakah Anda mengalami perubahan nafsu makan yang signifikan?",
        type: "frequency",
        options: ["Tidak Pernah", "Jarang", "Kadang-kadang", "Sering", "Selalu"]
      },
      {
        text: "Seberapa sering Anda merasa putus asa tentang masa depan?",
        type: "frequency",
        options: ["Tidak Pernah", "Jarang", "Kadang-kadang", "Sering", "Selalu"]
      }
    ]
  },
  "Akademik": {
    category: "Akademik",
    questions: [
      {
        text: "Saya merasa yakin dengan kemampuan akademik saya",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya mudah memahami materi pelajaran baru",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya memiliki motivasi tinggi untuk belajar",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya sering menunda-nunda mengerjakan tugas",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya merasa tertekan dengan beban akademik",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya mampu mengatur waktu belajar dengan baik",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya merasa nyaman bertanya kepada guru saat tidak paham",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya sering merasa cemas saat menghadapi ujian",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya memiliki target prestasi yang jelas",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya merasa didukung keluarga dalam belajar",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      }
    ]
  },
  "Karir": {
    category: "Karir",
    questions: [
      {
        text: "Saya memiliki gambaran jelas tentang karir yang ingin saya jalani",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya tertarik pada pekerjaan yang melibatkan interaksi dengan banyak orang",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya lebih menyukai pekerjaan yang membutuhkan analisis dan pemecahan masalah",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya tertarik pada bidang teknologi dan inovasi",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya lebih suka bekerja di lingkungan yang terstruktur dan terorganisir",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya tertarik pada pekerjaan yang melibatkan kreativitas dan seni",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya merasa nyaman bekerja dalam tekanan dan deadline ketat",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya tertarik pada pekerjaan yang memberikan dampak sosial positif",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya lebih memilih pekerjaan dengan gaji tinggi daripada passion",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      },
      {
        text: "Saya memiliki role model karir yang jelas",
        type: "likert",
        options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"]
      }
    ]
  }
};

interface TestQuestionTemplatesProps {
  testId: string;
  testCategory: string;
  onQuestionsAdded: () => void;
}

export const TestQuestionTemplates = ({ testId, testCategory, onQuestionsAdded }: TestQuestionTemplatesProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const addTemplateQuestions = async () => {
    const template = questionTemplates[testCategory];
    if (!template) {
      toast({
        title: "Template tidak ditemukan",
        description: `Tidak ada template untuk kategori ${testCategory}`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const questionsToInsert = template.questions.map((question, index) => ({
        test_template_id: testId,
        question_text: question.text,
        question_type: question.type,
        options: question.options,
        order_index: index,
        scoring_config: { category: testCategory.toLowerCase() }
      }));

      const { error } = await supabase
        .from('psychology_test_questions')
        .insert(questionsToInsert);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: `${template.questions.length} pertanyaan berhasil ditambahkan`,
      });

      onQuestionsAdded();
    } catch (error) {
      console.error("Error adding template questions:", error);
      toast({
        title: "Error",
        description: "Gagal menambahkan pertanyaan template",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const template = questionTemplates[testCategory];

  if (!template) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Tidak ada template pertanyaan untuk kategori {testCategory}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          Template Pertanyaan {testCategory}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Tersedia {template.questions.length} pertanyaan siap pakai
            </p>
            <Badge variant="outline" className="mt-1">
              {testCategory}
            </Badge>
          </div>
          <Button onClick={addTemplateQuestions} disabled={loading}>
            {loading ? "Menambahkan..." : "Gunakan Template"}
            <Plus className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Preview Pertanyaan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[70vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Preview Template {testCategory}</DialogTitle>
              <DialogDescription>
                Daftar pertanyaan yang akan ditambahkan ke tes
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {template.questions.map((question, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <p className="font-medium mb-2">{index + 1}. {question.text}</p>
                    <div className="flex flex-wrap gap-1">
                      {question.options.map((option, optIndex) => (
                        <Badge key={optIndex} variant="secondary" className="text-xs">
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
