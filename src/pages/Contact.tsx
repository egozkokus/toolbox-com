
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/components/common/PageHeader";
import { Mail, MessageSquare, Lightbulb, Bug, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const categories = [
    { value: "tool-suggestion", label: "הצעה לכלי חדש", icon: "💡" },
    { value: "bug-report", label: "דיווח על באג", icon: "🐛" },
    { value: "feature-request", label: "בקשה לשיפור", icon: "✨" },
    { value: "general", label: "שאלה כללית", icon: "💬" },
    { value: "feedback", label: "משוב כללי", icon: "❤️" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.category || !formData.message) {
      toast({
        title: "שגיאה",
        description: "אנא מלא את כל השדות הנדרשים",
        variant: "destructive"
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "הודעה נשלחה!",
      description: "תודה על פנייתך. נחזור אליך בהקדם האפשרי."
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      category: "",
      subject: "",
      message: ""
    });
  };

  const popularSuggestions = [
    "PDF Converter - המרת קבצים מ/ל PDF",
    "Image Background Remover - הסרת רקע מתמונות",
    "Audio Editor - עורך אודיו מתקדם",
    "Color Palette Generator - מחולל פלטות צבעים",
    "Text to Speech - המרת טקסט לדיבור",
    "QR Code Scanner - סורק QR קודים",
    "File Compression - דחיסת קבצים",
    "Favicon Generator - יצירת איקונים לאתרים"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <PageHeader 
          title="צור קשר"
          subtitle="נשמח לשמוע מכם - הצעות, בקשות ומשוב"
          icon={<Mail className="h-12 w-12 mx-auto text-blue-600" />}
        />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>שלח הודעה</CardTitle>
                <CardDescription>מלא את הטופס ונחזור אליך בהקדם</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">שם מלא *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="השם המלא שלך"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">אימייל *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">קטגוריה *</label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר קטגוריה" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            <span className="flex items-center gap-2">
                              <span>{cat.icon}</span>
                              <span>{cat.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">נושא</label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="נושא ההודעה"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">הודעה *</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="כתוב כאן את ההודעה שלך..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    שלח הודעה
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                  הצעות פופולריות
                </CardTitle>
                <CardDescription>כלים שהמשתמשים מבקשים</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {popularSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                      {suggestion}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">עזרו לנו לשפר</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-blue-700">
                  <div className="flex items-center">
                    <Bug className="h-4 w-4 mr-2" />
                    <span>דיווח על בעיות טכניות</span>
                  </div>
                  <div className="flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    <span>הצעות לכלים חדשים</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-2" />
                    <span>משוב על החווית שלכם</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
