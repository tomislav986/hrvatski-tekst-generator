
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface WaterMeterDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meterType: string;
  details: string;
}

const WaterMeterDetailsModal = ({
  open,
  onOpenChange,
  meterType,
  details,
}: WaterMeterDetailsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalji {meterType} vodomjera</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea 
            value={details} 
            disabled 
            className="min-h-[200px] w-full bg-gray-100"
            readOnly
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WaterMeterDetailsModal;
