import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Check,
  X,
  User,
  CalendarDays,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Appointment,
  getTodayAppointments,
  addAppointment,
  cancelAppointment,
  changeAppointmentStatus,
  getAppointmentCounts,
} from "@/utils/appointmentUtils";
import { getClinics } from "@/utils/clinicUtils";
import { toast } from "@/hooks/use-toast";

const SecretaryDashboard = () => {
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [counts, setCounts] = useState({
    today: 0,
    completed: 0,
    inProgress: 0,
    scheduled: 0,
    newPatients: 0,
  });
  const [patientSearchQuery, setPatientSearchQuery] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);

  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentClinic, setAppointmentClinic] = useState("");
  const [appointmentDoctor, setAppointmentDoctor] = useState("");
  const [appointmentNotes, setAppointmentNotes] = useState("");

  const clinics = getClinics();

  useEffect(() => {
    loadAppointmentsData();
  }, []);

  useEffect(() => {
    if (patientSearchQuery.trim() === "") {
      setFilteredAppointments(todayAppointments);
    } else {
      const filtered = todayAppointments.filter((appointment) =>
        appointment.patientName
          .toLowerCase()
          .includes(patientSearchQuery.toLowerCase())
      );
      setFilteredAppointments(filtered);
    }
  }, [patientSearchQuery, todayAppointments]);

  const loadAppointmentsData = () => {
    const todayApps = getTodayAppointments();
    setTodayAppointments(todayApps);
    setFilteredAppointments(todayApps);

    const appointmentCounts = getAppointmentCounts();
    setCounts({
      today: appointmentCounts.today,
      completed: appointmentCounts.completed,
      inProgress: appointmentCounts.inProgress,
      scheduled: appointmentCounts.scheduled,
      newPatients: 3,
    });
  };

  const resetFormFields = () => {
    setPatientName("");
    setPatientPhone("");
    setAppointmentDate("");
    setAppointmentTime("");
    setAppointmentClinic("");
    setAppointmentDoctor("");
    setAppointmentNotes("");
  };

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      addAppointment({
        patientName,
        patientPhone,
        date: appointmentDate,
        time: appointmentTime,
        clinicName: appointmentClinic,
        doctor: appointmentDoctor,
        notes: appointmentNotes,
        status: "scheduled",
      });

      setAppointmentDialogOpen(false);
      resetFormFields();

      loadAppointmentsData();
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم يتم إضافة الموعد. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleCancelAppointment = (id: number) => {
    try {
      cancelAppointment(id);
      loadAppointmentsData();
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم يتم إلغاء الموعد. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleCompleteAppointment = (id: number) => {
    try {
      changeAppointmentStatus(id, "completed");
      loadAppointmentsData();
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم يتم تغيير حالة الموعد. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            مجدول
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            جاري
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            مكتمل
          </Badge>
        );
      case "canceled":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">ملغي</Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const doctors = [
    { id: 1, name: "د. أحمد الخالد" },
    { id: 2, name: "د. فاطمة الزهراني" },
    { id: 3, name: "د. عبدالرحمن العتيبي" },
    { id: 4, name: "د. هند السعيد" },
    { id: 5, name: "د. عبدالله المالكي" },
    { id: 6, name: "د. منال العتيبي" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">لوحة تحكم السكرتير</h1>
            <p className="text-gray-500">
              مرحبًا بك في لوحة تحكم السكرتير، يمكنك إدارة المواعيد من هنا
            </p>
          </div>

          <Dialog
            open={appointmentDialogOpen}
            onOpenChange={setAppointmentDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetFormFields();
                  const today = new Date().toISOString().split("T")[0];
                  setAppointmentDate(today);
                  setAppointmentDialogOpen(true);
                }}
              >
                <Calendar className="ml-2 h-4 w-4" />
                موعد جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>إضافة موعد جديد</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddAppointment} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label htmlFor="patient-name" className="text-sm font-medium">
                    اسم المريض
                  </label>
                  <Input
                    id="patient-name"
                    placeholder="أدخل اسم المريض"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="patient-phone"
                    className="text-sm font-medium"
                  >
                    رقم الهاتف
                  </label>
                  <Input
                    id="patient-phone"
                    placeholder="05XXXXXXXX"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="appointment-date"
                      className="text-sm font-medium"
                    >
                      تاريخ الموعد
                    </label>
                    <Input
                      id="appointment-date"
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="appointment-time"
                      className="text-sm font-medium"
                    >
                      وقت الموعد
                    </label>
                    <Input
                      id="appointment-time"
                      type="time"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="clinic" className="text-sm font-medium">
                    العيادة
                  </label>
                  <Select
                    value={appointmentClinic}
                    onValueChange={setAppointmentClinic}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر العيادة" />
                    </SelectTrigger>
                    <SelectContent>
                      {clinics.map((clinic) => (
                        <SelectItem key={clinic.id} value={clinic.name}>
                          {clinic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="doctor" className="text-sm font-medium">
                    الطبيب
                  </label>
                  <Select
                    value={appointmentDoctor}
                    onValueChange={setAppointmentDoctor}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الطبيب" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.name}>
                          {doctor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    ملاحظات
                  </label>
                  <Input
                    id="notes"
                    placeholder="ملاحظات إضافية (اختياري)"
                    value={appointmentNotes}
                    onChange={(e) => setAppointmentNotes(e.target.value)}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit">حفظ الموعد</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="البحث عن مريض..."
            className="pr-10"
            value={patientSearchQuery}
            onChange={(e) => setPatientSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-3">
                <CalendarDays className="h-6 w-6" />
              </div>
              <div className="text-xl font-bold">{counts.today}</div>
              <div className="text-sm text-gray-500">مواعيد اليوم</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="p-3 bg-green-100 text-green-600 rounded-full mb-3">
                <Check className="h-6 w-6" />
              </div>
              <div className="text-xl font-bold">{counts.completed}</div>
              <div className="text-sm text-gray-500">مواعيد مكتملة</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full mb-3">
                <Clock className="h-6 w-6" />
              </div>
              <div className="text-xl font-bold">{counts.inProgress}</div>
              <div className="text-sm text-gray-500">مواعيد جارية</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-full mb-3">
                <User className="h-6 w-6" />
              </div>
              <div className="text-xl font-bold">{counts.newPatients}</div>
              <div className="text-sm text-gray-500">مرضى جدد</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>مواعيد اليوم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-right font-medium">
                      اسم المريض
                    </th>
                    <th className="py-3 px-4 text-right font-medium">
                      رقم الهاتف
                    </th>
                    <th className="py-3 px-4 text-right font-medium">الوقت</th>
                    <th className="py-3 px-4 text-right font-medium">الطبيب</th>
                    <th className="py-3 px-4 text-right font-medium">
                      العيادة
                    </th>
                    <th className="py-3 px-4 text-right font-medium">الحالة</th>
                    <th className="py-3 px-4 text-right font-medium">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b">
                      <td className="py-3 px-4">{appointment.patientName}</td>
                      <td className="py-3 px-4 ltr">
                        {appointment.patientPhone}
                      </td>
                      <td className="py-3 px-4 ltr">{appointment.time}</td>
                      <td className="py-3 px-4">{appointment.doctor}</td>
                      <td className="py-3 px-4">{appointment.clinicName}</td>
                      <td className="py-3 px-4">
                        {getStatusBadge(appointment.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          {appointment.status === "scheduled" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-green-500"
                                title="إكمال الموعد"
                                onClick={() =>
                                  handleCompleteAppointment(appointment.id)
                                }
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500"
                                    title="إلغاء الموعد"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      هل أنت متأكد من إلغاء الموعد؟
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      سيتم إلغاء موعد {appointment.patientName}.
                                      هل تريد المتابعة؟
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>تراجع</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleCancelAppointment(appointment.id)
                                      }
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      إلغاء الموعد
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                          {appointment.status === "in-progress" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-500"
                              title="إكمال الموعد"
                              onClick={() =>
                                handleCompleteAppointment(appointment.id)
                              }
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredAppointments.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-8 text-center text-gray-500"
                      >
                        {patientSearchQuery
                          ? "لا توجد مواعيد مطابقة للبحث"
                          : "لا توجد مواعيد لليوم"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>نظرة عامة على جدول الأسبوع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[800px] p-4">
                <div className="grid grid-cols-7 gap-2">
                  {[
                    "الأحد",
                    "الإثنين",
                    "الثلاثاء",
                    "الأربعاء",
                    "الخميس",
                    "الجمعة",
                    "السبت",
                  ].map((day, i) => (
                    <div key={i} className="text-center">
                      <div className="font-medium mb-2">{day}</div>
                      <div
                        className={`py-2 px-3 rounded-md ${
                          i === 0
                            ? "bg-blue-100 border border-blue-300"
                            : "bg-gray-50"
                        }`}
                      >
                        <div className="font-medium">
                          {i === 0
                            ? "8"
                            : i === 1
                            ? "6"
                            : i === 2
                            ? "10"
                            : i === 3
                            ? "7"
                            : i === 4
                            ? "9"
                            : i === 5
                            ? "0"
                            : "0"}
                        </div>
                        <div className="text-xs text-gray-500">مواعيد</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SecretaryDashboard;
