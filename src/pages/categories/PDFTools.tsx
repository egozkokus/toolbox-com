
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "@/components/LanguageSelector";

const PDFTools = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const pdfToolsConfig = useMemo(
    () => [
      { key: "pdfConverter", icon: "🔄", route: "/tools/pdf-converter", category: "conversion" },
      { key: "pdfMerger", icon: "📎", route: "/tools/pdf-merger", category: "processing" },
      { key: "pdfSplitter", icon: "✂️", route: "/tools/pdf-splitter", category: "processing" },
      { key: "pdfCompressor", icon: "🗜️", route: "/tools/pdf-compressor", category: "optimization" },
      { key: "pdfPassword", icon: "🔐", route: "/tools/pdf-password", category: "security" },
      { key: "pdfRotator", icon: "🔄", route: "/tools/pdf-rotator", category: "processing" },
      { key: "pdfTextExtractor", icon: "📝", route: "/tools/pdf-text-extractor", category: "content" },
      { key: "pdfSignature", icon: "✍️", route: "/tools/pdf-signature", category: "security" }
    ],
    []
  );

  const pdfTools = useMemo(
    () =>
      pdfToolsConfig.map((tool) => ({
        ...tool,
        title: t(`pdf_tools_page.tools.${tool.key}.name`),
        description: t(`pdf_tools_page.tools.${tool.key}.description`),
        category: t(`pdf_tools_page.categories.${tool.category}`)
      })),
    [t, pdfToolsConfig]
  );

  const filteredTools = pdfTools.filter((tool) =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(pdfTools.map((tool) => tool.category))];

  const basicList = t('pdf_tools_page.info_basic_list', { returnObjects: true }) as string[];
  const advancedList = t('pdf_tools_page.info_advanced_list', { returnObjects: true }) as string[];

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
                  {t('pdf_tools_page.back_to_home')}
              </Button>
              <Button 
                onClick={() => navigate("/")} 
                variant="outline" 
                size="sm"
              >
                <Home className="h-4 w-4 mr-2" />
                  {t('nav.home', { defaultValue: 'Home' })}
              </Button>
            </div>
            <LanguageSelector />
          </div>
          
          <div className="text-center">
            <div className="mb-4">
              <FileText className="h-16 w-16 mx-auto text-red-600" />
            </div>
            <h1 className="text-4xl font-bold mb-2">{t('pdf_tools_page.title')}</h1>
              <p className="text-gray-600">{t('pdf_tools_page.subtitle')}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder={t('pdf_tools_page.search_placeholder')}
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
                  {t('pdf_tools_page.use_tool_button')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('pdf_tools_page.no_results_text')}</p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-center">{t('pdf_tools_page.info_title')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">{t('pdf_tools_page.info_basic_title')}</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {basicList.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t('pdf_tools_page.info_advanced_title')}</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {advancedList.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFTools;
