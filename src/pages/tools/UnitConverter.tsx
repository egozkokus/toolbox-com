
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, ArrowRightLeft } from "lucide-react";

const UnitConverter = () => {
  const [lengthValue, setLengthValue] = useState("");
  const [lengthFrom, setLengthFrom] = useState("meters");
  const [lengthTo, setLengthTo] = useState("feet");
  const [lengthResult, setLengthResult] = useState("");

  const [weightValue, setWeightValue] = useState("");
  const [weightFrom, setWeightFrom] = useState("kilograms");
  const [weightTo, setWeightTo] = useState("pounds");
  const [weightResult, setWeightResult] = useState("");

  const lengthUnits = {
    meters: 1,
    kilometers: 0.001,
    centimeters: 100,
    millimeters: 1000,
    inches: 39.3701,
    feet: 3.28084,
    yards: 1.09361,
    miles: 0.000621371
  };

  const weightUnits = {
    kilograms: 1,
    grams: 1000,
    pounds: 2.20462,
    ounces: 35.274,
    tons: 0.001,
    stones: 0.157473
  };

  const convertLength = () => {
    if (!lengthValue) return;
    const valueInMeters = parseFloat(lengthValue) / lengthUnits[lengthFrom as keyof typeof lengthUnits];
    const result = valueInMeters * lengthUnits[lengthTo as keyof typeof lengthUnits];
    setLengthResult(result.toFixed(6));
  };

  const convertWeight = () => {
    if (!weightValue) return;
    const valueInKg = parseFloat(weightValue) / weightUnits[weightFrom as keyof typeof weightUnits];
    const result = valueInKg * weightUnits[weightTo as keyof typeof weightUnits];
    setWeightResult(result.toFixed(6));
  };

  const swapLengthUnits = () => {
    const temp = lengthFrom;
    setLengthFrom(lengthTo);
    setLengthTo(temp);
    if (lengthResult) {
      setLengthValue(lengthResult);
      convertLength();
    }
  };

  const swapWeightUnits = () => {
    const temp = weightFrom;
    setWeightFrom(weightTo);
    setWeightTo(temp);
    if (weightResult) {
      setWeightValue(weightResult);
      convertWeight();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <Calculator className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold mb-2">Unit Converter</h1>
          <p className="text-gray-600">Convert between different units of measurement</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Unit Converter</CardTitle>
            <CardDescription>
              Convert length, weight, and other measurements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="length" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="length">Length</TabsTrigger>
                <TabsTrigger value="weight">Weight</TabsTrigger>
              </TabsList>
              
              <TabsContent value="length" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>From</Label>
                    <Select value={lengthFrom} onValueChange={setLengthFrom}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(lengthUnits).map(unit => (
                          <SelectItem key={unit} value={unit}>
                            {unit.charAt(0).toUpperCase() + unit.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>To</Label>
                    <Select value={lengthTo} onValueChange={setLengthTo}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(lengthUnits).map(unit => (
                          <SelectItem key={unit} value={unit}>
                            {unit.charAt(0).toUpperCase() + unit.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Enter value"
                    value={lengthValue}
                    onChange={(e) => setLengthValue(e.target.value)}
                  />
                  <Button onClick={swapLengthUnits} variant="outline" size="icon">
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Result"
                    value={lengthResult}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                
                <Button onClick={convertLength} className="w-full">
                  Convert Length
                </Button>
              </TabsContent>
              
              <TabsContent value="weight" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>From</Label>
                    <Select value={weightFrom} onValueChange={setWeightFrom}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(weightUnits).map(unit => (
                          <SelectItem key={unit} value={unit}>
                            {unit.charAt(0).toUpperCase() + unit.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>To</Label>
                    <Select value={weightTo} onValueChange={setWeightTo}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(weightUnits).map(unit => (
                          <SelectItem key={unit} value={unit}>
                            {unit.charAt(0).toUpperCase() + unit.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Enter value"
                    value={weightValue}
                    onChange={(e) => setWeightValue(e.target.value)}
                  />
                  <Button onClick={swapWeightUnits} variant="outline" size="icon">
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Result"
                    value={weightResult}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                
                <Button onClick={convertWeight} className="w-full">
                  Convert Weight
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnitConverter;
