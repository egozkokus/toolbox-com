
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const PDFTools = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const pdfTools = [
    {
      title: "ממיר PDF",
      description: "המרת PDF לWord, Excel, PowerPoint ולהפך",
      icon: "🔄",
      route: "/tools/pdf-converter",
      category: "המרה"
    },
    {
      title: "מיזוג PDF",
      description: "איחוד מספר קבצי PDF לקובץ אחד",
      icon: "📎",
      route: "/tools/pdf-merger",
      category: "עיבוד"
    },
    {
      title: "פיצול PDF",
      description: "חלוקת PDF לעמודים נפרדים או קבצים קטנים",
      icon: "✂️",
      route: "/tools/pdf-splitter",
      category: "עיבוד"
    },
    {
      title: "דחיסת PDF",
      description: "הקטנת גודל הקובץ תוך שמירה על איכות",
      icon: "🗜️",
      route: "/tools/pdf-compressor",
      category: "אופטימיזציה"
    },
    {
      title: "מנהל סיסמאות PDF",
      description: "הוספה והסרה של סיסמאות מקבצי PDF",
      icon: "🔐",
      route: "/tools/pdf-password",
      category: "אבטחה"
    },
    {
      title: "סיבוב PDF",
      description: "תיקון כיוון עמודים שסובבו",
      icon: "🔄",
      route: "/tools/pdf-rotator",
      category: "עיבוד"
    },
    {
      title: "מחלץ טקסט מ-PDF",
      description: "הוצאת טקסט מPDF לעריכה או העתקה",
      icon: "📝",
      route: "/tools/pdf-text-extractor",
      category: "תוכן"
    },
    {
      title: "חתימה דיגיטלית",
      description: "הוספת חתימה אלקטרונית למסמכי PDF",
      icon: "✍️",
      route: "/tools/pdf-signature",
      category: "אבטחה"
    }
  ];

  const filteredTools = pdfTools.filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(pdfTools.map(tool => tool.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-2">
              <Button 
                onClick={() => navigate("/")} 
                variant="outline" 
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                חזרה לעמוד הראשי
              </Button>
              <Button 
                onClick={() => navigate("/")} 
                variant="outline" 
                size="sm"
              >
                <Home className="h-4 w-4 mr-2" />
                בית
              </Button>
            </div>
            <LanguageSelector />
          </div>
          
          <div className="text-center">
            <div className="mb-4">
              <FileText className="h-16 w-16 mx-auto text-red-600" />
            </div>
            <h1 className="text-4xl font-bold mb-2">כלי PDF</h1>
            <p className="text-gray-600">כלים מקצועיים לעיבוד, המרה ועריכת קבצי PDF</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="חיפוש כלי PDF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg border-2 border-gray-200 focus:border-red-500 rounded-xl"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-shadow cursor-pointer bg-white border-0 hover:-translate-y-1 transition-transform duration-200"
              onClick={() => navigate(tool.route)}
            >
              <CardHeader className="text-center pb-2">
                <div className="text-4xl mb-2">{tool.icon}</div>
                <CardTitle className="text-lg font-bold text-gray-800">
                  {tool.title}
                </CardTitle>
                <div className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full inline-block">
                  {tool.category}
                </div>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <CardDescription className="text-sm text-gray-600">
                  {tool.description}
                </CardDescription>
                <Button 
                  className="w-full mt-4 bg-red-600 hover:bg-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(tool.route);
                  }}
                >
                  השתמש בכלי
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">לא נמצאו כלים התואמים לחיפוש שלך</p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-center">על כלי PDF</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">כלים בסיסיים</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• המרת PDF לפורמטים שונים</li>
                <li>• מיזוג וחלוקת קבצים</li>
                <li>• דחיסה ואופטימיזציה</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">כלים מתקדמים</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• הגנה בסיסמה</li>
                <li>• חילוץ תוכן</li>
                <li>• חתימה דיגיטלית</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFTools;
