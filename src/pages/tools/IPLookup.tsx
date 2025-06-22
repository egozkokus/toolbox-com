import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Wifi } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface IpInfo {
    status: string;
    query: string;
    country: string;
    city: string;
    isp: string;
    org: string;
    as: string;
    lat: number;
    lon: number;
}

const IPLookup = () => {
    const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchIpInfo = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://ip-api.com/json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: IpInfo = await response.json();
                if (data.status === 'success') {
                    setIpInfo(data);
                } else {
                    throw new Error('Failed to fetch IP information');
                }
            } catch (error) {
                console.error("Failed to fetch IP info:", error);
                toast({
                    title: "שגיאה באחזור המידע",
                    description: "לא הצלחנו לאתר את פרטי ה-IP שלך. נסה לרענן את הדף.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchIpInfo();
    }, [toast]);
    
    const InfoRow = ({ label, value }: { label: string; value: string | number | undefined }) => (
        <div className="flex justify-between items-center py-3 border-b">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="text-sm font-semibold text-gray-800 text-right">{value || 'N/A'}</dd>
        </div>
    );

    return (
        <div className="container mx-auto max-w-2xl p-4">
            <Button onClick={() => navigate("/categories/network-tools")} variant="outline" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                חזרה לכלי רשת
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Wifi className="h-6 w-6 mr-2 text-blue-500" />
                        פרטי ה-IP שלך
                    </CardTitle>
                    <CardDescription>מידע על כתובת ה-IP הציבורית שלך ומיקומך הגיאוגרפי.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            <p className="ml-4">מאחזר מידע...</p>
                        </div>
                    ) : ipInfo ? (
                        <dl>
                            <InfoRow label="כתובת IP" value={ipInfo.query} />
                            <InfoRow label="מדינה" value={ipInfo.country} />
                            <InfoRow label="עיר" value={ipInfo.city} />
                            <InfoRow label="ספק אינטרנט (ISP)" value={ipInfo.isp} />
                            <InfoRow label="ארגון" value={ipInfo.org} />
                            <InfoRow label="AS" value={ipInfo.as} />
                            <InfoRow label="קו רוחב" value={ipInfo.lat} />
                            <InfoRow label="קו אורך" value={ipInfo.lon} />
                        </dl>
                    ) : (
                        <p className="text-center text-red-500">לא ניתן היה לטעון את המידע.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default IPLookup;