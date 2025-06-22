
import { useState } from "react";
import { Search, Type, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const TextTools = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const textTools = [
    { name: "Word Counter", description: "Count words, characters, and paragraphs", route: "/tools/word-counter", icon: "📝" },
    { name: "Case Converter", description: "Convert text to different cases", route: "/tools/case-converter", icon: "🔤" },
    { name: "Lorem Generator", description: "Generate Lorem Ipsum text", route: "/tools/lorem-generator", icon: "📄" },
    { name: "Text Reverser", description: "Reverse text characters", route: "/tools/text-reverser", icon: "↩️" },
    { name: "Text Formatter", description: "Format and clean text", route: "/tools/text-formatter", icon: "✨" },
    { name: "Line Sorter", description: "Sort lines alphabetically", route: "/tools/line-sorter", icon: "📋" },
    { name: "Text Diff", description: "Compare two texts", route: "/tools/text-diff", icon: "🔍" },
    { name: "Character Frequency", description: "Count character frequency", route: "/tools/char-frequency", icon: "📊" }
  ];

  const filteredTools = textTools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={() => navigate("/")} 
            variant="outline" 
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <Type className="h-16 w-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Text Tools
            </h1>
            <p className="text-gray-600 text-lg">Transform and manipulate text with ease</p>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search text tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3"
            />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => navigate(tool.route)}
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{tool.icon}</div>
                <CardTitle className="text-lg">{tool.name}</CardTitle>
                <CardDescription className="text-sm">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Use Tool
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextTools;
