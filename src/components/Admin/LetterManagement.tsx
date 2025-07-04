
import { useState, useEffect } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FilePlus, FileText, Download, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

interface Letter {
  id: string;
  title: string;
  recipient: string;
  content: string;
  type: string;
  status: string;
  created_at: string;
}

const LetterManagement = () => {
  const { toast } = useToast();
  const [letterOpen, setLetterOpen] = useState(false);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [letterForm, setLetterForm] = useState({
    title: "",
    recipient: "",
    content: "",
    type: "panggilan_ortu"
  });

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('whatsapp_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform templates to letters format
      const transformedLetters = data?.map(template => ({
        id: template.id,
        title: template.name,
        recipient: template.subject,
        content: template.message_template,
        type: template.category || 'general',
        status: 'draft',
        created_at: template.created_at
      })) || [];
      
      setLetters(transformedLetters);
    } catch (error: any) {
      console.error("Error fetching letters:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data surat",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleLetterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLetterForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleGenerateLetter = async () => {
    if (!letterForm.title || !letterForm.recipient || !letterForm.content) {
      toast({
        title: "Form tidak lengkap",
        description: "Mohon lengkapi semua field",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('whatsapp_templates')
        .insert({
          name: letterForm.title,
          subject: letterForm.recipient,
          message_template: letterForm.content,
          category: letterForm.type
        });
      
      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Surat berhasil dibuat dan disimpan",
      });
      
      setLetterForm({
        title: "",
        recipient: "",
        content: "",
        type: "panggilan_ortu"
      });
      setLetterOpen(false);
      fetchLetters();
    } catch (error: any) {
      console.error("Error creating letter:", error);
      toast({
        title: "Error",
        description: "Gagal membuat surat",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadLetter = (letter: Letter) => {
    const content = `
SURAT ${letter.title.toUpperCase()}

Kepada: ${letter.recipient}
Tanggal: ${new Date().toLocaleDateString('id-ID')}

${letter.content}

Hormat kami,
Tim Bimbingan Konseling
SMA Negeri 1 Lumbang
    `;
    
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${letter.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Berhasil",
      description: "Surat berhasil didownload",
    });
  };
  
  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manajemen Surat</CardTitle>
          <CardDescription>Buat dan kelola surat-surat resmi</CardDescription>
        </div>
        <Dialog open={letterOpen} onOpenChange={setLetterOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" title="Buat surat baru">
              <FilePlus className="mr-2 h-4 w-4" />
              Buat Surat
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Buat Surat Baru</DialogTitle>
              <DialogDescription>
                Buat surat resmi dengan mengisi form di bawah ini
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="type">Jenis Surat</Label>
                <Select value={letterForm.type} onValueChange={(value) => setLetterForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis surat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="panggilan_ortu">Surat Panggilan Orang Tua</SelectItem>
                    <SelectItem value="peringatan">Surat Peringatan</SelectItem>
                    <SelectItem value="undangan">Surat Undangan</SelectItem>
                    <SelectItem value="pemberitahuan">Surat Pemberitahuan</SelectItem>
                    <SelectItem value="rekomendasi">Surat Rekomendasi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Judul Surat</Label>
                <Input 
                  id="title"
                  name="title"
                  value={letterForm.title}
                  onChange={handleLetterChange}
                  placeholder="Mis. Surat Panggilan Orang Tua"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recipient">Penerima</Label>
                <Input 
                  id="recipient"
                  name="recipient"
                  value={letterForm.recipient}
                  onChange={handleLetterChange}
                  placeholder="Mis. Orang Tua/Wali Siswa"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Isi Surat</Label>
                <Textarea 
                  id="content"
                  name="content"
                  value={letterForm.content}
                  onChange={handleLetterChange}
                  placeholder="Tulis isi surat di sini..."
                  rows={8}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setLetterOpen(false)}>
                Batal
              </Button>
              <Button 
                onClick={handleGenerateLetter}
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan Surat"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <p>Memuat data surat...</p>
          </div>
        ) : letters.length > 0 ? (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Penerima</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {letters.map((letter) => (
                  <TableRow key={letter.id}>
                    <TableCell className="font-medium">{letter.title}</TableCell>
                    <TableCell>{letter.recipient}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                        {letter.type}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(letter.created_at).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadLetter(letter)}
                          title="Download surat"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="mb-2">Belum ada surat yang dibuat.</p>
            <p>Klik tombol "Buat Surat" untuk membuat surat baru.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LetterManagement;
