
import { useState } from "react";
import { CreditCard, Copy, RefreshCw, AlertTriangle } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface CreditCardData {
  number: string;
  cvv: string;
  expiry: string;
  type: string;
}

const CreditCardGenerator = () => {
  const [cardType, setCardType] = useState("visa");
  const [generatedCards, setGeneratedCards] = useState<CreditCardData[]>([]);

  const cardPrefixes = {
    visa: ["4"],
    mastercard: ["51", "52", "53", "54", "55"],
    amex: ["34", "37"],
    discover: ["6011", "65"]
  };

  const generateLuhnValid = (prefix: string, length: number): string => {
    let number = prefix;
    
    // Fill with random digits except the last one
    while (number.length < length - 1) {
      number += Math.floor(Math.random() * 10);
    }
    
    // Calculate check digit using Luhn algorithm
    let sum = 0;
    let isEven = true;
    
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit = Math.floor(digit / 10) + (digit % 10);
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    return number + checkDigit;
  };

  const generateCard = () => {
    const prefixes = cardPrefixes[cardType as keyof typeof cardPrefixes];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    
    let length = 16;
    if (cardType === "amex") length = 15;
    
    const number = generateLuhnValid(prefix, length);
    const cvv = cardType === "amex" 
      ? Math.floor(Math.random() * 9000 + 1000).toString()
      : Math.floor(Math.random() * 900 + 100).toString();
    
    const currentYear = new Date().getFullYear();
    const futureYear = currentYear + Math.floor(Math.random() * 5) + 1;
    const month = Math.floor(Math.random() * 12) + 1;
    const expiry = `${month.toString().padStart(2, '0')}/${futureYear.toString().slice(-2)}`;
    
    const newCard: CreditCardData = {
      number: number.replace(/(.{4})/g, '$1 ').trim(),
      cvv,
      expiry,
      type: cardType
    };
    
    setGeneratedCards([newCard, ...generatedCards.slice(0, 4)]); // Keep last 5 cards
    toast.success("כרטיס אשראי לבדיקה נוצר בהצלחה!");
  };

  const copyCard = (card: CreditCardData) => {
    const cardText = `Number: ${card.number}\nCVV: ${card.cvv}\nExpiry: ${card.expiry}`;
    navigator.clipboard.writeText(cardText);
    toast.success("פרטי הכרטיס הועתקו ללוח!");
  };

  const getCardTypeLabel = (type: string) => {
    const labels = {
      visa: "Visa",
      mastercard: "Mastercard",
      amex: "American Express",
      discover: "Discover"
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <PageHeader
          title="מחולל כרטיסי אשראי לבדיקה"
          subtitle="צור כרטיסי אשראי פיקטיביים למטרות בדיקה"
          icon={<CreditCard className="h-16 w-16 text-indigo-600" />}
          backPath="/categories/generators"
          backLabel="חזרה לגנרטורים"
        />

        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>אזהרה:</strong> הכרטיסים הללו הם לבדיקות בלבד ואינם תקפים לרכישות אמיתיות. 
            אין להשתמש בהם למטרות הונאה או פעילות בלתי חוקית.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>הגדרות כרטיס</CardTitle>
              <CardDescription>בחר את סוג הכרטיס</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">סוג כרטיס</label>
                <Select value={cardType} onValueChange={setCardType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visa">Visa</SelectItem>
                    <SelectItem value="mastercard">Mastercard</SelectItem>
                    <SelectItem value="amex">American Express</SelectItem>
                    <SelectItem value="discover">Discover</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={generateCard} className="w-full" size="lg">
                <RefreshCw className="h-4 w-4 mr-2" />
                צור כרטיס לבדיקה
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>כרטיסים שנוצרו</CardTitle>
              <CardDescription>כרטיסי בדיקה אחרונים</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedCards.length > 0 ? (
                <div className="space-y-4">
                  {generatedCards.map((card, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white relative overflow-hidden"
                    >
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div className="text-xs opacity-75">
                            {getCardTypeLabel(card.type)}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyCard(card)}
                            className="text-white hover:bg-white/10"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="font-mono text-lg mb-4 tracking-wider">
                          {card.number}
                        </div>
                        
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="text-xs opacity-75">VALID THRU</div>
                            <div className="font-mono">{card.expiry}</div>
                          </div>
                          <div>
                            <div className="text-xs opacity-75">CVV</div>
                            <div className="font-mono">{card.cvv}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Card background pattern */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>לחץ על "צור כרטיס לבדיקה" כדי להתחיל</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>שימושים נפוצים</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>בדיקת טפסי תשלום באתרים ואפליקציות</li>
              <li>בדיקת אלגוריתמי אימות כרטיסי אשראי</li>
              <li>פיתוח ובדיקת מערכות עסקיות</li>
              <li>הדרכה ולמידה של מערכות תשלום</li>
              <li>בדיקת ביצועים של מערכות עיבוד תשלומים</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreditCardGenerator;
