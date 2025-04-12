
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Pill } from 'lucide-react';

interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  clinicName: string;
  medications: {
    name: string;
    dosage: string;
    instructions: string;
  }[];
  notes: string;
  date: string;
}

const PrescriptionForm = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [medications, setMedications] = useState([
    { name: '', dosage: '', instructions: '' }
  ]);
  const [notes, setNotes] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [clinicName, setClinicName] = useState('');

  useEffect(() => {
    // Load appointments from localStorage to get patients
    const storedAppointments = localStorage.getItem('appointments');
    if (storedAppointments) {
      const appointments = JSON.parse(storedAppointments);
      // Extract unique patients from appointments
      const uniquePatients = Array.from(
        new Map(
          appointments.map((app: any) => [
            app.patientId, 
            { 
              id: app.patientId || app.id, 
              name: app.patientName,
              clinicName: app.clinicName,
              doctorName: app.doctorName
            }
          ])
        ).values()
      );
      setPatients(uniquePatients);
    }
  }, []);

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const patientId = e.target.value;
    setSelectedPatientId(patientId);
    
    // Auto-fill clinic and doctor info
    const selectedPatient = patients.find(p => p.id === patientId);
    if (selectedPatient) {
      setClinicName(selectedPatient.clinicName || '');
      setDoctorName(selectedPatient.doctorName || '');
    }
  };

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', instructions: '' }]);
  };

  const removeMedication = (index: number) => {
    const updatedMedications = [...medications];
    updatedMedications.splice(index, 1);
    setMedications(updatedMedications);
  };

  const handleMedicationChange = (
    index: number, 
    field: 'name' | 'dosage' | 'instructions', 
    value: string
  ) => {
    const updatedMedications = [...medications];
    updatedMedications[index][field] = value;
    setMedications(updatedMedications);
  };

  const savePrescription = () => {
    if (!selectedPatientId) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار مريض أولاً",
        variant: "destructive"
      });
      return;
    }

    if (medications.some(med => !med.name || !med.dosage)) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم الدواء والجرعة لجميع الأدوية",
        variant: "destructive"
      });
      return;
    }

    const selectedPatient = patients.find(p => p.id === selectedPatientId);
    if (!selectedPatient) return;

    const newPrescription: Prescription = {
      id: Date.now().toString(),
      patientId: selectedPatientId,
      patientName: selectedPatient.name,
      doctorName: doctorName,
      clinicName: clinicName,
      medications,
      notes,
      date: new Date().toISOString().split('T')[0]
    };

    // Save prescription to localStorage
    const storedPrescriptions = localStorage.getItem('prescriptions');
    const prescriptions = storedPrescriptions ? JSON.parse(storedPrescriptions) : [];
    prescriptions.push(newPrescription);
    localStorage.setItem('prescriptions', JSON.stringify(prescriptions));

    // Create notification for the prescription
    const { addNotification } = require('@/context/UserContext');
    const notification = {
      id: Date.now().toString(),
      title: "وصفة طبية جديدة",
      message: `تم إصدار وصفة طبية للمريض ${selectedPatient.name}`,
      type: "appointment",
      read: false,
      timestamp: new Date()
    };
    
    try {
      // Try to add notification directly
      addNotification(notification);
    } catch (error) {
      // Fallback if direct method fails
      const storedNotifications = localStorage.getItem('userNotifications');
      const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
      notifications.unshift(notification);
      localStorage.setItem('userNotifications', JSON.stringify(notifications));
    }

    toast({
      title: "تم إصدار الوصفة",
      description: `تم إصدار وصفة طبية للمريض ${selectedPatient.name} بنجاح`,
    });

    // Reset form
    setMedications([{ name: '', dosage: '', instructions: '' }]);
    setNotes('');
    setSelectedPatientId('');
    setDoctorName('');
    setClinicName('');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>إصدار وصفة طبية</CardTitle>
          <div className="flex items-center text-clinic-primary">
            <Pill className="w-5 h-5 ml-2" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="patient-select">اختر المريض</Label>
          <select
            id="patient-select"
            value={selectedPatientId}
            onChange={handlePatientChange}
            className="w-full p-2 mt-1 border rounded-md"
          >
            <option value="">-- اختر مريض --</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="doctor-name">اسم الطبيب</Label>
          <Input
            id="doctor-name"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="clinic-name">اسم العيادة</Label>
          <Input
            id="clinic-name"
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>الأدوية</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addMedication}
            >
              إضافة دواء
            </Button>
          </div>

          <div className="space-y-3">
            {medications.map((med, index) => (
              <div key={index} className="p-3 border rounded-md">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <Label htmlFor={`med-name-${index}`}>اسم الدواء</Label>
                    <Input
                      id={`med-name-${index}`}
                      value={med.name}
                      onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`med-dosage-${index}`}>الجرعة</Label>
                    <Input
                      id={`med-dosage-${index}`}
                      value={med.dosage}
                      onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`med-instructions-${index}`}>تعليمات الاستخدام</Label>
                  <Input
                    id={`med-instructions-${index}`}
                    value={med.instructions}
                    onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                  />
                </div>
                {medications.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="mt-2"
                    onClick={() => removeMedication(index)}
                  >
                    حذف
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="notes">ملاحظات إضافية</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={savePrescription}
          className="w-full"
        >
          إصدار الوصفة
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PrescriptionForm;
