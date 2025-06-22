// src/components/OptimizedToolCard.tsx

import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRoutePreloader } from '@/services/routePreloader';

interface ToolInfo {
  name: string;
  description: string;
  route: string;
  icon: string;
  category?: string;
  importFunc?: () => Promise<any>;
}

interface OptimizedToolCardProps {
  tool: ToolInfo;
  searchTerm?: string;
}

const OptimizedToolCard: React.FC<OptimizedToolCardProps> = ({ tool, searchTerm = "" }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const { preloadOnHover } = useRoutePreloader();

  // Highlight search term
  const highlightText = (text: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Setup preloading on hover
  useEffect(() => {
    if (cardRef.current && tool.importFunc) {
      const cleanup = preloadOnHover(
        cardRef.current,
        tool.route,
        tool.importFunc
      );
      
      return cleanup;
    }
  }, [tool.route, tool.importFunc]);

  const handleClick = () => {
    navigate(tool.route);
  };

  return (
    <Card 
      ref={cardRef}
      className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer bg-white/90 backdrop-blur-sm"
      onClick={handleClick}
      data-preload-path={tool.route}
      data-preload-category={tool.category}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="text-2xl">{tool.icon}</span>
          {tool.category && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {tool.category}
            </span>
          )}
        </div>
        <CardTitle className="text-lg">
          {highlightText(tool.name)}
        </CardTitle>
        <CardDescription>
          {highlightText(tool.description)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          {t('common.use')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default React.memo(OptimizedToolCard);