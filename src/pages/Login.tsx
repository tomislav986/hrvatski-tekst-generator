
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import DocumentModal from "@/components/DocumentModal";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to the work orders page instead of opening a modal
    navigate("/work-orders");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          {/* Logo tvrtke */}
          <div className="mx-auto w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-10 h-10 text-gray-600"
            >
              <path d="M5 3a2 2 0 0 0-2 2"></path>
              <path d="M19 3a2 2 0 0 1 2 2"></path>
              <path d="M21 19a2 2 0 0 1-2 2"></path>
              <path d="M5 21a2 2 0 0 1-2-2"></path>
              <path d="M9 3h1"></path>
              <path d="M9 21h1"></path>
              <path d="M14 3h1"></path>
              <path d="M14 21h1"></path>
              <path d="M3 9v1"></path>
              <path d="M21 9v1"></path>
              <path d="M3 14v1"></path>
              <path d="M21 14v1"></path>
            </svg>
          </div>
        </div>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Prijava</CardTitle>
            <CardDescription className="text-center text-gray-500">
              Unesite svoje podatke za prijavu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Korisničko ime</Label>
                <Input
                  id="username"
                  placeholder="Unesite korisničko ime"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-50 border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Lozinka</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Unesite lozinku"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label 
                  htmlFor="remember" 
                  className="text-sm font-normal cursor-pointer"
                >
                  Zapamti podatke za pristup
                </Label>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gray-700 hover:bg-gray-800"
              >
                Prijavi se
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">Radni nalozi</p>
          <Button
            type="button"
            className="mt-2 bg-gray-700 hover:bg-gray-800"
            onClick={() => setIsDocumentModalOpen(true)}
          >
            Otvori modal za dokumente
          </Button>
        </div>
      </div>

      <DocumentModal 
        open={isDocumentModalOpen} 
        onOpenChange={setIsDocumentModalOpen} 
      />
    </div>
  );
};

export default Login;
