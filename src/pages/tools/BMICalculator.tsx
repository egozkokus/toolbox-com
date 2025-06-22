
import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
    if (bmi < 18.5) category = t('bmi_calculator_page.categories.under');
    else if (bmi < 25) category = t('bmi_calculator_page.categories.normal');
    else if (bmi < 30) category = t('bmi_calculator_page.categories.over');
    else category = t('bmi_calculator_page.categories.obese');

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
          {t('bmi_calculator_page.back')}
        </Button>

        <div className="mb-8 text-center">
          <Activity className="h-12 w-12 mx-auto mb-4 text-green-600" />
          <h1 className="text-4xl font-bold mb-2">{t('bmi_calculator_page.title')}</h1>
          <p className="text-gray-600">{t('bmi_calculator_page.subtitle')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('bmi_calculator_page.card_title')}</CardTitle>
            <CardDescription>
              {t('bmi_calculator_page.card_desc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => setUnit("metric")}
                variant={unit === "metric" ? "default" : "outline"}
              >
                {t('bmi_calculator_page.metric')}
              </Button>
              <Button
                onClick={() => setUnit("imperial")}
                variant={unit === "imperial" ? "default" : "outline"}
              >
                {t('bmi_calculator_page.imperial')}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="height">
                  {t('bmi_calculator_page.height_label', { unit: unit === 'metric' ? 'cm' : 'inches' })}
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder={t('bmi_calculator_page.height_ph', { unit_name: unit === 'metric' ? 'centimeters' : 'inches' })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">
                  {t('bmi_calculator_page.weight_label', { unit: unit === 'metric' ? 'kg' : 'lbs' })}
                </Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={t('bmi_calculator_page.weight_ph', { unit_name: unit === 'metric' ? 'kilograms' : 'pounds' })}
                />
              </div>
            </div>

            <Button onClick={calculateBMI} className="w-full">
              {t('bmi_calculator_page.button')}
            </Button>

            {result && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-center">
                  <div className="text-sm text-green-600 mb-1">{t('bmi_calculator_page.result_title')}</div>
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
