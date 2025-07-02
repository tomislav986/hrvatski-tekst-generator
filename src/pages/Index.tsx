
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Recycle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4">Dobro došli!</h1>
        <p className="text-xl text-gray-600 mb-8">Infodizajn d.o.o.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/work-orders")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-6 w-6" />
                Radni nalozi
              </CardTitle>
              <CardDescription>Upravljanje radnim nalozima</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Otvori radne naloge
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/recycling-yard")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Recycle className="h-6 w-6" />
                Reciklažno dvorište
              </CardTitle>
              <CardDescription>Odabir reciklažnog dvorišta</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Otvori reciklažno dvorište
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
