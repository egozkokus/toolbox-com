// src/pages/tools/JWTDecoder.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Copy, RotateCcw, AlertTriangle, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/common/PageHeader";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { ERROR_CODES } from "@/lib/errorHandling";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SafeExecutionWrapper from "@/components/SafeExecutionWrapper";

const JWTDecoder = () => {
  const [token, setToken] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const { logError, handleAsyncError, validateAndHandle } = useErrorHandler({
    context: 'jwt-decoder'
  });

  const decodeJWT = async () => {
    setError("");
    setHeader("");
    setPayload("");
    setSignature("");

    // Validate input
    if (!validateAndHandle(
      token,
      (val) => val.trim().length > 0,
      ERROR_CODES.EMPTY_INPUT,
      "אנא הכנס טוקן JWT"
    )) {
      return;
    }

    const result = await handleAsyncError(async () => {
      const parts = token.split('.');
      
      if (parts.length !== 3) {
        throw new Error("JWT לא תקין - חייב להכיל 3 חלקים (header.payload.signature)");
      }

      // Decode and validate header
      let decodedHeader;
      try {
        decodedHeader = JSON.parse(atob(parts[0]));
      } catch (e) {
        throw new Error("כותרת JWT לא תקינה - לא ניתן לפענח");
      }

      // Decode and validate payload
      let decodedPayload;
      try {
        decodedPayload = JSON.parse(atob(parts[1]));
      } catch (e) {
        throw new Error("תוכן JWT לא תקין - לא ניתן לפענח");
      }

      // Check for security issues
      if (decodedPayload.admin === true || decodedPayload.role === 'admin') {
        logError(
          ERROR_CODES.SECURITY_VIOLATION,
          "זוהה טוקן עם הרשאות מנהל - יש לבדוק את מקור הטוקן",
          'warning'
        );
      }

      // Check token expiration
      if (decodedPayload.exp) {
        const expirationDate = new Date(decodedPayload.exp * 1000);
        if (expirationDate < new Date()) {
          logError(
            ERROR_CODES.INVALID_FORMAT,
            `הטוקן פג תוקף ב-${expirationDate.toLocaleString('he-IL')}`,
            'warning'
          );
        }
      }

      return {
        header: decodedHeader,
        payload: decodedPayload,
        signature: parts[2]
      };
    });

    if (result) {
      setHeader(JSON.stringify(result.header, null, 2));
      setPayload(JSON.stringify(result.payload, null, 2));
      setSignature(result.signature);
      
      toast({ 
        title: "הצלחה!", 
        description: "טוקן JWT פוענח בהצלחה" 
      });
    } else {
      setError("שגיאה בפענוח JWT - ודא שהטוקן תקין");
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    const result = await handleAsyncError(
      async () => {
        await navigator.clipboard.writeText(text);
        return true;
      },
      ERROR_CODES.CLIPBOARD_ACCESS_DENIED
    );

    if (result) {
      toast({ 
        title: "הועתק!", 
        description: `${type} הועתק ללוח` 
      });
    }
  };

  const resetFields = () => {
    setToken("");
    setHeader("");
    setPayload("");
    setSignature("");
    setError("");
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('he-IL');
  };

  const parsePayloadForDisplay = () => {
    if (!payload) return "";
    
    try {
      const parsed = JSON.parse(payload);
      const displayData = { ...parsed };
      
      // Format common timestamp fields
      if (displayData.iat) {
        displayData.iat_formatted = formatTimestamp(displayData.iat);
      }
      if (displayData.exp) {
        displayData.exp_formatted = formatTimestamp(displayData.exp);
      }
      if (displayData.nbf) {
        displayData.nbf_formatted = formatTimestamp(displayData.nbf);
      }
      
      return JSON.stringify(displayData, null, 2);
    } catch {
      return payload;
    }
  };

  return (
    <SafeExecutionWrapper context="jwt-decoder">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="container mx-auto max-w-6xl">
          <PageHeader
            title="מפענח JWT"
            subtitle="פענח טוקני JWT וצפה בתוכן שלהם"
            icon={<Key className="h-16 w-16 text-purple-600" />}
            backPath="/categories/developer-tools"
            backLabel="חזרה לכלי מפתחים"
          />

          {/* Security Warning */}
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <Shield className="h-4 w-4 text-orange-600" />
            <AlertTitle className="text-orange-800">אזהרת אבטחה</AlertTitle>
            <AlertDescription className="text-orange-700">
              אל תשתף טוקני JWT אמיתיים המכילים מידע רגיש. 
              השתמש בטוקנים לדוגמה בלבד באתרים ציבוריים.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>טוקן JWT</CardTitle>
                <CardDescription>הדבק כאן את הטוקן שברצונך לפענח</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="min-h-32 font-mono text-sm"
                />
                <div className="flex gap-2">
                  <Button onClick={decodeJWT} className="flex-1">
                    <Key className="h-4 w-4 mr-2" />
                    פענח JWT
                  </Button>
                  <Button onClick={resetFields} variant="outline">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {(header || payload || signature) && (
              <>
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Header</CardTitle>
                      <CardDescription>מידע על האלגוריתם וסוג הטוקן</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        value={header}
                        readOnly
                        className="min-h-32 font-mono text-sm bg-gray-50"
                      />
                      <Button 
                        onClick={() => copyToClipboard(header, "Header")} 
                        variant="outline"
                        disabled={!header}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        העתק
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Payload</CardTitle>
                      <CardDescription>הנתונים המקודדים בטוקן</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        value={parsePayloadForDisplay()}
                        readOnly
                        className="min-h-32 font-mono text-sm bg-gray-50"
                      />
                      <Button 
                        onClick={() => copyToClipboard(payload, "Payload")} 
                        variant="outline"
                        disabled={!payload}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        העתק
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Signature</CardTitle>
                    <CardDescription>
                      החתימה הדיגיטלית (לא ניתן לאמת ללא המפתח הסודי)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <code className="block p-4 bg-gray-100 rounded text-sm break-all">
                      {signature}
                    </code>
                    <Button 
                      onClick={() => copyToClipboard(signature, "Signature")} 
                      variant="outline"
                      disabled={!signature}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      העתק
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </SafeExecutionWrapper>
  );
};

export default JWTDecoder;