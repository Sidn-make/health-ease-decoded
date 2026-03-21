import { motion } from "framer-motion";
import { User, FileText, Bell, HelpCircle, LogOut, ChevronRight } from "lucide-react";

const menuItems = [
  { icon: FileText, label: "My Documents", desc: "View scanned documents" },
  { icon: Bell, label: "Notifications", desc: "Manage alerts" },
  { icon: HelpCircle, label: "Help Center", desc: "FAQs and support" },
  { icon: LogOut, label: "Sign Out", desc: "Log out of your account" },
];

const ProfilePage = () => {
  return (
    <div className="min-h-screen pb-24">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-bold text-foreground">Profile</h1>
      </div>

      <div className="px-5">
        {/* Avatar card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 shadow-card flex items-center gap-4 mb-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
            <User size={24} className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">Guest User</p>
            <p className="text-xs text-muted-foreground">Sign in to save your documents</p>
          </div>
        </motion.div>

        {/* Menu */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          {menuItems.map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="w-full flex items-center gap-3 px-5 py-4 active:bg-muted/50 transition-colors"
            >
              <item.icon size={18} className="text-muted-foreground" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-[11px] text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground/50" />
            </motion.button>
          ))}
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-6">ClearCare v1.0</p>
      </div>
    </div>
  );
};

export default ProfilePage;
