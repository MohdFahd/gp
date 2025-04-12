import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Plus, Search, Pencil, Trash, Eye, Clock, User, MapPin, Phone, Mail, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import DashboardLayout from '@/components/DashboardLayout';
import { Clinic, getClinics, updateClinic, deleteClinic, getClinicCounts } from '@/utils/clinicUtils';
import { toast } from '@/hooks/use-toast';

const ClinicPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewClinicOpen, setViewClinicOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [addClinicOpen, setAddClinicOpen] = useState(false);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [activeClinicCount, setActiveClinicCount] = useState(0);
  const [pendingClinicCount, setPendingClinicCount] = useState(0);
  const [suspendedClinicCount, setSuspendedClinicCount] = useState(0);
  
  // State for edit clinic form
  const [currentClinic, setCurrentClinic] = useState<Clinic | null>(null);
  const [clinicName, setClinicName] = useState('');
  const [clinicSpecialization, setClinicSpecialization] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [clinicDescription, setClinicDescription] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [doctorExperience, setDoctorExperience] = useState('');
  const [doctorDescription, setDoctorDescription] = useState('');
  const [clinicPhone, setClinicPhone] = useState('');
  const [clinicEmail, setClinicEmail] = useState('');
  const [breakTimeFrom, setBreakTimeFrom] = useState('');
  const [breakTimeTo, setBreakTimeTo] = useState('');
  const [avgPatientTime, setAvgPatientTime] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [clinicStatus, setClinicStatus] = useState<'active' | 'pending' | 'suspended'>('active');
  
  // Load clinics on component mount
  useEffect(() => {
    loadClinics();
  }, []);
  
  // Load clinics and update counts
  const loadClinics = () => {
    const loadedClinics = getClinics();
    setClinics(loadedClinics);
    
    // Update counts
    const counts = getClinicCounts();
    setActiveClinicCount(counts.active);
    setPendingClinicCount(counts.pending);
    setSuspendedClinicCount(counts.suspended);
  };
  
  // Reset form fields
  const resetFormFields = () => {
    setClinicName('');
    setClinicSpecialization('');
    setClinicAddress('');
    setClinicPhone('');
    setClinicEmail('');
    setClinicDescription('');
    setDoctorName('');
    setDoctorExperience('');
    setDoctorDescription('');
    setBreakTimeFrom('');
    setBreakTimeTo('');
    setAvgPatientTime('');
    setPhotoPreview(null);
    setClinicStatus('active');
    setCurrentClinic(null);
    setEditMode(false);
  };

  // Handle photo change
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Open clinic dialog for editing
  const openEditClinicDialog = (clinic: Clinic) => {
    setCurrentClinic(clinic);
    setClinicName(clinic.name);
    setClinicSpecialization(clinic.specialization);
    setClinicAddress(clinic.address);
    setClinicPhone(clinic.phone);
    setClinicEmail(clinic.email || '');
    setClinicDescription(clinic.description || '');
    setDoctorName(clinic.doctorName || '');
    setDoctorExperience(clinic.doctorExperience || '');
    setDoctorDescription(clinic.doctorDescription || '');
    setBreakTimeFrom(clinic.breakTimeFrom || '');
    setBreakTimeTo(clinic.breakTimeTo || '');
    setAvgPatientTime(clinic.avgPatientTime || '');
    setPhotoPreview(clinic.photoUrl || null);
    setClinicStatus(clinic.status);
    setEditMode(true);
    setAddClinicOpen(true);
  };
  
  // Open clinic dialog for viewing
  const openViewClinicDialog = (clinic: Clinic) => {
    setCurrentClinic(clinic);
    setViewClinicOpen(true);
  };
  
  // Handle form submission for editing
  const handleSubmitClinic = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert photo to data URL if it exists
      let photoUrl = currentClinic?.photoUrl || '';
      if (photoPreview && (!currentClinic || photoPreview !== currentClinic.photoUrl)) {
        photoUrl = photoPreview;
      }

      // Update existing clinic
      updateClinic({
        ...currentClinic!,
        name: clinicName,
        specialization: clinicSpecialization,
        address: clinicAddress,
        phone: clinicPhone,
        email: clinicEmail,
        description: clinicDescription,
        doctorName,
        doctorExperience,
        doctorDescription,
        breakTimeFrom,
        breakTimeTo,
        avgPatientTime,
        photoUrl,
        status: clinicStatus
      });
      
      // Close dialog and reset form
      setAddClinicOpen(false);
      resetFormFields();
      
      // Reload clinics
      loadClinics();
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم يتم تعديل العيادة. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      console.error(error);
    }
  };
  
  // Handle clinic deletion
  const handleDeleteClinic = (id: number) => {
    try {
      deleteClinic(id);
      loadClinics();
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم يتم حذف العيادة. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      console.error(error);
    }
  };
  
  // Filter clinics based on search and status
  const filterClinics = (status: string) => {
    return clinics
      .filter(clinic => 
        status === 'all' || clinic.status === status
      )
      .filter(clinic => 
        clinic.name.includes(searchQuery) || 
        clinic.specialization.includes(searchQuery) ||
        clinic.address.includes(searchQuery)
      );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-300">نشط</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">معلق</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800 border-red-300">موقوف</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">إدارة العيادات</h1>
            <p className="text-gray-500">إدارة العيادات المسجلة في النظام</p>
          </div>
          
          {/* Link to home page with anchor to trigger the Add Clinic dialog */}
          <Link to="/#add-clinic">
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إضافة عيادة
            </Button>
          </Link>
          
          {/* Edit Clinic Dialog (kept for editing) */}
          <Dialog open={addClinicOpen} onOpenChange={setAddClinicOpen}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>تعديل العيادة</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitClinic} className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium flex items-center">
                      <Building className="h-4 w-4 ml-1" />
                      اسم العيادة
                    </label>
                    <Input 
                      id="name" 
                      placeholder="أدخل اسم العيادة" 
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="specialization" className="text-sm font-medium">التخصص</label>
                    <Select 
                      value={clinicSpecialization} 
                      onValueChange={setClinicSpecialization}
                      required
                    >
                      <SelectTrigger id="specialization">
                        <SelectValue placeholder="اختر التخصص" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="طب الأسنان">طب الأسنان</SelectItem>
                        <SelectItem value="طب العيون">طب العيون</SelectItem>
                        <SelectItem value="الأمراض الجلدية">الأمراض الجلدية</SelectItem>
                        <SelectItem value="طب الأطفال">طب الأطفال</SelectItem>
                        <SelectItem value="جراحة عامة">جراحة عامة</SelectItem>
                        <SelectItem value="طب العظام">طب العظام</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium flex items-center">
                    <MapPin className="h-4 w-4 ml-1" />
                    عنوان العيادة
                  </label>
                  <Input 
                    id="address" 
                    placeholder="أدخل عنوان العيادة" 
                    value={clinicAddress}
                    onChange={(e) => setClinicAddress(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="doctorName" className="text-sm font-medium flex items-center">
                      <User className="h-4 w-4 ml-1" />
                      اسم الطبيب
                    </label>
                    <Input 
                      id="doctorName" 
                      placeholder="أدخل اسم الطبيب" 
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="doctorExperience" className="text-sm font-medium">سنوات خبرة الطبيب</label>
                    <Input 
                      id="doctorExperience" 
                      type="number"
                      placeholder="أدخل سنوات الخبرة" 
                      value={doctorExperience}
                      onChange={(e) => setDoctorExperience(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium flex items-center">
                      <Phone className="h-4 w-4 ml-1" />
                      رقم الهاتف
                    </label>
                    <Input 
                      id="phone" 
                      placeholder="01XXXXXXXX" 
                      value={clinicPhone}
                      onChange={(e) => setClinicPhone(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium flex items-center">
                      <Mail className="h-4 w-4 ml-1" />
                      البريد الإلكتروني
                    </label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="example@domain.com" 
                      value={clinicEmail}
                      onChange={(e) => setClinicEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="breakTimeFrom" className="text-sm font-medium flex items-center">
                      <Clock className="h-4 w-4 ml-1" />
                      وقت بداية الاستراحة
                    </label>
                    <Input 
                      id="breakTimeFrom" 
                      type="time"
                      value={breakTimeFrom}
                      onChange={(e) => setBreakTimeFrom(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="breakTimeTo" className="text-sm font-medium">وقت نهاية الاستراحة</label>
                    <Input 
                      id="breakTimeTo" 
                      type="time"
                      value={breakTimeTo}
                      onChange={(e) => setBreakTimeTo(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="avgPatientTime" className="text-sm font-medium">متوسط الوقت مع المريض (بالدقائق)</label>
                    <Input 
                      id="avgPatientTime" 
                      type="number"
                      placeholder="بالدقائق" 
                      value={avgPatientTime}
                      onChange={(e) => setAvgPatientTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                {/* Clinic Photo Upload */}
                <div className="space-y-2">
                  <label htmlFor="photo" className="text-sm font-medium">صورة العيادة</label>
                  <div className="flex flex-col gap-4">
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="file:mr-4 file:px-4 file:py-2 file:rounded-md file:border-0 file:bg-teal-500 file:text-white hover:file:bg-teal-600"
                    />
                    {photoPreview && (
                      <div className="mt-2">
                        <p className="text-sm mb-2">معاينة الصورة:</p>
                        <div className="relative w-full h-48 border rounded-md overflow-hidden">
                          <img
                            src={photoPreview}
                            alt="معاينة صورة العيادة"
                            className="absolute w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium flex items-center">
                    <FileText className="h-4 w-4 ml-1" />
                    وصف العيادة
                  </label>
                  <Textarea 
                    id="description" 
                    placeholder="أدخل وصفاً تفصيلياً للعيادة" 
                    value={clinicDescription}
                    onChange={(e) => setClinicDescription(e.target.value)}
                    className="min-h-[80px]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="doctorDescription" className="text-sm font-medium">وصف الطبيب</label>
                  <Textarea 
                    id="doctorDescription" 
                    placeholder="أدخل وصفاً للطبيب وتخصصاته" 
                    value={doctorDescription}
                    onChange={(e) => setDoctorDescription(e.target.value)}
                    className="min-h-[80px]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">الحالة</label>
                  <Select 
                    value={clinicStatus} 
                    onValueChange={(value: 'active' | 'pending' | 'suspended') => setClinicStatus(value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="pending">معلق</SelectItem>
                      <SelectItem value="suspended">موقوف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    حفظ التغييرات
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          
          {/* View Clinic Dialog */}
          <Dialog open={viewClinicOpen} onOpenChange={setViewClinicOpen}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>معلومات العيادة</DialogTitle>
              </DialogHeader>
              {currentClinic && (
                <div className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto">
                  {currentClinic.photoUrl && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">صورة العيادة</h3>
                      <div className="w-full h-48 border rounded-md overflow-hidden">
                        <img 
                          src={currentClinic.photoUrl} 
                          alt={currentClinic.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">اسم العيادة</h3>
                      <p>{currentClinic.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">التخصص</h3>
                      <p>{currentClinic.specialization}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">العنوان</h3>
                    <p>{currentClinic.address}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">اسم الطبيب</h3>
                      <p>{currentClinic.doctorName || 'غير متوفر'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">سنوات الخبرة</h3>
                      <p>{currentClinic.doctorExperience || 'غير متوفر'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">رقم الهاتف</h3>
                      <p className="ltr">{currentClinic.phone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">البريد الإلكتروني</h3>
                      <p className="ltr">{currentClinic.email || 'غير متوفر'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">وقت بداية الاستراحة</h3>
                      <p>{currentClinic.breakTimeFrom || 'غير محدد'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">وقت نهاية الاستراحة</h3>
                      <p>{currentClinic.breakTimeTo || 'غير محدد'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">متوسط الوقت مع المريض</h3>
                      <p>{currentClinic.avgPatientTime ? `${currentClinic.avgPatientTime} دقيقة` : 'غير محدد'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">وصف العيادة</h3>
                    <p>{currentClinic.description || 'لا يوجد وصف'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">وصف الطبيب</h3>
                    <p>{currentClinic.doctorDescription || 'لا يوجد وصف'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">الحالة</h3>
                    <div className="mt-1">{getStatusBadge(currentClinic.status)}</div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 space-x-reverse">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setViewClinicOpen(false);
                        openEditClinicDialog(currentClinic);
                      }}
                    >
                      <Pencil className="ml-2 h-4 w-4" />
                      تعديل
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash className="ml-2 h-4 w-4" />
                          حذف
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                          <AlertDialogDescription>
                            سيتم حذف العيادة بشكل نهائي. هل تريد المتابعة؟
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => {
                              if (currentClinic) {
                                handleDeleteClinic(currentClinic.id);
                                setViewClinicOpen(false);
                              }
                            }}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-green-100 text-green-600 rounded-full">
                <Building className="h-6 w-6" />
              </div>
              <div className="mr-4">
                <div className="text-sm text-gray-500">العيادات النشطة</div>
                <div className="text-xl font-bold">{activeClinicCount}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
                <Building className="h-6 w-6" />
              </div>
              <div className="mr-4">
                <div className="text-sm text-gray-500">العيادات المعلقة</div>
                <div className="text-xl font-bold">{pendingClinicCount}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-red-100 text-red-600 rounded-full">
                <Building className="h-6 w-6" />
              </div>
              <div className="mr-4">
                <div className="text-sm text-gray-500">العيادات الموقوفة</div>
                <div className="text-xl font-bold">{suspendedClinicCount}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and filters */}
        <div className="flex items-center mb-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              type="search" 
              placeholder="البحث عن عيادة..." 
              className="pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Clinics table */}
        <Card>
          <CardHeader className="p-0">
            <Tabs defaultValue="all">
              <div className="border-b px-6">
                <TabsList className="bg-transparent -mb-px">
                  <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-clinic-primary">الكل</TabsTrigger>
                  <TabsTrigger value="active" className="data-[state=active]:border-b-2 data-[state=active]:border-clinic-primary">نشط</TabsTrigger>
                  <TabsTrigger value="pending" className="data-[state=active]:border-b-2 data-[state=active]:border-clinic-primary">معلق</TabsTrigger>
                  <TabsTrigger value="suspended" className="data-[state=active]:border-b-2 data-[state=active]:border-clinic-primary">موقوف</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="p-0 m-0">
                <ClinicTable clinics={filterClinics('all')} statusBadge={getStatusBadge} onView={openViewClinicDialog} onEdit={openEditClinicDialog} onDelete={handleDeleteClinic} />
              </TabsContent>
              
              <TabsContent value="active" className="p-0 m-0">
                <ClinicTable clinics={filterClinics('active')} statusBadge={getStatusBadge} onView={openViewClinicDialog} onEdit={openEditClinicDialog} onDelete={handleDeleteClinic} />
              </TabsContent>
              
              <TabsContent value="pending" className="p-0 m-0">
                <ClinicTable clinics={filterClinics('pending')} statusBadge={getStatusBadge} onView={openViewClinicDialog} onEdit={openEditClinicDialog} onDelete={handleDeleteClinic} />
              </TabsContent>
              
              <TabsContent value="suspended" className="p-0 m-0">
                <ClinicTable clinics={filterClinics('suspended')} statusBadge={getStatusBadge} onView={openViewClinicDialog} onEdit={openEditClinicDialog} onDelete={handleDeleteClinic} />
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </DashboardLayout>
  );
};

interface ClinicTableProps {
  clinics: Clinic[];
  statusBadge: (status: string) => JSX.Element;
  onView: (clinic: Clinic) => void;
  onEdit: (clinic: Clinic) => void;
  onDelete: (id: number) => void;
}

const ClinicTable: React.FC<ClinicTableProps> = ({ clinics, statusBadge, onView, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-4 px-6 text-right font-medium">اسم العيادة</th>
            <th className="py-4 px-6 text-right font-medium">التخصص</th>
            <th className="py-4 px-6 text-right font-medium">العنوان</th>
            <th className="py-4 px-6 text-right font-medium">رقم الهاتف</th>
            <th className="py-4 px-6 text-right font-medium">الحالة</th>
            <th className="py-4 px-6 text-right font-medium">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {clinics.map((clinic) => (
            <tr key={clinic.id} className="border-b">
              <td className="py-4 px-6">{clinic.name}</td>
              <td className="py-4 px-6">{clinic.specialization}</td>
              <td className="py-4 px-6">{clinic.address}</td>
              <td className="py-4 px-6 ltr">{clinic.phone}</td>
              <td className="py-4 px-6">{statusBadge(clinic.status)}</td>
              <td className="py-4 px-6">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Button variant="ghost" size="icon" onClick={() => onView(clinic)} title="عرض">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(clinic)} title="تعديل">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-red-500" title="حذف">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                        <AlertDialogDescription>
                          سيتم حذف العيادة بشكل نهائي. هل تريد المتابعة؟
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onDelete(clinic.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          حذف
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </td>
            </tr>
          ))}
          
          {clinics.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-gray-500">
                لا توجد عيادات مطابقة للبحث
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClinicPage;
