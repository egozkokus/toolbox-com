
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface VideoUploadProps {
  onFileSelect: (file: File) => void;
}

const VideoUpload = ({ onFileSelect }: VideoUploadProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      onFileSelect(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">בחר וידיאו</label>
      <div className="relative">
        <Input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="cursor-pointer"
        />
        <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

export default VideoUpload;
