import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Edit, Trash2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QuestionManager } from "./QuestionManager";

interface TestTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  duration_minutes: number;
  instructions: string;
  is_active: boolean;
  created_at: string;
}

interface TestManagementProps {
  onBack: () => void;
  onTestsUpdated: () => void;
}

export const TestManagement = ({ onBack, onTestsUpdated }: TestManagementProps) => {
  const { toast } = useToast();
  const [tests, setTests] = useState<TestTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<TestTemplate | null>(null);
  const [showQuestionManager, setShowQuestionManager] = useState(false);
  const [editingTest, setEditingTest] = useState<TestTemplate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const { data, error } = await supabase
        .from('psychology_test_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTests(data || []);
    } catch (error) {
      console.error("Error fetching tests:", error);
      toast({
        title: "Error",
        description: "Gagal memuat daftar tes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTest = () => {
    setEditingTest({
      id: '',
      title: '',
      description: '',
      category: 'Kepribadian',
      duration_minutes: 15,
      instructions: '',
      is_active: true,
      created_at: ''
    });
    setIsDialogOpen(true);
  };

  const handleEditTest = (test: TestTemplate) => {
    setEditingTest(test);
    setIsDialogOpen(true);
  };

  const handleSaveTest = async (testData: {
    title: string;
    description: string;
    category: string;
    duration_minutes: number;
    instructions: string;
    is_active: boolean;
  }) => {
    try {
      if (editingTest?.id) {
        // Update existing test
        const { error } = await supabase
          .from('psychology_test_templates')
          .update(testData)
          .eq('id', editingTest.id);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Tes berhasil diperbarui",
        });
      } else {
        // Create new test
        const { error } = await supabase
          .from('psychology_test_templates')
          .insert(testData);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Tes berhasil dibuat",
        });
      }

      setIsDialogOpen(false);
      setEditingTest(null);
      fetchTests();
      onTestsUpdated();
    } catch (error) {
      console.error("Error saving test:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan tes",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTest = async (testId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tes ini?")) return;

    try {
      const { error } = await supabase
        .from('psychology_test_templates')
        .delete()
        .eq('id', testId);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Tes berhasil dihapus",
      });

      fetchTests();
      onTestsUpdated();
    } catch (error) {
      console.error("Error deleting test:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus tes",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (testId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('psychology_test_templates')
        .update({ is_active: isActive })
        .eq('id', testId);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: `Tes berhasil ${isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
      });

      fetchTests();
      onTestsUpdated();
    } catch (error) {
      console.error("Error updating test status:", error);
      toast({
        title: "Error",
        description: "Gagal mengubah status tes",
        variant: "destructive",
      });
    }
  };

  if (showQuestionManager && selectedTest) {
    return (
      <QuestionManager
        test={selectedTest}
        onBack={() => {
          setShowQuestionManager(false);
          setSelectedTest(null);
        }}
      />
    );
  }

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
            <h1 className="text-2xl font-bold">Manajemen Tes Psikologi</h1>
            <p className="text-muted-foreground">Kelola tes psikologi dan pertanyaannya</p>
          </div>
        </div>
        
        <Button onClick={handleCreateTest}>
          <Plus className="h-4 w-4 mr-2" />
          Buat Tes Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tests.map((test) => (
          <Card key={test.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{test.title}</CardTitle>
                    <Badge variant={test.is_active ? "default" : "secondary"}>
                      {test.is_active ? "Aktif" : "Nonaktif"}
                    </Badge>
                    <Badge variant="outline">{test.category}</Badge>
                  </div>
                  <CardDescription>{test.description}</CardDescription>
                  <p className="text-sm text-muted-foreground mt-2">
                    Durasi: {test.duration_minutes} menit
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={test.is_active}
                    onCheckedChange={(checked) => handleToggleActive(test.id, checked)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedTest(test);
                    setShowQuestionManager(true);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Kelola Pertanyaan
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditTest(test)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteTest(test.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tests.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">Belum Ada Tes</h3>
          <p className="text-muted-foreground mb-4">
            Mulai dengan membuat tes psikologi pertama Anda.
          </p>
          <Button onClick={handleCreateTest}>
            <Plus className="h-4 w-4 mr-2" />
            Buat Tes Pertama
          </Button>
        </div>
      )}

      <TestFormDialog
        test={editingTest}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingTest(null);
        }}
        onSave={handleSaveTest}
      />
    </div>
  );
};

interface TestFormDialogProps {
  test: TestTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    category: string;
    duration_minutes: number;
    instructions: string;
    is_active: boolean;
  }) => void;
}

const TestFormDialog = ({ test, isOpen, onClose, onSave }: TestFormDialogProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Kepribadian',
    duration_minutes: 15,
    instructions: '',
    is_active: true
  });

  useEffect(() => {
    if (test) {
      setFormData({
        title: test.title,
        description: test.description,
        category: test.category,
        duration_minutes: test.duration_minutes,
        instructions: test.instructions || '',
        is_active: test.is_active
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'Kepribadian',
        duration_minutes: 15,
        instructions: '',
        is_active: true
      });
    }
  }, [test]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {test?.id ? 'Edit Tes' : 'Buat Tes Baru'}
          </DialogTitle>
          <DialogDescription>
            Isi informasi dasar tes psikologi. Anda dapat menambahkan pertanyaan setelah tes dibuat.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Judul Tes</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kepribadian">Kepribadian</SelectItem>
                  <SelectItem value="Mental Health">Mental Health</SelectItem>
                  <SelectItem value="Akademik">Akademik</SelectItem>
                  <SelectItem value="Karir">Karir</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="duration">Durasi (menit)</Label>
              <Input
                id="duration"
                type="number"
                min="5"
                max="120"
                value={formData.duration_minutes}
                onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) }))}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="instructions">Petunjuk Tes</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Berikan petunjuk untuk peserta tes..."
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active">Aktifkan tes</Label>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              {test?.id ? 'Simpan Perubahan' : 'Buat Tes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
