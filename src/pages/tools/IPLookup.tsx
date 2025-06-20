
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search, Globe, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface IPInfo {
  ip: string;
  country: string;
  region: string;
  city: string;
  isp: string;
  timezone: string;
  lat: number;
  lon: number;
}

const IPLookup = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const lookupIP = async () => {
    if (!ipAddress.trim()) {
      // Get user's own IP
      setIsLoading(true);
      try {
        // Simulate IP lookup with mock data
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockData: IPInfo = {
          ip: "8.8.8.8",
          country: "United States",
          region: "California",
          city: "Mountain View",
          isp: "Google LLC",
          timezone: "America/Los_Angeles",
          lat: 37.4056,
          lon: -122.0775
        };
        
        setIpInfo(mockData);
        toast({
          title: "הושלם!",
          description: "פרטי ה-IP נטענו בהצלחה"
        });
      } catch (error) {
        toast({
          title: "שגיאה",
          description: "לא ניתן לאתר את ה-IP"
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Validate IP format
      const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipRegex.test(ipAddress)) {
        toast({
          title: "שגיאה",
          description: "כתובת IP לא תקינה"
        });
        return;
      }

      setIsLoading(true);
      try {
        // Simulate IP lookup
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockData: IPInfo = {
          ip: ipAddress,
          country: "Israel",
          region: "Tel Aviv",
          city: "Tel Aviv",
          isp: "Bezeq International",
          timezone: "Asia/Jerusalem",
          lat: 32.0853,
          lon: 34.7818
        };
        
        setIpInfo(mockData);
        toast({
          title: "הושלם!",
          description: "פרטי ה-IP נטענו בהצלחה"
        });
      } catch (error) {
        toast({
          title: "שגיאה",
          description: "לא ניתן לאתר את ה-IP"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getMyIP = () => {
    setIpAddress("");
    lookupIP();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <Button 
          onClick={() => navigate("/categories/developer-tools")} 
          variant="outline" 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          חזרה לכלי מפתחים
        </Button>

        <div className="mb-8 text-center">
          <Globe className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold mb-2">חיפוש IP</h1>
          <p className="text-gray-600">מצא מידע על כתובות IP</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>חיפוש כתובת IP</CardTitle>
              <CardDescription>הכנס כתובת IP או השאר ריק לבדיקת ה-IP שלך</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  placeholder="192.168.1.1"
                  className="font-mono"
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={lookupIP} disabled={isLoading} className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  {isLoading ? "מחפש..." : "חפש"}
                </Button>
                <Button onClick={getMyIP} disabled={isLoading} variant="outline">
                  <Globe className="h-4 w-4 mr-2" />
                  ה-IP שלי
                </Button>
              </div>

              <div className="p-3 bg-blue-50 rounded">
                <h4 className="font-medium text-blue-800 mb-2">מה ניתן לגלות:</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• מיקום גיאוגרפי</li>
                  <li>• ספק האינטרנט (ISP)</li>
                  <li>• אזור זמן</li>
                  <li>• מדינה ועיר</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>מידע על ה-IP</CardTitle>
              <CardDescription>פרטים על כתובת ה-IP</CardDescription>
            </CardHeader>
            <CardContent>
              {ipInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-sm text-gray-600">כתובת IP</div>
                      <div className="font-mono font-medium">{ipInfo.ip}</div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-sm text-gray-600">מיקום</div>
                      <div className="font-medium flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {ipInfo.city}, {ipInfo.region}, {ipInfo.country}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-sm text-gray-600">ספק אינטרנט</div>
                      <div className="font-medium">{ipInfo.isp}</div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-sm text-gray-600">אזור זמן</div>
                      <div className="font-medium">{ipInfo.timezone}</div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-sm text-gray-600">קורדינטות</div>
                      <div className="font-medium font-mono">
                        {ipInfo.lat.toFixed(4)}, {ipInfo.lon.toFixed(4)}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-yellow-800 text-sm">
                      <strong>הערה:</strong> המידע מוצג לצרכי הדגמה בלבד. 
                      באפליקציה אמיתית יש להשתמש ב-API אמיתי.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-400 border border-dashed rounded">
                  <div className="text-center">
                    <Globe className="h-12 w-12 mx-auto mb-2" />
                    <div>מידע על ה-IP יופיע כאן</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IPLookup;
