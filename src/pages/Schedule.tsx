
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScheduleForm } from "@/components/Schedule/ScheduleForm";
import { ScheduleList } from "@/components/Schedule/ScheduleList";
import { MultiWhatsAppSender } from "@/components/WhatsApp/MultiWhatsAppSender";
import { FeatureGuide } from "@/components/Guide/FeatureGuide";
import { Helmet } from "react-helmet-async";

const Schedule = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <Layout>
      <Helmet>
        <title>Jadwal Konseling - BK Connect</title>
      </Helmet>
      
      <div className="container mx-auto p-4 animate-fadeIn">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          <div className="w-full lg:w-1/3 space-y-6">
            <Card className="animate-slideInLeft">
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
                  className="mt-4 w-full transition-all duration-200 transform hover:scale-105"
                  onClick={() => setIsFormOpen(true)}
                >
                  Tambah Jadwal Baru
                </Button>
              </CardContent>
            </Card>

            <MultiWhatsAppSender />
          </div>
          
          <div className="w-full lg:w-2/3">
            <ScheduleList selectedDate={date} />
          </div>
        </div>
      </div>
      
      <ScheduleForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        selectedDate={date}
      />
      
      <FeatureGuide />
    </Layout>
  );
};

export default Schedule;
