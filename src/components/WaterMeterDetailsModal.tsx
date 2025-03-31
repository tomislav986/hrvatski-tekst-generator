
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Droplet } from "lucide-react";

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
  // Parse the details into key-value pairs for better display
  const detailLines = details.split('\n').filter(line => line.trim() !== '');
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-blue-500" />
            Detalji {meterType} vodomjera
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {detailLines.length > 0 ? (
            <div className="space-y-2">
              {detailLines.map((line, index) => {
                const parts = line.split(':');
                if (parts.length < 2) return <div key={index} className="text-sm">{line}</div>;
                
                const label = parts[0].trim();
                const value = parts.slice(1).join(':').trim();
                
                return (
                  <div key={index} className="grid grid-cols-2 gap-2 border-b border-gray-100 py-1 text-sm last:border-0">
                    <span className="font-medium text-gray-700">{label}:</span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Nema dostupnih informacija o vodomjeru
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WaterMeterDetailsModal;
