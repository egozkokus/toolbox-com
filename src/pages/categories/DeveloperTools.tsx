
import { useState } from "react";
import { Search, Code, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const DeveloperTools = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const developerTools = [
    { name: "JSON Formatter", description: "Format and validate JSON", route: "/tools/json-formatter", icon: "⚡" },
    { name: "Base64 Encoder", description: "Encode/decode Base64 strings", route: "/tools/base64-encoder", icon: "🔒" },
    { name: "URL Encoder", description: "Encode/decode URLs", route: "/tools/url-encoder", icon: "🌐" },
    { name: "Color Picker", description: "Pick and convert colors", route: "/tools/color-picker", icon: "🎨" },
    { name: "CSS Minifier", description: "Minify CSS code", route: "/tools/css-minifier", icon: "🎯" },
    { name: "JavaScript Minifier", description: "Minify JavaScript code", route: "/tools/js-minifier", icon: "📄" },
    { name: "HTML Formatter", description: "Format and beautify HTML", route: "/tools/html-formatter", icon: "📝" },
    { name: "SQL Formatter", description: "Format SQL queries", route: "/tools/sql-formatter", icon: "🗄️" },
    { name: "XML Formatter", description: "Format and validate XML", route: "/tools/xml-formatter", icon: "🏷️" },
    { name: "Regex Tester", description: "Test regular expressions", route: "/tools/regex-tester", icon: "🔍" },
    { name: "JWT Decoder", description: "Decode JWT tokens", route: "/tools/jwt-decoder", icon: "🔐" },
    { name: "Markdown to HTML", description: "Convert Markdown to HTML", route: "/tools/markdown-converter", icon: "📖" }
  ];

  const filteredTools = developerTools.filter(tool =>
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
            <Code className="h-16 w-16 mx-auto mb-4 text-orange-600" />
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Developer Tools
            </h1>
            <p className="text-gray-600 text-lg">Essential tools for developers</p>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search developer tools..."
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

export default DeveloperTools;
