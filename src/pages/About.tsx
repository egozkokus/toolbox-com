
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/common/PageHeader";
import { Code, Users, Zap, Shield, Heart, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "מהיר ויעיל",
      description: "כלים מהירים שעובדים ישירות בדפדפן ללא צורך בהעלאה לשרתים"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "בטוח ופרטי",
      description: "כל העיבוד מתבצע מקומית במחשב שלך, הקבצים שלך לא נשלחים לשרתים"
    },
    {
      icon: <Code className="h-8 w-8 text-blue-600" />,
      title: "קוד פתוח",
      description: "הפרויקט בנוי בטכנולוגיות מתקדמות ופתוח לקהילה"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "קהילתי",
      description: "נבנה על בסיס משוב וצרכים של המשתמשים"
    }
  ];

  const stats = [
    { number: "50+", label: "כלים זמינים" },
    { number: "100%", label: "חינם" },
    { number: "24/7", label: "זמינות" },
    { number: "0", label: "פרסומות" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <PageHeader 
          title="אודות כלים לכל דבר"
          subtitle="הכירו את הפלטפורמה המובילה לכלי רשת חינמיים"
          icon={<Heart className="h-12 w-12 mx-auto text-red-600" />}
        />

        <div className="grid gap-8 lg:grid-cols-2 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>המשימה שלנו</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                כלים לכל דבר נוצר מהצורך לספק גישה חופשית וקלה לכלי רשת איכותיים. 
                אנו מאמינים שכלים דיגיטליים חיוניים צריכים להיות זמינים לכולם, בחינם ובקלות.
              </p>
              <p className="text-gray-700">
                הפלטפורמה שלנו מציעה מגוון רחב של כלים לעיבוד טקסט, עריכת תמונות, 
                חישובים, כלי פיתוח ועוד - הכל באתר אחד ובטוח.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="secondary">טקסט</Badge>
                <Badge variant="secondary">תמונות</Badge>
                <Badge variant="secondary">וידאו</Badge>
                <Badge variant="secondary">אודיו</Badge>
                <Badge variant="secondary">מחשבונים</Badge>
                <Badge variant="secondary">פיתוח</Badge>
                <Badge variant="secondary">מחוללים</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>הערכים שלנו</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-center mb-2">{feature.icon}</div>
                    <h4 className="font-medium mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle>במספרים</CardTitle>
            <CardDescription>הנתונים שלנו מדברים בעד עצמם</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="text-blue-800">רוצים להציע כלי חדש?</CardTitle>
            <CardDescription className="text-blue-700">
              אנחנו תמיד מחפשים רעיונות לכלים חדשים ושימושיים
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-blue-700 mb-4">
              יש לכם רעיון לכלי שיכול לעזור לאחרים? שלחו לנו הצעה!
            </p>
            <Button 
              onClick={() => navigate("/contact")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Mail className="h-4 w-4 mr-2" />
              שלחו הצעה
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
