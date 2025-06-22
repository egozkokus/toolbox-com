import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Download, Upload, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ImageConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [convertedImage, setConvertedImage] = useState<string>("");
  const [outputFormat, setOutputFormat] = useState("jpeg");
  const { toast } = useToast();
  const navigate = useNavigate();

  const formats = [
    { value: "jpeg", label: "JPEG" },
    { value: "png", label: "PNG" },
    { value: "webp", label: "WebP" }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setConvertedImage("");
    } else {
      toast({ title: "Error", description: "Please select a valid image file" });
    }
  };

  const convertImage = () => {
    if (!selectedFile) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new (window as any).Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx?.drawImage(img, 0, 0);
      
      const mimeType = `image/${outputFormat}`;
      const convertedDataUrl = canvas.toDataURL(mimeType, 0.9);
      setConvertedImage(convertedDataUrl);
      
      toast({ title: "Success!", description: `Image converted to ${outputFormat.toUpperCase()}` });
    };

    img.src = URL.createObjectURL(selectedFile);
  };

  const downloadConverted = () => {
    if (convertedImage) {
      const link = document.createElement('a');
      link.href = convertedImage;
      const extension = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
      link.download = `converted_${selectedFile?.name?.split('.')[0] || 'image'}.${extension}`;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <Button 
          onClick={() => navigate("/categories/image-tools")} 
          variant="outline" 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Image Tools
        </Button>

        <div className="mb-8 text-center">
          <Image className="h-12 w-12 mx-auto mb-4 text-purple-600" />
          <h1 className="text-4xl font-bold mb-2">Image Format Converter</h1>
          <p className="text-gray-600">Convert images between different formats</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload & Convert</CardTitle>
              <CardDescription>
                Select an image and choose output format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Output Format</label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {formats.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedFile && (
                <div className="text-sm text-gray-600">
                  <strong>Input:</strong> {selectedFile.name} ({selectedFile.type})
                </div>
              )}

              <Button onClick={convertImage} disabled={!selectedFile} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Convert Image
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Converted Image</CardTitle>
              <CardDescription>
                Preview and download converted image
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {convertedImage ? (
                <div className="space-y-4">
                  <img 
                    src={convertedImage} 
                    alt="Converted" 
                    className="max-w-full h-auto border rounded"
                  />
                  <Button onClick={downloadConverted} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Converted Image
                  </Button>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed rounded">
                  Converted image will appear here
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImageConverter;
