
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PercentageCalculator = () => {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState<"percentage" | "increase" | "decrease">("percentage");
  const navigate = useNavigate();

  const calculate = () => {
    const num1 = parseFloat(value1);
    const num2 = parseFloat(value2);

    if (isNaN(num1) || isNaN(num2)) return;

    let calculatedResult = "";
    
    switch (mode) {
      case "percentage":
        calculatedResult = `${((num1 / num2) * 100).toFixed(2)}%`;
        break;
      case "increase":
        calculatedResult = `${(((num2 - num1) / num1) * 100).toFixed(2)}%`;
        break;
      case "decrease":
        calculatedResult = `${(((num1 - num2) / num1) * 100).toFixed(2)}%`;
        break;
    }
    
    setResult(calculatedResult);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-2xl">
        <Button 
          onClick={() => navigate("/categories/calculators")} 
          variant="outline" 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Calculators
        </Button>

        <div className="mb-8 text-center">
          <Calculator className="h-12 w-12 mx-auto mb-4 text-green-600" />
          <h1 className="text-4xl font-bold mb-2">Percentage Calculator</h1>
          <p className="text-gray-600">Calculate percentages, increases, and decreases</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Percentage Calculator</CardTitle>
            <CardDescription>
              Choose calculation type and enter values
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-2">
              <Button 
                onClick={() => setMode("percentage")} 
                variant={mode === "percentage" ? "default" : "outline"}
                size="sm"
              >
                % of Number
              </Button>
              <Button 
                onClick={() => setMode("increase")} 
                variant={mode === "increase" ? "default" : "outline"}
                size="sm"
              >
                % Increase
              </Button>
              <Button 
                onClick={() => setMode("decrease")} 
                variant={mode === "decrease" ? "default" : "outline"}
                size="sm"
              >
                % Decrease
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="value1">
                  {mode === "percentage" ? "Value" : "Original Value"}
                </Label>
                <Input
                  id="value1"
                  type="number"
                  value={value1}
                  onChange={(e) => setValue1(e.target.value)}
                  placeholder="Enter first value"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="value2">
                  {mode === "percentage" ? "Total" : "New Value"}
                </Label>
                <Input
                  id="value2"
                  type="number"
                  value={value2}
                  onChange={(e) => setValue2(e.target.value)}
                  placeholder="Enter second value"
                />
              </div>
            </div>

            <Button onClick={calculate} className="w-full">
              Calculate
            </Button>

            {result && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-center">
                  <div className="text-sm text-green-600 mb-1">Result</div>
                  <div className="text-2xl font-bold text-green-700">{result}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PercentageCalculator;
