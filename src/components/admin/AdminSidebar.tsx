import { 
  LayoutDashboard, 
  Mail, 
  Megaphone, 
  Settings, 
  BarChart3, 
  Image,
  Search,
  LogOut,
  Home
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Advertisements", url: "/admin/ads", icon: Megaphone },
  { title: "Email Campaigns", url: "/admin/emails", icon: Mail },
  { title: "Banners", url: "/admin/banners", icon: Image },
  { title: "SEO Settings", url: "/admin/seo", icon: Search },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Site Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-lg">
            <span>P</span>
          </div>
          <div>
            <h2 className="font-bold text-foreground">PDFHubs</h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink 
                    to={item.url} 
                    end={item.url === "/admin"}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary text-primary-foreground shadow-md' 
                          : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.title}</span>
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border space-y-2">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          onClick={() => navigate('/')}
        >
          <Home className="h-4 w-4" />
          Back to Site
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
