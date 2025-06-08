
import { Layout } from "@/components/Layout";
import { AIAssistant } from "@/components/AI/AIAssistant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Lightbulb, MessageCircle, Target } from "lucide-react";

const AIAssistantPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Bot className="h-8 w-8 text-counseling-blue" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Asisten AI BK Connect</h1>
            <p className="text-gray-600">Dapatkan bantuan dan panduan tentang bimbingan konseling</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AIAssistant />
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Tips Penggunaan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <p>• Tanyakan tentang cara menggunakan fitur-fitur BK Connect</p>
                  <p>• Minta saran untuk menangani masalah siswa tertentu</p>
                  <p>• Dapatkan panduan interpretasi hasil tes psikologi</p>
                  <p>• Konsultasi strategi konseling yang efektif</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageCircle className="h-5 w-5 text-green-500" />
                  Contoh Pertanyaan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm space-y-1">
                  <p className="font-medium">"Bagaimana cara membaca sosiogram?"</p>
                  <p className="font-medium">"Apa yang harus dilakukan jika siswa sering terlambat?"</p>
                  <p className="font-medium">"Bagaimana menginterpretasi hasil tes kepribadian?"</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-blue-500" />
                  Fokus AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <p>AI ini dilatih khusus untuk membantu dalam:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Bimbingan konseling</li>
                    <li>Analisis perilaku siswa</li>
                    <li>Penggunaan aplikasi BK Connect</li>
                    <li>Strategi pembelajaran</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIAssistantPage;
