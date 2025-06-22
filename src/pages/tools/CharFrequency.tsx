
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CharFrequency = () => {
  const [input, setInput] = useState("");
  const [frequency, setFrequency] = useState<Array<{char: string, count: number, percentage: number}>>([]);
  const navigate = useNavigate();

  const analyzeFrequency = () => {
    const charCount: Record<string, number> = {};
    const totalChars = input.length;

    for (const char of input) {
      charCount[char] = (charCount[char] || 0) + 1;
    }

    const freqArray = Object.entries(charCount)
      .map(([char, count]) => ({
        char: char === ' ' ? 'Space' : char === '\n' ? 'Newline' : char,
        count,
        percentage: Math.round((count / totalChars) * 100 * 10) / 10
      }))
      .sort((a, b) => b.count - a.count);

    setFrequency(freqArray);
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
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold mb-2">Character Frequency</h1>
          <p className="text-gray-600">Analyze character frequency in your text</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Input Text</CardTitle>
              <CardDescription>
                Enter text to analyze character frequency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your text here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-48"
              />
              <Button onClick={analyzeFrequency} className="w-full">
                Analyze Frequency
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Character Frequency</CardTitle>
              <CardDescription>
                Character count and percentage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                {frequency.length > 0 ? (
                  <div className="space-y-2">
                    {frequency.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-mono font-bold">'{item.char}'</span>
                        <div className="flex gap-4 text-sm">
                          <span>{item.count}x</span>
                          <span>{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-8">
                    Character frequency will appear here...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CharFrequency;
