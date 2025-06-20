
import { useState } from "react";
import { Volume2, Search, ArrowLeft, Music, FileAudio, Headphones, Scissors, Merge, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const AudioTools = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const audioTools = [
    {
      name: "Audio Editor",
      description: "Professional audio editing with waveform visualization and effects",
      icon: Music,
      route: "/tools/audio-editor",
      gradient: "from-teal-500 to-cyan-500"
    },
    {
      name: "Audio Converter",
      description: "Convert audio files between formats (MP3, WAV, FLAC, etc.)",
      icon: FileAudio,
      route: "/tools/audio-converter",
      gradient: "from-blue-500 to-teal-500"
    },
    {
      name: "Audio Compressor",
      description: "Compress audio files to reduce size while maintaining quality",
      icon: Volume2,
      route: "/tools/audio-compressor",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      name: "Audio Merger",
      description: "Combine multiple audio files into one track",
      icon: Merge,
      route: "/tools/audio-merger",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "Noise Reducer",
      description: "Remove background noise and improve audio quality",
      icon: ShieldCheck,
      route: "/tools/noise-reducer",
      gradient: "from-orange-500 to-red-500"
    },
    {
      name: "Audio Splitter",
      description: "Split audio files into multiple segments",
      icon: Scissors,
      route: "/tools/audio-splitter",
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

  const filteredTools = audioTools.filter(tool =>
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
          Back to Home
        </Button>

        <div className="mb-8 text-center">
          <Volume2 className="h-16 w-16 mx-auto mb-4 text-teal-600" />
          <h1 className="text-4xl font-bold mb-2 text-gray-800">Audio Tools</h1>
          <p className="text-gray-600 text-lg">Professional audio editing and processing tools</p>
        </div>

        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search audio tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg border-2 border-gray-200 focus:border-teal-500 rounded-xl"
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
                <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors">
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
                  <Headphones className="h-4 w-4 mr-2" />
                  Use Tool
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <Volume2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No tools found</h3>
            <p className="text-gray-500">Try adjusting your search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioTools;
