import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, ArrowRightLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API_BASE_URL = 'https://api.frankfurter.app';

interface Currencies {
    [key: string]: string;
}

const CurrencyConverter = () => {
    const [amount, setAmount] = useState<number>(1);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('ILS');
    const [currencies, setCurrencies] = useState<Currencies>({});
    const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCurrenciesLoading, setIsCurrenciesLoading] = useState(true);

    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/currencies`);
                const data: Currencies = await response.json();
                setCurrencies(data);
            } catch (error) {
                toast({ title: "שגיאה בטעינת המטבעות", variant: "destructive" });
            } finally {
                setIsCurrenciesLoading(false);
            }
        };
        fetchCurrencies();
    }, [toast]);

    const convertCurrency = useCallback(async () => {
        if (amount <= 0 || !fromCurrency || !toCurrency) {
            setConvertedAmount(0);
            return;
        }
        if (fromCurrency === toCurrency) {
            setConvertedAmount(amount);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`);
            const data = await response.json();
            setConvertedAmount(data.rates[toCurrency]);
        } catch (error) {
            toast({ title: "שגיאה בהמרת המטבע", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [amount, fromCurrency, toCurrency, toast]);
    
    useEffect(() => {
        convertCurrency();
    }, [convertCurrency]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setAmount(isNaN(value) ? 0 : value);
    };

    const swapCurrencies = () => {
        const temp = fromCurrency;
        setFromCurrency(toCurrency);
        setToCurrency(temp);
    };

    return (
        <div className="container mx-auto max-w-2xl p-4">
             <Button onClick={() => navigate("/categories/finance-tools")} variant="outline" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                חזרה לכלי פיננסים
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle>ממיר מטבעות</CardTitle>
                    <CardDescription>המר בין מטבעות שונים עם שערי חליפין עדכניים.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isCurrenciesLoading ? (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <p className="ml-4">טוען רשימת מטבעות...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount">סכום</Label>
                                <Input id="amount" type="number" value={amount} onChange={handleAmountChange} />
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex-1 space-y-2">
                                    <Label>ממטבע</Label>
                                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(currencies).map(([code, name]) => (
                                                <SelectItem key={code} value={code}>{code} - {name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button variant="ghost" size="icon" className="mt-6" onClick={swapCurrencies}>
                                    <ArrowRightLeft className="h-5 w-5"/>
                                </Button>
                                <div className="flex-1 space-y-2">
                                    <Label>למטבע</Label>
                                    <Select value={toCurrency} onValueChange={setToCurrency}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(currencies).map(([code, name]) => (
                                                <SelectItem key={code} value={code}>{code} - {name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="text-center pt-4">
                                {isLoading ? (
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto"/>
                                ) : (
                                    <>
                                        <p className="text-lg font-semibold">{amount} {currencies[fromCurrency]} שווה ל:</p>
                                        <p className="text-4xl font-bold text-green-600">{convertedAmount?.toFixed(2) ?? '0.00'} {currencies[toCurrency]}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CurrencyConverter;