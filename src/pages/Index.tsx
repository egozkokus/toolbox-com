
import { useState } from "react";
import { Search, Calculator, Type, Image, Code, Hash, Globe, Zap, Video, Volume2, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const toolCategories = [
    {
      icon: Type,
      title: t('categories.text'),
      description: t('categories.text.desc'),
      tools: [
        { name: "Word Counter", route: "/tools/word-counter" },
        { name: "Case Converter", route: "/tools/case-converter" },
        { name: "Lorem Generator", route: "/tools/lorem-generator" },
        { name: "Text Reverser", route: "/tools/text-reverser" },
        { name: "Text Formatter", route: "/tools/text-formatter" },
        { name: "Line Sorter", route: "/tools/line-sorter" }
      ],
      color: "from-blue-500 to-cyan-500",
      categoryRoute: "/categories/text-tools"
    },
    {
      icon: Calculator,
      title: t('categories.calculators'),
      description: t('categories.calculators.desc'),
      tools: [
        { name: "Unit Converter", route: "/tools/unit-converter" },
        { name: "Percentage Calculator", route: "/tools/percentage-calc" },
        { name: "BMI Calculator", route: "/tools/bmi-calculator" },
        { name: "Tip Calculator", route: "/tools/tip-calculator" },
        { name: "Loan Calculator", route: "/tools/loan-calculator" },
        { name: "Age Calculator", route: "/tools/age-calculator" }
      ],
      color: "from-green-500 to-emerald-500",
      categoryRoute: "/categories/calculators"
    },
    {
      icon: Image,
      title: t('categories.image'),
      description: t('categories.image.desc'),
      tools: [
        { name: "Image Resizer", route: "/tools/image-resizer" },
        { name: "QR Generator", route: "/tools/qr-generator" },
        { name: "Image Compressor", route: "/tools/image-compressor" },
        { name: "Image Converter", route: "/tools/image-converter" },
        { name: "Advanced Image Editor", route: "/tools/advanced-image-editor" },
        { name: "Background Remover", route: "/tools/background-remover" }
      ],
      color: "from-purple-500 to-pink-500",
      categoryRoute: "/categories/image-tools"
    },
    {
      icon: Video,
      title: t('categories.video'),
      description: t('categories.video.desc'),
      tools: [
        { name: "Video Editor", route: "/tools/video-editor" }
      ],
      color: "from-red-500 to-orange-500",
      categoryRoute: "/categories/video-tools"
    },
    {
      icon: Volume2,
      title: t('categories.audio'),
      description: t('categories.audio.desc'),
      tools: [],
      color: "from-teal-500 to-cyan-500",
      categoryRoute: "/categories/audio-tools"
    },
    {
      icon: Code,
      title: t('categories.developer'),
      description: t('categories.developer.desc'),
      tools: [
        { name: "JSON Formatter", route: "/tools/json-formatter" },
        { name: "Base64 Encoder", route: "/tools/base64-encoder" },
        { name: "URL Encoder", route: "/tools/url-encoder" },
        { name: "Color Picker", route: "/tools/color-picker" }
      ],
      color: "from-orange-500 to-red-500",
      categoryRoute: "/categories/developer-tools"
    },
    {
      icon: Hash,
      title: t('categories.generators'),
      description: t('categories.generators.desc'),
      tools: [
        { name: "Password Generator", route: "/tools/password-generator" },
        { name: "Hash Generator", route: "/tools/hash-generator" },
        { name: "UUID Generator", route: "/tools/uuid-generator" }
      ],
      color: "from-indigo-500 to-blue-500",
      categoryRoute: "/categories/generators"
    },
    {
      icon: FileText,
      title: "כלי PDF",
      description: "כלים מקצועיים לעיבוד קבצי PDF",
      tools: [
        { name: "PDF Converter", route: "/tools/pdf-converter" },
        { name: "PDF Merger", route: "/tools/pdf-merger" },
        { name: "PDF Splitter", route: "/tools/pdf-splitter" },
        { name: "PDF Compressor", route: "/tools/pdf-compressor" }
      ],
      color: "from-red-500 to-pink-500",
      categoryRoute: "/categories/pdf-tools"
    }
  ];

  const featuredTools = [
    { name: "Password Generator", category: "Security", icon: "🔐", route: "/tools/password-generator" },
    { name: "QR Code Generator", category: "Utilities", icon: "📱", route: "/tools/qr-generator" },
    { name: "Color Picker", category: "Design", icon: "🎨", route: "/tools/color-picker" },
    { name: "Word Counter", category: "Text", icon: "📝", route: "/tools/word-counter" },
    { name: "JSON Formatter", category: "Developer", icon: "⚡", route: "/tools/json-formatter" },
    { name: "Base64 Encoder", category: "Encoding", icon: "🔒", route: "/tools/base64-encoder" },
    { name: "Hash Generator", category: "Crypto", icon: "#️⃣", route: "/tools/hash-generator" },
    { name: "UUID Generator", category: "ID", icon: "🆔", route: "/tools/uuid-generator" },
  ];

  const filteredCategories = toolCategories.filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.tools.some(tool => tool.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ${language === 'he' ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('site.title')}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex space-x-6">
                <a href="#tools" className="text-gray-600 hover:text-blue-600 transition-colors">{t('nav.tools')}</a>
                <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">{t('nav.about')}</a>
                <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">{t('nav.contact')}</a>
              </nav>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            {t('hero.title')}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto px-4">
            {t('hero.subtitle')}
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12 px-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder={t('hero.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto mb-16 px-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-sm sm:text-base text-gray-600">{t('hero.stats.tools')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-sm sm:text-base text-gray-600">{t('hero.stats.free')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-sm sm:text-base text-gray-600">{t('hero.stats.available')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Categories */}
      <section id="tools" className="py-8 sm:py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
            {t('categories.title')}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredCategories.map((category, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/70 backdrop-blur-sm"
              >
                <CardHeader className="p-4 sm:p-6">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base text-gray-600">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="space-y-1 sm:space-y-2 mb-4">
                    {category.tools.slice(0, 4).map((tool, toolIndex) => (
                      <div 
                        key={toolIndex}
                        className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 cursor-pointer transition-colors"
                        onClick={() => navigate(tool.route)}
                      >
                        • {tool.name}
                      </div>
                    ))}
                    {category.tools.length > 4 && (
                      <div className="text-xs sm:text-sm text-gray-500 italic">
                        +{category.tools.length - 4} more tools...
                      </div>
                    )}
                  </div>
                  <Button 
                    className={`w-full text-sm sm:text-base bg-gradient-to-r ${category.color} hover:opacity-90 transition-opacity border-0`}
                    onClick={() => navigate(category.categoryRoute)}
                  >
                    {t('common.explore')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-8 sm:py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
            Most Popular Tools
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredTools.map((tool, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer bg-white border-0"
                onClick={() => navigate(tool.route)}
              >
                <CardContent className="p-3 sm:p-6 text-center">
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{tool.icon}</div>
                  <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">{tool.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-600">{tool.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="h-6 w-6 text-blue-400" />
                <span className="text-lg sm:text-xl font-bold">{t('site.title')}</span>
              </div>
              <p className="text-sm sm:text-base text-gray-400">
                Your one-stop destination for all web-based tools and utilities.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">{t('footer.categories')}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer">Text Tools</li>
                <li className="hover:text-white cursor-pointer">Calculators</li>
                <li className="hover:text-white cursor-pointer">Image Tools</li>
                <li className="hover:text-white cursor-pointer">Developer Tools</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">{t('footer.popular')}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer">Password Generator</li>
                <li className="hover:text-white cursor-pointer">QR Generator</li>
                <li className="hover:text-white cursor-pointer">JSON Formatter</li>
                <li className="hover:text-white cursor-pointer">Color Picker</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">{t('footer.support')}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer">Help Center</li>
                <li className="hover:text-white cursor-pointer">Contact Us</li>
                <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer">Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-sm">
            <p>{t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
