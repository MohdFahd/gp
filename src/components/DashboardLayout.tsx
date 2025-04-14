import { useState, ReactNode, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import {
  BarChart3,
  Calendar,
  CreditCard,
  Home,
  LogOut,
  Menu,
  Settings,
  User,
  X,
  Bell,
  Search,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  role?: string[];
}

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const {
    user,
    switchRole,
    logout,
    notifications,
    markNotificationRead,
    performSearch,
    clearNotifications,
    addNotification,
  } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  interface SearchResult {
    id: string;
    type: "clinic" | "appointment";
    name?: string;
    doctorName?: string;
    patientName?: string;
    clinicName?: string;
  }

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showClearNotificationsDialog, setShowClearNotificationsDialog] =
    useState(false);

  // useEffect(() => {
  //   if (!user || !Array.isArray(user.role)) {
  //     navigate("/login");
  //   }
  // }, [user, navigate]);

  // if (!user || !Array.isArray(user.role)) {
  //   return null;
  // }
  const role = user?.roles?.[0] || ""; // Default to SuperAdmin if no role is found
  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems: NavItem[] = [
    {
      label: "الرئيسية",
      icon: Home,
      href: `/${role}`,
      role: ["SuperAdmin", "SubAdmin", "Secretary"],
    },
    {
      label: "العيادات",
      icon: Building,
      href: `/${role}/clinics`,
      role: ["SuperAdmin", "SubAdmin"],
    },
    {
      label: "المواعيد",
      icon: Calendar,
      href: `/${role}/appointments`,
      role: ["Secretary"],
    },
    {
      label: "المدفوعات",
      icon: CreditCard,
      href: `/${role}/payments`,
      role: ["SubAdmin"],
    },
    {
      label: "التقارير",
      icon: BarChart3,
      href: `/${role}/reports`,
      role: ["SuperAdmin", "SubAdmin"],
    },
    {
      label: "الإعدادات",
      icon: Settings,
      href: `/${role}/settings`,
      role: ["SuperAdmin", "SubAdmin", "Secretary"],
    },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !item.role || item.role.includes(role)
  );

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  const handleNotificationClick = (id: string) => {
    markNotificationRead(id);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = performSearch(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim()) {
      const results = performSearch(value);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchResultClick = (result: SearchResult) => {
    setIsSearchOpen(false);

    if (result.type === "clinic") {
      navigate(`/${role}/clinics`);
      toast({
        title: "تم العثور على عيادة",
        description: `تم العثور على عيادة ${result.name}`,
      });
    } else if (result.type === "appointment") {
      navigate(`/${role}/appointments`);
      toast({
        title: "تم العثور على موعد",
        description: `تم العثور على موعد للمريض ${result.patientName}`,
      });
    }
  };

  const handleClearNotifications = () => {
    clearNotifications();
    setShowClearNotificationsDialog(false);
    toast({
      title: "تم مسح الإشعارات",
      description: "تم مسح جميع الإشعارات بنجاح",
    });
  };

  const addTestNotification = () => {
    addNotification({
      id: Date.now().toString(),
      title: "إشعار تجريبي جديد",
      message: "هذا إشعار تجريبي تم إضافته من قبل المستخدم",
      type: "system",
      read: false,
      timestamp: new Date(),
    });

    toast({
      title: "تم إضافة إشعار",
      description: "تم إضافة إشعار تجريبي جديد بنجاح",
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside
        className={`hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 z-50 bg-white border-l`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <Link to="/" className="text-2xl font-bold text-clinic-primary">
              عيادة
            </Link>
          </div>

          <ScrollArea className="flex-1 py-4">
            <nav className="px-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActiveRoute(item.href)
                      ? "bg-clinic-light text-clinic-primary"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="ml-3 h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex items-center">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user?.avatar}
                  alt={user?.userName || "User"}
                />
                <AvatarFallback className="bg-clinic-primary text-white">
                  {user?.userName?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="mr-3">
                <div className="font-medium">{user?.userName || "مستخدم"}</div>
                <div className="text-xs text-gray-500">
                  {user?.email || "غير متوفر"}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4 text-red-600"
              onClick={() => logout()}
            >
              <LogOut className="ml-2 h-4 w-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </aside>

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="right" className="p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-6 border-b">
              <Link to="/" className="text-2xl font-bold text-clinic-primary">
                عيادة
              </Link>
              <Button variant="ghost" size="icon" onClick={handleSidebarToggle}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1 py-4">
              <nav className="px-4 space-y-1">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      to={item.href}
                      className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                        isActiveRoute(item.href)
                          ? "bg-clinic-light text-clinic-primary"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="ml-3 h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-clinic-primary text-white">
                    {user?.name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="mr-3">
                  <div className="font-medium">{user?.name || "مستخدم"}</div>
                  <div className="text-xs text-gray-500">
                    {user?.email || "غير متوفر"}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full mt-4 text-red-600"
                onClick={() => logout()}
              >
                <LogOut className="ml-2 h-4 w-4" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex flex-col md:mr-64 flex-1 min-h-0">
        <header className="bg-white border-b sticky top-0 z-20">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSidebarToggle}
                className="md:hidden"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="text-xl font-medium mr-4 md:mr-0">لوحة التحكم</h1>
            </div>

            <div className="flex items-center gap-2">
              <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Search className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <Command>
                    <CommandInput
                      placeholder="البحث..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                    />
                    <CommandList>
                      {searchQuery === "" ? (
                        <CommandEmpty className="py-4 text-center text-sm text-gray-500">
                          ابدأ الكتابة للبحث...
                        </CommandEmpty>
                      ) : searchResults.length === 0 ? (
                        <CommandEmpty className="py-4 text-center text-sm text-gray-500">
                          لم يتم العثور على نتائج
                        </CommandEmpty>
                      ) : (
                        <>
                          {searchResults.some((r) => r.type === "clinic") && (
                            <CommandGroup heading="العيادات">
                              {searchResults
                                .filter((r) => r.type === "clinic")
                                .map((result) => (
                                  <CommandItem
                                    key={result.id}
                                    onSelect={() =>
                                      handleSearchResultClick(result)
                                    }
                                  >
                                    <Building className="ml-2 h-4 w-4" />
                                    <span>
                                      {result.name} - {result.doctorName}
                                    </span>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          )}

                          {searchResults.some(
                            (r) => r.type === "appointment"
                          ) && (
                            <CommandGroup heading="المواعيد">
                              {searchResults
                                .filter((r) => r.type === "appointment")
                                .map((result) => (
                                  <CommandItem
                                    key={result.id}
                                    onSelect={() =>
                                      handleSearchResultClick(result)
                                    }
                                  >
                                    <Calendar className="ml-2 h-4 w-4" />
                                    <span>
                                      {result.patientName} - {result.clinicName}
                                    </span>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          )}
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
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
                    <div className="flex justify-between items-center">
                      <div className="font-medium">الإشعارات</div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowClearNotificationsDialog(true)}
                        >
                          مسح الكل
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addTestNotification}
                        >
                          إضافة إشعار
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="text-center text-muted-foreground p-4">
                          لا توجد إشعارات
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 rounded-lg cursor-pointer ${
                              notification.read ? "bg-gray-50" : "bg-blue-50"
                            }`}
                            onClick={() =>
                              handleNotificationClick(notification.id)
                            }
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

                  <DropdownMenuItem onClick={() => switchRole("SuperAdmin")}>
                    <User className="ml-2 h-4 w-4" />
                    <span>مدير عام</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => switchRole("SubAdmin")}>
                    <User className="ml-2 h-4 w-4" />
                    <span>مدير فرعي</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => switchRole("Secretary")}>
                    <User className="ml-2 h-4 w-4" />
                    <span>سكرتير</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link to={`/${user?.role}/settings`}>
                      <Settings className="ml-2 h-4 w-4" />
                      <span>الإعدادات</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="ml-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>

      <Dialog
        open={showClearNotificationsDialog}
        onOpenChange={setShowClearNotificationsDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>مسح جميع الإشعارات</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في مسح جميع الإشعارات؟ لا يمكن التراجع عن
              هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowClearNotificationsDialog(false)}
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleClearNotifications}>
              مسح الكل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardLayout;
