
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Home, Users, Database, Search, ChartBar } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/"
    },
    {
      title: "Data Siswa",
      icon: Users,
      path: "/students"
    },
    {
      title: "Sosiogram",
      icon: ChartBar,
      path: "/sociogram"
    },
    {
      title: "Pencarian Masalah",
      icon: Search,
      path: "/issues"
    },
    {
      title: "Pendataan Perilaku",
      icon: Database,
      path: "/behavior"
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar location={location} menuItems={menuItems} />
        <div className="flex-1 flex flex-col">
          <div className="p-4 flex items-center border-b bg-white">
            <SidebarTrigger className="mr-2">
              <div className="h-6 w-6 flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </div>
            </SidebarTrigger>
            <h1 className="text-xl font-semibold text-counseling-blue">BK Connect</h1>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

interface AppSidebarProps {
  location: ReturnType<typeof useLocation>;
  menuItems: Array<{
    title: string;
    icon: React.FC<any>;
    path: string;
  }>;
}

function AppSidebar({ location, menuItems }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4 mb-4">
          <h2 className="font-bold text-xl text-counseling-blue flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            BK Connect
          </h2>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={cn(
                    "flex gap-2 items-center",
                    location.pathname === item.path && "bg-counseling-lightBlue text-counseling-blue font-medium"
                  )}>
                    <Link to={item.path}>
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
