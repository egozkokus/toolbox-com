
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, ArrowLeft, Users, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TipCalculator = () => {
  const [billAmount, setBillAmount] = useState("");
  const [tipPercentage, setTipPercentage] = useState("15");
  const [numPeople, setNumPeople] = useState("1");
  const [results, setResults] = useState({
    tipAmount: 0,
    totalAmount: 0,
    perPerson: 0,
    tipPerPerson: 0
  });
  const navigate = useNavigate();

  const calculateTip = () => {
    const bill = parseFloat(billAmount) || 0;
    const tipPercent = parseFloat(tipPercentage) || 0;
    const people = parseInt(numPeople) || 1;

    const tipAmount = (bill * tipPercent) / 100;
    const totalAmount = bill + tipAmount;
    const perPerson = totalAmount / people;
    const tipPerPerson = tipAmount / people;

    setResults({
      tipAmount,
      totalAmount,
      perPerson,
      tipPerPerson
    });
  };

  const presetTips = [10, 15, 18, 20, 25];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <Button 
          onClick={() => navigate("/categories/calculators")} 
          variant="outline" 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Calculators
        </Button>

        <div className="mb-8 text-center">
          <DollarSign className="h-12 w-12 mx-auto mb-4 text-green-600" />
          <h1 className="text-4xl font-bold mb-2">Tip Calculator</h1>
          <p className="text-gray-600">Calculate tips and split bills easily</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Bill Details</CardTitle>
              <CardDescription>
                Enter your bill amount and tip percentage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Bill Amount ($)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tip Percentage (%)</label>
                <Input
                  type="number"
                  placeholder="15"
                  value={tipPercentage}
                  onChange={(e) => setTipPercentage(e.target.value)}
                />
                <div className="flex gap-2 mt-2">
                  {presetTips.map((tip) => (
                    <Button
                      key={tip}
                      variant="outline"
                      size="sm"
                      onClick={() => setTipPercentage(tip.toString())}
                      className="flex-1"
                    >
                      {tip}%
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Number of People</label>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <Input
                    type="number"
                    placeholder="1"
                    value={numPeople}
                    onChange={(e) => setNumPeople(e.target.value)}
                    min="1"
                  />
                </div>
              </div>

              <Button onClick={calculateTip} className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Tip
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>
                Tip breakdown and per-person amounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Tip Amount</div>
                  <div className="text-2xl font-bold text-blue-700">
                    ${results.tipAmount.toFixed(2)}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Total Amount</div>
                  <div className="text-2xl font-bold text-green-700">
                    ${results.totalAmount.toFixed(2)}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium">Per Person</div>
                  <div className="text-2xl font-bold text-purple-700">
                    ${results.perPerson.toFixed(2)}
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm text-orange-600 font-medium">Tip Per Person</div>
                  <div className="text-2xl font-bold text-orange-700">
                    ${results.tipPerPerson.toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TipCalculator;
