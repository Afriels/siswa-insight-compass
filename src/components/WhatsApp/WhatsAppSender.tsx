
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WhatsAppSenderProps {
  studentName?: string;
  studentPhone?: string;
  defaultMessage?: string;
}

export const WhatsAppSender = ({ studentName, studentPhone, defaultMessage }: WhatsAppSenderProps) => {
  const [phone, setPhone] = useState(studentPhone || "");
  const [message, setMessage] = useState(defaultMessage || "");
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!phone || !message) {
      toast({
        title: "Error",
        description: "Nomor telepon dan pesan harus diisi",
        variant: "destructive",
      });
      return;
    }

    // Format phone number (remove non-digits and add +62)
    const formattedPhone = phone.replace(/\D/g, "").replace(/^0/, "62");
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, "_blank");
    
    toast({
      title: "WhatsApp dibuka",
      description: "Pesan telah disiapkan untuk dikirim melalui WhatsApp",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Kirim Pesan WhatsApp
        </CardTitle>
        <CardDescription>
          {studentName ? `Kirim pesan ke ${studentName}` : "Kirim pesan ke orang tua/wali siswa"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="phone">Nomor WhatsApp</Label>
          <Input
            id="phone"
            placeholder="08123456789"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="message">Pesan</Label>
          <textarea
            id="message"
            className="w-full min-h-[100px] p-3 border rounded-md resize-none"
            placeholder="Tuliskan pesan Anda..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <Button onClick={handleSendMessage} className="w-full">
          <MessageCircle className="h-4 w-4 mr-2" />
          Kirim via WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
};
