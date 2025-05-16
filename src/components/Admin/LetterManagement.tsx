
import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { FilePlus } from "lucide-react";

const LetterManagement = () => {
  const { toast } = useToast();
  const [letterOpen, setLetterOpen] = useState(false);
  
  const [letterForm, setLetterForm] = useState({
    title: "",
    recipient: "",
    content: ""
  });
  
  const handleLetterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLetterForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleGenerateLetter = () => {
    // Check if all fields are filled
    if (!letterForm.title || !letterForm.recipient || !letterForm.content) {
      toast({
        title: "Form tidak lengkap",
        description: "Mohon lengkapi semua field",
        variant: "destructive"
      });
      return;
    }
    
    // Generate and download letter as PDF
    toast({
      title: "Fitur dalam pengembangan",
      description: "Fitur pembuatan surat sedang dalam tahap pengembangan",
      variant: "default"
    });
    
    // Reset form and close dialog
    setLetterForm({
      title: "",
      recipient: "",
      content: ""
    });
    setLetterOpen(false);
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
            <Button className="bg-counseling-blue hover:bg-blue-600">
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
                className="bg-counseling-blue hover:bg-blue-600"
                onClick={handleGenerateLetter}
              >
                Generate PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="text-center py-16 text-muted-foreground">
          <p className="mb-2">Fitur manajemen surat sedang dalam pengembangan.</p>
          <p>Silakan gunakan tombol "Buat Surat" untuk mencoba demo.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LetterManagement;
