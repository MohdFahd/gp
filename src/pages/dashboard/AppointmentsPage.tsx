import { useState, useEffect, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Search, Plus, Filter, Pencil, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Appointment, addAppointment, getAppointments, updateAppointment, cancelAppointment, changeAppointmentStatus } from '@/utils/appointmentUtils';
import { getClinics } from '@/utils/clinicUtils';
import { toast } from '@/hooks/use-toast';

const AppointmentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedClinic, setSelectedClinic] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  
  // Form states
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentClinic, setAppointmentClinic] = useState('');
  const [appointmentDoctor, setAppointmentDoctor] = useState('');
  const [appointmentNotes, setAppointmentNotes] = useState('');

  const todayDate = new Date().toLocaleDateString('ar-EG');
  const clinics = getClinics();

  // Load appointments on component mount
  useEffect(() => {
    loadAppointments();
  }, []);

  // Load appointments
  const loadAppointments = () => {
    const loadedAppointments = getAppointments();
    setAppointments(loadedAppointments);
  };

  // Reset form fields
  const resetFormFields = () => {
    setPatientName('');
    setPatientPhone('');
    setAppointmentDate('');
    setAppointmentTime('');
    setAppointmentClinic('');
    setAppointmentDoctor('');
    setAppointmentNotes('');
    setCurrentAppointment(null);
    setEditMode(false);
  };

  // Open appointment dialog for adding
  const openAddAppointmentDialog = () => {
    resetFormFields();
    const today = new Date().toISOString().split('T')[0];
    setAppointmentDate(today);
    setEditMode(false);
    setAppointmentDialogOpen(true);
  };

  // Open appointment dialog for editing
  const openEditAppointmentDialog = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setPatientName(appointment.patientName);
    setPatientPhone(appointment.patientPhone);
    setAppointmentDate(appointment.date);
    setAppointmentTime(appointment.time);
    setAppointmentClinic(appointment.clinicName);
    setAppointmentDoctor(appointment.doctor);
    setAppointmentNotes(appointment.notes || '');
    setEditMode(true);
    setAppointmentDialogOpen(true);
  };

  // Handle form submission
  const handleSubmitAppointment = (e: FormEvent) => {
    e.preventDefault();
    
    try {
      if (editMode && currentAppointment) {
        // Update existing appointment
        updateAppointment({
          ...currentAppointment,
          patientName,
          patientPhone,
          date: appointmentDate,
          time: appointmentTime,
          clinicName: appointmentClinic,
          doctor: appointmentDoctor,
          notes: appointmentNotes,
        });
      } else {
        // Add new appointment
        addAppointment({
          patientName,
          patientPhone,
          date: appointmentDate,
          time: appointmentTime,
          clinicName: appointmentClinic,
          doctor: appointmentDoctor,
          notes: appointmentNotes,
          status: 'scheduled'
        });
      }
      
      // Close dialog and reset form
      setAppointmentDialogOpen(false);
      resetFormFields();
      
      // Reload appointments
      loadAppointments();
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: `لم يتم ${editMode ? 'تعديل' : 'إضافة'} الموعد. الرجاء المحاولة مرة أخرى.`,
        variant: "destructive",
      });
      console.error(error);
    }
  };

  // Handle cancel appointment
  const handleCancelAppointment = (id: number) => {
    try {
      cancelAppointment(id);
      loadAppointments();
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم يتم إلغاء الموعد. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  // Handle changing appointment status
  const handleChangeStatus = (id: number, status: Appointment['status']) => {
    try {
      changeAppointmentStatus(id, status);
      loadAppointments();
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم يتم تغيير حالة الموعد. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      console.error(error);
    }
  };
  
  const filterAppointments = (filter: string) => {
    let filtered = [...appointments];
    
    // Apply tab filter
    if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(a => a.date === today);
    } else if (filter === 'upcoming') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(a => a.date > today && a.status === 'scheduled');
    } else if (filter === 'completed') {
      filtered = filtered.filter(a => a.status === 'completed');
    }
    
    // Apply date filter if selected
    if (selectedDate) {
      filtered = filtered.filter(a => a.date === selectedDate);
    }
    
    // Apply clinic filter if selected
    if (selectedClinic) {
      filtered = filtered.filter(a => a.clinicName === selectedClinic);
    }
    
    // Apply search query - only search by patient name
    if (searchQuery) {
      filtered = filtered.filter(a => 
        a.patientName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };
  
  // Status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">مجدول</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">جاري</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-300">مكتمل</Badge>;
      case 'canceled':
        return <Badge className="bg-red-100 text-red-800 border-red-300">ملغي</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Available doctors
  const doctors = [
    { id: 1, name: 'د. أحمد الخالد' },
    { id: 2, name: 'د. فاطمة الزهراني' },
    { id: 3, name: 'د. عبدالرحمن العتيبي' },
    { id: 4, name: 'د. هند السعيد' },
    { id: 5, name: 'د. عبدالله المالكي' },
    { id: 6, name: 'د. منال العتيبي' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">إدارة المواعيد</h1>
            <p className="text-gray-500">اليوم: {todayDate}</p>
          </div>
          
          <Dialog open={appointmentDialogOpen} onOpenChange={setAppointmentDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddAppointmentDialog}>
                <Plus className="ml-2 h-4 w-4" />
                موعد جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editMode ? 'تعديل الموعد' : 'إضافة موعد جديد'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitAppointment} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label htmlFor="patient-name" className="text-sm font-medium">اسم المريض</label>
                  <Input 
                    id="patient-name" 
                    placeholder="أدخل اسم المريض" 
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="patient-phone" className="text-sm font-medium">رقم الهاتف</label>
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
                    <label htmlFor="appointment-date" className="text-sm font-medium">تاريخ الموعد</label>
                    <Input 
                      id="appointment-date" 
                      type="date" 
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="appointment-time" className="text-sm font-medium">وقت الموعد</label>
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
                  <label htmlFor="clinic" className="text-sm font-medium">العيادة</label>
                  <Select 
                    value={appointmentClinic} 
                    onValueChange={setAppointmentClinic}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر العيادة" />
                    </SelectTrigger>
                    <SelectContent>
                      {clinics.map(clinic => (
                        <SelectItem key={clinic.id} value={clinic.name}>
                          {clinic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="doctor" className="text-sm font-medium">الطبيب</label>
                  <Select 
                    value={appointmentDoctor} 
                    onValueChange={setAppointmentDoctor}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الطبيب" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map(doctor => (
                        <SelectItem key={doctor.id} value={doctor.name}>
                          {doctor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">ملاحظات</label>
                  <Input 
                    id="notes" 
                    placeholder="ملاحظات إضافية (اختياري)" 
                    value={appointmentNotes}
                    onChange={(e) => setAppointmentNotes(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    {editMode ? 'حفظ التغييرات' : 'حفظ الموعد'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              type="search" 
              placeholder="البحث عن مريض..." 
              className="pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select 
              value={selectedClinic} 
              onValueChange={setSelectedClinic}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="فلترة بحسب العيادة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="all">الكل</SelectItem>
                {clinics.map(clinic => (
                  <SelectItem key={clinic.id} value={clinic.name}>
                    {clinic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Input 
              type="date" 
              className="w-[180px]" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        {/* Appointments table */}
        <Card>
          <CardHeader className="p-0">
            <Tabs defaultValue="all">
              <div className="border-b px-6">
                <TabsList className="bg-transparent -mb-px">
                  <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-clinic-primary">جميع المواعيد</TabsTrigger>
                  <TabsTrigger value="today" className="data-[state=active]:border-b-2 data-[state=active]:border-clinic-primary">اليوم</TabsTrigger>
                  <TabsTrigger value="upcoming" className="data-[state=active]:border-b-2 data-[state=active]:border-clinic-primary">القادمة</TabsTrigger>
                  <TabsTrigger value="completed" className="data-[state=active]:border-b-2 data-[state=active]:border-clinic-primary">المكتملة</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="m-0">
                <AppointmentTable 
                  appointments={filterAppointments('all')} 
                  statusBadge={getStatusBadge} 
                  onEdit={openEditAppointmentDialog}
                  onCancel={handleCancelAppointment}
                  onChangeStatus={handleChangeStatus}
                />
              </TabsContent>
              
              <TabsContent value="today" className="m-0">
                <AppointmentTable 
                  appointments={filterAppointments('today')} 
                  statusBadge={getStatusBadge} 
                  onEdit={openEditAppointmentDialog}
                  onCancel={handleCancelAppointment}
                  onChangeStatus={handleChangeStatus}
                />
              </TabsContent>
              
              <TabsContent value="upcoming" className="m-0">
                <AppointmentTable 
                  appointments={filterAppointments('upcoming')} 
                  statusBadge={getStatusBadge} 
                  onEdit={openEditAppointmentDialog}
                  onCancel={handleCancelAppointment}
                  onChangeStatus={handleChangeStatus}
                />
              </TabsContent>
              
              <TabsContent value="completed" className="m-0">
                <AppointmentTable 
                  appointments={filterAppointments('completed')} 
                  statusBadge={getStatusBadge} 
                  onEdit={openEditAppointmentDialog}
                  onCancel={handleCancelAppointment}
                  onChangeStatus={handleChangeStatus}
                />
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </DashboardLayout>
  );
};

interface AppointmentTableProps {
  appointments: Appointment[];
  statusBadge: (status: string) => JSX.Element;
  onEdit: (appointment: Appointment) => void;
  onCancel: (id: number) => void;
  onChangeStatus: (id: number, status: Appointment['status']) => void;
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({ 
  appointments, 
  statusBadge, 
  onEdit, 
  onCancel,
  onChangeStatus
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-4 px-6 text-right font-medium">اسم المريض</th>
            <th className="py-4 px-6 text-right font-medium">رقم الهاتف</th>
            <th className="py-4 px-6 text-right font-medium">التاريخ</th>
            <th className="py-4 px-6 text-right font-medium">الوقت</th>
            <th className="py-4 px-6 text-right font-medium">العيادة</th>
            <th className="py-4 px-6 text-right font-medium">الطبيب</th>
            <th className="py-4 px-6 text-right font-medium">الحالة</th>
            <th className="py-4 px-6 text-right font-medium">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id} className="border-b">
              <td className="py-4 px-6">{appointment.patientName}</td>
              <td className="py-4 px-6 ltr">{appointment.patientPhone}</td>
              <td className="py-4 px-6 ltr">{new Date(appointment.date).toLocaleDateString('ar-EG')}</td>
              <td className="py-4 px-6 ltr">{appointment.time}</td>
              <td className="py-4 px-6">{appointment.clinicName}</td>
              <td className="py-4 px-6">{appointment.doctor}</td>
              <td className="py-4 px-6">{statusBadge(appointment.status)}</td>
              <td className="py-4 px-6">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(appointment)} title="تعديل">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  
                  {appointment.status === 'scheduled' && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="بدء الموعد"
                        onClick={() => onChangeStatus(appointment.id, 'in-progress')}
                        className="text-yellow-500"
                      >
                        <Calendar className="h-4 w-4" />
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
                            <AlertDialogTitle>هل أنت متأكد من إلغاء الموعد؟</AlertDialogTitle>
                            <AlertDialogDescription>
                              سيتم إلغاء موعد {appointment.patientName}. هل تريد المتابعة؟
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>تراجع</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => onCancel(appointment.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              إلغاء الموعد
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                  
                  {appointment.status === 'in-progress' && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-green-500" 
                      title="إنهاء الموعد"
                      onClick={() => onChangeStatus(appointment.id, 'completed')}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          
          {appointments.length === 0 && (
            <tr>
              <td colSpan={8} className="py-8 text-center text-gray-500">
                لا توجد مواعيد مطابقة للبحث
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentsPage;
