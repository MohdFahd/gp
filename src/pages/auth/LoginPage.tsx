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

  // useEffect(() => {
  //   if (isAuthenticated && user && !requestedRole) {
  //     navigate(`/${user.role}`);
  //   }
  // }, [isAuthenticated, user, requestedRole, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // // If authenticated and no role switch is requested, redirect to dashboard
  // useEffect(() => {
  //   if (isAuthenticated && user && !requestedRole) {
  //     navigate(`/${user?.role[0]}`);
  //   }
  // }, [isAuthenticated, user, requestedRole, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiPost("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      toast({
        title: "تم إرسال الطلب",
        description: response.message || "سيتم مراجعة طلبك والرد عليه قريباً",
      });
      if (response?.success) {
        setUser(response.data.user);
        console.log("User data:", response.data.user);
        // Optional: update requestedRole if needed
        const roles = response?.data?.user.roles;
        if (Array.isArray(roles) && roles.length > 0) {
          const role = roles[0];
          if (role === "SuperAdmin") {
            setRequestedRole("SuperAdmin");
            navigate(`/SuperAdmin`);
          } else if (role === "Patient") {
            setRequestedRole("Patient");
            navigate(`/Patient`);
          } else if (role === "SubAdmin") {
            setRequestedRole("SubAdmin");
            navigate(`/SubAdmin`);
          }
          navigate(`/${role}`);
        } else {
          toast({
            title: "خطأ",
            description: response.message || "تعذر تسجيل الدخول",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast({
        title: "خطأ",
        description:
          error instanceof Error
            ? error.message
            : "تعذر تسجيل الدخول. الرجاء المحاولة لاحقاً.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const roleSwitchingMessage = requestedRole && (
    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded mt-4 mb-4">
      <p className="text-sm text-yellow-800">
        يرجى إدخال بيانات الدخول للحساب{" "}
        {requestedRole === "SuperAdmin"
          ? "المدير العام"
          : requestedRole === "SubAdmin"
          ? "المدير الفرعي"
          : "السكرتير"}
      </p>
    </div>
  );

  const demoInstructions = (
    <div className="bg-blue-50 border border-blue-200 p-3 rounded mt-4">
      <p className="text-sm text-blue-800 mb-1">
        للتجربة، استخدم أحد الحسابات التالية:
      </p>
      <ul className="text-xs text-blue-600">
        <li>مدير عام: admin@clinic.com / password</li>
        <li>مدير فرعي: subadmin@clinic.com / password</li>
        <li>سكرتير: Secretary@clinic.com / password</li>
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
            <CardTitle
              className="text-center"
              onClick={() => {
                console.log(user);
              }}
            >
              أدخل بيانات حسابك
            </CardTitle>
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
