"use client";

import { useState, useEffect } from "react";
import Head from "next/head";

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 64; // h-16 = 64px
      const elementPosition = element.offsetTop - navbarHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      });
    }
    setActiveSection(sectionId);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "services", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'שם מלא הוא שדה חובה';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'שם חייב להכיל לפחות 2 תווים';
    }

    if (!formData.email.trim()) {
      errors.email = 'כתובת דוא״ל היא שדה חובה';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'כתובת דוא״ל לא תקינה';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'מספר טלפון הוא שדה חובה';
    } else if (!/^0[2-9]\d{7,8}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      errors.phone = 'מספר טלפון לא תקין (דוגמה: 050-1234567)';
    }

    if (!formData.message.trim()) {
      errors.message = 'הודעה היא שדה חובה';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'הודעה חייבת להכיל לפחות 10 תווים';
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus(null);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    try {
      // Simulate API call - replace with actual email service
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          to: 'Sara_987654@walla.com',
          subject: `פנייה חדשה מאתר - ${formData.name}`
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <noscript>
        <div style={{textAlign: 'center', padding: '20px', background: '#f8fafc', color: '#334155'}}>
          <h2>הדפדפן שלך לא תומך ב-JavaScript</h2>
          <p>אנא הפעל JavaScript או השתמש בדפדפן מודרני יותר כדי לראות את האתר במלואו.</p>
          <p>ליצירת קשר: <a href="mailto:Sara_987654@walla.com">Sara_987654@walla.com</a> | טלפון: 050-6466711</p>
        </div>
      </noscript>
      <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-md shadow-lg z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Hamburger Menu for Mobile */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { id: "home", label: "בית" },
                { id: "about", label: "אודות" },
                { id: "services", label: "שירותים" },
                { id: "contact", label: "צור קשר" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 cursor-pointer ${
                    activeSection === id
                      ? "text-blue-600 bg-blue-50 shadow-sm"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50 hover:shadow-sm"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Logo */}
            <div className="flex-shrink-0">
              <img
                src="/moz.png"
                alt="MOZ Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-white/96 backdrop-blur-md border-b border-gray-200 shadow-lg">
              <div className="px-6 py-4">
                <nav className="space-y-2">
                  {[
                    { id: "home", label: "בית" },
                    { id: "about", label: "אודות" },
                    { id: "services", label: "שירותים" },
                    { id: "contact", label: "צור קשר" },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => {
                        scrollToSection(id);
                        setIsMenuOpen(false);
                      }}
                      className={`block w-full text-right px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                        activeSection === id
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-16 min-h-screen flex items-center overflow-hidden">
        {/* Enhanced background with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 via-transparent to-indigo-600/5"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-blue-50/30 to-indigo-100/20"></div>

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-indigo-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-lg animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-purple-200/25 rounded-full blur-xl animate-pulse delay-700"></div>

        {/* Geometric shapes with better positioning */}
        <div className="hidden sm:block absolute top-32 right-1/4 w-16 h-16 border-2 border-blue-200/30 rotate-45 animate-spin-slow"></div>
        <div className="hidden sm:block absolute bottom-32 left-1/3 w-12 h-12 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-lg rotate-12"></div>
        <div className="hidden sm:block absolute top-1/4 left-1/6 w-8 h-8 bg-gradient-to-br from-indigo-300/30 to-purple-300/30 rounded-full"></div>
        <div className="hidden sm:block absolute bottom-1/4 right-1/6 w-14 h-14 border border-blue-300/40 rounded-lg rotate-45"></div>

        {/* Professional accent lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-200/50 to-transparent"></div>


        <div className="relative z-10 max-w-6xl mx-auto px-1 sm:px-4 lg:px-8 py-8 sm:py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 place-items-center lg:place-items-start">
            {/* Person Image */}
            <div className="order-2 lg:order-2 flex justify-end lg:justify-end self-start min-h-[400px] justify-self-end">
              <div className="relative">
                <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden shadow-2xl border-4 sm:border-8 border-white/50 backdrop-blur-sm">
                  <img
                    src="/sara.jpg"
                    alt="עורכת דין שרה מיכל אדרי"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Subtle decorative elements around image */}
                <div className="hidden sm:block absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-300/40 to-indigo-300/40 rounded-full opacity-60"></div>
                <div className="hidden sm:block absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-indigo-300/30 to-purple-300/30 rounded-full opacity-50"></div>
                <div className="hidden sm:block absolute top-1/4 -left-3 w-4 h-4 bg-gradient-to-br from-blue-200/50 to-cyan-200/50 rounded-full opacity-40"></div>
                {/* Tanakh quote below image */}
                <div className="mt-6 text-center">
                  <blockquote className="text-xs text-gray-500 italic leading-relaxed max-w-xs mx-auto opacity-80">
                    עושה שלום במרומיו, הוא ברחמיו יעשה שלום עלינו<br/>
                    ועל כל עמו ישראל ואמרו אמן <span className="text-blue-600/70 font-medium">(איוב כ"5)</span>
                  </blockquote>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="order-1 lg:order-1 text-center lg:text-right flex flex-col self-start min-h-[400px] lg:min-w-[600px]">
            {/* Enhanced title with premium styling */}
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 blur-3xl rounded-full"></div>
              <h1 className="relative text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-800 bg-clip-text text-transparent mb-4 sm:mb-6 animate-fade-in leading-tight">
                עורכת דין<br/>
                <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">שרה מיכל אדרי</span>
              </h1>
              <div className="flex justify-center lg:justify-start gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                <div className="w-8 h-0.5 sm:w-12 sm:h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
                <div className="w-6 h-0.5 sm:w-8 sm:h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
                <div className="w-7 h-0.5 sm:w-10 sm:h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
              </div>
            </div>


            {/* Enhanced subtitle with better visual hierarchy */}
            <div className="mb-10">
              {/* Desktop Layout */}
              <div className="hidden lg:block">
                <div className="inline-flex flex-wrap justify-center gap-4 mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/50">
                  <span className="px-4 py-2 bg-blue-100/80 text-blue-800 rounded-lg font-medium text-sm md:text-base">משפט אזרחי</span>
                  <span className="px-4 py-2 bg-indigo-100/80 text-indigo-800 rounded-lg font-medium text-sm md:text-base">מעמד אישי</span>
                  <span className="px-4 py-2 bg-purple-100/80 text-purple-800 rounded-lg font-medium text-sm md:text-base">צוואות</span>
                  <span className="px-4 py-2 bg-green-100/80 text-green-800 rounded-lg font-medium text-sm md:text-base">ייפוי כוח מתמשך</span>
                  <span className="px-4 py-2 bg-teal-100/80 text-teal-800 rounded-lg font-medium text-sm md:text-base">נדל״ן</span>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden">
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-blue-100/90 text-blue-800 px-4 py-3 rounded-xl text-center font-medium text-sm shadow-sm border border-blue-200/50">
                    משפט אזרחי
                  </div>
                  <div className="bg-indigo-100/90 text-indigo-800 px-4 py-3 rounded-xl text-center font-medium text-sm shadow-sm border border-indigo-200/50">
                    מעמד אישי
                  </div>
                  <div className="bg-purple-100/90 text-purple-800 px-4 py-3 rounded-xl text-center font-medium text-sm shadow-sm border border-purple-200/50">
                    צוואות
                  </div>
                  <div className="bg-green-100/90 text-green-800 px-4 py-3 rounded-xl text-center font-medium text-sm shadow-sm border border-green-200/50">
                    ייפוי כוח מתמשך
                  </div>
                  <div className="bg-teal-100/90 text-teal-800 px-4 py-3 rounded-xl text-center font-medium text-sm shadow-sm border border-teal-200/50 col-span-2">
                    נדל״ן
                  </div>
                </div>
              </div>
            </div>

          {/* Enhanced buttons with better spacing and effects */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start items-center lg:items-start mb-8 sm:mb-12 lg:mb-16">
            <button
              onClick={() => scrollToSection("contact")}
              className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-12 rounded-2xl transition-all duration-500 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative flex items-center gap-3">
                צור קשר עכשיו
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="group relative border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-4 px-12 rounded-2xl transition-all duration-500 shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 cursor-pointer bg-white/90 backdrop-blur-sm overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative flex items-center gap-3">
                השירותים שלנו
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </span>
            </button>
          </div>
            </div>
          </div>

          {/* Enhanced scroll indicator - full width centered */}
          <div className="flex justify-center mt-4 sm:mt-16">
            <div className="animate-bounce">
              <div className="inline-flex flex-col items-center gap-2 text-blue-600/70">
                <span className="text-sm font-medium">גלול למטה</span>
                <div className="w-8 h-14 border-2 border-blue-300 rounded-full flex justify-center p-1">
                  <div className="w-1 h-3 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 via-white to-blue-50/30 overflow-hidden">
        {/* Enhanced decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-blue-100/40 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-indigo-100/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-100/25 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-teal-100/20 rounded-full blur-lg animate-pulse delay-700"></div>

        {/* Geometric patterns */}
        <div className="absolute top-20 left-20 w-16 h-16 border border-blue-200/30 rotate-45"></div>
        <div className="absolute bottom-20 right-20 w-12 h-12 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-lg rotate-12"></div>

        {/* Professional accent lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200/40 to-transparent"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">אודות</h2>
            <div className="flex justify-center gap-2 mb-4">
              <div className="w-8 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
              <div className="w-4 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">הכירו את הניסיון והמומחיות שמובילים לפתרונות משפטיים מוצלחים</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-blue-100/50 h-full min-h-[300px]">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  ניסיון ומומחיות
                </h3>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    עורכת דין שרה מיכל אדרי בעלת ניסיון רב שנים בתחומי המשפט האזרחי והמשפחתי.
                    מתמחה בטיפול בתיקים מורכבים עם גישה אישית ויחס חם לכל לקוח.
                  </p>
                  <p>
                    מאמינה בפתרונות משפטיים יצירתיים תוך שמירה על האינטרסים של הלקוח
                    ובהתחשבות בצרכיו האישיים והמשפחתיים.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-2xl shadow-lg border border-blue-100/50 h-full min-h-[300px]">
                <h4 className="text-xl font-semibold text-blue-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  הערכים שלנו
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: "🎯", title: "מקצועיות", desc: "יסודיות ודיוק" },
                    { icon: "🤝", title: "יחס אישי", desc: "זמינות ותשומת לב" },
                    { icon: "🔍", title: "שקיפות", desc: "יושר ואמינות" },
                    { icon: "✨", title: "מותאם אישית", desc: "פתרונות יצירתיים" }
                  ].map((value, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-white/60 rounded-lg">
                      <span className="text-2xl">{value.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-900">{value.title}</div>
                        <div className="text-sm text-gray-600">{value.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Professional profile card */}
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 h-full min-h-[300px]">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-32 h-32 rounded-full mx-auto overflow-hidden shadow-lg">
                      <img
                        src="/sara.jpg"
                        alt="עורכת דין שרה מיכל אדרי"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900">עורכת דין שרה מיכל אדרי</h3>
                    <p className="text-blue-700 font-medium">מומחית במשפט אזרחי ומעמד אישי</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-blue-100/50 h-full min-h-[300px]">
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                  <img
                    src="/moz.png"
                    alt="MOZ Logo"
                    className="w-42 h-42 object-contain"
                  />
                  <blockquote className="text-sm text-gray-600 italic leading-relaxed text-center">
                    עושה שלום במרומיו,<br/>
                    הוא ברחמיו יעשה שלום עלינו ועל כל עמו ישראל ואמרו אמן (איוב כ"ה)
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-blue-50/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-indigo-50/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">השירותים שלנו</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              שירותים משפטיים מקצועיים ומקיפים לכל הצרכים שלכם
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "משפט אזרחי",
                description: "ייעוץ וייצוג בתיקים אזרחיים מגוונים כולל חוזים, נזיקין וסכסוכים מסחריים.",
                icon: "⚖️",
                color: "from-blue-500 to-blue-600"
              },
              {
                title: "מעמד אישי",
                description: "טיפול בכל הנושאים הקשורים למעמד אישי כולל גירושין, מזונות ומשמורת.",
                icon: "👨‍👩‍👧‍👦",
                color: "from-indigo-500 to-purple-600"
              },
              {
                title: "צוואות",
                description: "עריכת צוואות והסדרת עיזבונות בהתאם לצרכים האישיים והמשפחתיים.",
                icon: "📄",
                color: "from-green-500 to-teal-600"
              },
              {
                title: "ייפוי כוח מתמשך",
                description: "הכנת מסמכי ייפוי כוח מתמשך לניהול עניינים אישיים ורכושיים.",
                icon: "✍️",
                color: "from-purple-500 to-pink-600"
              },
              {
                title: "נדל״ן",
                description: "ליווי משפטי בעסקאות נדל״ן כולל קנייה, מכירה והשכרה של נכסים.",
                icon: "🏠",
                color: "from-cyan-500 to-blue-600"
              },
              {
                title: "ייעוץ משפטי כללי",
                description: "ייעוץ משפטי מקצועי ומהימן בכל תחומי המשפט האזרחי.",
                icon: "💼",
                color: "from-emerald-500 to-green-600"
              }
            ].map((service, index) => (
              <div key={index} className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{service.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
                <div className="mt-4 w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-blue-50 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-100/20 rounded-full blur-3xl translate-y-40 -translate-x-40"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">צור קשר</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4">אני כאן לעזור לכם בכל שאלה משפטית</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">פרטי התקשרות</h3>
              <div className="space-y-6">
                <a href="mailto:Sara_987654@walla.com" className="flex items-center bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center ml-4 shadow-lg">
                    <span className="text-white text-xl">📧</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">דוא״ל</p>
                    <p className="text-gray-600">Sara_987654@walla.com</p>
                  </div>
                </a>
                <a href="tel:050-6466711" className="flex items-center bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center ml-4 shadow-lg">
                    <span className="text-white text-xl">📱</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">טלפון</p>
                    <p className="text-gray-600">050-6466711</p>
                  </div>
                </a>
                <div className="flex items-center bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center ml-4 shadow-lg">
                    <span className="text-white text-xl">🏢</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">משרד</p>
                    <p className="text-gray-600">זמין לפגישות אישיות וטלפוניות</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm">
                <h4 className="text-lg font-semibold text-blue-900 mb-4">שעות פעילות</h4>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>א׳ - ה׳:</span>
                    <span className="font-medium">9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>יום ו׳:</span>
                    <span className="font-medium">לפי תיאום מראש</span>
                  </div>
                  <div className="flex justify-between">
                    <span>שבת:</span>
                    <span className="font-medium">סגור</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">שלח הודעה</h3>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">ההודעה נשלחה בהצלחה!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">נחזור אליך בהקדם האפשרי.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">שגיאה בשליחת ההודעה</span>
                  </div>
                  <p className="text-red-700 text-sm mt-1">אנא נסה שוב או צור קשר ישירות בטלפון.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    שם מלא <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="הכנס את שמך המלא"
                    dir="rtl"
                    required
                    aria-describedby={formErrors.name ? "name-error" : undefined}
                  />
                  {formErrors.name && (
                    <p id="name-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    כתובת דוא״ל <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="example@email.com"
                    required
                    aria-describedby={formErrors.email ? "email-error" : undefined}
                  />
                  {formErrors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    מספר טלפון <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="050-1234567"
                    dir="ltr"
                    required
                    aria-describedby={formErrors.phone ? "phone-error" : undefined}
                  />
                  {formErrors.phone && (
                    <p id="phone-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    הודעה <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical ${
                      formErrors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="תאר את בקשתך או השאלה שלך בפירוט..."
                    dir="rtl"
                    required
                    aria-describedby={formErrors.message ? "message-error" : undefined}
                  />
                  {formErrors.message && (
                    <p id="message-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formErrors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:scale-105'
                  } text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      שולח...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      שלח הודעה
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  * שדות חובה. המידע שלך מאובטח ומוגן.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 עורכת דין שרה מיכל אדרי. כל הזכויות שמורות.
          </p>
        </div>
      </footer>
    </div>
    </>
  );
}