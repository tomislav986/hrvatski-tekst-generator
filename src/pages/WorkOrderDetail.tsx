import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Info, ChevronDown, ChevronUp, Barcode, Droplet } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import DocumentModal from "@/components/DocumentModal";
import SignatureModal from "@/components/SignatureModal";
import NewItemModal from "@/components/NewItemModal";
import WaterMeterDetailsModal from "@/components/WaterMeterDetailsModal";
import { WorkOrderItem } from "@/components/NewItemModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface LocationState {
  orderType?: string;
}

const WorkOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { orderType } = (location.state as LocationState) || {};
  const isMobile = useIsMobile();
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isWaterMeterSectionOpen, setIsWaterMeterSectionOpen] = useState(false);
  const [isWaterMeterDetailsModalOpen, setIsWaterMeterDetailsModalOpen] = useState(false);
  const [currentWaterMeterType, setCurrentWaterMeterType] = useState<string>("");
  const [waterMeterDetails, setWaterMeterDetails] = useState<string>("");

  const [formData, setFormData] = useState({
    nalog: "",
    korisnik: "",
    kontakt: "",
    opis: "Detaljan opis radova na nalogu",
    stari_vodomjer_serijski: "",
    stari_vodomjer_stanje: "",
    novi_vodomjer_serijski: "",
    novi_vodomjer_stanje: "",
    vrsta: orderType || "",
    status: ""
  });

  const isWaterMeterOrder = formData.vrsta.includes("475-RN Vodomjeri");

  const [items, setItems] = useState<WorkOrderItem[]>([
    { 
      id: 1, 
      sifra: "32568", 
      naziv: "Vijak", 
      jmj: "kom", 
      djelatnik: "Ivan", 
      kolicina_plan: 5, 
      izvrsena_kolicina: 5,
      status: "Completed",
      amount: "500"
    },
    { 
      id: 2, 
      sifra: "34872", 
      naziv: "Ugradnja navoja", 
      jmj: "kom", 
      djelatnik: "Marko", 
      kolicina_plan: 10, 
      izvrsena_kolicina: 9,
      status: "Completed",
      amount: "1000"
    },
    { 
      id: 3, 
      sifra: "23876", 
      naziv: "Iskop", 
      jmj: "m3", 
      djelatnik: "Ivan", 
      kolicina_plan: 1.5, 
      izvrsena_kolicina: 0,
      status: "Completed",
      amount: "1500"
    }
  ]);

  const getRowBackgroundColor = (plan: number | string, executed: number | string) => {
    const planNum = Number(plan);
    const executedNum = Number(executed);
    
    if (executedNum >= planNum) {
      return "bg-[#A1F7A7]"; // Soft green
    } else if (executedNum > 0) {
      return "bg-[#FEF7CD]"; // Soft yellow
    } else {
      return "bg-[#FEC6A1]"; // Soft red
    }
  };

  useEffect(() => {
    console.log("Loading work order details for ID:", id);
    console.log("Order type:", orderType);
    
    if (id === "1") {
      setFormData(prev => ({
        ...prev,
        vrsta: "410-RN KW",
        nalog: "2025-410-23",
        korisnik: "Marko Marković, Tina Ujevića 25",
        kontakt: "099 123 45 67",
        status: "Za odraditi"
      }));
    } 
    else if (id === "2") {
      setFormData(prev => ({
        ...prev,
        vrsta: "440-RN Vozila",
        nalog: "2025-440-35",
        korisnik: "Tim d.o.o., Zavojna 2b",
        kontakt: "098 321 54 98",
        status: "Aktivno"
      }));
    }
    else if (id === "3") {
      setFormData(prev => ({
        ...prev,
        vrsta: "475-RN Vodomjeri",
        nalog: "2025-475-12",
        korisnik: "Tomislav Horvat, Uska 46",
        kontakt: "098 111 22 33, tom@hh.hr",
        status: "Završeno"
      }));
    }
    else if (id === "4") {
      setFormData(prev => ({
        ...prev,
        vrsta: "475-RN Vodomjeri",
        nalog: "2025-475-13",
        korisnik: "Ivan Viljak, Varaždinska 55",
        kontakt: "0991234564",
        status: "Na čekanju"
      }));
    }
    else if (orderType) {
      setFormData(prev => ({
        ...prev,
        vrsta: orderType,
        status: "Za odraditi"
      }));
    }
  }, [id, orderType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!["nalog", "vrsta", "korisnik", "kontakt", "opis", "status"].includes(name)) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddNewItem = () => {
    setIsNewItemModalOpen(true);
  };

  const addNewItem = (newItem: WorkOrderItem) => {
    const newId = Math.max(0, ...items.map(item => Number(item.id) || 0)) + 1;
    const itemWithId = { ...newItem, id: newId };
    
    setItems([...items, itemWithId]);
    
    toast("Nova stavka dodana", {
      description: "Stavka je uspješno dodana na radni nalog"
    });
  };

  const handleDeleteItem = (idToDelete: number | undefined) => {
    if (idToDelete === undefined) return;
    
    const updatedItems = items.filter(item => item.id !== idToDelete);
    setItems(updatedItems);
    
    toast("Stavka izbrisana", {
      description: "Stavka je uspješno izbrisana iz radnog naloga"
    });
  };

  const handleFinishOrder = () => {
    toast.success("Radni nalog završen");
    navigate("/work-orders");
  };

  const handlePutOnHold = () => {
    const newStatus = formData.status === "Aktivno" ? "Na čekanju" : "Aktivno";
    
    setFormData(prev => ({
      ...prev,
      status: newStatus
    }));
    
    toast(`Radni nalog ${newStatus === "Aktivno" ? "aktiviran" : "stavljen na čekanje"}`);
  };

  const handleDocuments = () => {
    setIsDocumentModalOpen(true);
  };

  const handleSignatures = () => {
    setIsSignatureModalOpen(true);
  };

  const handleShowDetails = (type: string) => {
    let details = "";
    if (type === "starog") {
      details = formData.stari_vodomjer_serijski 
        ? `Serijski broj: ${formData.stari_vodomjer_serijski}\nProizvođač: Siemens\nModel: WM600\nGodina proizvodnje: 2018\nKlasa točnosti: C\nMaksimalni protok: 6 m³/h\nNominalni protok: 2.5 m³/h\nMinimalni protok: 0.05 m³/h\nMaksimalna temperatura: 30°C\nMaksimalni tlak: 16 bar\nPromjer: DN20`
        : "Nisu dostupni podaci o vodomjeru";
      setCurrentWaterMeterType("starog");
    } else {
      details = formData.novi_vodomjer_serijski 
        ? `Serijski broj: ${formData.novi_vodomjer_serijski}\nProizvođač: Sensus\nModel: iPERL\nGodina proizvodnje: 2022\nKlasa točnosti: R800\nMaksimalni protok: 6.3 m³/h\nNominalni protok: 2.5 m³/h\nMinimalni protok: 0.003 m³/h\nMaksimalna temperatura: 50°C\nMaksimalni tlak: 16 bar\nPromjer: DN15`
        : "Nisu dostupni podaci o vodomjeru";
      setCurrentWaterMeterType("novog");
    }
    
    setWaterMeterDetails(details);
    setIsWaterMeterDetailsModalOpen(true);
  };

  const handleScanBarcode = (type: string) => {
    toast.info(`Skeniranje barkoda`, {
      description: `Skeniranje barkoda za ${type} vodomjer`
    });
  };

  const toggleWaterMeterSection = () => {
    setIsWaterMeterSectionOpen(!isWaterMeterSectionOpen);
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className={`text-2xl font-bold mb-6 ${isMobile ? "pt-12" : ""}`}>Podaci o radnom nalogu</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="nalog" className="block text-sm font-medium mb-1">Broj naloga:</label>
            <Input 
              id="nalog"
              name="nalog"
              value={formData.nalog}
              readOnly
              disabled
              className="bg-gray-100"
            />
          </div>
          
          <div>
            <label htmlFor="vrsta" className="block text-sm font-medium mb-1">Vrsta radnog naloga:</label>
            <Input 
              id="vrsta"
              name="vrsta"
              value={formData.vrsta}
              readOnly
              disabled
              className="bg-gray-100"
            />
          </div>
          
          <div>
            <label htmlFor="korisnik" className="block text-sm font-medium mb-1">Korisnik i adresa:</label>
            <Input 
              id="korisnik"
              name="korisnik"
              value={formData.korisnik}
              readOnly
              disabled
              className="bg-gray-100"
            />
          </div>
          
          <div>
            <label htmlFor="kontakt" className="block text-sm font-medium mb-1">Kontakt podaci:</label>
            <Input 
              id="kontakt"
              name="kontakt"
              value={formData.kontakt}
              readOnly
              disabled
              className="bg-gray-100"
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">Status:</label>
            <div className="flex items-center">
              <span 
                className={`px-3 py-1 rounded text-sm ${
                  formData.status === "Za odraditi" ? "bg-yellow-100 text-yellow-800" : 
                  formData.status === "Aktivno" ? "bg-green-100 text-green-800" : 
                  formData.status === "Na čekanju" ? "bg-orange-100 text-orange-800" :
                  "bg-gray-100 text-gray-800"
                }`}
              >
                {formData.status}
              </span>
            </div>
          </div>
          
          <div>
            <label htmlFor="opis" className="block text-sm font-medium mb-1">Opis radova:</label>
            <Textarea 
              id="opis"
              name="opis"
              value={formData.opis}
              readOnly
              disabled
              className="min-h-[100px] bg-gray-100"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          {isWaterMeterOrder && (
            <Collapsible
              open={isWaterMeterSectionOpen}
              onOpenChange={setIsWaterMeterSectionOpen}
              className="border rounded-md p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-blue-500" />
                  Podaci o vodomjerima
                </h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={toggleWaterMeterSection} className="p-1">
                    {isWaterMeterSectionOpen ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent className="space-y-4">
                <div>
                  <label htmlFor="stari_vodomjer_serijski" className="block text-sm font-medium mb-1">
                    Serijski broj starog vodomjera:
                  </label>
                  <div className="flex items-center">
                    <Input
                      id="stari_vodomjer_serijski"
                      name="stari_vodomjer_serijski"
                      value={formData.stari_vodomjer_serijski}
                      onChange={handleInputChange}
                      className="flex-1"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleShowDetails('starog')}
                            className="ml-1"
                          >
                            <Info className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Prikaži detalje o vodomjeru</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleScanBarcode('starog')}
                            className="ml-1"
                          >
                            <Barcode className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Skeniraj barkod</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="stari_vodomjer_stanje" className="block text-sm font-medium mb-1">Stanje starog vodomjera:</label>
                  <Input 
                    id="stari_vodomjer_stanje"
                    name="stari_vodomjer_stanje"
                    value={formData.stari_vodomjer_stanje}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="novi_vodomjer_serijski" className="block text-sm font-medium mb-1">Serijski broj novog vodomjera:</label>
                  <div className="flex items-center">
                    <Input 
                      id="novi_vodomjer_serijski"
                      name="novi_vodomjer_serijski"
                      value={formData.novi_vodomjer_serijski}
                      onChange={handleInputChange}
                      className="flex-1"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleShowDetails('novog')}
                            className="ml-1"
                          >
                            <Info className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Prikaži detalje o vodomjeru</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleScanBarcode('novog')}
                            className="ml-1"
                          >
                            <Barcode className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Skeniraj barkod</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="novi_vodomjer_stanje" className="block text-sm font-medium mb-1">Stanje novog vodomjera:</label>
                  <Input 
                    id="novi_vodomjer_stanje"
                    name="novi_vodomjer_stanje"
                    value={formData.novi_vodomjer_stanje}
                    onChange={handleInputChange}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
          
          <div className={`flex ${isWaterMeterOrder ? 'md:items-end' : 'items-start'} ${isWaterMeterOrder ? 'md:mt-0' : 'mt-4'}`}>
            <Button 
              onClick={handleAddNewItem}
              className="bg-gray-800 hover:bg-gray-700"
            >
              Nova stavka
            </Button>
          </div>
        </div>
      </div>
      
      <div className="overflow-auto border rounded-md mb-8">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              {!isMobile && <TableHead className="w-12 text-center">Rb</TableHead>}
              {!isMobile && <TableHead>Šifra</TableHead>}
              <TableHead>{isMobile ? "Naziv" : "Naziv operacije/materijala"}</TableHead>
              {!isMobile && <TableHead>J.mj</TableHead>}
              {!isMobile && <TableHead>Djelatnik (opcionalno)</TableHead>}
              <TableHead>{isMobile ? "Plan" : "Količina (plan)"}</TableHead>
              <TableHead>{isMobile ? "Izvr." : "Izvršena količina"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow 
                key={item.id}
                className={getRowBackgroundColor(item.kolicina_plan, item.izvrsena_kolicina)}
              >
                {!isMobile && <TableCell className="text-center">{item.id}</TableCell>}
                {!isMobile && <TableCell>{item.sifra}</TableCell>}
                <TableCell>{item.naziv}</TableCell>
                {!isMobile && <TableCell>{item.jmj}</TableCell>}
                {!isMobile && <TableCell>{item.djelatnik}</TableCell>}
                <TableCell>{item.kolicina_plan}</TableCell>
                <TableCell>
                  {typeof item.izvrsena_kolicina === 'number' ? (
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={item.izvrsena_kolicina}
                        onChange={(e) => {
                          const newItems = [...items];
                          const index = newItems.findIndex(i => i.id === item.id);
                          if (index !== -1) {
                            newItems[index].izvrsena_kolicina = parseFloat(e.target.value);
                            setItems(newItems);
                          }
                        }}
                        className="pr-8"
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  ) : (
                    <Input value={item.izvrsena_kolicina} readOnly />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {formData.status !== "Završeno" && (
          <Button 
            onClick={handleFinishOrder}
            variant="outline" 
            className="border-gray-300"
          >
            Završi radni nalog
          </Button>
        )}
        
        <Button 
          onClick={handlePutOnHold}
          variant="outline" 
          className="border-gray-300"
        >
          {formData.status === "Aktivno" ? "Stavi na čekanje" : "Aktiviraj"}
        </Button>
        
        <Button 
          onClick={handleDocuments}
          variant="outline" 
          className="border-gray-300"
        >
          Dokumenti
        </Button>
        
        <Button 
          onClick={handleSignatures}
          variant="outline" 
          className="border-gray-300"
        >
          Potpisi
        </Button>
      </div>

      <DocumentModal 
        open={isDocumentModalOpen} 
        onOpenChange={setIsDocumentModalOpen} 
      />
      
      <SignatureModal 
        open={isSignatureModalOpen} 
        onOpenChange={setIsSignatureModalOpen} 
      />
      
      <NewItemModal
        open={isNewItemModalOpen}
        onOpenChange={setIsNewItemModalOpen}
        onAddItem={addNewItem}
      />

      <WaterMeterDetailsModal
        open={isWaterMeterDetailsModalOpen}
        onOpenChange={setIsWaterMeterDetailsModalOpen}
        meterType={currentWaterMeterType}
        details={waterMeterDetails}
      />
    </div>
  );
};

export default WorkOrderDetail;
