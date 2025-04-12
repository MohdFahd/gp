
import { toast } from "@/hooks/use-toast";

export interface Appointment {
  id: number;
  patientName: string;
  patientPhone: string;
  date: string;
  time: string;
  doctor: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'canceled';
  clinicName: string;
  notes?: string;
}

// Initial appointments data
const initialAppointments: Appointment[] = [
  { 
    id: 1,
    patientName: 'محمد علي',
    patientPhone: '0555123456',
    date: '2025-04-07',
    time: '09:30',
    doctor: 'د. أحمد الخالد',
    status: 'scheduled',
    clinicName: 'عيادة الأسنان'
  },
  { 
    id: 2,
    patientName: 'سارة العبدالله',
    patientPhone: '0555789012',
    date: '2025-04-07',
    time: '10:15',
    doctor: 'د. فاطمة الزهراني',
    status: 'in-progress',
    clinicName: 'عيادة الجلدية'
  },
  { 
    id: 3,
    patientName: 'خالد العمري',
    patientPhone: '0555456789',
    date: '2025-04-07',
    time: '11:00',
    doctor: 'د. عبدالرحمن العتيبي',
    status: 'completed',
    clinicName: 'عيادة العيون'
  },
  { 
    id: 4,
    patientName: 'نورة الشمري',
    patientPhone: '0555234567',
    date: '2025-04-08',
    time: '09:30',
    doctor: 'د. هند السعيد',
    status: 'scheduled',
    clinicName: 'عيادة الأطفال'
  },
  { 
    id: 5,
    patientName: 'أحمد الزهراني',
    patientPhone: '0555345678',
    date: '2025-04-08',
    time: '11:30',
    doctor: 'د. عبدالله المالكي',
    status: 'scheduled',
    clinicName: 'عيادة الأسنان'
  },
  { 
    id: 6,
    patientName: 'فاطمة القحطاني',
    patientPhone: '0555456789',
    date: '2025-04-06',
    time: '13:00',
    doctor: 'د. منال العتيبي',
    status: 'canceled',
    clinicName: 'عيادة الجلدية'
  },
];

// Get appointments from localStorage or use initial data
export const getAppointments = (): Appointment[] => {
  const storedAppointments = localStorage.getItem('appointments');
  if (storedAppointments) {
    return JSON.parse(storedAppointments);
  }
  
  // Initialize localStorage with default data on first load
  localStorage.setItem('appointments', JSON.stringify(initialAppointments));
  return initialAppointments;
};

// Save appointments to localStorage
export const saveAppointments = (appointments: Appointment[]): void => {
  localStorage.setItem('appointments', JSON.stringify(appointments));
};

// Add a new appointment
export const addAppointment = (appointment: Omit<Appointment, 'id'>): Appointment => {
  const appointments = getAppointments();
  
  // Generate a new ID (max ID + 1)
  const newId = appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1;
  
  const newAppointment = {
    ...appointment,
    id: newId
  };
  
  appointments.push(newAppointment);
  saveAppointments(appointments);
  
  toast({
    title: "تمت الإضافة بنجاح",
    description: `تم إضافة موعد لـ ${appointment.patientName} بنجاح`,
  });
  
  return newAppointment;
};

// Update an existing appointment
export const updateAppointment = (updatedAppointment: Appointment): Appointment => {
  const appointments = getAppointments();
  const index = appointments.findIndex(a => a.id === updatedAppointment.id);
  
  if (index !== -1) {
    appointments[index] = updatedAppointment;
    saveAppointments(appointments);
    
    toast({
      title: "تم التحديث بنجاح",
      description: `تم تحديث موعد المريض ${updatedAppointment.patientName} بنجاح`,
    });
    
    return updatedAppointment;
  }
  
  throw new Error(`Appointment with ID ${updatedAppointment.id} not found`);
};

// Delete/cancel an appointment
export const cancelAppointment = (id: number): void => {
  const appointments = getAppointments();
  const index = appointments.findIndex(a => a.id === id);
  
  if (index !== -1) {
    // Mark as canceled instead of deleting
    appointments[index].status = 'canceled';
    saveAppointments(appointments);
    
    toast({
      title: "تم الإلغاء بنجاح",
      description: `تم إلغاء موعد المريض ${appointments[index].patientName} بنجاح`,
      variant: "destructive",
    });
    
    return;
  }
  
  throw new Error(`Appointment with ID ${id} not found`);
};

// Change appointment status
export const changeAppointmentStatus = (id: number, newStatus: Appointment['status']): Appointment => {
  const appointments = getAppointments();
  const index = appointments.findIndex(a => a.id === id);
  
  if (index !== -1) {
    appointments[index].status = newStatus;
    saveAppointments(appointments);
    
    const statusText = 
      newStatus === 'scheduled' ? 'مجدول' :
      newStatus === 'in-progress' ? 'جاري' :
      newStatus === 'completed' ? 'مكتمل' : 'ملغي';
    
    toast({
      title: "تم تغيير الحالة",
      description: `تم تغيير حالة الموعد إلى ${statusText}`,
    });
    
    return appointments[index];
  }
  
  throw new Error(`Appointment with ID ${id} not found`);
};

// Get appointment counts by status
export const getAppointmentCounts = () => {
  const appointments = getAppointments();
  const today = new Date().toISOString().split('T')[0];
  
  const todayAppointments = appointments.filter(a => a.date === today);
  
  return {
    today: todayAppointments.length,
    completed: todayAppointments.filter(a => a.status === 'completed').length,
    inProgress: todayAppointments.filter(a => a.status === 'in-progress').length,
    scheduled: todayAppointments.filter(a => a.status === 'scheduled').length,
    canceled: todayAppointments.filter(a => a.status === 'canceled').length
  };
};

// Get a specific appointment by ID
export const getAppointmentById = (id: number): Appointment | undefined => {
  const appointments = getAppointments();
  return appointments.find(a => a.id === id);
};

// Get today's appointments
export const getTodayAppointments = (): Appointment[] => {
  const appointments = getAppointments();
  const today = new Date().toISOString().split('T')[0];
  
  return appointments.filter(a => a.date === today);
};
