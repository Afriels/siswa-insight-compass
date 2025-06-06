
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Plus, X, Send, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WhatsAppTemplate {
  id: string;
  name: string;
  subject: string;
  message_template: string;
  category: string;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
}

export const MultiWhatsAppSender = () => {
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [contacts, setContacts] = useState<Contact[]>([{ id: "1", name: "", phone: "" }]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_templates')
        .select('*')
        .order('category', { ascending: true });
      
      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      console.error("Error loading templates:", error);
      toast({
        title: "Gagal memuat template",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addContact = () => {
    const newContact = {
      id: Date.now().toString(),
      name: "",
      phone: ""
    };
    setContacts([...contacts, newContact]);
  };

  const removeContact = (id: string) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter(contact => contact.id !== id));
    }
  };

  const updateContact = (id: string, field: 'name' | 'phone', value: string) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, [field]: value } : contact
    ));
  };

  const selectTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setMessage(template.message_template);
    }
  };

  const sendBulkWhatsApp = () => {
    const validContacts = contacts.filter(c => c.name && c.phone && message);
    
    if (validContacts.length === 0) {
      toast({
        title: "Error",
        description: "Pastikan setidaknya ada satu kontak dengan nama, nomor, dan pesan yang lengkap",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    validContacts.forEach((contact, index) => {
      setTimeout(() => {
        // Replace template variables
        let personalizedMessage = message
          .replace(/{student_name}/g, contact.name)
          .replace(/{parent_name}/g, contact.name);

        // Format phone number
        const formattedPhone = contact.phone.replace(/\D/g, "").replace(/^0/, "62");
        const encodedMessage = encodeURIComponent(personalizedMessage);
        const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, "_blank");
      }, index * 500); // Delay each message by 500ms
    });

    setIsLoading(false);
    
    toast({
      title: "WhatsApp dibuka",
      description: `${validContacts.length} pesan telah disiapkan untuk dikirim melalui WhatsApp`,
    });
  };

  return (
    <Card className="animate-fadeIn">
      <CardHeader className="animate-slideInDown">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Kirim Pesan WhatsApp Massal
        </CardTitle>
        <CardDescription>
          Kirim pesan WhatsApp ke multiple kontak menggunakan template
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 animate-slideInUp">
        {/* Template Selection */}
        <div className="space-y-2">
          <Label htmlFor="template">Template Pesan</Label>
          <Select value={selectedTemplate} onValueChange={selectTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih template..." />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{template.category}</Badge>
                    {template.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Message Content */}
        <div className="space-y-2">
          <Label htmlFor="message">Pesan</Label>
          <Textarea
            id="message"
            className="min-h-[120px] transition-all duration-200 hover:border-blue-300 focus:border-blue-500"
            placeholder="Tulis pesan Anda atau pilih template..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Gunakan {"{student_name}"} atau {"{parent_name}"} untuk personalisasi
          </p>
        </div>

        {/* Contacts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Daftar Kontak</Label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addContact}
              className="transition-all duration-200 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4 mr-1" />
              Tambah Kontak
            </Button>
          </div>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {contacts.map((contact, index) => (
              <div 
                key={contact.id} 
                className="flex gap-3 p-3 border rounded-lg bg-gray-50 animate-slideInRight"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-1">
                  <Input
                    placeholder="Nama kontak"
                    value={contact.name}
                    onChange={(e) => updateContact(contact.id, 'name', e.target.value)}
                    className="mb-2 transition-all duration-200 hover:border-blue-300"
                  />
                  <Input
                    placeholder="08123456789"
                    value={contact.phone}
                    onChange={(e) => updateContact(contact.id, 'phone', e.target.value)}
                    className="transition-all duration-200 hover:border-blue-300"
                  />
                </div>
                {contacts.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeContact(contact.id)}
                    className="mt-2 text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Send Button */}
        <Button 
          onClick={sendBulkWhatsApp} 
          className="w-full bg-green-600 hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
          disabled={isLoading}
        >
          <Send className="h-4 w-4 mr-2" />
          {isLoading ? "Mengirim..." : `Kirim ke ${contacts.filter(c => c.name && c.phone).length} Kontak`}
        </Button>
      </CardContent>
    </Card>
  );
};
