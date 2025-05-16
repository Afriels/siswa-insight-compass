
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScheduleForm } from "@/components/Schedule/ScheduleForm";
import { ScheduleList } from "@/components/Schedule/ScheduleList";
import { Helmet } from "react-helmet-async";

const Schedule = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <Layout>
      <Helmet>
        <title>Jadwal Konseling - BK Connect</title>
      </Helmet>
      
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="w-full md:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>Kalender</CardTitle>
                <CardDescription>Pilih tanggal untuk melihat jadwal</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
                <Button 
                  className="mt-4 w-full"
                  onClick={() => setIsFormOpen(true)}
                >
                  Tambah Jadwal Baru
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full md:w-2/3">
            <ScheduleList selectedDate={date} />
          </div>
        </div>
      </div>
      
      <ScheduleForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        selectedDate={date}
      />
    </Layout>
  );
};

export default Schedule;
