import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Download, Upload, Crop, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ImageCropper = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<string>("");
  const [cropWidth, setCropWidth] = useState(300);
  const [cropHeight, setCropHeight] = useState(300);
  const [imagePreview, setImagePreview] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setCroppedImage("");
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast({ title: "Error", description: "Please select a valid image file" });
    }
  };

  const cropImage = () => {
    if (!selectedFile || !imagePreview) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = new (window as any).Image();

    img.onload = () => {
      if (!canvas || !ctx) return;
      
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      
      // Calculate center crop
      const sourceX = Math.max(0, (img.width - cropWidth) / 2);
      const sourceY = Math.max(0, (img.height - cropHeight) / 2);
      
      ctx.drawImage(
        img,
        sourceX, sourceY, cropWidth, cropHeight,
        0, 0, cropWidth, cropHeight
      );
      
      const croppedDataUrl = canvas.toDataURL('image/png');
      setCroppedImage(croppedDataUrl);
      
      toast({ title: "Success!", description: "Image cropped successfully" });
    };

    img.src = imagePreview;
  };

  const downloadCropped = () => {
    if (croppedImage) {
      const link = document.createElement('a');
      link.href = croppedImage;
      link.download = `cropped_${selectedFile?.name || 'image.png'}`;
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
          <Crop className="h-12 w-12 mx-auto mb-4 text-purple-600" />
          <h1 className="text-4xl font-bold mb-2">Image Cropper</h1>
          <p className="text-gray-600">Crop images to specific dimensions</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload & Settings</CardTitle>
              <CardDescription>
                Select an image and set crop dimensions
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Width (px)</label>
                  <Input
                    type="number"
                    value={cropWidth}
                    onChange={(e) => setCropWidth(Number(e.target.value))}
                    min="10"
                    max="2000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Height (px)</label>
                  <Input
                    type="number"
                    value={cropHeight}
                    onChange={(e) => setCropHeight(Number(e.target.value))}
                    min="10"
                    max="2000"
                  />
                </div>
              </div>

              {imagePreview && (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Preview:</div>
                  <img 
                    src={imagePreview} 
                    alt="Original" 
                    className="max-w-full h-32 object-contain border rounded"
                  />
                </div>
              )}

              <Button onClick={cropImage} disabled={!selectedFile} className="w-full">
                <Crop className="h-4 w-4 mr-2" />
                Crop Image
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cropped Result</CardTitle>
              <CardDescription>
                Preview and download cropped image
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {croppedImage ? (
                <div className="space-y-4">
                  <img 
                    src={croppedImage} 
                    alt="Cropped" 
                    className="max-w-full h-auto border rounded"
                  />
                  <Button onClick={downloadCropped} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Cropped Image
                  </Button>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed rounded">
                  Cropped image will appear here
                </div>
              )}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
