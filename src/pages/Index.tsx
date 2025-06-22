import { useState, useMemo } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

// שלב 1: החלפת FaSearch ב-FaMagnifyingGlass, והסרת אייקונים לא רלוונטיים
import { 
    FaFont, FaCalculator, FaImage, FaVideo, FaCode,
    FaGear, FaFilePdf, FaBolt, FaMagnifyingGlass, FaQrcode, 
    FaPalette, FaFileWord, FaKey, FaHashtag, FaFingerprint
} from 'react-icons/fa6';
import { 
    FaShieldAlt, FaVolumeUp
} from 'react-icons/fa';


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeSwitcher from '@/components/ThemeSwitcher';
import LanguageSelector from "@/components/LanguageSelector";

const Index = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const toolCategoriesConfig = useMemo(() => [
    { icon: FaFont, key: 'text', tools: ["wordCounter", "caseConverter"], color: "from-blue-500 to-cyan-500", categoryRoute: "/categories/text-tools" },
    { icon: FaCalculator, key: 'calculators', tools: ["unitConverter", "percentageCalc"], color: "from-green-500 to-emerald-500", categoryRoute: "/categories/calculators" },
    { icon: FaImage, key: 'image', tools: ["imageResizer", "qrGenerator"], color: "from-purple-500 to-pink-500", categoryRoute: "/categories/image-tools" },
    { icon: FaVideo, key: 'video', tools: ["videoEditor"], color: "from-red-500 to-orange-500", categoryRoute: "/categories/video-tools" },
    { icon: FaVolumeUp, key: 'audio', tools: [], color: "from-teal-500 to-cyan-500", categoryRoute: "/categories/audio-tools" },
    { icon: FaCode, key: 'developer', tools: ["jsonFormatter", "colorPicker"], color: "from-orange-500 to-red-500", categoryRoute: "/categories/developer-tools" },
    { icon: FaGear, key: 'generators', tools: ["passwordGenerator", "hashGenerator"], color: "from-indigo-500 to-blue-500", categoryRoute: "/categories/generators" },
    { icon: FaFilePdf, key: 'pdf', tools: ["pdfConverter", "pdfMerger"], color: "from-red-500 to-pink-500", categoryRoute: "/categories/pdf-tools" }
  ], []);

  const toolCategories = useMemo(() => toolCategoriesConfig.map(category => ({
    ...category,
    title: t(`categories.${category.key}.title`),
    description: t(`categories.${category.key}.desc`),
    tools: category.tools.map(toolKey => ({
        name: t(`tools.${toolKey}.name`),
        route: `/tools/${toolKey.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    }))
  })), [t, toolCategoriesConfig]);

  const featuredTools = useMemo(() => [
    { key: "passwordGenerator", icon: <FaKey /> },
    { key: "qrGenerator", icon: <FaQrcode /> },
    { key: "colorPicker", icon: <FaPalette /> },
    { key: "wordCounter", icon: <FaFileWord /> },
    { key: "jsonFormatter", icon: <FaCode /> },
    { key: "base64Encoder", icon: <FaShieldAlt /> },
    { key: "hashGenerator", icon: <FaHashtag /> },
    { key: "uuidGenerator", icon: <FaFingerprint /> },
  ].map(tool => ({
      ...tool,
      name: t(`tools.${tool.key}.name`),
      category: t(`tools.${tool.key}.category`),
      route: `/tools/${tool.key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
  })), [t]);

  const filteredCategories = toolCategories.filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.tools.some(tool => tool.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-300 ${i18n.dir()}`}>
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <FaBolt className="h-8 w-8 text-blue-500" />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('site.title')}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <nav className="hidden md:flex space-x-6">
                <a href="#tools" className="text-muted-foreground hover:text-foreground transition-colors">{t('nav.tools')}</a>
                <a className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer" onClick={() => navigate('/about')}>{t('nav.about')}</a>
                <a className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer" onClick={() => navigate('/contact')}>{t('nav.contact')}</a>
              </nav>
			        <ThemeSwitcher />
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
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto px-4">
            {t('hero.subtitle')}
          </p>
          
          <div className="max-w-md mx-auto mb-12 px-4">
            <div className="relative">
              <FaMagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder={t('hero.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-3 h-12 text-lg border-2 focus:border-primary rounded-full"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Tools Categories */}
      <section id="tools" className="py-8 sm:py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-foreground">
            {t('categories.title')}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredCategories.map((category, index) => (
              <Card 
                key={index} 
                className="group rounded-xl overflow-hidden bg-card/60 backdrop-blur-sm border-border/50 transition-all duration-300 ease-in-out hover:shadow-2xl hover:border-primary/30 hover:!scale-105"
                onClick={() => navigate(category.categoryRoute)}
              >
                <CardHeader className="p-4 sm:p-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle 
                    className="text-lg sm:text-xl font-bold text-card-foreground group-hover:text-primary transition-colors cursor-pointer"
                  >
                    {category.title}
                  </CardTitle>
                  <CardDescription>
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="space-y-1 sm:space-y-2 mb-4">
                    {category.tools.slice(0, 4).map((tool, toolIndex) => (
                      <div 
                        key={toolIndex}
                        className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                        onClick={(e) => { e.stopPropagation(); navigate(tool.route); }}
                      >
                        • {tool.name}
                      </div>
                    ))}
                  </div>
                  <Button 
                    className={`w-full text-sm sm:text-base bg-gradient-to-r ${category.color} hover:opacity-90 transition-opacity border-0`}
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
      <section className="py-8 sm:py-16 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-foreground">
            {t('featured.title')}
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-6">
            {featuredTools.map((tool, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer bg-card border-0 aspect-square flex flex-col justify-center items-center"
                onClick={() => navigate(tool.route)}
              >
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 text-primary">{tool.icon}</div>
                  <h4 className="font-semibold text-foreground mb-1 text-sm">{tool.name}</h4>
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
                <FaBolt className="h-6 w-6 text-blue-400" />
                <span className="text-lg sm:text-xl font-bold">{t('site.title')}</span>
              </div>
              <p className="text-sm sm:text-base text-gray-400">
                {t('site.footer_desc')}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">{t('footer.categories')}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/categories/text-tools')}>{t('categories.text.title')}</li>
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/categories/calculators')}>{t('categories.calculators.title')}</li>
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/categories/image-tools')}>{t('categories.image.title')}</li>
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/categories/developer-tools')}>{t('categories.developer.title')}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">{t('footer.popular')}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/tools/password-generator')}>{t('tools.passwordGenerator.name')}</li>
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/tools/qr-generator')}>{t('tools.qrGenerator.name')}</li>
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/tools/json-formatter')}>{t('tools.jsonFormatter.name')}</li>
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/tools/color-picker')}>{t('tools.colorPicker.name')}</li>
              </ul>
            </div>
            
            {/* --- החלק המעודכן --- */}
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">{t('footer.support')}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/contact')}>{t('footer.links.contact')}</li>
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/about')}>{t('footer.links.about')}</li>
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/privacy-policy')}>{t('footer.links.privacy')}</li>
              </ul>
            </div>
            {/* --- סוף החלק המעודכן --- */}

          </div>
          
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-sm">
            <p>{t('footer.rights', { year: new Date().getFullYear() })}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;