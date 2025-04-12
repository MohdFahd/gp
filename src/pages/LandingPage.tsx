import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import NavBar from '@/components/NavBar';
import ScrollToTop from '@/components/ScrollToTop';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowRight,
  ArrowDown,
  Calendar,
  Clock,
  MapPin,
  Star,
  Stethoscope,
  Eye,
  Smile,
  Baby,
  UserRound,
  Heart,
  Brain,
  Activity, 
  Bone,
} from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  clinicName: z.string().min(2, { message: "اسم العيادة مطلوب" }),
  clinicLocation: z.string().min(5, { message: "العنوان مطلوب" }),
  clinicDescription: z.string().min(10, { message: "وصف العيادة مطلوب" }),
  doctorDescription: z.string().min(10, { message: "وصف الطبيب مطلوب" }),
  phoneNumber: z
    .string()
    .min(10, { message: "رقم الهاتف يجب أن يكون 10 أرقام على الأقل" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صحيح" }),
  breakTimeFrom: z.string().min(1, { message: "وقت بداية الاستراحة مطلوب" }),
  breakTimeTo: z.string().min(1, { message: "وقت نهاية الاستراحة مطلوب" }),
  avgPatientTime: z.string().min(1, { message: "متوسط الوقت مطلوب" }),
  doctorName: z.string().min(2, { message: "اسم الطبيب مطلوب" }),
  doctorExperience: z.string().min(1, { message: "سنوات الخبرة مطلوبة" })
});

type FormValues = z.infer<typeof formSchema>;

