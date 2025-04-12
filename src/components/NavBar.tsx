import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { Menu, Bell, Search, User, LogOut, Stethoscope } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const NavBar = () => {
  const { user, logout, switchRole, isAuthenticated, notifications } =
    useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSwitchDialog, setShowSwitchDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<
    "SuperAdmin" | "SubAdmin" | "Secretary" | null
  >(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRoleSelect = (role: "SuperAdmin" | "SubAdmin" | "Secretary") => {
    setSelectedRole(role);
    setShowSwitchDialog(true);
  };

  const handleConfirmSwitch = () => {
    if (selectedRole) {
      switchRole(selectedRole);
      setShowSwitchDialog(false);
      navigate("/login");
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      toast({
        title: "نتائج البحث",
        description: `جاري البحث عن: ${searchQuery}`,
      });
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      return;
    }

    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="border-b bg-white py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-clinic-primary flex items-center"
          >
            <Stethoscope className="ml-2 h-6 w-6" />
            عيادة
          </Link>

          <div className="hidden md:flex space-x-8 space-x-reverse mr-10">
            <button
              onClick={() => navigate("/")}
              className="text-gray-700 hover:text-clinic-primary"
            >
              الرئيسية
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-gray-700 hover:text-clinic-primary"
            >
              من نحن
            </button>
            <button
              onClick={() => scrollToSection("specializations")}
              className="text-gray-700 hover:text-clinic-primary"
            >
              التخصصات
            </button>
            <button
              onClick={() => scrollToSection("clinics")}
              className="text-gray-700 hover:text-clinic-primary"
            >
              العيادات
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-gray-700 hover:text-clinic-primary"
            >
              اتصل بنا
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4 space-x-reverse">
          {isAuthenticated ? (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-600">
                    <Search className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="البحث عن عيادات، مواعيد..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSearch();
                          }
                        }}
                      />
                      <Button size="sm" onClick={handleSearch}>
                        بحث
                      </Button>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {searchQuery ? "اضغط Enter للبحث" : "ابدأ الكتابة للبحث"}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-gray-600"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 space-y-4">
                    <div className="font-medium">الإشعارات</div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="text-center text-muted-foreground p-4">
                          لا توجد إشعارات
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 rounded-lg ${
                              notification.read ? "bg-gray-50" : "bg-blue-50"
                            }`}
                          >
                            <div className="font-medium">
                              {notification.title}
                            </div>
                            <div className="text-sm text-gray-600">
                              {notification.message}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(
                                notification.timestamp
                              ).toLocaleDateString("ar-EG")}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-clinic-primary">
                        {user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div>{user?.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {user?.email}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => handleRoleSelect("SuperAdmin")}
                  >
                    <User className="ml-2 h-4 w-4" />
                    <span>مدير عام</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleRoleSelect("SubAdmin")}
                  >
                    <User className="ml-2 h-4 w-4" />
                    <span>مدير فرعي</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleRoleSelect("Secretary")}
                  >
                    <User className="ml-2 h-4 w-4" />
                    <span>سكرتير</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link to={`/${user?.role}`}>
                      <span>لوحة التحكم</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="ml-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">تسجيل الدخول</Button>
              </Link>
              <Link to="/register">
                <Button>تسجيل جديد</Button>
              </Link>
            </>
          )}

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-10">
                  <button
                    onClick={() => {
                      navigate("/");
                      document
                        .querySelector('button[aria-label="Close"]')
                        ?.dispatchEvent(new Event("click"));
                    }}
                    className="text-xl font-medium py-2 hover:text-clinic-primary"
                  >
                    الرئيسية
                  </button>
                  <button
                    onClick={() => {
                      scrollToSection("about");
                      document
                        .querySelector('button[aria-label="Close"]')
                        ?.dispatchEvent(new Event("click"));
                    }}
                    className="text-xl font-medium py-2 hover:text-clinic-primary"
                  >
                    من نحن
                  </button>
                  <button
                    onClick={() => {
                      scrollToSection("specializations");
                      document
                        .querySelector('button[aria-label="Close"]')
                        ?.dispatchEvent(new Event("click"));
                    }}
                    className="text-xl font-medium py-2 hover:text-clinic-primary"
                  >
                    التخصصات
                  </button>
                  <button
                    onClick={() => {
                      scrollToSection("clinics");
                      document
                        .querySelector('button[aria-label="Close"]')
                        ?.dispatchEvent(new Event("click"));
                    }}
                    className="text-xl font-medium py-2 hover:text-clinic-primary"
                  >
                    العيادات
                  </button>
                  <button
                    onClick={() => {
                      scrollToSection("contact");
                      document
                        .querySelector('button[aria-label="Close"]')
                        ?.dispatchEvent(new Event("click"));
                    }}
                    className="text-xl font-medium py-2 hover:text-clinic-primary"
                  >
                    اتصل بنا
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <Dialog open={showSwitchDialog} onOpenChange={setShowSwitchDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تغيير نوع الحساب</DialogTitle>
            <DialogDescription>
              للتبديل إلى حساب{" "}
              {selectedRole === "SuperAdmin"
                ? "المدير العام"
                : selectedRole === "SubAdmin"
                ? "المدير الفرعي"
                : "السكرتير"}
              ، يجب عليك إدخال بيانات الدخول الخاصة بهذا الحساب.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              variant="secondary"
              onClick={() => setShowSwitchDialog(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleConfirmSwitch}>تأكيد</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default NavBar;
