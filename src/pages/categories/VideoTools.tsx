
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Video, Search, ArrowLeft, Play, Film, Scissors, FileVideo, Image as ImageIcon, Merge } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const VideoTools = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const videoToolsConfig = useMemo(() => [
    { key: "videoEditor", icon: Film, route: "/tools/video-editor", gradient: "from-red-500 to-pink-500" },
    { key: "videoCompressor", icon: FileVideo, route: "/tools/video-compressor", gradient: "from-blue-500 to-purple-500" },
    { key: "videoConverter", icon: Video, route: "/tools/video-converter", gradient: "from-green-500 to-teal-500" },
    { key: "videoTrimmer", icon: Scissors, route: "/tools/video-trimmer", gradient: "from-orange-500 to-red-500" },
    { key: "gifMaker", icon: ImageIcon, route: "/tools/gif-maker", gradient: "from-purple-500 to-indigo-500" },
    { key: "videoMerger", icon: Merge, route: "/tools/video-merger", gradient: "from-cyan-500 to-blue-500" }
  ], []);

  const videoTools = useMemo(() => videoToolsConfig.map(tool => ({
    ...tool,
    name: t(`video_tools_page.tools.${tool.key}.name`),
    description: t(`video_tools_page.tools.${tool.key}.description`)
  })), [t, videoToolsConfig]);

  const filteredTools = videoTools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <Button 
          onClick={() => navigate("/")} 
          variant="outline" 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('video_tools_page.back_to_home')}
        </Button>

        <div className="mb-8 text-center">
          <Video className="h-16 w-16 mx-auto mb-4 text-red-600" />
          <h1 className="text-4xl font-bold mb-2 text-gray-800">{t('video_tools_page.title')}</h1>
          <p className="text-gray-600 text-lg">{t('video_tools_page.subtitle')}</p>
        </div>

        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder={t('video_tools_page.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg border-2 border-gray-200 focus:border-red-500 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-red-600 transition-colors">
                  {tool.name}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate(tool.route)}
                  className={`w-full bg-gradient-to-r ${tool.gradient} hover:opacity-90 transition-opacity border-0`}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {t('video_tools_page.use_tool_button')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <Video className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">{t('video_tools_page.no_results_title')}</h3>
            <p className="text-gray-500">{t('video_tools_page.no_results_subtitle')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoTools;
