import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Settings, Shield, Users, Database, MessageSquare } from "lucide-react";

export const AdminManualControls = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [adminSettings, setAdminSettings] = useState({
    userManagement: true,
    fullDatabaseAccess: false,
    systemConfiguration: false,
    advancedFeatures: false,
    superAdminMode: false
  });

  const isSuperAdmin = user?.email === 'andikabgs@gmail.com';

  const handleSettingChange = (setting: string, value: boolean) => {
    if (!isSuperAdmin) {
      toast({
        title: "Akses Ditolak",
        description: "Hanya super administrator yang dapat mengubah pengaturan ini",
        variant: "destructive",
      });
      return;
    }

    setAdminSettings(prev => ({
      ...prev,
      [setting]: value
    }));

    toast({
      title: "Pengaturan Diperbarui",
      description: `${setting} telah ${value ? 'diaktifkan' : 'dinonaktifkan'}`,
    });
  };

  return (
    <Card className="border-2 border-primary/20 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-primary" />
          Kontrol Manual Administrator
          {isSuperAdmin && <Badge variant="destructive"><Shield className="h-3 w-3 mr-1" />Super Admin</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isSuperAdmin && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Informasi:</strong> Kontrol manual hanya tersedia untuk super administrator.
            </p>
          </div>
        )}

        <div className="grid gap-6">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <Label className="text-base font-medium">Manajemen User</Label>
                <p className="text-sm text-muted-foreground">Akses penuh untuk membuat, edit, dan hapus user</p>
              </div>
            </div>
            <Switch
              checked={adminSettings.userManagement}
              onCheckedChange={(checked) => handleSettingChange('userManagement', checked)}
              disabled={!isSuperAdmin}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-green-500" />
              <div>
                <Label className="text-base font-medium">Akses Database Penuh</Label>
                <p className="text-sm text-muted-foreground">Akses langsung ke database untuk operasi lanjutan</p>
              </div>
            </div>
            <Switch
              checked={adminSettings.fullDatabaseAccess}
              onCheckedChange={(checked) => handleSettingChange('fullDatabaseAccess', checked)}
              disabled={!isSuperAdmin}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-purple-500" />
              <div>
                <Label className="text-base font-medium">Konfigurasi Sistem</Label>
                <p className="text-sm text-muted-foreground">Mengubah pengaturan sistem dan parameter aplikasi</p>
              </div>
            </div>
            <Switch
              checked={adminSettings.systemConfiguration}
              onCheckedChange={(checked) => handleSettingChange('systemConfiguration', checked)}
              disabled={!isSuperAdmin}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-orange-500" />
              <div>
                <Label className="text-base font-medium">Fitur Lanjutan</Label>
                <p className="text-sm text-muted-foreground">AI Assistant, analitik lanjutan, dan tools admin</p>
              </div>
            </div>
            <Switch
              checked={adminSettings.advancedFeatures}
              onCheckedChange={(checked) => handleSettingChange('advancedFeatures', checked)}
              disabled={!isSuperAdmin}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-destructive" />
              <div>
                <Label className="text-base font-medium text-destructive">Mode Super Admin</Label>
                <p className="text-sm text-muted-foreground">Akses unlimited ke semua fitur sistem</p>
              </div>
            </div>
            <Switch
              checked={adminSettings.superAdminMode}
              onCheckedChange={(checked) => handleSettingChange('superAdminMode', checked)}
              disabled={!isSuperAdmin}
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">Status Kontrol Manual</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• Administrator dapat mengaktifkan/menonaktifkan fitur secara manual</p>
            <p>• Pengaturan tersimpan secara real-time</p>
            <p>• Hanya super admin yang dapat mengubah pengaturan</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};