
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Clock } from 'lucide-react';

interface ClinicHour {
  day: string;
  openTime: string;
  closeTime: string;
}

const defaultHours: ClinicHour[] = [
  { day: 'الأحد', openTime: '09:00', closeTime: '17:00' },
  { day: 'الاثنين', openTime: '09:00', closeTime: '17:00' },
  { day: 'الثلاثاء', openTime: '09:00', closeTime: '17:00' },
  { day: 'الأربعاء', openTime: '09:00', closeTime: '17:00' },
  { day: 'الخميس', openTime: '09:00', closeTime: '17:00' },
  { day: 'الجمعة', openTime: '09:00', closeTime: '13:00' },
  { day: 'السبت', openTime: '', closeTime: '' }, // Closed
];

const ClinicHoursManager = () => {
  const [clinicHours, setClinicHours] = useState<ClinicHour[]>([]);
  const [selectedClinicId, setSelectedClinicId] = useState<string>('');
  const [clinics, setClinics] = useState<any[]>([]);

  useEffect(() => {
    // Load clinics from localStorage
    const storedClinics = localStorage.getItem('clinics');
    if (storedClinics) {
      const parsedClinics = JSON.parse(storedClinics);
      setClinics(parsedClinics);
      
      if (parsedClinics.length > 0) {
        setSelectedClinicId(parsedClinics[0].id);
        
        // Load hours for the selected clinic, or use defaults
        const storedHours = localStorage.getItem(`clinicHours-${parsedClinics[0].id}`);
        if (storedHours) {
          setClinicHours(JSON.parse(storedHours));
        } else {
          setClinicHours([...defaultHours]);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (selectedClinicId) {
      const storedHours = localStorage.getItem(`clinicHours-${selectedClinicId}`);
      if (storedHours) {
        setClinicHours(JSON.parse(storedHours));
      } else {
        setClinicHours([...defaultHours]);
      }
    }
  }, [selectedClinicId]);

  const handleClinicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClinicId(e.target.value);
  };

  const handleHourChange = (index: number, field: 'openTime' | 'closeTime', value: string) => {
    const updatedHours = [...clinicHours];
    updatedHours[index][field] = value;
    setClinicHours(updatedHours);
  };

  const saveHours = () => {
    if (!selectedClinicId) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار عيادة أولاً",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem(`clinicHours-${selectedClinicId}`, JSON.stringify(clinicHours));
    
    toast({
      title: "تم بنجاح",
      description: "تم حفظ ساعات عمل العيادة بنجاح",
    });
  };

  const getSelectedClinicName = () => {
    const clinic = clinics.find(c => c.id === selectedClinicId);
    return clinic ? clinic.name : '';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>ساعات عمل العيادة</CardTitle>
          <div className="flex items-center text-clinic-primary">
            <Clock className="w-5 h-5 ml-2" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label htmlFor="clinic-select">اختر العيادة</Label>
          <select
            id="clinic-select"
            value={selectedClinicId}
            onChange={handleClinicChange}
            className="w-full p-2 mt-1 border rounded-md"
          >
            <option value="">-- اختر عيادة --</option>
            {clinics.map((clinic) => (
              <option key={clinic.id} value={clinic.id}>
                {clinic.name} - {clinic.doctorName}
              </option>
            ))}
          </select>
        </div>

        {selectedClinicId && (
          <>
            <h3 className="mb-4 font-medium">تحديد ساعات العمل الأسبوعية لـ {getSelectedClinicName()}</h3>
            <div className="space-y-4">
              {clinicHours.map((hour, index) => (
                <div key={hour.day} className="grid grid-cols-3 gap-2 items-center">
                  <div className="font-medium">{hour.day}</div>
                  <div>
                    <Label htmlFor={`open-${index}`} className="sr-only">وقت الفتح</Label>
                    <Input
                      id={`open-${index}`}
                      type="time"
                      value={hour.openTime}
                      onChange={(e) => handleHourChange(index, 'openTime', e.target.value)}
                      placeholder="وقت الفتح"
                      className="text-center"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`close-${index}`} className="sr-only">وقت الإغلاق</Label>
                    <Input
                      id={`close-${index}`}
                      type="time"
                      value={hour.closeTime}
                      onChange={(e) => handleHourChange(index, 'closeTime', e.target.value)}
                      placeholder="وقت الإغلاق"
                      className="text-center"
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button 
              onClick={saveHours} 
              className="mt-6 w-full"
            >
              حفظ ساعات العمل
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ClinicHoursManager;
