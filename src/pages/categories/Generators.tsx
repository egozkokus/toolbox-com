
import { useState } from "react";
import { Search, Hash, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Generators = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const generatorTools = [
    { name: "Password Generator", description: "Generate secure passwords", route: "/tools/password-generator", icon: "🔐" },
    { name: "Hash Generator", description: "Generate cryptographic hashes", route: "/tools/hash-generator", icon: "#️⃣" },
    { name: "UUID Generator", description: "Generate unique identifiers", route: "/tools/uuid-generator", icon: "🆔" },
    { name: "Random Number Generator", description: "Generate random numbers", route: "/tools/random-number", icon: "🎲" },
    { name: "Lorem Ipsum Generator", description: "Generate placeholder text", route: "/tools/lorem-generator", icon: "📄" },
    { name: "Mock Data Generator", description: "Generate fake data for testing", route: "/tools/mock-data", icon: "📊" },
    { name: "API Key Generator", description: "Generate API keys", route: "/tools/api-key-generator", icon: "🔑" },
    { name: "Credit Card Generator", description: "Generate test credit card numbers", route: "/tools/credit-card-generator", icon: "💳" },
    { name: "Name Generator", description: "Generate random names", route: "/tools/name-generator", icon: "👤" },
    { name: "Email Generator", description: "Generate random email addresses", route: "/tools/email-generator", icon: "📧" }
  ];

  const filteredTools = generatorTools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={() => navigate("/")} 
            variant="outline" 
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <Hash className="h-16 w-16 mx-auto mb-4 text-indigo-600" />
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Generators
            </h1>
            <p className="text-gray-600 text-lg">Generate passwords, hashes and more</p>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search generators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3"
            />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => navigate(tool.route)}
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{tool.icon}</div>
                <CardTitle className="text-lg">{tool.name}</CardTitle>
                <CardDescription className="text-sm">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Use Tool
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Generators;
