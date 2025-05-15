
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Data contoh
const studentData = [
  {
    id: 1,
    name: "Ahmad Fauzi",
    kelas: "X-A",
    issues: ["Akademik", "Karier"],
    details: "Kesulitan dalam matematika, bingung memilih jurusan kuliah"
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    kelas: "X-A",
    issues: ["Sosial"],
    details: "Kesulitan beradaptasi dengan lingkungan baru"
  },
  {
    id: 3,
    name: "Budi Santoso",
    kelas: "X-B",
    issues: ["Akademik", "Pribadi"],
    details: "Nilai menurun, sering terlihat murung"
  },
  {
    id: 4,
    name: "Dewi Lestari",
    kelas: "X-B",
    issues: ["Sosial", "Keluarga"],
    details: "Konflik dengan teman, orang tua bercerai"
  },
  {
    id: 5,
    name: "Gita Savitri",
    kelas: "XI-B",
    issues: ["Pribadi", "Keluarga", "Sosial"],
    details: "Kurang percaya diri, konflik keluarga, sering menyendiri"
  }
];

export function IssueSearch() {
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [currentTab, setCurrentTab] = useState("kategori");
  
  const issueCategories = ["Akademik", "Sosial", "Pribadi", "Karier", "Keluarga"];

  // Filter students based on selected issues and class
  const filteredStudents = studentData.filter(student => 
    (selectedIssues.length === 0 || selectedIssues.some(issue => student.issues.includes(issue))) &&
    (selectedKelas === "" || student.kelas === selectedKelas)
  );

  const handleIssueToggle = (issue: string) => {
    setSelectedIssues(prev => 
      prev.includes(issue)
        ? prev.filter(item => item !== issue)
        : [...prev, issue]
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Cari Siswa Berdasarkan Masalah</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="kategori">Berdasarkan Kategori</TabsTrigger>
              <TabsTrigger value="kelas">Berdasarkan Kelas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="kategori" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {issueCategories.map(issue => (
                  <div key={issue} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`issue-${issue}`}
                      checked={selectedIssues.includes(issue)}
                      onCheckedChange={() => handleIssueToggle(issue)}
                    />
                    <Label htmlFor={`issue-${issue}`}>{issue}</Label>
                  </div>
                ))}
              </div>
              
              <Button 
                className="w-full bg-counseling-blue hover:bg-blue-600"
                disabled={selectedIssues.length === 0}
              >
                Cari Siswa
              </Button>
            </TabsContent>
            
            <TabsContent value="kelas" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="kelas">Pilih Kelas</Label>
                <Select value={selectedKelas} onValueChange={setSelectedKelas}>
                  <SelectTrigger id="kelas">
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Kelas</SelectItem>
                    <SelectItem value="X-A">X-A</SelectItem>
                    <SelectItem value="X-B">X-B</SelectItem>
                    <SelectItem value="XI-A">XI-A</SelectItem>
                    <SelectItem value="XI-B">XI-B</SelectItem>
                    <SelectItem value="XII-A">XII-A</SelectItem>
                    <SelectItem value="XII-B">XII-B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="w-full bg-counseling-blue hover:bg-blue-600"
              >
                Lihat Siswa
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {(selectedIssues.length > 0 || selectedKelas !== "") && (
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Hasil Pencarian
              {selectedIssues.length > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({selectedIssues.join(", ")})
                </span>
              )}
              {selectedKelas && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  Kelas: {selectedKelas}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border shadow-sm">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Siswa</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Kategori Masalah</TableHead>
                      <TableHead>Detail</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.kelas}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {student.issues.map((issue, i) => (
                                <span 
                                  key={i} 
                                  className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                                    selectedIssues.includes(issue) 
                                      ? "bg-counseling-lightBlue text-blue-800" 
                                      : "bg-gray-100"
                                  }`}
                                >
                                  {issue}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{student.details}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          Tidak ada siswa yang sesuai dengan kriteria pencarian
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
