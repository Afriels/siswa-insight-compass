
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function SociogramFilter() {
  const [kelas, setKelas] = useState("");
  const [tipe, setTipe] = useState("");

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Filter Sosiogram</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="kelas" className="text-sm font-medium">Kelas</label>
              <Select value={kelas} onValueChange={setKelas}>
                <SelectTrigger id="kelas">
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10a">X-A</SelectItem>
                  <SelectItem value="10b">X-B</SelectItem>
                  <SelectItem value="11a">XI-A</SelectItem>
                  <SelectItem value="11b">XI-B</SelectItem>
                  <SelectItem value="12a">XII-A</SelectItem>
                  <SelectItem value="12b">XII-B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="tipe" className="text-sm font-medium">Tipe Sosiometri</label>
              <Select value={tipe} onValueChange={setTipe}>
                <SelectTrigger id="tipe">
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teman">Pilihan Teman</SelectItem>
                  <SelectItem value="kelompok">Pilihan Kelompok Belajar</SelectItem>
                  <SelectItem value="pemimpin">Pilihan Pemimpin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button className="w-full bg-counseling-blue hover:bg-blue-600">
            Terapkan Filter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
