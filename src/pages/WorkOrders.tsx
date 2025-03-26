import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, ChevronDown, X, Edit, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useIsMobile, useIsSmallMobile } from "@/hooks/use-mobile";

interface WorkOrder {
  id: string;
  nalog: string;
  vrsta: string;
  korisnik: string;
  kontakt: string;
  planirani_datum: string;
  due_date: string;
  status: string;
  selected?: boolean;
}

const WorkOrders = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isSmallMobile = useIsSmallMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("Status");
  const [filterType, setFilterType] = useState<string | null>(null);
  
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    { 
      id: "1", 
      nalog: "IN/1001/23", 
      vrsta: "410-RN KW", 
      korisnik: "Marko Marković, Tina Ujevića 25", 
      kontakt: "099 123 45 67", 
      planirani_datum: "2022-01-23", 
      due_date: "2022-02-07", 
      status: "Za odraditi",
      selected: true
    },
    { 
      id: "2", 
      nalog: "IN/1002/23", 
      vrsta: "440-RN Vozila", 
      korisnik: "Tim d.o.o., Zavojna 2b", 
      kontakt: "098 321 54 98", 
      planirani_datum: "2022-01-09", 
      due_date: "2022-01-21", 
      status: "Aktivno",
      selected: true
    },
    { 
      id: "3", 
      nalog: "IN/1003/23", 
      vrsta: "475-RN Vodomjeri", 
      korisnik: "Tomislav Horvat, Uska 46", 
      kontakt: "098 111 22 33, tom@hh.hr", 
      planirani_datum: "2022-02-11", 
      due_date: "2022-02-24", 
      status: "Završeno",
      selected: false
    },
    { 
      id: "4", 
      nalog: "...", 
      vrsta: "", 
      korisnik: "....", 
      kontakt: "....", 
      planirani_datum: "...", 
      due_date: "...", 
      status: "Završeno",
      selected: false
    },
  ]);

  const handleSelectAllChange = (checked: boolean) => {
    setWorkOrders(workOrders.map(order => ({ ...order, selected: checked })));
  };

  const handleSelectChange = (id: string, checked: boolean) => {
    setWorkOrders(workOrders.map(order => 
      order.id === id ? { ...order, selected: checked } : order
    ));
  };

  const handleRemoveStatusFilter = () => {
    setStatusFilter(null);
  };

  const handleRemoveFilterType = () => {
    setFilterType(null);
  };

  const handleFilterTypeSelect = (type: string) => {
    setFilterType(type);
    toast(`Filter postavljen: ${type}`);
  };

  const handleDelete = () => {
    const selectedOrders = workOrders.filter(order => order.selected);
    if (selectedOrders.length === 0) {
      toast("Nema odabranih naloga za brisanje.");
      return;
    }
    
    setWorkOrders(workOrders.filter(order => !order.selected));
    toast(`${selectedOrders.length} nalog(a) obrisano.`);
  };

  const handleComplete = () => {
    const selectedOrders = workOrders.filter(order => order.selected);
    if (selectedOrders.length === 0) {
      toast("Nema odabranih naloga za završavanje.");
      return;
    }
    
    setWorkOrders(workOrders.map(order => 
      order.selected ? { ...order, status: "Završeno", selected: false } : order
    ));
    toast(`${selectedOrders.length} nalog(a) označeno kao završeno.`);
  };

  const handleEditOrder = (id: string) => {
    navigate(`/work-orders/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} justify-between p-2 sm:p-4 gap-2 border-b`}>
        <div className={`flex ${isSmallMobile ? 'flex-col' : 'flex-row'} gap-2`}>
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-32 flex justify-between">
                  Akcija
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isMobile ? "center" : "start"} className="bg-white z-50 shadow-md">
                <DropdownMenuItem onClick={handleDelete} className="cursor-pointer">
                  Obriši
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleComplete} className="cursor-pointer">
                  Završi
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Traži..." 
              className="pl-9 w-full sm:w-64" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto flex justify-between">
                  Filtriranje
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isMobile ? "center" : "start"} className="bg-white z-50 shadow-md">
                <DropdownMenuItem onClick={() => handleFilterTypeSelect("410-RN KW")} className="cursor-pointer">
                  410-RN KW
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterTypeSelect("440-RN Vozila")} className="cursor-pointer">
                  440-RN Vozila
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterTypeSelect("475-RN Vodomjeri")} className="cursor-pointer">
                  475-RN Vodomjeri
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {statusFilter && (
            <div className="flex items-center bg-gray-200 rounded-md px-3 py-1">
              <span className="text-sm mr-2">{statusFilter}</span>
              <button onClick={handleRemoveStatusFilter}>
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          
          {filterType && (
            <div className="flex items-center bg-gray-200 rounded-md px-3 py-1">
              <span className="text-sm mr-2">{filterType}</span>
              <button onClick={handleRemoveFilterType}>
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        
        <Button variant="default" className="mt-2 sm:mt-0 bg-gray-800 hover:bg-gray-700">
          Unos
        </Button>
      </div>
      
      <div className="overflow-auto flex-grow">
        <div className={isMobile ? "min-w-fit" : "min-w-[800px]"}>
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    onCheckedChange={(checked) => 
                      handleSelectAllChange(checked === true)
                    }
                  />
                </TableHead>
                <TableHead>Radni nalog</TableHead>
                <TableHead>Vrsta radnog naloga</TableHead>
                {!isMobile && (
                  <>
                    <TableHead>Korisnik i adresa</TableHead>
                    <TableHead>Kontakt podaci</TableHead>
                    <TableHead>Planirani datum</TableHead>
                    <TableHead>Due date</TableHead>
                    <TableHead>Status</TableHead>
                  </>
                )}
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox 
                      checked={order.selected} 
                      onCheckedChange={(checked) => 
                        handleSelectChange(order.id, checked === true)
                      }
                    />
                  </TableCell>
                  <TableCell>{order.nalog}</TableCell>
                  <TableCell>{order.vrsta}</TableCell>
                  {!isMobile && (
                    <>
                      <TableCell>{order.korisnik}</TableCell>
                      <TableCell>{order.kontakt}</TableCell>
                      <TableCell>{order.planirani_datum}</TableCell>
                      <TableCell>{order.due_date}</TableCell>
                      <TableCell>
                        <span 
                          className={`px-2 py-1 rounded text-sm ${
                            order.status === "Za odraditi" ? "bg-yellow-100 text-yellow-800" : 
                            order.status === "Aktivno" ? "bg-green-100 text-green-800" : 
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                    </>
                  )}
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleEditOrder(order.id)}
                      >
                        <Edit className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="border-t p-2 sm:p-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-2 sm:mb-0 text-sm">
          Naloga po stranici: 
          <Button variant="outline" className="ml-2 px-2">
            10 <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="text-sm text-gray-500 mb-2 sm:mb-0">
          1 - 4 of 4
        </div>
        
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink>
                <ChevronsLeft className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>
                <ChevronsRight className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default WorkOrders;
