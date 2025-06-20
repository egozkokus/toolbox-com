
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftRight, ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Popular currencies
  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "BRL", name: "Brazilian Real", symbol: "R$" }
  ];

  const fetchExchangeRate = async () => {
    if (fromCurrency === toCurrency) {
      setExchangeRate(1);
      setConvertedAmount(parseFloat(amount) || 0);
      return;
    }

    setLoading(true);
    try {
      // Using exchangerate-api.com (free tier allows 1500 requests/month)
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
      }
      
      const data = await response.json();
      const rate = data.rates[toCurrency];
      
      if (rate) {
        setExchangeRate(rate);
        setConvertedAmount((parseFloat(amount) || 0) * rate);
        setLastUpdated(new Date().toLocaleString());
      } else {
        throw new Error('Currency not found');
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      toast({
        title: "Error",
        description: "Failed to fetch exchange rate. Please try again.",
        variant: "destructive"
      });
      
      // Fallback to mock data for demo purposes
      const mockRate = Math.random() * 2 + 0.5; // Random rate between 0.5 and 2.5
      setExchangeRate(mockRate);
      setConvertedAmount((parseFloat(amount) || 0) * mockRate);
      setLastUpdated("Demo data - " + new Date().toLocaleString());
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    if (exchangeRate && exchangeRate !== 0) {
      setExchangeRate(1 / exchangeRate);
      setConvertedAmount((parseFloat(amount) || 0) / exchangeRate);
    }
  };

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      const timeoutId = setTimeout(() => {
        fetchExchangeRate();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [amount, fromCurrency, toCurrency]);

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
          <ArrowLeftRight className="h-12 w-12 mx-auto mb-4 text-green-600" />
          <h1 className="text-4xl font-bold mb-2">Currency Converter</h1>
          <p className="text-gray-600">Convert between different currencies with real-time rates</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Currency Conversion</CardTitle>
                  <CardDescription>
                    {lastUpdated && `Last updated: ${lastUpdated}`}
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchExchangeRate}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <Input
                  type="number"
                  placeholder="1.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  className="text-lg"
                />
              </div>

              {/* From Currency */}
              <div>
                <label className="block text-sm font-medium mb-2">From</label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name} ({currency.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button variant="outline" onClick={swapCurrencies}>
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>
              </div>

              {/* To Currency */}
              <div>
                <label className="block text-sm font-medium mb-2">To</label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name} ({currency.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Result */}
              {convertedAmount !== null && (
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-blue-600 font-medium mb-2">Converted Amount</div>
                    <div className="text-3xl font-bold text-blue-700">
                      {convertedAmount.toFixed(2)} {toCurrency}
                    </div>
                    {exchangeRate && (
                      <div className="text-sm text-gray-600 mt-2">
                        1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {loading && (
                <div className="text-center text-gray-500">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Fetching latest exchange rates...
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
