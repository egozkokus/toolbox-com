
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown, Copy, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const LineSorter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();
  const navigate = useNavigate();

  const sortLines = () => {
    const lines = input.split('\n').filter(line => line.trim() !== '');
    const sorted = lines.sort((a, b) => {
      return sortOrder === "asc" ? a.localeCompare(b) : b.localeCompare(a);
    });
    setOutput(sorted.join('\n'));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Copied!", description: "Sorted lines copied to clipboard" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <Button 
          onClick={() => navigate("/categories/text-tools")} 
          variant="outline" 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Text Tools
        </Button>

        <div className="mb-8 text-center">
          <ArrowUpDown className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold mb-2">Line Sorter</h1>
          <p className="text-gray-600">Sort lines of text alphabetically</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Input Text</CardTitle>
              <CardDescription>
                Enter lines of text to sort
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter lines of text here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-48"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => setSortOrder("asc")} 
                  variant={sortOrder === "asc" ? "default" : "outline"}
                  className="flex-1"
                >
                  A-Z
                </Button>
                <Button 
                  onClick={() => setSortOrder("desc")} 
                  variant={sortOrder === "desc" ? "default" : "outline"}
                  className="flex-1"
                >
                  Z-A
                </Button>
              </div>
              <Button onClick={sortLines} className="w-full">
                Sort Lines
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sorted Lines</CardTitle>
              <CardDescription>
                Your lines sorted alphabetically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={output}
                readOnly
                className="min-h-48 bg-gray-50"
                placeholder="Sorted lines will appear here..."
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

export default LineSorter;
