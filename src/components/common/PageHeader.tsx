
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  backPath?: string;
  backLabel?: string;
}

const PageHeader = ({ title, subtitle, icon, backPath, backLabel }: PageHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2">
          {backPath && (
            <Button 
              onClick={() => navigate(backPath)} 
              variant="outline" 
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backLabel || t('common.back.category')}
            </Button>
          )}
          <Button 
            onClick={() => navigate("/")} 
            variant="outline" 
            size="sm"
          >
            <Home className="h-4 w-4 mr-2" />
            {t('common.back.home')}
          </Button>
        </div>
        <LanguageSelector />
      </div>
      
      <div className="text-center">
        {icon && <div className="mb-4">{icon}</div>}
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
    </div>
  );
};

export default PageHeader;
