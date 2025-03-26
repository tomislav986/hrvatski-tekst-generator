import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import DocumentModal from "@/components/DocumentModal";

interface WorkOrderItem {
  id: number;
  sifra: string;
  naziv: string;
  jmj: string;
  djelatnik: string;
  kolicina_plan: string | number;
  izvrsena_kolicina: string | number;
  status: string;
  amount: string;
}

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
  
  const [formData, setFormData] = useState({
    nalog: "IN/1001/23",
    korisnik: "Marko Marković, Tina Ujevića 25",
    kontakt: "099 123 45 67",
    opis: "Detaljan opis radova na nalogu",
    stari_vodomjer_podaci: "",
    stari_vodomjer_stanje: "",
    novi_vodomjer_serijski: "",
    novi_vodomjer_stanje: "",
    vrsta: orderType || ""
  });

  const isWaterMeterOrder = formData.vrsta === "475-RN Vodomjeri";

  const [items, setItems] = useState<WorkOrderItem[]>([
    { 
      id: 1, 
      sifra: "32568", 
      naziv: "Vijak", 
      jmj: "kom", 
      djelatnik: "Ivan", 
      kolicina_plan: 5, 
      izvrsena_kolicina: 5, 
      status: "Unpaid", 
      amount: "$2,350.00" 
    },
    { 
      id: 2, 
      sifra: "34872", 
      naziv: "Ugradnja navoja", 
      jmj: "kom", 
      djelatnik: "Marko", 
      kolicina_plan: 10, 
      izvrsena_kolicina: 10, 
      status: "Pending", 
      amount: "$259.00" 
    },
    { 
      id: 3, 
      sifra: "23876", 
      naziv: "Iskop", 
      jmj: "m3", 
      djelatnik: "Ivan", 
      kolicina_plan: 1.5, 
      izvrsena_kolicina: 1.5, 
      status: "Paid", 
      amount: "$1,259.00" 
    },
    { 
      id: 4, 
      sifra: "...", 
      naziv: "...", 
      jmj: "...", 
      djelatnik: "...", 
      kolicina_plan: "..", 
      izvrsena_kolicina: "..", 
      status: "..", 
      amount: ".." 
    }
  ]);

  useEffect(() => {
    console.log("Loading work order details for ID:", id);
    console.log("Order type:", orderType);
    
    if (id === "1") {
      setFormData(prev => ({
        ...prev,
        vrsta: "410-RN KW",
        nalog: "IN/1001/23",
        korisnik: "Marko Marković, Tina Ujevića 25",
        kontakt: "099 123 45 67"
      }));
    } 
    else if (id === "2") {
      setFormData(prev => ({
        ...prev,
        vrsta: "440-RN Vozila",
        nalog: "IN/1002/23",
        korisnik: "Tim d.o.o., Zavojna 2b",
        kontakt: "098 321 54 98"
      }));
    }
    else if (id === "3") {
      setFormData(prev => ({
        ...prev,
        vrsta: "475-RN Vodomjeri",
        nalog: "IN/1003/23",
        korisnik: "Tomislav Horvat, Uska 46",
        kontakt: "098 111 22 33, tom@hh.hr"
      }));
    } 
    else if (orderType) {
      setFormData(prev => ({
        ...prev,
        vrsta: orderType
      }));
    }
  }, [id, orderType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddNewItem = () => {
    toast("Nova stavka dodana", {
      description: "Stavka je uspješno dodana na radni nalog"
    });
  };

  const handleFinishOrder = () => {
    toast.success("Radni nalog završen");
    navigate("/work-orders");
  };

  const handlePutOnHold = () => {
    toast("Radni nalog stavljen na čekanje");
    navigate("/work-orders");
  };

  const handleDocuments = () => {
    setIsDocumentModalOpen(true);
  };

  const handleSignatures = () => {
    toast("Otvaranje potpisa...");
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Podaci o radnom nalogu</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="nalog" className="block text-sm font-medium mb-1">Broj naloga:</label>
            <Input 
              id="nalog"
              name="nalog"
              value={formData.nalog}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label htmlFor="vrsta" className="block text-sm font-medium mb-1">Vrsta radnog naloga:</label>
            <Input 
              id="vrsta"
              name="vrsta"
              value={formData.vrsta}
              onChange={handleInputChange}
              readOnly
            />
          </div>
          
          <div>
            <label htmlFor="korisnik" className="block text-sm font-medium mb-1">Korisnik i adresa:</label>
            <Input 
              id="korisnik"
              name="korisnik"
              value={formData.korisnik}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label htmlFor="kontakt" className="block text-sm font-medium mb-1">Kontakt podaci:</label>
            <Input 
              id="kontakt"
              name="kontakt"
              value={formData.kontakt}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label htmlFor="opis" className="block text-sm font-medium mb-1">Opis radova:</label>
            <Textarea 
              id="opis"
              name="opis"
              value={formData.opis}
              onChange={handleInputChange}
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          {isWaterMeterOrder && (
            <>
              <div>
                <label htmlFor="stari_vodomjer_podaci" className="block text-sm font-medium mb-1">Podaci o starom vodomjeru:</label>
                <Textarea
                  id="stari_vodomjer_podaci"
                  name="stari_vodomjer_podaci"
                  value={formData.stari_vodomjer_podaci}
                  onChange={handleInputChange}
                  className="min-h-[130px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Input 
                    id="novi_vodomjer_serijski"
                    name="novi_vodomjer_serijski"
                    value={formData.novi_vodomjer_serijski}
                    onChange={handleInputChange}
                  />
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
              </div>
            </>
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
              {!isMobile && <TableHead>Status</TableHead>}
              {!isMobile && <TableHead>Amount</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
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
                          newItems[item.id - 1].izvrsena_kolicina = parseFloat(e.target.value);
                          setItems(newItems);
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
                {!isMobile && (
                  <TableCell>{item.status}</TableCell>
                )}
                {!isMobile && (
                  <TableCell className="flex items-center gap-2">
                    {item.amount}
                    {item.status === "Paid" || item.status === "Unpaid" ? (
                      <Check className="text-green-500 h-5 w-5" />
                    ) : (
                      <X className="text-red-500 h-5 w-5" />
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button 
          onClick={handleFinishOrder}
          variant="outline" 
          className="border-gray-300"
        >
          Završi radni nalog
        </Button>
        
        <Button 
          onClick={handlePutOnHold}
          variant="outline" 
          className="border-gray-300"
        >
          Stavi na čekanje
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
    </div>
  );
};

export default WorkOrderDetail;
