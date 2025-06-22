
import { useState } from "react";
import { Key, Copy, RefreshCw, Settings } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const APIKeyGenerator = () => {
  const [length, setLength] = useState(32);
  const [prefix, setPrefix] = useState("");
  const [format, setFormat] = useState("hex");
  const [includeTimestamp, setIncludeTimestamp] = useState(false);
  const [generatedKeys, setGeneratedKeys] = useState<string[]>([]);

  const generateKey = () => {
    let key = "";
    
    switch (format) {
      case "hex":
        key = Array.from({ length }, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join("");
        break;
      case "base64":
        const bytes = new Uint8Array(length);
        crypto.getRandomValues(bytes);
        key = btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, '');
        break;
      case "uuid":
        key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
        break;
      case "alphanumeric":
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        key = Array.from({ length }, () => 
          chars.charAt(Math.floor(Math.random() * chars.length))
        ).join("");
        break;
    }

    if (includeTimestamp) {
      const timestamp = Date.now().toString(36);
      key = `${timestamp}_${key}`;
    }

    if (prefix) {
      key = `${prefix}_${key}`;
    }

    const newKeys = [key, ...generatedKeys.slice(0, 9)]; // Keep last 10 keys
    setGeneratedKeys(newKeys);
    toast.success("מפתח API נוצר בהצלחה!");
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("המפתח הועתק ללוח!");
  };

  const copyAllKeys = () => {
    const allKeys = generatedKeys.join('\n');
    navigator.clipboard.writeText(allKeys);
    toast.success("כל המפתחות הועתקו ללוח!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <PageHeader
          title="מחולל מפתחות API"
          subtitle="צור מפתחות API מאובטחים לשירותים שלך"
          icon={<Key className="h-16 w-16 text-indigo-600" />}
          backPath="/categories/generators"
          backLabel="חזרה לגנרטורים"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                הגדרות מפתח
              </CardTitle>
              <CardDescription>קבע את הפרמטרים למפתח ה-API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="prefix">קידומת (אופציונלי)</Label>
                <Input
                  id="prefix"
                  placeholder="api, sk, pk"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="format">פורמט מפתח</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hex">Hexadecimal</SelectItem>
                    <SelectItem value="base64">Base64</SelectItem>
                    <SelectItem value="uuid">UUID</SelectItem>
                    <SelectItem value="alphanumeric">Alphanumeric</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {format !== "uuid" && (
                <div>
                  <Label htmlFor="length">אורך מפתח</Label>
                  <Input
                    id="length"
                    type="number"
                    min="8"
                    max="128"
                    value={length}
                    onChange={(e) => setLength(parseInt(e.target.value) || 32)}
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="timestamp"
                  checked={includeTimestamp}
                  onCheckedChange={(checked) => setIncludeTimestamp(checked === true)}
                />
                <Label htmlFor="timestamp">כלול חותמת זמן</Label>
              </div>

              <Button onClick={generateKey} className="w-full" size="lg">
                <RefreshCw className="h-4 w-4 mr-2" />
                צור מפתח API
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>מפתחות שנוצרו</CardTitle>
              <CardDescription>המפתחות האחרונים שנוצרו</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedKeys.length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {generatedKeys.map((key, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                      >
                        <code className="text-sm font-mono text-gray-700 flex-1 break-all">
                          {key}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyKey(key)}
                          className="ml-2 flex-shrink-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={copyAllKeys} 
                      variant="outline" 
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      העתק הכל
                    </Button>
                    <Button 
                      onClick={generateKey} 
                      variant="outline"
                      className="flex-1"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      צור עוד
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>לחץ על "צור מפתח API" כדי להתחיל</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>טיפים לאבטחה</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>השתמש במפתחות ארוכים (לפחות 32 תווים) לאבטחה מקסימלית</li>
              <li>אל תשתף מפתחות API בקוד או בגרסיונות</li>
              <li>החלף מפתחות באופן קבוע</li>
              <li>השתמש בהרשאות מוגבלות לכל מפתח</li>
              <li>עקוב אחר השימוש במפתחות ובקש אירועים חשודים</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default APIKeyGenerator;
