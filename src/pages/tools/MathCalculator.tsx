
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, ArrowLeft, Delete } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MathCalculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [isScientific, setIsScientific] = useState(false);
  const navigate = useNavigate();

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case "=":
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performScientificOperation = (func: string) => {
    const inputValue = parseFloat(display);
    let result: number;

    switch (func) {
      case "sin":
        result = Math.sin(inputValue * Math.PI / 180);
        break;
      case "cos":
        result = Math.cos(inputValue * Math.PI / 180);
        break;
      case "tan":
        result = Math.tan(inputValue * Math.PI / 180);
        break;
      case "log":
        result = Math.log10(inputValue);
        break;
      case "ln":
        result = Math.log(inputValue);
        break;
      case "sqrt":
        result = Math.sqrt(inputValue);
        break;
      case "x²":
        result = inputValue * inputValue;
        break;
      case "1/x":
        result = 1 / inputValue;
        break;
      default:
        return;
    }

    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  const buttons = [
    ["C", "±", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="]
  ];

  const scientificButtons = [
    ["sin", "cos", "tan", "log"],
    ["ln", "sqrt", "x²", "1/x"],
    ["π", "e", "(", ")"]
  ];

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
          <Calculator className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold mb-2">Math Calculator</h1>
          <p className="text-gray-600">Basic and scientific calculator functions</p>
        </div>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Calculator</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsScientific(!isScientific)}
                >
                  {isScientific ? "Basic" : "Scientific"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Display */}
              <div className="bg-gray-900 text-white p-4 rounded-lg text-right">
                <div className="text-3xl font-mono overflow-hidden">
                  {display}
                </div>
              </div>

              {/* Scientific Functions */}
              {isScientific && (
                <div className="grid grid-cols-4 gap-2">
                  {scientificButtons.flat().map((btn) => (
                    <Button
                      key={btn}
                      variant="outline"
                      className="h-12 text-sm"
                      onClick={() => {
                        if (btn === "π") {
                          setDisplay(String(Math.PI));
                          setWaitingForOperand(true);
                        } else if (btn === "e") {
                          setDisplay(String(Math.E));
                          setWaitingForOperand(true);
                        } else {
                          performScientificOperation(btn);
                        }
                      }}
                    >
                      {btn}
                    </Button>
                  ))}
                </div>
              )}

              {/* Main Calculator Buttons */}
              <div className="space-y-2">
                {buttons.map((row, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-4 gap-2">
                    {row.map((btn) => (
                      <Button
                        key={btn}
                        variant={["÷", "×", "-", "+", "="].includes(btn) ? "default" : "outline"}
                        className={`h-12 ${btn === "0" ? "col-span-2" : ""}`}
                        onClick={() => {
                          if (btn === "C") {
                            clear();
                          } else if (btn === "=") {
                            performOperation("=");
                          } else if (["+", "-", "×", "÷"].includes(btn)) {
                            performOperation(btn);
                          } else if (btn === ".") {
                            inputDecimal();
                          } else if (btn === "±") {
                            setDisplay(String(-parseFloat(display)));
                          } else if (btn === "%") {
                            setDisplay(String(parseFloat(display) / 100));
                          } else {
                            inputNumber(btn);
                          }
                        }}
                      >
                        {btn}
                      </Button>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MathCalculator;
