import { toast } from "@/hooks/use-toast";
import { apiGet } from "./api";
import { useEffect } from "react";

export interface Clinic {
  id: number;
  name: string;
  doctorName: string;
  location: string;
  email: string;
  image: string;
  status: string | null;
  clinicDescription: string;
  phoneNumber: string;
  patientAverageTime: number;
  isActive: boolean;
  doctorDescription?: string;
  doctorExperienceYears?: string; // Added this property
  startTime: string | null;
  endTime: string | null;
  speciality: {
    id: number;
    name: string;
    imageUrl: string;
  };
}

// Initial clinics data
const initialClinics: Clinic[] = [
  {
    id: 1,
    name: "عيادة الرحمة",
    specialization: "طب الأسنان",
    address: "الجمهورية اليمنية, صنعاء",
    phone: "0112345678",
    status: "active",
  },
  {
    id: 2,
    name: "مركز النور التخصصي",
    specialization: "طب العيون",
    address: "شارع التحلية، جدة",
    phone: "0123456789",
    status: "active",
  },
  {
    id: 3,
    name: "عيادة الشفاء",
    specialization: "الأمراض الجلدية",
    address: "شارع الأمير سلطان، الدمام",
    phone: "0134567890",
    status: "pending",
  },
  {
    id: 4,
    name: "مركز الحياة الطبي",
    specialization: "جراحة عامة",
    address: "شارع العليا، الرياض",
    phone: "0145678901",
    status: "suspended",
  },
  {
    id: 5,
    name: "عيادة السلام",
    specialization: "طب الأطفال",
    address: "شارع المدينة المنورة، مكة",
    phone: "0156789012",
    status: "active",
  },
  {
    id: 6,
    name: "مركز الصحة الشاملة",
    specialization: "طب العظام",
    address: "شارع الأمير محمد، الرياض",
    phone: "0167890123",
    status: "active",
  },
  {
    id: 7,
    name: "عيادة الأمل",
    specialization: "الأمراض الجلدية",
    address: "شارع الملك سعود، جدة",
    phone: "0178901234",
    status: "pending",
  },
];

// Get clinics from localStorage or use initial data
export const getClinics = (): Clinic[] => {
  const storedClinics = localStorage.getItem("clinics");
  if (storedClinics) {
    return JSON.parse(storedClinics);
  }

  // Initialize localStorage with default data on first load
  localStorage.setItem("clinics", JSON.stringify(initialClinics));
  return initialClinics;
};

// Save clinics to localStorage
export const saveClinics = (clinics: Clinic[]): void => {
  localStorage.setItem("clinics", JSON.stringify(clinics));
};

// Add a new clinic
export const addClinic = (clinic: Omit<Clinic, "id">): Clinic => {
  const clinics = getClinics();

  // Generate a new ID (max ID + 1)
  const newId =
    clinics.length > 0 ? Math.max(...clinics.map((c) => c.id)) + 1 : 1;

  const newClinic = {
    ...clinic,
    id: newId,
  };

  clinics.push(newClinic);
  saveClinics(clinics);

  toast({
    title: "تمت الإضافة بنجاح",
    description: `تمت إضافة عيادة ${clinic.name} بنجاح`,
  });

  return newClinic;
};

// Update an existing clinic
export const updateClinic = (updatedClinic: Clinic): Clinic => {
  const clinics = getClinics();
  const index = clinics.findIndex((c) => c.id === updatedClinic.id);

  if (index !== -1) {
    clinics[index] = updatedClinic;
    saveClinics(clinics);

    toast({
      title: "تم التحديث بنجاح",
      description: `تم تحديث بيانات عيادة ${updatedClinic.name} بنجاح`,
    });

    return updatedClinic;
  }

  throw new Error(`Clinic with ID ${updatedClinic.id} not found`);
};

// Delete a clinic
export const deleteClinic = (id: number): void => {
  const clinics = getClinics();
  const index = clinics.findIndex((c) => c.id === id);

  if (index !== -1) {
    const deletedClinic = clinics[index];
    clinics.splice(index, 1);
    saveClinics(clinics);

    toast({
      title: "تم الحذف بنجاح",
      description: `تم حذف عيادة ${deletedClinic.name} بنجاح`,
      variant: "destructive",
    });

    return;
  }

  throw new Error(`Clinic with ID ${id} not found`);
};

// Get clinic counts by status
export const getClinicCounts = () => {
  const clinics = getClinics();

  return {
    active: clinics.filter((c) => c.status === "active").length,
    pending: clinics.filter((c) => c.status === "pending").length,
    suspended: clinics.filter((c) => c.status === "suspended").length,
    total: clinics.length,
  };
};

// Get a specific clinic by ID
export const getClinicById = (id: number): Clinic | undefined => {
  const clinics = getClinics();
  return clinics.find((c) => c.id === id);
};
