
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ImageUploadProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string;
}

const ImageUpload = ({ onFileSelect, imagePreview }: ImageUploadProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>העלאת תמונה</CardTitle>
        <CardDescription>בחר תמונה להתחלת העריכה</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">בחר תמונה</label>
          <Input
            type="file"
            accept="image/*"
            onChange={onFileSelect}
            className="cursor-pointer"
          />
        </div>

        {imagePreview && (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">תצוגה מקדימה מקורית:</div>
            <img 
              src={imagePreview} 
              alt="Original" 
              className="max-w-full h-32 object-contain border rounded"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
