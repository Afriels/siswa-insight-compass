
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Data contoh
const studentData = [
  {
    id: 1,
    nis: "10001",
    name: "Ahmad Fauzi",
    kelas: "X-A",
    gender: "Laki-laki",
    socialScore: "Tinggi",
    issues: ["Akademik", "Karier"]
  },
  {
    id: 2,
    nis: "10002",
    name: "Siti Nurhaliza",
    kelas: "X-A",
    gender: "Perempuan",
    socialScore: "Sedang",
    issues: ["Sosial"]
  },
  {
    id: 3,
    nis: "10003",
    name: "Budi Santoso",
    kelas: "X-B",
    gender: "Laki-laki",
    socialScore: "Rendah",
    issues: ["Akademik", "Pribadi"]
  },
  {
    id: 4,
    nis: "10004",
    name: "Dewi Lestari",
    kelas: "X-B",
    gender: "Perempuan",
    socialScore: "Tinggi",
    issues: ["Sosial", "Keluarga"]
  },
  {
    id: 5,
    nis: "11001",
    name: "Eko Prasetyo",
    kelas: "XI-A",
    gender: "Laki-laki",
    socialScore: "Sedang",
    issues: ["Karier"]
  },
  {
    id: 6,
    nis: "11002",
    name: "Fira Amalia",
    kelas: "XI-A",
    gender: "Perempuan",
    socialScore: "Tinggi",
    issues: []
  },
  {
    id: 7,
    nis: "11003",
    name: "Gita Savitri",
    kelas: "XI-B",
    gender: "Perempuan",
    socialScore: "Rendah",
    issues: ["Pribadi", "Keluarga", "Sosial"]
  }
];

export function StudentTable() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter students based on search term
  const filteredStudents = studentData.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.nis.includes(searchTerm)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h2 className="text-xl font-semibold">Data Siswa</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Cari siswa..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NIS</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Skor Sosial</TableHead>
                <TableHead>Masalah</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.nis}</TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.kelas}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.socialScore === "Tinggi" ? "bg-counseling-lightGreen text-green-800" :
                      student.socialScore === "Sedang" ? "bg-counseling-lightBlue text-blue-800" :
                      "bg-counseling-lightPurple text-purple-800"
                    }`}>
                      {student.socialScore}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {student.issues.length > 0 ? student.issues.map((issue, i) => (
                        <span key={i} className="inline-block px-2 py-0.5 bg-gray-100 text-xs rounded-full">
                          {issue}
                        </span>
                      )) : (
                        <span className="text-gray-400 text-xs">Tidak ada</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Detail</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
