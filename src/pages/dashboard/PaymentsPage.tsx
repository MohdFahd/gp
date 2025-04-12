
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, CreditCard, ArrowUp, ArrowDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PaymentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const payments = [
    {
      id: 1,
      patientName: 'خالد محمد',
      clinicName: 'عيادة الأمل',
      amount: 350,
      date: '2025-04-05',
      paymentMethod: 'credit-card',
      status: 'completed'
    },
    {
      id: 2,
      patientName: 'فاطمة أحمد',
      clinicName: 'عيادة الشفاء',
      amount: 500,
      date: '2025-04-04',
      paymentMethod: 'cash',
      status: 'completed'
    },
    {
      id: 3,
      patientName: 'عبدالله العلي',
      clinicName: 'مركز الحياة الطبي',
      amount: 275,
      date: '2025-04-03',
      paymentMethod: 'bank-transfer',
      status: 'pending'
    },
    {
      id: 4,
      patientName: 'سارة محمد',
      clinicName: 'عيادة العيون',
      amount: 425,
      date: '2025-04-02',
      paymentMethod: 'credit-card',
      status: 'failed'
    },
    {
      id: 5,
      patientName: 'محمد عبدالرحمن',
      clinicName: 'عيادة الأسنان',
      amount: 600,
      date: '2025-04-01',
      paymentMethod: 'cash',
      status: 'completed'
    },
  ];
  
  // Filter payments based on status
  const filterPayments = (status: string) => {
    let filtered = [...payments];
    
    if (status !== 'all') {
      filtered = filtered.filter(p => p.status === status);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.patientName.includes(searchQuery) || 
        p.clinicName.includes(searchQuery)
      );
    }
    
    return filtered;
  };
  
  const completedPaymentsAmount = payments
    .filter(p => p.status === 'completed')
    .reduce((total, p) => total + p.amount, 0);
    
  const pendingPaymentsAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((total, p) => total + p.amount, 0);
  
  // Status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-300">مكتمل</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">معلق</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-300">فشل</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Payment method display
  const getPaymentMethod = (method: string) => {
    switch (method) {
      case 'credit-card':
        return 'بطاقة ائتمان';
      case 'cash':
        return 'نقداً';
      case 'bank-transfer':
        return 'تحويل بنكي';
      default:
        return method;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">إدارة المدفوعات</h1>
          <p className="text-gray-500">تتبع ومراقبة جميع المدفوعات والمعاملات المالية</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-green-100 text-green-600 rounded-full">
                <CreditCard className="h-6 w-6" />
              </div>
              <div className="mr-4">
                <div className="text-sm text-gray-500">إجمالي المدفوعات المكتملة</div>
                <div className="text-xl font-bold">{completedPaymentsAmount} ريال</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
                <CreditCard className="h-6 w-6" />
              </div>
              <div className="mr-4">
                <div className="text-sm text-gray-500">المدفوعات المعلقة</div>
                <div className="text-xl font-bold">{pendingPaymentsAmount} ريال</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                <ArrowUp className="h-6 w-6" />
              </div>
              <div className="mr-4">
                <div className="text-sm text-gray-500">نسبة الزيادة من الشهر السابق</div>
                <div className="text-xl font-bold">+12%</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              type="search" 
              placeholder="البحث عن مدفوعات..." 
              className="pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="طريقة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="credit-card">بطاقة ائتمان</SelectItem>
                <SelectItem value="cash">نقداً</SelectItem>
                <SelectItem value="bank-transfer">تحويل بنكي</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Input type="date" className="w-[180px]" />
          </div>
        </div>

        {/* Payments table */}
        <Card>
          <CardHeader className="p-0">
            <Tabs defaultValue="all">
              <div className="border-b px-6">
                <TabsList className="bg-transparent -mb-px">
                  <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-clinic-primary">الكل</TabsTrigger>
                  <TabsTrigger value="completed" className="data-[state=active]:border-b-2 data-[state=active]:border-clinic-primary">مكتمل</TabsTrigger>
                  <TabsTrigger value="pending" className="data-[state=active]:border-b-2 data-[state=active]:border-clinic-primary">معلق</TabsTrigger>
                  <TabsTrigger value="failed" className="data-[state=active]:border-b-2 data-[state=active]:border-clinic-primary">فشل</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="m-0">
                <PaymentTable 
                  payments={filterPayments('all')} 
                  statusBadge={getStatusBadge} 
                  getPaymentMethod={getPaymentMethod}
                />
              </TabsContent>
              
              <TabsContent value="completed" className="m-0">
                <PaymentTable 
                  payments={filterPayments('completed')} 
                  statusBadge={getStatusBadge}
                  getPaymentMethod={getPaymentMethod}
                />
              </TabsContent>
              
              <TabsContent value="pending" className="m-0">
                <PaymentTable 
                  payments={filterPayments('pending')} 
                  statusBadge={getStatusBadge}
                  getPaymentMethod={getPaymentMethod}
                />
              </TabsContent>
              
              <TabsContent value="failed" className="m-0">
                <PaymentTable 
                  payments={filterPayments('failed')} 
                  statusBadge={getStatusBadge}
                  getPaymentMethod={getPaymentMethod}
                />
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </DashboardLayout>
  );
};

interface PaymentTableProps {
  payments: any[];
  statusBadge: (status: string) => JSX.Element;
  getPaymentMethod: (method: string) => string;
}

const PaymentTable: React.FC<PaymentTableProps> = ({ payments, statusBadge, getPaymentMethod }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-4 px-6 text-right font-medium">رقم العملية</th>
            <th className="py-4 px-6 text-right font-medium">اسم المريض</th>
            <th className="py-4 px-6 text-right font-medium">العيادة</th>
            <th className="py-4 px-6 text-right font-medium">المبلغ</th>
            <th className="py-4 px-6 text-right font-medium">طريقة الدفع</th>
            <th className="py-4 px-6 text-right font-medium">التاريخ</th>
            <th className="py-4 px-6 text-right font-medium">الحالة</th>
            <th className="py-4 px-6 text-right font-medium">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-b">
              <td className="py-4 px-6 ltr">{payment.id}</td>
              <td className="py-4 px-6">{payment.patientName}</td>
              <td className="py-4 px-6">{payment.clinicName}</td>
              <td className="py-4 px-6">{payment.amount} ريال</td>
              <td className="py-4 px-6">{getPaymentMethod(payment.paymentMethod)}</td>
              <td className="py-4 px-6 ltr">{new Date(payment.date).toLocaleDateString('ar-EG')}</td>
              <td className="py-4 px-6">{statusBadge(payment.status)}</td>
              <td className="py-4 px-6">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Button variant="outline" size="sm">تفاصيل</Button>
                  {payment.status === 'pending' && (
                    <Button variant="outline" size="sm" className="bg-green-50 hover:bg-green-100 text-green-600 border-green-200">
                      تأكيد
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          
          {payments.length === 0 && (
            <tr>
              <td colSpan={8} className="py-8 text-center text-gray-500">
                لا توجد مدفوعات مطابقة للبحث
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsPage;
