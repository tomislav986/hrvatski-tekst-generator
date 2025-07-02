
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const RecyclingYard = () => {
  const handleRDSelection = (rdName: string) => {
    console.log(`Odabrano: ${rdName}`);
    // Ovdje možete dodati logiku za prelazak na specifičnu stranicu RD-a
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Reciklažno dvorište</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>RD Prvo</CardTitle>
              <CardDescription>Prvo reciklažno dvorište</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleRDSelection("RD Prvo")} 
                className="w-full"
                size="lg"
              >
                Odaberi RD Prvo
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>RD Drugo</CardTitle>
              <CardDescription>Drugo reciklažno dvorište</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleRDSelection("RD Drugo")} 
                className="w-full"
                size="lg"
              >
                Odaberi RD Drugo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecyclingYard;
