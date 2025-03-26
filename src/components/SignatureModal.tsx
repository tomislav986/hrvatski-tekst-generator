
import React, { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Save, Trash } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface SignatureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SignatureModal = ({ open, onOpenChange }: SignatureModalProps) => {
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || !open) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;
    
    // Set canvas dimensions to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = 300; // Fixed height
      
      // Reset drawing settings after resize
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000000"; // Ensure black color
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    setContext(ctx);
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [open]);

  // Drawing functions
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!context || !canvasRef.current) return;
    
    setIsDrawing(true);
    context.beginPath();
    
    // Get the position
    const position = getEventPosition(e);
    if (!position) return;
    
    context.moveTo(position.x, position.y);
    
    // Prevent default behavior to avoid page scrolling/selection
    e.preventDefault();
  };
  
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !context || !canvasRef.current) return;
    
    // Prevent default behavior
    e.preventDefault();
    
    // Get the position
    const position = getEventPosition(e);
    if (!position) return;
    
    context.lineTo(position.x, position.y);
    context.stroke();
  };
  
  const endDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!context) return;
    
    e.preventDefault();
    setIsDrawing(false);
    context.closePath();
  };
  
  // Get position for both mouse and touch events
  const getEventPosition = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    
    // Handle touch events
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } 
    // Handle mouse events
    else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };
  
  // Clear the canvas
  const handleClear = () => {
    if (!canvasRef.current || !context) return;
    
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    toast("Potpis obrisan");
  };
  
  // Save the signature
  const handleSave = () => {
    if (!canvasRef.current) return;
    
    try {
      // Convert to image data URL
      const dataUrl = canvasRef.current.toDataURL("image/png");
      console.log("Signature saved:", dataUrl.slice(0, 50) + "...");
      
      // Here you could store the dataUrl to state, context, or send to server
      toast.success("Potpis spremljen");
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving signature:", error);
      toast.error("Greška prilikom spremanja potpisa");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-50 border-gray-200 shadow-sm flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl text-center text-gray-700">Potpis</DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500">
            {isMobile ? "Nacrtajte potpis prstom po ekranu" : "Nacrtajte potpis mišem"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-grow overflow-hidden p-4">
          <div className="border border-gray-300 rounded-md bg-white w-full h-[300px] touch-none">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={endDrawing}
              onMouseLeave={endDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={endDrawing}
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button 
            onClick={handleClear}
            variant="outline"
            className="border-gray-300"
          >
            <Trash className="mr-2 h-4 w-4" />
            Obriši
          </Button>
          
          <Button 
            onClick={handleSave}
            className="bg-gray-700 hover:bg-gray-800 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            Spremi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureModal;
