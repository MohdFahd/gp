import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/context/UserContext";
import { toast } from "@/components/ui/use-toast";

const SettingsPage = () => {
  const { user, updateUserProfile } = useUser();
  const [loading, setLoading] = useState(false);

  // User profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("05XXXXXXXX");
  const [avatar, setAvatar] = useState("");

  // Password settings state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    appointments: true,
    clinicRequests: true,
    payments: true,
    email: true,
    sms: false,
  });

  // System settings state (for SuperAdmin)
  const [systemSettings, setSystemSettings] = useState({
    name: "نظام العيادات - موعد",
    logo: "",
    language: "ar",
    email: "system@clinic.com",
    smsApiKey: "********",
    description: "نظام متكامل لإدارة العيادات وحجز المواعيد الطبية",
    maintenanceMode: false,
  });

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAvatar(user.avatar || "");

      // Load saved settings from localStorage if any
      const savedNotificationSettings = localStorage.getItem(
        "notificationSettings"
      );
      if (savedNotificationSettings) {
        setNotificationSettings(JSON.parse(savedNotificationSettings));
      }

      const savedSystemSettings = localStorage.getItem("systemSettings");
      if (savedSystemSettings) {
        setSystemSettings(JSON.parse(savedSystemSettings));
      }

      const savedPhone = localStorage.getItem("userPhone");
      if (savedPhone) {
        setPhone(savedPhone);
      }
    }
  }, [user]);

  // Handle profile update
  const handleProfileUpdate = () => {
    setLoading(true);

    // Validate inputs
    if (!name || !email) {
      toast({
        title: "خطأ في الإدخال",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Save user profile data
    setTimeout(() => {
      if (updateUserProfile) {
        updateUserProfile({
          name,
          email,
          avatar,
        });
      }

      // Save phone to localStorage
      localStorage.setItem("userPhone", phone);

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم تحديث المعلومات الشخصية",
      });
      setLoading(false);
    }, 1000);
  };

  // Handle password update
  const handlePasswordUpdate = () => {
    setLoading(true);

    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "خطأ في الإدخال",
        description: "يرجى ملء جميع حقول كلمات المرور",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمة المرور الجديدة وتأكيدها غير متطابقين",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Simulate password update
    setTimeout(() => {
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تغيير كلمة المرور",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
    }, 1000);
  };

  // Handle notification settings update
  const handleNotificationSettingsUpdate = () => {
    setLoading(true);

    // Save notification settings to localStorage
    localStorage.setItem(
      "notificationSettings",
      JSON.stringify(notificationSettings)
    );

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم تحديث إعدادات الإشعارات",
      });
      setLoading(false);
    }, 1000);
  };

  // Handle system settings update
  const handleSystemSettingsUpdate = () => {
    setLoading(true);

    // Save system settings to localStorage
    localStorage.setItem("systemSettings", JSON.stringify(systemSettings));

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم تحديث إعدادات النظام",
      });
      setLoading(false);
    }, 1000);
  };

  // Handle system reset
  const handleSystemReset = () => {
    if (
      window.confirm(
        "هل أنت متأكد من رغبتك في إعادة تعيين النظام؟ سيتم حذف كل البيانات."
      )
    ) {
      setLoading(true);

      // Clear localStorage
      localStorage.clear();

      toast({
        title: "تم إعادة تعيين النظام",
        description: "تم حذف جميع البيانات",
        variant: "destructive",
      });

      setLoading(false);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">الإعدادات</h1>
          <p className="text-gray-500">إدارة إعدادات الحساب والنظام</p>
        </div>

        <Tabs defaultValue="account">
          <TabsList className="mb-8">
            <TabsTrigger value="account">الحساب الشخصي</TabsTrigger>
            <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
            <TabsTrigger value="security">الأمان</TabsTrigger>
            {user?.role === "SuperAdmin" && (
              <TabsTrigger value="system">إعدادات النظام</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>المعلومات الشخصية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatar} alt={name} />
                    <AvatarFallback className="bg-clinic-primary text-2xl">
                      {name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Input
                      type="file"
                      className="hidden"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setAvatar(event.target.result.toString());
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById("avatar-upload")?.click()
                      }
                    >
                      تغيير الصورة
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      الاسم
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      البريد الإلكتروني
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      رقم الهاتف
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="role" className="text-sm font-medium">
                      الدور
                    </label>
                    <Input
                      id="role"
                      value={
                        user?.role === "SuperAdmin"
                          ? "مدير عام"
                          : user?.role === "SubAdmin"
                          ? "مدير فرعي"
                          : "سكرتير"
                      }
                      disabled
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleProfileUpdate} disabled={loading}>
                    {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الإشعارات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">إشعارات المواعيد</div>
                      <div className="text-sm text-gray-500">
                        إشعارات للمواعيد الجديدة والمعدلة والملغاة
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.appointments}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          appointments: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">إشعارات طلبات العيادات</div>
                      <div className="text-sm text-gray-500">
                        إشعارات عند إرسال طلب عيادة جديدة
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.clinicRequests}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          clinicRequests: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">إشعارات المدفوعات</div>
                      <div className="text-sm text-gray-500">
                        إشعارات للمعاملات المالية والمدفوعات
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.payments}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          payments: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        إشعارات البريد الإلكتروني
                      </div>
                      <div className="text-sm text-gray-500">
                        استلام الإشعارات عبر البريد الإلكتروني
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.email}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          email: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        إشعارات الرسائل النصية (SMS)
                      </div>
                      <div className="text-sm text-gray-500">
                        استلام الإشعارات عبر الرسائل النصية
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.sms}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          sms: checked,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={handleNotificationSettingsUpdate}
                    disabled={loading}
                  >
                    {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>تغيير كلمة المرور</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="current-password"
                      className="text-sm font-medium"
                    >
                      كلمة المرور الحالية
                    </label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="new-password"
                      className="text-sm font-medium"
                    >
                      كلمة المرور الجديدة
                    </label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="confirm-password"
                      className="text-sm font-medium"
                    >
                      تأكيد كلمة المرور الجديدة
                    </label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button onClick={handlePasswordUpdate} disabled={loading}>
                    {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الأمان والتحقق</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">التحقق من خطوتين</div>
                      <div className="text-sm text-gray-500">
                        تفعيل التحقق من خطوتين لتأمين حسابك بشكل أفضل
                      </div>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        جلسات تسجيل الدخول النشطة
                      </div>
                      <div className="text-sm text-gray-500">
                        عرض وإدارة جلسات تسجيل الدخول النشطة
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      عرض
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {user?.role === "SuperAdmin" && (
            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات النظام</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="system-name"
                        className="text-sm font-medium"
                      >
                        اسم النظام
                      </label>
                      <Input
                        id="system-name"
                        value={systemSettings.name}
                        onChange={(e) =>
                          setSystemSettings((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="system-logo"
                        className="text-sm font-medium"
                      >
                        شعار النظام
                      </label>
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <Input
                          id="system-logo"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setSystemSettings((prev) => ({
                                    ...prev,
                                    logo:
                                      event.target?.result?.toString() || "",
                                  }));
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="default-lang"
                        className="text-sm font-medium"
                      >
                        اللغة الافتراضية
                      </label>
                      <Select
                        value={systemSettings.language}
                        onValueChange={(value) =>
                          setSystemSettings((prev) => ({
                            ...prev,
                            language: value,
                          }))
                        }
                      >
                        <SelectTrigger id="default-lang">
                          <SelectValue placeholder="اختر اللغة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ar">العربية</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="system-email"
                        className="text-sm font-medium"
                      >
                        البريد الإلكتروني للنظام
                      </label>
                      <Input
                        id="system-email"
                        type="email"
                        value={systemSettings.email}
                        onChange={(e) =>
                          setSystemSettings((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="sms-api-key"
                        className="text-sm font-medium"
                      >
                        مفتاح واجهة برمجة التطبيقات لخدمة الرسائل النصية
                      </label>
                      <Input
                        id="sms-api-key"
                        type="password"
                        value={systemSettings.smsApiKey}
                        onChange={(e) =>
                          setSystemSettings((prev) => ({
                            ...prev,
                            smsApiKey: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="system-desc"
                        className="text-sm font-medium"
                      >
                        وصف النظام
                      </label>
                      <Textarea
                        id="system-desc"
                        value={systemSettings.description}
                        onChange={(e) =>
                          setSystemSettings((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">وضع الصيانة</div>
                        <div className="text-sm text-gray-500">
                          تفعيل وضع الصيانة وإيقاف الوصول العام للنظام
                        </div>
                      </div>
                      <Switch
                        checked={systemSettings.maintenanceMode}
                        onCheckedChange={(checked) =>
                          setSystemSettings((prev) => ({
                            ...prev,
                            maintenanceMode: checked,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={handleSystemSettingsUpdate}
                      disabled={loading}
                    >
                      {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-600">إجراءات خطرة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-red-600">
                          إعادة تعيين النظام
                        </div>
                        <div className="text-sm text-red-500">
                          إعادة تعيين النظام كاملاً وحذف جميع البيانات. هذا
                          الإجراء لا يمكن التراجع عنه.
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="border-red-300 bg-red-100 text-red-600 hover:bg-red-200"
                        onClick={handleSystemReset}
                      >
                        إعادة تعيين
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
