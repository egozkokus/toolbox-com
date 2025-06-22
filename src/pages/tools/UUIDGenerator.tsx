
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Fingerprint, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UUIDGenerator = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const { toast } = useToast();

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const generateUUIDs = () => {
    const newUUIDs = Array.from({ length: count }, () => generateUUID());
    setUuids(newUUIDs);
  };

  const copyToClipboard = (uuid: string) => {
    navigator.clipboard.writeText(uuid);
    toast({ title: "Copied!", description: "UUID copied to clipboard" });
  };

  const copyAllUUIDs = () => {
    const allUUIDs = uuids.join('\n');
    navigator.clipboard.writeText(allUUIDs);
    toast({ title: "Copied!", description: "All UUIDs copied to clipboard" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <Fingerprint className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold mb-2">UUID Generator</h1>
          <p className="text-gray-600">Generate unique identifiers (UUID v4)</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Generate UUIDs</CardTitle>
            <CardDescription>
              Specify how many UUIDs to generate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="count">Number of UUIDs</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
            <Button onClick={generateUUIDs} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate UUIDs
            </Button>
          </CardContent>
        </Card>

        {uuids.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generated UUIDs</CardTitle>
                  <CardDescription>
                    {uuids.length} UUID{uuids.length > 1 ? 's' : ''} generated
                  </CardDescription>
                </div>
                {uuids.length > 1 && (
                  <Button onClick={copyAllUUIDs} variant="outline">
                    Copy All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {uuids.map((uuid, index) => (
                <div key={index} className="flex gap-2">
                  <Input value={uuid} readOnly className="font-mono" />
                  <Button 
                    onClick={() => copyToClipboard(uuid)} 
                    variant="outline"
                    size="icon"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UUIDGenerator;