const LandingPage = () => {
  const { user, addNotification } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [clinicFormOpen, setClinicFormOpen] = useState(false);
  const [showAllSpecializations, setShowAllSpecializations] = useState(false);
  const [clinicPhoto, setClinicPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clinicName: "",
      clinicLocation: "",
      clinicDescription: "",
      doctorDescription: "",
      phoneNumber: "",
      email: "",
      breakTimeFrom: "",
      breakTimeTo: "",
      avgPatientTime: "",
      doctorName: "",
      doctorExperience: ""
    },
  });

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setClinicPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: FormValues) => {
    console.log("Form data submitted:", data);
    console.log("Clinic photo:", clinicPhoto);
    
    addNotification({
      id: Date.now().toString(),
      title: 'طلب عيادة جديدة',
      message: `طلب إضافة عيادة جديدة: ${data.clinicName}`,
      type: 'clinicRequest',
      read: false,
      timestamp: new Date()
    });
    
    toast({
      title: "تم إرسال الطلب بنجاح",
      description: "سنقوم بمراجعة بيانات العيادة والتواصل معك قريباً.",
    });

    form.reset();
    setClinicPhoto(null);
    setPhotoPreview(null);
    setClinicFormOpen(false);
  };

  const specializations = [
    { 
      name: 'طب الأسنان', 
      icon: <Smile className="w-12 h-12 text-clinic-primary" />, 
      description: 'علاج وتجميل الأسنان واللثة بأحدث التقنيات' 
    },
    { 
      name: 'طب العيون', 
      icon: <Eye className="w-12 h-12 text-clinic-primary" />, 
      description: 'تشخيص وعلاج أمراض العيون وجراحات العيون المتقدمة' 
    },
    { 
      name: 'الأمراض الجلدية', 
      icon: <Stethoscope className="w-12 h-12 text-clinic-primary" />, 
      description: 'علاج الأمراض الجلدية والتجميل بأحدث الأجهزة' 
    },
    { 
      name: 'طب الأطفال', 
      icon: <Baby className="w-12 h-12 text-clinic-primary" />, 
      description: 'رعاية صحية متكاملة للأطفال منذ الولادة' 
    },
    { 
      name: 'طب النساء والتوليد', 
      icon: <UserRound className="w-12 h-12 text-clinic-primary" />, 
      description: 'رعاية صحية متكاملة للمرأة قبل وأثناء وبعد الحمل' 
    },
    { 
      name: 'طب الباطنة', 
      icon: <Heart className="w-12 h-12 text-clinic-primary" />, 
      description: 'تشخيص وعلاج الأمراض الداخلية والمزمنة' 
    },
    { 
      name: 'طب الأعصاب', 
      icon: <Brain className="w-12 h-12 text-clinic-primary" />, 
      description: 'تشخيص وعلاج أمراض الجهاز العصبي والدماغ' 
    },
    { 
      name: 'أمراض الصدر', 
      icon: <Activity className="w-12 h-12 text-clinic-primary" />, 
      description: 'تشخيص وعلاج أمراض الجهاز التنفسي والرئتين' 
    },
    { 
      name: 'جراحة العظام', 
      icon: <Bone className="w-12 h-12 text-clinic-primary" />, 
      description: 'علاج وجراحة العظام والمفاصل وإصابات الرياضة' 
    },
  ];

  const displayedSpecializations = showAllSpecializations 
    ? specializations 
    : specializations.slice(0, 6);

  const clinics = [
    { 
      id: 1, 
      name: 'عيادة الرحمة', 
      specialization: 'طب الأسنان',
      address: 'الجمهورية اليمنية, صنعاء',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop'
    },
    { 
      id: 2, 
      name: 'مركز النور التخصصي', 
      specialization: 'طب العيون',
      address: 'شارع التحلية، جدة',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?q=80&w=800&auto=format&fit=crop'
    },
    { 
      id: 3, 
      name: 'عيادة الصفا', 
      specialization: 'الأمراض الجلدية',
      address: 'شارع الأمير سلطان، الدمام',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop'
    },
    { 
      id: 4, 
      name: 'مركز الشفاء', 
      specialization: 'طب الأطفال',
      address: 'شارع العليا، الرياض',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1631217868264-e6036a81fcc1?q=80&w=800&auto=format&fit=crop'
    },
    { 
      id: 5, 
      name: 'عيادة الأمل', 
      specialization: 'طب النساء والتوليد',
      address: 'شارع الملك عبدالله، الرياض',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop'
    },
    { 
      id: 6, 
      name: 'مركز الحياة الطبي', 
      specialization: 'طب الباطنة',
      address: 'شارع التخصصي، جدة',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1666214277398-8a2e76e5326f?q=80&w=800&auto=format&fit=crop'
    },
    { 
      id: 7, 
      name: 'مستوصف المستقبل', 
      specialization: 'طب الأسنان',
      address: 'شارع الأمير محمد، المدينة المنورة',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?q=80&w=800&auto=format&fit=crop'
    },
    { 
      id: 8, 
      name: 'عيادة الوفاء', 
      specialization: 'طب العيون',
      address: 'شارع الخليج، الخبر',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=800&auto=format&fit=crop'
    },
    { 
      id: 9, 
      name: 'مركز الأمان الطبي', 
      specialization: 'طب الأعصاب',
      address: 'شارع الأمير سلطان، جدة',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop'
    },
    { 
      id: 10, 
      name: 'عيادة البسمة', 
      specialization: 'طب الأسنان',
      address: 'شارع العروبة، الرياض',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1616391182219-e080b4d1ef48?q=80&w=800&auto=format&fit=crop'
    },
    { 
      id: 11, 
      name: 'مركز صحة الصدر', 
      specialization: 'أمراض الصدر',
      address: 'شارع فلسطين، جدة',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop'
    },
    { 
      id: 12, 
      name: 'مركز العظام الحديث', 
      specialization: 'جراحة العظام',
      address: 'شارع الملك عبدالعزيز، الدمام',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=800&auto=format&fit=crop'
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <section className="relative h-[70vh] flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-l from-black/60 to-black/40 z-10"></div>
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('https://www.conwaymedicalcenter.com/wp-content/uploads/2020/12/ten-reasons-you-must-have-a-primary-care-doctor.jpg')" }}
        ></div>
        
        <div className="relative z-20 text-center text-white max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">نظام حجز المواعيد الطبية الأمثل</h1>
          <p className="text-xl mb-8 opacity-90 animate-fade-in">
            منصة متكاملة لإدارة العيادات وحجز المواعيد الطبية بشكل سهل وفعال
          </p>
          <Dialog open={clinicFormOpen} onOpenChange={setClinicFormOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-clinic-primary hover:bg-clinic-dark animate-fade-in">
                أضف عيادتك الآن
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إضافة عيادة جديدة</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="clinicName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم العيادة</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="أدخل اسم العيادة" 
                              {...field} 
                              className="border-teal-500 focus:border-teal-600 focus-visible:ring-teal-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="doctorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم الطبيب</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="أدخل اسم الطبيب" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="clinicLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>العنوان</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل عنوان العيادة" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم الهاتف</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل رقم الهاتف" {...field} dir="ltr" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>البريد الإلكتروني</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="example@domain.com"
                              {...field}
                              dir="ltr"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="doctorExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>سنوات خبرة الطبيب</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="عدد سنوات الخبرة" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="avgPatientTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>متوسط الوقت مع كل مريض (بالدقائق)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="متوسط الوقت بالدقائق" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="breakTimeFrom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>وقت بداية الاستراحة</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type="time" 
                                {...field} 
                                className="pl-8"
                              />
                              <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="breakTimeTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>وقت نهاية الاستراحة</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type="time" 
                                {...field} 
                                className="pl-8"
                              />
                              <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <FormLabel>صورة العيادة</FormLabel>
                    <div className="flex flex-col gap-4">
                      <Input
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

                  <FormField
                    control={form.control}
                    name="clinicDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>وصف العيادة</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أدخل وصفاً للعيادة"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="doctorDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>وصف الطبيب</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أدخل وصفاً للطبيب وتخصصاته"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4 flex justify-start">
                    <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
                      إرسال الطلب
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <section id="about" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">من نحن</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              نظام عيادة هو منصة متكاملة لإدارة العيادات وحجز المواعيد الطبية، تهدف إلى تسهيل إدارة العيادات وتحسين تجربة المرضى
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md hover-scale">
              <div className="bg-clinic-light text-clinic-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">حجز المواعيد</h3>
              <p className="text-gray-600 text-center">
                نظام حجز مواعيد سهل ومرن يسمح بحجز المواعيد عبر الإنترنت بسهولة
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover-scale">
              <div className="bg-clinic-light text-clinic-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserRound className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">إدارة العملاء</h3>
              <p className="text-gray-600 text-center">
                إدارة بيانات المرضى والحصول على تقارير وإحصائيات شاملة
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover-scale">
              <div className="bg-clinic-light text-clinic-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">إدارة الوقت</h3>
              <p className="text-gray-600 text-center">
                جدولة أوقات العمل والمواعيد بشكل فعال وتنظيم وقت العيادة
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="specializations" className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">التخصصات</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              مجموعة متنوعة من التخصصات الطبية لتغطية كافة احتياجاتك الصحية
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {displayedSpecializations.map((specialization, index) => (
              <Card key={index} className="hover-scale">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">{specialization.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{specialization.name}</h3>
                  <p className="text-gray-600">{specialization.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {specializations.length > 6 && (
            <div className="text-center mt-8">
              <Button 
                onClick={() => setShowAllSpecializations(!showAllSpecializations)}
                className="bg-clinic-primary hover:bg-clinic-dark"
              >
                {showAllSpecializations ? 'عرض أقل' : 'عرض المزيد'}
                {showAllSpecializations ? null : <ArrowDown className="mr-2 h-5 w-5" />}
              </Button>
            </div>
          )}
        </div>
      </section>

      <section id="clinics" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">العيادات</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              استعرض مجموعة متميزة من العيادات المتخصصة
            </p>
          </div>
          
          <div className="carousel-container">
            <Carousel className="w-full">
              <CarouselContent className="-mr-4">
                {clinics.map((clinic) => (
                  <CarouselItem key={clinic.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <Card className="overflow-hidden h-full">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={clinic.image} 
                          alt={clinic.name} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-xl font-semibold mb-1">{clinic.name}</h3>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">{clinic.specialization}</span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                            <span className="text-gray-700">{clinic.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 ml-1" />
                          {clinic.address}
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-8 gap-4">
                <CarouselPrevious className="relative static transform-none"/>
                <CarouselNext className="relative static transform-none"/>
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 px-6 bg-gradient-to-b from-clinic-light to-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">تواصل معنا</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            نحن هنا لمساعدتك والإجابة على جميع استفساراتك
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-clinic-primary hover:bg-clinic-dark">
              صفحة الاتصال
              <ArrowRight className="mr-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">عيادة</h3>
              <p className="text-gray-400">
                منصة متكاملة لإدارة العيادات وحجز المواعيد الطبية
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">روابط مهمة</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => navigate('/')} 
                    className="text-gray-400 hover:text-white"
                  >
                    الرئيسية
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('about')} 
                    className="text-gray-400 hover:text-white"
                  >
                    من نحن
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('specializations')} 
                    className="text-gray-400 hover:text-white"
                  >
                    التخصصات
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('clinics')} 
                    className="text-gray-400 hover:text-white"
                  >
                    العيادات
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('contact')} 
                    className="text-gray-400 hover:text-white"
                  >
                    اتصل بنا
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">تواصل معنا</h3>
              <div className="space-y-2">
                <p className="text-gray-400">الجمهورية اليمنية, صنعاء</p>
                <p className="text-gray-400">info@clinic.com</p>
                <p className="text-gray-400">+966-12-345-6789</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-6">
            <p className="text-center text-gray-400">
              &copy; {new Date().getFullYear()} عيادة. جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
};

export default LandingPage;
