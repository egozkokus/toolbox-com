
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/common/PageHeader";

const HashGenerator = () => {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const generateHashes = async () => {
    if (!input.trim()) return;

    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    try {
      // Generate different hashes
      const sha1 = await crypto.subtle.digest('SHA-1', data);
      const sha256 = await crypto.subtle.digest('SHA-256', data);
      const sha384 = await crypto.subtle.digest('SHA-384', data);
      const sha512 = await crypto.subtle.digest('SHA-512', data);

      const toHex = (buffer: ArrayBuffer) => {
        return Array.from(new Uint8Array(buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      };

      setHashes({
        SHA1: toHex(sha1),
        SHA256: toHex(sha256),
        SHA384: toHex(sha384),
        SHA512: toHex(sha512),
        MD5: "MD5 not supported in browser"
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate hashes" });
    }
  };

  const copyToClipboard = (value: string, type: string) => {
    navigator.clipboard.writeText(value);
    toast({ title: "Copied!", description: `${type} hash copied to clipboard` });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <PageHeader
          title="Hash Generator"
          subtitle="Generate cryptographic hashes for any text"
          icon={<Hash className="h-16 w-16 text-blue-600" />}
          backPath="/categories/generators"
          backLabel="Back to Generators"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
              <CardDescription>
                Enter text to generate hashes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your text here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-32"
              />
              <Button onClick={generateHashes} className="w-full">
                Generate Hashes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Hashes</CardTitle>
              <CardDescription>
                Cryptographic hash values
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(hashes).map(([type, hash]) => (
                <div key={type} className="space-y-2">
                  <Label>{type}</Label>
                  <div className="flex gap-2">
                    <Input value={hash} readOnly className="font-mono text-xs" />
                    <Button 
                      onClick={() => copyToClipboard(hash, type)} 
                      variant="outline"
                      size="icon"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HashGenerator;
