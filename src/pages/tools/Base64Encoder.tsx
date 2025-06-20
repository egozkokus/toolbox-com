
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Copy, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Base64Encoder = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const { toast } = useToast();

  const processText = () => {
    try {
      if (mode === "encode") {
        const encoded = btoa(input);
        setOutput(encoded);
      } else {
        const decoded = atob(input);
        setOutput(decoded);
      }
    } catch (error) {
      toast({ title: "Error", description: "Invalid input for decoding" });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Copied!", description: "Result copied to clipboard" });
  };

  const switchMode = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput("");
    setOutput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <Code className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold mb-2">Base64 Encoder/Decoder</h1>
          <p className="text-gray-600">Encode and decode Base64 strings</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Input</CardTitle>
                  <CardDescription>
                    Enter text to {mode}
                  </CardDescription>
                </div>
                <Button onClick={switchMode} variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Switch to {mode === "encode" ? "Decode" : "Encode"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-48"
              />
              <Button onClick={processText} className="w-full">
                {mode === "encode" ? "Encode" : "Decode"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Output</CardTitle>
              <CardDescription>
                {mode === "encode" ? "Encoded" : "Decoded"} result
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={output}
                readOnly
                className="min-h-48 bg-gray-50"
                placeholder="Result will appear here..."
              />
              {output && (
                <Button onClick={copyToClipboard} variant="outline" className="w-full">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Result
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Base64Encoder;
