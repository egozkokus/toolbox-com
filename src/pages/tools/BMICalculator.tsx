
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [result, setResult] = useState<{bmi: number, category: string} | null>(null);
  const navigate = useNavigate();

  const calculateBMI = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (isNaN(weightNum) || isNaN(heightNum)) return;

    let bmi: number;
    
    if (unit === "metric") {
      // height in cm, weight in kg
      const heightInMeters = heightNum / 100;
      bmi = weightNum / (heightInMeters * heightInMeters);
    } else {
      // height in inches, weight in pounds
      bmi = (weightNum / (heightNum * heightNum)) * 703;
    }

    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal weight";
    else if (bmi < 30) category = "Overweight";
    else category = "Obese";

    setResult({ bmi: Math.round(bmi * 10) / 10, category });
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
          <Activity className="h-12 w-12 mx-auto mb-4 text-green-600" />
          <h1 className="text-4xl font-bold mb-2">BMI Calculator</h1>
          <p className="text-gray-600">Calculate your Body Mass Index</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>BMI Calculator</CardTitle>
            <CardDescription>
              Enter your height and weight to calculate BMI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => setUnit("metric")} 
                variant={unit === "metric" ? "default" : "outline"}
              >
                Metric (cm, kg)
              </Button>
              <Button 
                onClick={() => setUnit("imperial")} 
                variant={unit === "imperial" ? "default" : "outline"}
              >
                Imperial (in, lbs)
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="height">
                  Height ({unit === "metric" ? "cm" : "inches"})
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder={`Enter height in ${unit === "metric" ? "centimeters" : "inches"}`}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">
                  Weight ({unit === "metric" ? "kg" : "lbs"})
                </Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={`Enter weight in ${unit === "metric" ? "kilograms" : "pounds"}`}
                />
              </div>
            </div>

            <Button onClick={calculateBMI} className="w-full">
              Calculate BMI
            </Button>

            {result && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-center">
                  <div className="text-sm text-green-600 mb-1">Your BMI</div>
                  <div className="text-3xl font-bold text-green-700 mb-2">{result.bmi}</div>
                  <div className="text-lg font-semibold text-green-600">{result.category}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BMICalculator;
