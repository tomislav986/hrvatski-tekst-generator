import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, ScanLine } from "lucide-react";

interface User {
  id: string;
  name: string;
  barcode: string;
}

interface WasteType {
  id: string;
  keyNumber: string;
  name: string;
}

const sampleUsers: User[] = [
  { id: "1", name: "Tomislav Samarin", barcode: "60006826102" },
  { id: "2", name: "Ivan Vuljak", barcode: "12345678901" },
  { id: "3", name: "Tomislav Pertinač", barcode: "109876543210" },
  { id: "4", name: "Alen Pajan", barcode: "65498712325" },
];

const wasteTypes: WasteType[] = [
  { id: "1", keyNumber: "20 01 01", name: "papir i karton" },
  { id: "2", keyNumber: "20 03 01", name: "miješani komunalni otpad" },
  { id: "3", keyNumber: "15 01 02", name: "ambalaža od plastike" },
];

const RDPrvo = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [selectedBillingLocation, setSelectedBillingLocation] = useState<string | null>(null);
  const [wasteSearchTerm, setWasteSearchTerm] = useState("");
  const [showWasteSuggestions, setShowWasteSuggestions] = useState(false);
  const [selectedWaste, setSelectedWaste] = useState<WasteType | null>(null);

  const billingLocations = [
    "Obračunsko mjesto 1",
    "Obračunsko mjesto 2", 
    "Obračunsko mjesto 3"
  ];

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return [];
    
    return sampleUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.barcode.includes(searchTerm)
    );
  }, [searchTerm]);

  const filteredWasteTypes = useMemo(() => {
    if (!wasteSearchTerm) return [];
    
    return wasteTypes.filter(waste => 
      waste.name.toLowerCase().includes(wasteSearchTerm.toLowerCase()) ||
      waste.keyNumber.includes(wasteSearchTerm)
    );
  }, [wasteSearchTerm]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(value.length > 0);
    setSelectedUser(null);
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setSearchTerm(user.name);
    setShowSuggestions(false);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const handleUserCardClick = () => {
    if (selectedUser) {
      setShowBillingModal(true);
    }
  };

  const handleBillingLocationSelect = (location: string) => {
    setSelectedBillingLocation(location);
    setShowBillingModal(false);
    console.log(`Selected billing location: ${location} for user: ${selectedUser?.name}`);
  };

  const handleWasteSearchChange = (value: string) => {
    setWasteSearchTerm(value);
    setShowWasteSuggestions(value.length > 0);
    setSelectedWaste(null);
  };

  const handleWasteSelect = (waste: WasteType) => {
    setSelectedWaste(waste);
    setWasteSearchTerm(`${waste.keyNumber} ${waste.name}`);
    setShowWasteSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/recycling-yard")}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold">Odaberite korisnika</h1>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-primary-foreground hover:bg-primary-foreground/20"
        >
          Odjava
        </Button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="relative">
          <div className="relative">
            <Input
              placeholder="Korisnik"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pr-12 h-12 text-base"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            >
              <ScanLine className="h-5 w-5" />
            </Button>
          </div>

          {/* Suggestions */}
          {showSuggestions && filteredUsers.length > 0 && (
            <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-60 overflow-y-auto">
              <CardContent className="p-0">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-3 cursor-pointer hover:bg-accent border-b border-border last:border-b-0"
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Barkod: {user.barcode}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Selected User Display */}
        {selectedUser && (
          <Card className="mt-4 cursor-pointer hover:bg-accent/50 transition-colors" onClick={handleUserCardClick}>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Odabrani korisnik:</h3>
              <div className="text-lg font-medium">{selectedUser.name}</div>
              <div className="text-sm text-muted-foreground">
                Barkod: {selectedUser.barcode}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Kliknite za odabir obračunskog mjesta
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Billing Location Display */}
        {selectedBillingLocation && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Odabrano obračunsko mjesto:</h3>
              <div className="text-lg font-medium">{selectedBillingLocation}</div>
            </CardContent>
          </Card>
        )}

        {/* Waste Type Selection */}
        {selectedBillingLocation && (
          <div className="mt-4">
            <div className="relative">
              <div className="relative">
                <Input
                  placeholder="Ključni broj otpada"
                  value={wasteSearchTerm}
                  onChange={(e) => handleWasteSearchChange(e.target.value)}
                  className="pr-12 h-12 text-base"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                >
                  <ScanLine className="h-5 w-5" />
                </Button>
              </div>

              {/* Waste Suggestions */}
              {showWasteSuggestions && filteredWasteTypes.length > 0 && (
                <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-60 overflow-y-auto">
                  <CardContent className="p-0">
                    {filteredWasteTypes.map((waste) => (
                      <div
                        key={waste.id}
                        className="p-3 cursor-pointer hover:bg-accent border-b border-border last:border-b-0"
                        onClick={() => handleWasteSelect(waste)}
                      >
                        <div className="font-medium">{waste.keyNumber} {waste.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Ključni broj: {waste.keyNumber}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Selected Waste Display */}
            {selectedWaste && (
              <Card className="mt-4">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Odabrani otpad:</h3>
                  <div className="text-lg font-medium">{selectedWaste.keyNumber} {selectedWaste.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Ključni broj: {selectedWaste.keyNumber}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Billing Location Modal */}
      <Dialog open={showBillingModal} onOpenChange={setShowBillingModal}>
        <DialogContent className="bg-background border">
          <DialogHeader>
            <DialogTitle>Odaberite obračunsko mjesto</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            {billingLocations.map((location, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start h-12"
                onClick={() => handleBillingLocationSelect(location)}
              >
                {location}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RDPrvo;