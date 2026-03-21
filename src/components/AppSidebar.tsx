import { Plus, FileText, MessageCircle, Settings, LogOut, Shield } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

type Entry = { id: string; title: string; created_at: string; document_type: string | null };

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, signOut } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchEntries = async () => {
      const { data } = await supabase
        .from("scan_entries")
        .select("id, title, created_at, document_type")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (data) setEntries(data);
    };
    fetchEntries();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Logo */}
        <div className="px-4 py-4 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
            <Shield size={16} className="text-primary-foreground" />
          </div>
          {!collapsed && <span className="text-base font-bold text-foreground">ClearCare</span>}
        </div>

        {/* New Entry */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/app" end className="hover:bg-muted/50" activeClassName="bg-muted text-primary font-medium">
                    <Plus className="mr-2 h-4 w-4" />
                    {!collapsed && <span>New Scan</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/app/chat" className="hover:bg-muted/50" activeClassName="bg-muted text-primary font-medium">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {!collapsed && <span>AI Chat</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Previous Entries */}
        {!collapsed && entries.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Previous Scans</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {entries.map((entry) => (
                  <SidebarMenuItem key={entry.id}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={`/app/entry/${entry.id}`}
                        className="hover:bg-muted/50"
                        activeClassName="bg-muted text-primary font-medium"
                      >
                        <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="truncate text-sm">{entry.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/app/profile" className="hover:bg-muted/50" activeClassName="bg-muted text-primary font-medium">
                <Settings className="mr-2 h-4 w-4" />
                {!collapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} className="hover:bg-destructive/10 text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              {!collapsed && <span>Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
