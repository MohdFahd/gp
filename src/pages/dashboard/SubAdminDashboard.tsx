
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/DashboardLayout';
import { Building, CalendarCheck, CreditCard, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ClinicHoursManager from '@/components/clinics/ClinicHoursManager';
import PrescriptionForm from '@/components/prescriptions/PrescriptionForm';

const SubAdminDashboard = () => {
  const stats = [
    { 
      title: 'العيادات النشطة', 
      value: 18, 
      change: 5, 
      changeType: 'increase',
      icon: Building,
      iconColor: 'text-clinic-primary bg-clinic-light' 
    },
    { 
      title: 'عدد المواعيد اليوم', 
      value: 76, 
      change: 12, 
      changeType: 'increase',
      icon: CalendarCheck,
      iconColor: 'text-green-600 bg-green-100' 
    },
    { 
      title: 'إجمالي الإيرادات الشهر الحالي', 
      value: '45,628 ريال', 
      change: 8, 
      changeType: 'increase',
      icon: CreditCard,
      iconColor: 'text-blue-600 bg-blue-100' 
    },
  ];

  // Pending payments
  const pendingPayments = [
    { 
      id: 1,
      patientName: 'خالد محمد',
      clinicName: 'عيادة الأمل',
      amount: 350,
      date: '2025-04-05',
      status: 'pending'
    },
    { 
      id: 2,
      patientName: 'فاطمة أحمد',
      clinicName: 'عيادة الشفاء',
      amount: 500,
      date: '2025-04-04',
      status: 'pending'
    },
    { 
      id: 3,
      patientName: 'عبدالله العلي',
      clinicName: 'مركز الحياة الطبي',
      amount: 275,
      date: '2025-04-03',
      status: 'pending'
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">لوحة تحكم المدير الفرعي</h1>
          <p className="text-gray-500">مرحبًا بك في لوحة تحكم المدير الفرعي، يمكنك الاطلاع على إحصائيات العيادات والمدفوعات</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">{stat.title}</div>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="flex items-center mt-1 space-x-1 space-x-reverse">
                      {stat.changeType === 'increase' ? (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm ${stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                        {Math.abs(stat.change)}%
                      </span>
                      <span className="text-sm text-gray-500">من الشهر السابق</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.iconColor}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* New Clinic Hours and Prescription Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ClinicHoursManager />
          <PrescriptionForm />
        </div>

        {/* Pending payments */}
        <Card>
          <CardHeader>
            <CardTitle>المدفوعات المعلقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-right font-medium">اسم المريض</th>
                    <th className="py-3 px-4 text-right font-medium">العيادة</th>
                    <th className="py-3 px-4 text-right font-medium">المبلغ</th>
                    <th className="py-3 px-4 text-right font-medium">تاريخ الموعد</th>
                    <th className="py-3 px-4 text-right font-medium">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPayments.map((payment) => (
                    <tr key={payment.id} className="border-b">
                      <td className="py-3 px-4">{payment.patientName}</td>
                      <td className="py-3 px-4">{payment.clinicName}</td>
                      <td className="py-3 px-4">{payment.amount} ريال</td>
                      <td className="py-3 px-4">{new Date(payment.date).toLocaleDateString('ar-EG')}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          معلق
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Revenue overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>نظرة عامة على الإيرادات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">إجمالي إيرادات اليوم</div>
                    <div className="text-2xl font-bold">4,250 ريال</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">إجمالي إيرادات الأسبوع</div>
                    <div className="text-2xl font-bold">18,750 ريال</div>
                  </div>
                </div>
                <div className="text-center p-8 border rounded-lg">
                  [رسم بياني للإيرادات]
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>أداء العيادات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">أفضل عيادة</div>
                    <div className="text-lg font-bold">عيادة الأمل</div>
                    <div className="text-xs text-gray-500">الإيرادات: 15,420 ريال</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">متوسط الإيرادات للعيادة</div>
                    <div className="text-lg font-bold">8,750 ريال</div>
                    <div className="text-xs text-green-500">+6% من الشهر السابق</div>
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

export default SubAdminDashboard;
