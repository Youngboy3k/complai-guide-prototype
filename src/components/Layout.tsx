import { NavLink, Outlet } from "react-router-dom";
import { Upload, FileText, MessageCircle, Lightbulb } from "lucide-react";

const Layout = () => {
  const navItems = [
    { path: "/", label: "Dashboard", icon: Upload },
    { path: "/upload", label: "Upload", icon: Upload },
    { path: "/report", label: "Reports", icon: FileText },
    { path: "/chat", label: "AI Assistant", icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-atmospheric flex">
      {/* Apple-style Sidebar */}
      <aside className="w-72 bg-white/80 backdrop-blur-sm border-r border-border/30 flex-shrink-0 shadow-subtle">
        <div className="p-6 h-full flex flex-col">
          {/* App Logo/Title */}
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-soft">
              <div className="w-5 h-5 bg-white rounded opacity-90"></div>
            </div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">ComplAIance Group</h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `flex items-center space-x-4 px-4 py-3 rounded-2xl text-[15px] font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-primary text-white shadow-soft"
                        : "text-muted-foreground hover:text-foreground hover:bg-gray-50 hover:-translate-y-0.5"
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Pro Tips Section */}
          <div className="mt-auto bg-gradient-blue-subtle rounded-2xl p-5 border border-primary/10">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-[15px] text-foreground">Pro Tips</h3>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Upload multiple PDFs to compare compliance across documents and identify patterns.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;