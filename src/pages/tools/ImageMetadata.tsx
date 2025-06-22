import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Upload, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface MetadataInfo {
  fileName: string;
  fileSize: number;
  fileType: string;
  dimensions: { width: number; height: number };
  lastModified: Date;
}

const ImageMetadata = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<MetadataInfo | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        extractMetadata(file);
      };
      reader.readAsDataURL(file);
    } else {
      toast({ title: "Error", description: "Please select a valid image file" });
    }
  };

  const extractMetadata = (file: File) => {
    const img = new (window as any).Image();
    img.onload = () => {
      const metadataInfo: MetadataInfo = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        dimensions: { width: img.width, height: img.height },
        lastModified: new Date(file.lastModified)
      };
      
      setMetadata(metadataInfo);
      toast({ title: "Success!", description: "Metadata extracted successfully" });
    };
    
    img.src = URL.createObjectURL(file);
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
          <h1 className="text-4xl font-bold mb-2">Image Metadata Viewer</h1>
          <p className="text-gray-600">View image information and metadata</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>
                Select an image to view its metadata
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

              {imagePreview && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Preview:</div>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-w-full h-48 object-contain border rounded"
                  />
                </div>
              )}

              <Button onClick={() => selectedFile && extractMetadata(selectedFile)} disabled={!selectedFile} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Extract Metadata
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Image Metadata</CardTitle>
              <CardDescription>
                Detailed information about the image
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metadata ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between">
                      <span className="font-medium">File Name:</span>
                      <span className="text-gray-600">{metadata.fileName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">File Size:</span>
                      <span className="text-gray-600">{formatFileSize(metadata.fileSize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">File Type:</span>
                      <span className="text-gray-600">{metadata.fileType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Dimensions:</span>
                      <span className="text-gray-600">
                        {metadata.dimensions.width} × {metadata.dimensions.height} px
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Aspect Ratio:</span>
                      <span className="text-gray-600">
                        {(metadata.dimensions.width / metadata.dimensions.height).toFixed(2)}:1
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Last Modified:</span>
                      <span className="text-gray-600">
                        {metadata.lastModified.toLocaleDateString()} {metadata.lastModified.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed rounded">
                  Metadata will appear here after uploading an image
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImageMetadata;
