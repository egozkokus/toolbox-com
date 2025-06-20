
import { useState } from "react";
import { Search, Image, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const ImageTools = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const imageTools = [
    { name: "Image Resizer", description: "Resize images to any dimension", route: "/tools/image-resizer", icon: "🖼️" },
    { name: "QR Generator", description: "Generate QR codes", route: "/tools/qr-generator", icon: "📱" },
    { name: "Image Compressor", description: "Compress images without quality loss", route: "/tools/image-compressor", icon: "🗜️" },
    { name: "Image Format Converter", description: "Convert between image formats", route: "/tools/image-converter", icon: "🔄" },
    { name: "Image Cropper", description: "Crop images to specific dimensions", route: "/tools/image-cropper", icon: "✂️" },
    { name: "Image Filter", description: "Apply filters to images", route: "/tools/image-filter", icon: "🎨" },
    { name: "Barcode Generator", description: "Generate various barcodes", route: "/tools/barcode-generator", icon: "📊" },
    { name: "Image Metadata Viewer", description: "View image EXIF data", route: "/tools/image-metadata", icon: "📋" }
  ];

  const filteredTools = imageTools.filter(tool =>
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
            <Image className="h-16 w-16 mx-auto mb-4 text-purple-600" />
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Image Tools
            </h1>
            <p className="text-gray-600 text-lg">Edit and optimize your images</p>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search image tools..."
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

export default ImageTools;
