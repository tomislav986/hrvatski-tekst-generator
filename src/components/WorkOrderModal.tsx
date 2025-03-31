
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface WorkOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWorkOrder: (newWorkOrder: WorkOrder) => void;
}

export interface WorkOrder {
  id?: string;
  nalog: string;
  vrsta: string;
  korisnik: string;
  kontakt: string;
  planirani_datum: string;
  due_date: string;
  status: string;
  selected?: boolean;
}

const WorkOrderModal = ({ open, onOpenChange, onAddWorkOrder }: WorkOrderModalProps) => {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState<WorkOrder>({
    nalog: "",
    vrsta: "",
    korisnik: "",
    kontakt: "",
    planirani_datum: "",
    due_date: "",
    status: "Za odraditi",
    selected: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    // Generate a random ID (would normally be handled by backend)
    const newWorkOrder = { 
      ...formData,
      id: Math.random().toString(36).substring(2, 9),
      nalog: "Auto-" + Math.random().toString(36).substring(2, 6),
      status: "Za odraditi"
    };
    
    onAddWorkOrder(newWorkOrder);
    
    // Reset form
    setFormData({
      nalog: "",
      vrsta: "",
      korisnik: "",
      kontakt: "",
      planirani_datum: "",
      due_date: "",
      status: "Za odraditi",
      selected: false
    });
    
    toast("Novi radni nalog dodan", {
      description: "Radni nalog je uspješno dodan"
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novi radni nalog</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {isMobile ? (
            // Mobile layout (vertical)
            <>
              <div className="grid gap-2">
                <Label htmlFor="vrsta">
                  Vrsta radnog naloga
                </Label>
                <Input
                  id="vrsta"
                  name="vrsta"
                  value={formData.vrsta}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="korisnik">
                  Korisnik i adresa
                </Label>
                <Input
                  id="korisnik"
                  name="korisnik"
                  value={formData.korisnik}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="kontakt">
                  Kontakt podaci
                </Label>
                <Input
                  id="kontakt"
                  name="kontakt"
                  value={formData.kontakt}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="planirani_datum">
                  Planirani datum
                </Label>
                <Input
                  id="planirani_datum"
                  name="planirani_datum"
                  type="date"
                  value={formData.planirani_datum}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="due_date">
                  Due date
                </Label>
                <Input
                  id="due_date"
                  name="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={handleChange}
                />
              </div>
            </>
          ) : (
            // Desktop layout (horizontal)
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vrsta" className="text-right">
                  Vrsta radnog naloga
                </Label>
                <Input
                  id="vrsta"
                  name="vrsta"
                  value={formData.vrsta}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="korisnik" className="text-right">
                  Korisnik i adresa
                </Label>
                <Input
                  id="korisnik"
                  name="korisnik"
                  value={formData.korisnik}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="kontakt" className="text-right">
                  Kontakt podaci
                </Label>
                <Input
                  id="kontakt"
                  name="kontakt"
                  value={formData.kontakt}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="planirani_datum" className="text-right">
                  Planirani datum
                </Label>
                <Input
                  id="planirani_datum"
                  name="planirani_datum"
                  type="date"
                  value={formData.planirani_datum}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="due_date" className="text-right">
                  Due date
                </Label>
                <Input
                  id="due_date"
                  name="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
            </>
          )}
        </div>
        
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Odustani
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>
            Dodaj nalog
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkOrderModal;
