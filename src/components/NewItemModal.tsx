
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NewItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (newItem: WorkOrderItem) => void;
}

export interface WorkOrderItem {
  id?: number;
  sifra: string;
  naziv: string;
  jmj: string;
  djelatnik: string;
  kolicina_plan: string | number;
  izvrsena_kolicina: string | number;
  status: string;
  amount: string;
}

const NewItemModal = ({ open, onOpenChange, onAddItem }: NewItemModalProps) => {
  const [formData, setFormData] = useState<WorkOrderItem>({
    sifra: "",
    naziv: "",
    jmj: "",
    djelatnik: "",
    kolicina_plan: "",
    izvrsena_kolicina: "",
    status: "Pending",
    amount: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    // Add a default ID (would normally be handled by backend)
    const newItem = { 
      ...formData,
      status: "Pending",
      amount: ""
    };
    onAddItem(newItem);
    
    // Reset form
    setFormData({
      sifra: "",
      naziv: "",
      jmj: "",
      djelatnik: "",
      kolicina_plan: "",
      izvrsena_kolicina: "",
      status: "Pending",
      amount: ""
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Nova stavka</DialogTitle>
          <DialogDescription>
            Dodaj novu stavku u radni nalog
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sifra" className="text-right">
              Šifra
            </Label>
            <Input
              id="sifra"
              name="sifra"
              value={formData.sifra}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="naziv" className="text-right">
              Matrijal
            </Label>
            <Input
              id="naziv"
              name="naziv"
              value={formData.naziv}
              onChange={handleChange}
              className="col-span-3"
              readOnly
              disabled
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jmj" className="text-right">
              J.mj
            </Label>
            <Input
              id="jmj"
              name="jmj"
              value={formData.jmj}
              onChange={handleChange}
              className="col-span-3"
              readOnly
              disabled
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="djelatnik" className="text-right">
              Djelatnik
            </Label>
            <Input
              id="djelatnik"
              name="djelatnik"
              value={formData.djelatnik}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="kolicina_plan" className="text-right">
              Količina (plan)
            </Label>
            <Input
              id="kolicina_plan"
              name="kolicina_plan"
              type="number"
              value={formData.kolicina_plan}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="izvrsena_kolicina" className="text-right">
              Izvršena količina
            </Label>
            <Input
              id="izvrsena_kolicina"
              name="izvrsena_kolicina"
              type="number"
              value={formData.izvrsena_kolicina}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Odustani
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>
            Dodaj stavku
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewItemModal;
