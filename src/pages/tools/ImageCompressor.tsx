import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Download, Upload, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ImageCompressor = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressedImage, setCompressedImage] = useState<string>("");
  const [quality, setQuality] = useState(80);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setOriginalSize(file.size);
      setCompressedImage("");
      setCompressedSize(0);
    } else {
      toast({ title: "Error", description: "Please select a valid image file" });
    }
  };

  const compressImage = () => {
    if (!selectedFile) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new (window as any).Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx?.drawImage(img, 0, 0);
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality / 100);
      setCompressedImage(compressedDataUrl);
      
      // Calculate compressed size (approximate)
      const compressedBytes = Math.round((compressedDataUrl.length * 3) / 4);
      setCompressedSize(compressedBytes);
      
      toast({ title: "Success!", description: "Image compressed successfully" });
    };

    img.src = URL.createObjectURL(selectedFile);
  };

  const downloadCompressed = () => {
    if (compressedImage) {
      const link = document.createElement('a');
      link.href = compressedImage;
      link.download = `compressed_${selectedFile?.name || 'image.jpg'}`;
      link.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
          <h1 className="text-4xl font-bold mb-2">Image Compressor</h1>
          <p className="text-gray-600">Compress images without losing quality</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload & Settings</CardTitle>
              <CardDescription>
                Select an image and adjust compression quality
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
                <label className="block text-sm font-medium mb-2">
                  Quality: {quality}%
                </label>
                <Input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {selectedFile && (
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Original:</strong> {formatFileSize(originalSize)}
                  </div>
                  {compressedSize > 0 && (
                    <div className="text-sm">
                      <strong>Compressed:</strong> {formatFileSize(compressedSize)}
                      <span className="text-green-600 ml-2">
                        ({Math.round(((originalSize - compressedSize) / originalSize) * 100)}% smaller)
                      </span>
                    </div>
                  )}
                </div>
              )}

              <Button onClick={compressImage} disabled={!selectedFile} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Compress Image
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview & Download</CardTitle>
              <CardDescription>
                Preview compressed image and download
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {compressedImage ? (
                <div className="space-y-4">
                  <img 
                    src={compressedImage} 
                    alt="Compressed" 
                    className="max-w-full h-auto border rounded"
                  />
                  <Button onClick={downloadCompressed} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Compressed Image
                  </Button>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed rounded">
                  Compressed image will appear here
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImageCompressor;
