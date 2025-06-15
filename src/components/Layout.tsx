
import { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { LogOut, Home, Users, Calendar, MessageSquare, ClipboardCheck, BarChart3, Search, Brain, MessageCircle, BookOpen, UserCog, Menu } from "lucide-react";

export const Layout = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<{ role: string } | null>(null);

  useEffect(() => {
    // Fetch the profile once on mount
    const fetchProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (!error && data) setUserProfile(data);
      else setUserProfile({ role: "student" });
    };
    fetchProfile();
  }, [user]);

  const navigationItems = () => {
    const isStudent = userProfile?.role === "student";
    const isAdmin = userProfile?.role === "admin";
    if (isStudent) {
      return [
        { to: "/", icon: Home, label: "Dashboard" },
        { to: "/consultation", icon: MessageSquare, label: "Konsultasi" },
        { to: "/psychology-test", icon: Brain, label: "Tes Psikologi" },
        { to: "/forum", icon: MessageCircle, label: "Forum" },
        { to: "/ai-assistant", icon: BookOpen, label: "AI Assistant" },
        { to: "/profile", icon: UserCog, label: "Profil" },
      ];
    }
    return [
      { to: "/", icon: Home, label: "Dashboard" },
      { to: "/students", icon: Users, label: "Siswa" },
      { to: "/schedule", icon: Calendar, label: "Jadwal" },
      { to: "/consultation", icon: MessageSquare, label: "Konsultasi" },
      { to: "/behavior", icon: ClipboardCheck, label: "Perilaku" },
      { to: "/behavior-history", icon: BarChart3, label: "Riwayat Perilaku" },
      { to: "/issues", icon: Search, label: "Pencarian Masalah" },
      { to: "/sociogram", icon: BarChart3, label: "Sosiogram" },
      { to: "/psychology-test", icon: Brain, label: "Tes Psikologi" },
      { to: "/forum", icon: MessageCircle, label: "Forum" },
      { to: "/ai-assistant", icon: BookOpen, label: "AI Assistant" },
      ...(isAdmin ? [{ to: "/admin", icon: UserCog, label: "Admin" }] : []),
      { to: "/profile", icon: UserCog, label: "Profil" },
    ];
  };

  const onMenuClick = (to: string) => {
    navigate(to);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gradient-to-br from-blue-100 via-white to-violet-100 dark:from-[#10111b] dark:via-[#15041f] dark:to-[#1a2431] transition-colors duration-700">
        {/* Sidebar */}
        <Sidebar className="shadow-xl border-r border-blue-50 dark:border-[#222030] bg-white/90 dark:bg-[#12041d]/80 backdrop-blur-lg transition-all">
          <SidebarHeader>
            <div className="flex items-center gap-3 py-2 px-2">
              <img
                src="https://sman1lumbang.sch.id/wp-content/uploads/2022/12/logo-smanilum-60mm.png"
                alt="Logo"
                className="h-9 w-9 rounded-lg border-2 border-blue-300 shadow"
              />
              <div>
                <div className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-700 text-transparent bg-clip-text animate-fadeIn">BK Connect</div>
                <span className="block text-xs text-blue-400 dark:text-purple-200 font-medium">Sistem BK Digital</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="pt-1">
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems().map((item) => {
                    const isCurrent = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));
                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton
                          isActive={isCurrent}
                          className="hover:scale-105 transition bg-gradient-to-l from-blue-50 dark:from-indigo-900 to-white/70 dark:to-transparent"
                          onClick={() => onMenuClick(item.to)}
                        >
                          <item.icon size={18} className={`mr-1 ${isCurrent ? "text-blue-700 dark:text-violet-300" : "text-gray-500 dark:text-gray-200"}`} />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center p-2 gap-2 bg-gradient-to-r from-blue-100 via-white to-violet-100 dark:from-violet-950 dark:to-indigo-950 rounded-lg mt-3 animate-fadeIn">
              <div className="h-8 w-8 bg-blue-600 flex items-center justify-center text-white font-bold rounded-full shadow animate-pulse">{user?.email?.charAt(0).toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-gray-800 dark:text-gray-50 truncate">{user?.email}</div>
                <div className="text-[10px] capitalize text-gray-400 dark:text-gray-300">{userProfile?.role || "User"}</div>
              </div>
              <ThemeToggle />
              <button
                onClick={async () => { await signOut(); navigate("/auth"); }}
                className="ml-1 text-gray-400 hover:text-red-500 transition"
                title="Keluar"
              >
                <LogOut size={16} />
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 min-w-0">
          {/* Topbar for mobile */}
          <div className="md:hidden flex justify-between items-center px-4 py-2 bg-gradient-to-l from-blue-50 via-white to-violet-100 dark:from-violet-950 dark:to-indigo-950 shadow-[0_2px_8px_0_#0001] z-10 sticky top-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger>
                <Menu />
              </SidebarTrigger>
              <img src="https://sman1lumbang.sch.id/wp-content/uploads/2022/12/logo-smanilum-60mm.png" alt="Logo" className="h-8 w-8" />
              <span className="font-bold text-blue-600 text-base">BK Connect</span>
            </div>
            <ThemeToggle />
          </div>
          <main className="p-2 md:p-8 max-w-screen-2xl mx-auto animate-fadeIn">
            <div className="rounded-2xl shadow-lg p-2 md:p-5 bg-white/80 dark:bg-slate-950/70 transition-all duration-700 min-h-[86vh]">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
