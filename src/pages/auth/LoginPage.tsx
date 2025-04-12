import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { apiPost } from "@/utils/api";

const LoginPage = () => {
  const { user, setUser, isAuthenticated, requestedRole, setRequestedRole } =
    useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Set default email if switching roles
  useEffect(() => {
    if (requestedRole) {
      // Pre-fill the email field based on the requested role
      if (requestedRole === "super-admin") {
        setFormData((prev) => ({ ...prev, email: "admin@clinic.com" }));
      } else if (requestedRole === "sub-admin") {
        setFormData((prev) => ({ ...prev, email: "subadmin@clinic.com" }));
      } else if (requestedRole === "secretary") {
        setFormData((prev) => ({ ...prev, email: "secretary@clinic.com" }));
      }
    }
  }, [requestedRole]);

  // If authenticated and no role switch is requested, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && user && !requestedRole) {
      navigate(`/${user.role}`);
    }
  }, [isAuthenticated, user, requestedRole, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const response = await apiPost("/auth/login", {
      email: formData.email,
      password: formData.password,
    });
    toast({
      title: "تم إرسال الطلب",
      description: response.message || "سيتم مراجعة طلبك والرد عليه قريباً",
    });

    navigate("/login");
    try {
      // Simulate login - in a real app this would be an API call
      const demoUsers = {
        "admin@clinic.com": {
          id: "1",
          name: "أحمد محمد",
          email: "admin@clinic.com",
          role: "super-admin" as const,
          avatar:
            "https://ui-avatars.com/api/?name=أحمد+محمد&background=0D8ABC&color=fff",
        },
        "subadmin@clinic.com": {
          id: "2",
          name: "محمد علي",
          email: "subadmin@clinic.com",
          role: "sub-admin" as const,
          avatar:
            "https://ui-avatars.com/api/?name=محمد+علي&background=06B6D4&color=fff",
        },
        "secretary@clinic.com": {
          id: "3",
          name: "سارة أحمد",
          email: "secretary@clinic.com",
          role: "secretary" as const,
          avatar:
            "https://ui-avatars.com/api/?name=سارة+أحمد&background=0EA5E9&color=fff",
        },
      };

      setTimeout(() => {
        // Check if this is a demo user
        const user = demoUsers[formData.email as keyof typeof demoUsers];

        if (user && formData.password === "password") {
          // Clear the requested role as we're now logging in
          setRequestedRole(null);
          setUser(user);

          navigate(`/${user.role}`);
          toast({
            title: "تم تسجيل الدخول بنجاح",
            description: `مرحباً بك ${user.name}`,
          });
        }
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل الدخول",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Role switching message
  const roleSwitchingMessage = requestedRole && (
    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded mt-4 mb-4">
      <p className="text-sm text-yellow-800">
        يرجى إدخال بيانات الدخول للحساب{" "}
        {requestedRole === "super-admin"
          ? "المدير العام"
          : requestedRole === "sub-admin"
          ? "المدير الفرعي"
          : "السكرتير"}
      </p>
    </div>
  );

  // Add some demo instructions
  const demoInstructions = (
    <div className="bg-blue-50 border border-blue-200 p-3 rounded mt-4">
      <p className="text-sm text-blue-800 mb-1">
        للتجربة، استخدم أحد الحسابات التالية:
      </p>
      <ul className="text-xs text-blue-600">
        <li>مدير عام: admin@clinic.com / password</li>
        <li>مدير فرعي: subadmin@clinic.com / password</li>
        <li>سكرتير: secretary@clinic.com / password</li>
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-clinic-primary">
            عيادة
          </Link>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900">
            تسجيل الدخول
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">أدخل بيانات حسابك</CardTitle>
          </CardHeader>
          <CardContent>
            {roleSwitchingMessage}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  البريد الإلكتروني
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  autoComplete="email"
                  placeholder="example@email.com"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    كلمة المرور
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-clinic-primary hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  autoComplete="current-password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "جاري التحميل..." : "تسجيل الدخول"}
              </Button>

              {demoInstructions}

              <div className="text-center mt-4">
                <span className="text-sm text-gray-600">ليس لديك حساب؟</span>{" "}
                <Link
                  to="/register"
                  className="text-sm text-clinic-primary hover:underline"
                >
                  تسجيل جديد
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
