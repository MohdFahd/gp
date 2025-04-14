import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Building,
  CalendarCheck,
  Users,
  ArrowUp,
  ArrowDown,
  Check,
  PlusCircle,
  X,
  Pencil,
  Trash2,
  Image,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiGet, apiPost } from "@/utils/api";

interface Specialization {
  id: string;
  name: string;
  active: boolean;
  description?: string;
  imageUrl?: string;
}

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState([
    {
      title: "إجمالي العيادات",
      value: 0,
      change: 0,
      changeType: "increase",
      icon: Building,
      iconColor: "text-clinic-primary bg-clinic-light",
    },
    {
      title: "عدد المواعيد اليوم",
      value: 0,
      change: 0,
      changeType: "increase",
      icon: CalendarCheck,
      iconColor: "text-green-600 bg-green-100",
    },
    {
      title: "عدد المستخدمين",
      value: 0,
      change: 0,
      changeType: "decrease",
      icon: Users,
      iconColor: "text-blue-600 bg-blue-100",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiGet("/SuperAdmin/dashboard");
        const { clinicsCount, appointmentsToday, usersCount } = response;

        setStats([
          {
            title: "إجمالي العيادات",
            value: clinicsCount,
            change: 12, // Example change value
            changeType: clinicsCount > 48 ? "increase" : "decrease",
            icon: Building,
            iconColor: "text-clinic-primary bg-clinic-light",
          },
          {
            title: "عدد المواعيد اليوم",
            value: appointmentsToday,
            change: 8, // Example change value
            changeType: appointmentsToday > 124 ? "increase" : "decrease",
            icon: CalendarCheck,
            iconColor: "text-green-600 bg-green-100",
          },
          {
            title: "عدد المستخدمين",
            value: usersCount,
            change: -3, // Example change value
            changeType: usersCount > 865 ? "increase" : "decrease",
            icon: Users,
            iconColor: "text-blue-600 bg-blue-100",
          },
        ]);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchData();
  }, []);

  const pendingClinics = [
    {
      id: 1,
      name: "عيادة الأمل",
      specialization: "طب الأسنان",
      owner: "د. محمد أحمد",
      date: "2025-03-15",
      status: "pending",
    },
    {
      id: 2,
      name: "مركز الحياة الطبي",
      specialization: "جراحة عامة",
      owner: "د. سارة الخالد",
      date: "2025-03-14",
      status: "pending",
    },
    {
      id: 3,
      name: "عيادة الشفاء",
      specialization: "أمراض القلب",
      owner: "د. أحمد العلي",
      date: "2025-03-12",
      status: "pending",
    },
  ];

  const [availableSpecializations, setAvailableSpecializations] = useState<
    Specialization[]
  >([
    {
      id: "1",
      name: "طب الأسنان",
      active: true,
      description: "علاج وصيانة الأسنان واللثة",
      imageUrl:
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=250",
    },
    {
      id: "2",
      name: "جلدية",
      active: true,
      description: "علاج الأمراض الجلدية والتجميل",
      imageUrl:
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=250",
    },
    {
      id: "3",
      name: "باطنة",
      active: true,
      description: "علاج الأمراض الداخلية",
    },
    {
      id: "4",
      name: "أمراض القلب",
      active: true,
      description: "تشخيص وعلاج أمراض القلب والأوعية الدموية",
    },
    {
      id: "5",
      name: "عيون",
      active: true,
      description: "فحص وعلاج أمراض العيون وتصحيح النظر",
    },
    {
      id: "6",
      name: "أنف وأذن وحنجرة",
      active: true,
      description: "علاج مشاكل الأنف والأذن والحنجرة",
    },
    {
      id: "7",
      name: "عظام",
      active: true,
      description: "علاج كسور وأمراض العظام والمفاصل",
    },
    {
      id: "8",
      name: "أمراض النساء والتوليد",
      active: true,
      description: "رعاية صحة المرأة والحمل والولادة",
    },
    {
      id: "9",
      name: "أطفال",
      active: false,
      description: "رعاية صحة الأطفال ونموهم",
    },
    {
      id: "10",
      name: "نفسية",
      active: false,
      description: "تشخيص وعلاج الاضطرابات النفسية",
    },
  ]);

  const [filterActive, setFilterActive] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSpecialization, setCurrentSpecialization] =
    useState<Specialization | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      specName: "",
    },
  });

  const editForm = useForm({
    defaultValues: {
      id: "",
      name: "",
      description: "",
      active: true,
      imageUrl: "",
    },
  });

  const handleToggleSpecialization = (id: string) => {
    setAvailableSpecializations(
      availableSpecializations.map((spec) =>
        spec.id === id ? { ...spec, active: !spec.active } : spec
      )
    );

    const spec = availableSpecializations.find((spec) => spec.id === id);
    if (spec) {
      toast({
        title: spec.active ? "تم تعطيل التخصص" : "تم تفعيل التخصص",
        description: `تم ${spec.active ? "تعطيل" : "تفعيل"} تخصص ${
          spec.name
        } بنجاح`,
      });
    }
  };

  const handleAddSpecialization = () => {
    if (form.getValues().specName.trim() === "") {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال اسم التخصص",
        variant: "destructive",
      });
      return;
    }

    if (
      availableSpecializations.some(
        (spec) =>
          spec.name.toLowerCase() ===
          form.getValues().specName.trim().toLowerCase()
      )
    ) {
      toast({
        title: "خطأ",
        description: "هذا التخصص موجود بالفعل",
        variant: "destructive",
      });
      return;
    }

    const newId = (availableSpecializations.length + 1).toString();
    setAvailableSpecializations([
      ...availableSpecializations,
      { id: newId, name: form.getValues().specName.trim(), active: true },
    ]);

    form.reset();

    toast({
      title: "تم إضافة التخصص",
      description: `تم إضافة تخصص ${form.getValues().specName} بنجاح`,
    });
  };

  const onSubmit = (data: { specName: string }) => {
    if (data.specName.trim() === "") {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال اسم التخصص",
        variant: "destructive",
      });
      return;
    }

    if (
      availableSpecializations.some(
        (spec) => spec.name.toLowerCase() === data.specName.trim().toLowerCase()
      )
    ) {
      toast({
        title: "خطأ",
        description: "هذا التخصص موجود بالفعل",
        variant: "destructive",
      });
      return;
    }

    const newId = (availableSpecializations.length + 1).toString();
    setAvailableSpecializations([
      ...availableSpecializations,
      { id: newId, name: data.specName.trim(), active: true },
    ]);

    form.reset();

    toast({
      title: "تم إضافة التخصص",
      description: `تم إضافة تخصص ${data.specName} بنجاح`,
    });
  };

  const filteredSpecializations = availableSpecializations.filter((spec) => {
    if (filterActive === "all") return true;
    if (filterActive === "active") return spec.active;
    if (filterActive === "inactive") return !spec.active;
    return true;
  });

  const handleEditClick = (specialization: Specialization) => {
    setCurrentSpecialization(specialization);
    editForm.reset({
      id: specialization.id,
      name: specialization.name,
      description: specialization.description || "",
      active: specialization.active,
      imageUrl: specialization.imageUrl || "",
    });
    setImagePreview(specialization.imageUrl || null);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (specialization: Specialization) => {
    setCurrentSpecialization(specialization);
    setIsDeleteDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        editForm.setValue("imageUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = (data: any) => {
    setAvailableSpecializations(
      availableSpecializations.map((spec) =>
        spec.id === data.id
          ? {
              ...spec,
              name: data.name,
              description: data.description,
              imageUrl: imagePreview || spec.imageUrl,
              active: data.active,
            }
          : spec
      )
    );

    setIsDialogOpen(false);
    setImagePreview(null);

    toast({
      title: "تم تحديث التخصص",
      description: `تم تحديث تخصص ${data.name} بنجاح`,
    });
  };

  const handleConfirmDelete = () => {
    if (currentSpecialization) {
      setAvailableSpecializations(
        availableSpecializations.filter(
          (spec) => spec.id !== currentSpecialization.id
        )
      );

      toast({
        title: "تم حذف التخصص",
        description: `تم حذف تخصص ${currentSpecialization.name} بنجاح`,
      });

      setIsDeleteDialogOpen(false);
      setCurrentSpecialization(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">لوحة تحكم المدير العام</h1>
          <p className="text-gray-500">
            مرحبًا بك في لوحة تحكم المدير العام، يمكنك الاطلاع على إحصائيات
            النظام
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      {stat.title}
                    </div>
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.iconColor}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>إدارة التخصصات الطبية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-3">إضافة تخصص جديد</h3>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-wrap gap-3 items-end"
                  >
                    <FormField
                      control={form.control}
                      name="specName"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>اسم التخصص</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل اسم التخصص" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="gap-1">
                      <PlusCircle className="h-4 w-4" /> إضافة
                    </Button>
                  </form>
                </Form>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">تصفية:</span>
                <Select value={filterActive} onValueChange={setFilterActive}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع التخصصات</SelectItem>
                    <SelectItem value="active">التخصصات النشطة</SelectItem>
                    <SelectItem value="inactive">التخصصات المعطلة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px] text-right">#</TableHead>
                      <TableHead className="text-right">الصورة</TableHead>
                      <TableHead className="text-right">اسم التخصص</TableHead>
                      <TableHead className="text-right">الوصف</TableHead>
                      <TableHead className="text-center">الحالة</TableHead>
                      <TableHead className="text-center">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSpecializations.map((spec, index) => (
                      <TableRow key={spec.id}>
                        <TableCell className="text-right">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <Avatar className="w-10 h-10">
                            {spec.imageUrl ? (
                              <AvatarImage
                                src={spec.imageUrl}
                                alt={spec.name}
                              />
                            ) : (
                              <AvatarFallback className="bg-gray-200">
                                <Image className="h-4 w-4 text-gray-500" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium text-right">
                          {spec.name}
                        </TableCell>
                        <TableCell className="text-right text-sm text-gray-500">
                          {spec.description && spec.description.length > 30
                            ? `${spec.description.substring(0, 30)}...`
                            : spec.description || "لا يوجد وصف"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={`${
                              spec.active
                                ? "bg-green-100 text-green-800 border-green-300"
                                : "bg-red-100 text-red-800 border-red-300"
                            }`}
                          >
                            {spec.active ? "نشط" : "غير نشط"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditClick(spec)}
                              className="h-8 gap-1"
                            >
                              <Pencil className="h-3.5 w-3.5" /> تعديل
                            </Button>
                            <Button
                              variant={spec.active ? "destructive" : "default"}
                              size="sm"
                              onClick={() =>
                                handleToggleSpecialization(spec.id)
                              }
                              className="h-8 gap-1"
                            >
                              {spec.active ? (
                                <>
                                  <X className="h-3.5 w-3.5" /> تعطيل
                                </>
                              ) : (
                                <>
                                  <Check className="h-3.5 w-3.5" /> تفعيل
                                </>
                              )}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(spec)}
                              className="h-8 gap-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> حذف
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}

                    {filteredSpecializations.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-24 text-center text-gray-500"
                        >
                          لا توجد تخصصات{" "}
                          {filterActive === "active"
                            ? "نشطة"
                            : filterActive === "inactive"
                            ? "معطلة"
                            : ""}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>تعديل التخصص</DialogTitle>
              <DialogDescription>قم بتعديل بيانات التخصص</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={editForm.handleSubmit(handleSaveEdit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    اسم التخصص
                  </label>
                  <Input
                    id="name"
                    {...editForm.register("name")}
                    placeholder="أدخل اسم التخصص"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    وصف التخصص
                  </label>
                  <Textarea
                    id="description"
                    {...editForm.register("description")}
                    placeholder="أدخل وصف التخصص"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">صورة التخصص</label>
                  <div className="flex items-start gap-4">
                    <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center">
                      {imagePreview ? (
                        <div className="relative w-32 h-32">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                            onClick={() => {
                              setImagePreview(null);
                              editForm.setValue("imageUrl", "");
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Image className="h-10 w-10 text-gray-400 mb-2" />
                          <span className="text-xs text-gray-500">
                            اضغط لتحميل صورة
                          </span>
                        </>
                      )}
                      <Input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <label htmlFor="imageUpload">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() =>
                            document.getElementById("imageUpload")?.click()
                          }
                        >
                          {imagePreview ? "تغيير الصورة" : "إضافة صورة"}
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="active"
                    {...editForm.register("active")}
                    checked={editForm.watch("active")}
                    onCheckedChange={(checked) =>
                      editForm.setValue("active", !!checked)
                    }
                  />
                  <label
                    htmlFor="active"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    التخصص نشط
                  </label>
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                >
                  إلغاء
                </Button>
                <Button type="submit">حفظ التغييرات</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>تأكيد حذف التخصص</DialogTitle>
              <DialogDescription>
                هل أنت متأكد من رغبتك في حذف تخصص "{currentSpecialization?.name}
                "؟ هذا الإجراء لا يمكن التراجع عنه.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                تأكيد الحذف
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader>
            <CardTitle>طلبات العيادات الجديدة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-right font-medium">
                      اسم العيادة
                    </th>
                    <th className="py-3 px-4 text-right font-medium">التخصص</th>
                    <th className="py-3 px-4 text-right font-medium">المالك</th>
                    <th className="py-3 px-4 text-right font-medium">
                      تاريخ الطلب
                    </th>
                    <th className="py-3 px-4 text-right font-medium">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingClinics.map((clinic) => (
                    <tr key={clinic.id} className="border-b">
                      <td className="py-3 px-4">{clinic.name}</td>
                      <td className="py-3 px-4">{clinic.specialization}</td>
                      <td className="py-3 px-4">{clinic.owner}</td>
                      <td className="py-3 px-4">
                        {new Date(clinic.date).toLocaleDateString("ar-EG")}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 border-yellow-300"
                        >
                          قيد الانتظار
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>نشاط العيادات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">
                      عدد المواعيد اليوم
                    </div>
                    <div className="text-2xl font-bold">124</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">
                      عدد المواعيد الأسبوع الحالي
                    </div>
                    <div className="text-2xl font-bold">842</div>
                  </div>
                </div>
                <div className="text-center p-8 border rounded-lg">
                  [رسم بياني للنشاط]
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>أحدث التقارير</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">
                    إجمالي المواعيد الشهر الحالي
                  </div>
                  <div className="text-2xl font-bold">3,842</div>
                  <div className="text-xs text-gray-500">
                    زيادة بنسبة 12% عن الشهر السابق
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">
                    إجمالي المرضى الجدد
                  </div>
                  <div className="text-2xl font-bold">267</div>
                  <div className="text-xs text-gray-500">
                    زيادة بنسبة 5% عن الشهر السابق
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
