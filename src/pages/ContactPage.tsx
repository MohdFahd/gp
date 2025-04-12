
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Mail, MapPin, Phone } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "تم إرسال الرسالة بنجاح",
      description: "سنقوم بالرد عليك في أقرب وقت ممكن",
    });
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-l from-black/60 to-black/40 z-10"></div>
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=2000&auto=format&fit=crop')" }}
        ></div>
        
        <div className="relative z-20 text-center text-white max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">اتصل بنا</h1>
          <p className="text-xl opacity-90 animate-fade-in">
            نحن هنا لمساعدتك والإجابة على استفساراتك
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10">
            {/* Contact Info */}
            <div className="md:col-span-1 space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-md hover-scale">
                <div className="bg-clinic-light text-clinic-primary w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Phone className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">اتصل بنا</h3>
                <p className="text-gray-600">+966-12-345-6789</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover-scale">
                <div className="bg-clinic-light text-clinic-primary w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">البريد الإلكتروني</h3>
                <p className="text-gray-600">info@clinic.com</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover-scale">
                <div className="bg-clinic-light text-clinic-primary w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">العنوان</h3>
                <p className="text-gray-600">الجمهورية اليمنية, صنعاء</p>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="md:col-span-2">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">ارسل لنا رسالة</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">الاسم</label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">البريد الإلكتروني</label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">رقم الهاتف</label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">الموضوع</label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">الرسالة</label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="bg-clinic-primary hover:bg-clinic-dark w-full">
                    إرسال الرسالة
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-lg overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d463879.9969668503!2d46.54234815!3d24.7254209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1711350121312!5m2!1sen!2sus"
              width="100%"
              height="450"
              style={{ border: 0 }}
              loading="lazy"
              title="موقع العيادة"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                  <Link to="/" className="text-gray-400 hover:text-white">الرئيسية</Link>
                </li>
                <li>
                  <Link to="/#about" className="text-gray-400 hover:text-white">من نحن</Link>
                </li>
                <li>
                  <Link to="/#specializations" className="text-gray-400 hover:text-white">التخصصات</Link>
                </li>
                <li>
                  <Link to="/#clinics" className="text-gray-400 hover:text-white">العيادات</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white">اتصل بنا</Link>
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
    </div>
  );
};

export default ContactPage;
