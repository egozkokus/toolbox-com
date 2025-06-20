
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

interface ImagePreviewProps {
  editedImage: string;
  onDownload: () => void;
}

const ImagePreview = ({ editedImage, onDownload }: ImagePreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>תוצאה ערוכה</CardTitle>
        <CardDescription>תצוגה מקדימה והורדה של התמונה הערוכה</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {editedImage ? (
          <div className="space-y-4">
            <img 
              src={editedImage} 
              alt="Edited" 
              className="max-w-full h-auto border rounded"
            />
            <Button onClick={onDownload} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              הורד תמונה ערוכה
            </Button>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed rounded">
            התמונה הערוכה תופיע כאן
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImagePreview;
