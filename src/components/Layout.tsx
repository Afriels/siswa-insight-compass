
import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home, Users, Calendar, MessageSquare, Search, 
  BarChart3, UserCog, Menu, LogOut, Brain, 
  BookOpen, MessageCircle, ClipboardCheck
} from "lucide-react";

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<{ role: string } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Different navigation items based on user role
  const getNavigationItems = () => {
    const isStudent = userProfile?.role === 'student';
    const isAdmin = userProfile?.role === 'admin';
    const isCounselor = userProfile?.role === 'counselor';

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

    // Admin and Counselor get full access
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

  const navigationItems = getNavigationItems();

  const NavItems = () => (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.to || 
          (item.to !== "/" && location.pathname.startsWith(item.to));
        
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-counseling-blue text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4 mb-8">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://sman1lumbang.sch.id/wp-content/uploads/2022/12/logo-smanilum-60mm.png" 
                  alt="Logo" 
                  className="h-8 w-8"
                />
                <div>
                  <h1 className="text-xl font-bold text-counseling-blue">BK Connect</h1>
                  <p className="text-xs text-gray-500">Sistem Bimbingan Konseling</p>
                </div>
              </div>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              <NavItems />
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-counseling-blue flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {userProfile?.role || 'User'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-3">
            <img 
              src="https://sman1lumbang.sch.id/wp-content/uploads/2022/12/logo-smanilum-60mm.png" 
              alt="Logo" 
              className="h-6 w-6"
            />
            <h1 className="text-lg font-bold text-counseling-blue">BK Connect</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-full flex-col">
                  <div className="flex items-center space-x-3 px-4 py-6 border-b">
                    <img 
                      src="https://sman1lumbang.sch.id/wp-content/uploads/2022/12/logo-smanilum-60mm.png" 
                      alt="Logo" 
                      className="h-8 w-8"
                    />
                    <div>
                      <h1 className="text-xl font-bold text-counseling-blue">BK Connect</h1>
                      <p className="text-xs text-gray-500">Sistem Bimbingan Konseling</p>
                    </div>
                  </div>
                  
                  <nav className="flex-1 space-y-1 px-2 py-4">
                    <NavItems />
                  </nav>
                  
                  <div className="border-t border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-counseling-blue flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {user?.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user?.email}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {userProfile?.role || 'User'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <LogOut size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-64">
        <main className="p-4 md:p-8">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
