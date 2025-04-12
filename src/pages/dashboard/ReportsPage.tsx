
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Download, FileBarChart, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ReportsPage = () => {
  const reportTypes = [
    {
      id: 'appointments',
      title: 'تقرير المواعيد',
      description: 'تفاصيل جميع المواعيد المحجوزة والملغية',
      icon: FileBarChart,
    },
    {
      id: 'clinics',
      title: 'تقرير العيادات',
      description: 'إحصائيات العيادات وأدائها',
      icon: FileBarChart,
    },
    {
      id: 'patients',
      title: 'تقرير المرضى',
      description: 'بيانات المرضى وزياراتهم',
      icon: FileBarChart,
    },
    {
      id: 'revenue',
      title: 'تقرير الإيرادات',
      description: 'تفاصيل الإيرادات والمدفوعات',
      icon: FileBarChart,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">التقارير</h1>
          <p className="text-gray-500">مراجعة وتحميل التقارير المختلفة للنظام</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="date-from" className="text-sm font-medium block mb-2">من تاريخ</label>
            <Input id="date-from" type="date" className="w-full" />
          </div>
          <div>
            <label htmlFor="date-to" className="text-sm font-medium block mb-2">إلى تاريخ</label>
            <Input id="date-to" type="date" className="w-full" />
          </div>
          <div>
            <label htmlFor="clinic-filter" className="text-sm font-medium block mb-2">العيادة</label>
            <Select>
              <SelectTrigger id="clinic-filter">
                <SelectValue placeholder="الكل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="dental">عيادة الأسنان</SelectItem>
                <SelectItem value="derma">عيادة الجلدية</SelectItem>
                <SelectItem value="eyes">عيادة العيون</SelectItem>
                <SelectItem value="pediatric">عيادة الأطفال</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button>
              <Filter className="ml-2 h-4 w-4" />
              تطبيق الفلتر
            </Button>
          </div>
        </div>

        {/* Report types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportTypes.map((report) => (
            <Card key={report.id} className="hover-scale">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{report.title}</CardTitle>
                  <report.icon className="h-6 w-6 text-clinic-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-6">{report.description}</p>
                <div className="flex items-center justify-between">
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="تنسيق التقرير" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <Download className="ml-2 h-4 w-4" />
                    تنزيل
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart preview */}
        <Card>
          <CardHeader>
            <CardTitle>إحصائيات المواعيد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full bg-gray-50 rounded-lg border flex items-center justify-center">
              <p className="text-gray-500">معاينة الرسم البياني</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

// Input component for the reports page
const Input = ({ 
  className, 
  type, 
  ...props 
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      type={type}
      className={`
        flex h-10 w-full rounded-md border border-input bg-background px-3 py-2
        text-sm ring-offset-background file:border-0 file:bg-transparent
        file:text-sm file:font-medium placeholder:text-muted-foreground
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
      {...props}
    />
  );
};

export default ReportsPage;
