
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, ArrowLeft, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoanCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [results, setResults] = useState({
    monthlyPayment: 0,
    totalPayment: 0,
    totalInterest: 0
  });
  const navigate = useNavigate();

  const calculateLoan = () => {
    const p = parseFloat(principal) || 0;
    const r = (parseFloat(interestRate) || 0) / 100 / 12; // Monthly interest rate
    const n = (parseFloat(loanTerm) || 0) * 12; // Total number of payments

    if (p > 0 && r > 0 && n > 0) {
      const monthlyPayment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayment = monthlyPayment * n;
      const totalInterest = totalPayment - p;

      setResults({
        monthlyPayment,
        totalPayment,
        totalInterest
      });
    } else if (p > 0 && r === 0 && n > 0) {
      // Handle zero interest rate
      const monthlyPayment = p / n;
      setResults({
        monthlyPayment,
        totalPayment: p,
        totalInterest: 0
      });
    }
  };

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
          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold mb-2">Loan Calculator</h1>
          <p className="text-gray-600">Calculate monthly loan payments and total costs</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Loan Details</CardTitle>
              <CardDescription>
                Enter your loan information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Loan Amount ($)</label>
                <Input
                  type="number"
                  placeholder="100000"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  step="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Annual Interest Rate (%)</label>
                <Input
                  type="number"
                  placeholder="5.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Loan Term (Years)</label>
                <Input
                  type="number"
                  placeholder="30"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                />
              </div>

              <Button onClick={calculateLoan} className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Payment
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
              <CardDescription>
                Your loan payment breakdown
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Monthly Payment</div>
                <div className="text-3xl font-bold text-blue-700">
                  ${results.monthlyPayment.toFixed(2)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Total Payment</div>
                  <div className="text-xl font-bold text-green-700">
                    ${results.totalPayment.toFixed(2)}
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm text-orange-600 font-medium">Total Interest</div>
                  <div className="text-xl font-bold text-orange-700">
                    ${results.totalInterest.toFixed(2)}
                  </div>
                </div>
              </div>

              {results.monthlyPayment > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Payment Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Principal:</span>
                      <span>${parseFloat(principal || "0").toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Rate:</span>
                      <span>{interestRate}% annually</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loan Term:</span>
                      <span>{loanTerm} years ({(parseFloat(loanTerm) || 0) * 12} payments)</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;
