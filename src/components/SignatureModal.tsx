
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
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
  const [hasContent, setHasContent] = useState(false);
  
  // Initialize canvas and context when modal opens
  useEffect(() => {
    if (!open || !canvasRef.current) return;
    
    console.log("Modal opened - initializing canvas");
    
    // Get the canvas and clear previous state
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      console.error("Failed to get canvas context");
      return;
    }
    
    // Set canvas dimensions to match container with proper scaling
    const container = canvas.parentElement;
    if (container) {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = 300;
      
      // Important: set actual canvas size to match display size to prevent scaling issues
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = "300px";
    }
    
    // Clear any existing content
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Configure drawing settings
    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    
    // Reset state
    setHasContent(false);
    setIsDrawing(false);
    lastPositionRef.current = null;
    
    console.log("Canvas initialization complete");
    
    // Add resize handler
    const handleResize = () => {
      if (!container || !ctx) return;
      
      // Save current drawing if any
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Get the new container size
      const rect = container.getBoundingClientRect();
      
      // Resize canvas
      canvas.width = rect.width;
      canvas.height = 300;
      
      // Set display size to match actual size
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = "300px";
      
      // Restore drawing settings
      ctx.lineWidth = 5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000000";
      ctx.fillStyle = "#000000";
      
      // Restore previous drawing
      ctx.putImageData(imageData, 0, 0);
    };
    
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);
  
  // Handle drawing start
  const handleDrawStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;
    
    setIsDrawing(true);
    
    // Get position with accurate calculation
    const pos = getEventPosition(e, canvas);
    if (!pos) return;
    
    // Draw starting dot
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
    ctx.fill();
    
    lastPositionRef.current = pos;
    setHasContent(true);
    
    console.log("Drawing started at", pos);
  };
  
  // Handle drawing motion
  const handleDrawMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    if (!isDrawing || !canvasRef.current || !lastPositionRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;
    
    // Get current position with accurate calculation
    const currentPos = getEventPosition(e, canvas);
    if (!currentPos) return;
    
    // Draw line from last position to current
    ctx.beginPath();
    ctx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
    ctx.lineTo(currentPos.x, currentPos.y);
    ctx.stroke();
    
    // Update last position
    lastPositionRef.current = currentPos;
    setHasContent(true);
  };
  
  // Handle drawing end
  const handleDrawEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(false);
    lastPositionRef.current = null;
  };
  
  // Helper to get position from mouse or touch event with improved accuracy
  const getEventPosition = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
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
    
    // Calculate position taking into account canvas scaling
    // This is crucial for accurate drawing position
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };
  
  // Clear the signature
  const handleClear = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasContent(false);
    
    console.log("Canvas cleared");
    toast("Potpis obrisan");
  };
  
  // Save the signature
  const handleSave = () => {
    if (!canvasRef.current) return;
    
    console.log("Attempting to save signature. Has content:", hasContent);
    
    if (!hasContent) {
      toast.error("Molimo nacrtajte potpis prije spremanja");
      return;
    }
    
    try {
      const dataUrl = canvasRef.current.toDataURL("image/png");
      console.log("Signature saved successfully");
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
              onMouseDown={handleDrawStart}
              onMouseMove={handleDrawMove}
              onMouseUp={handleDrawEnd}
              onMouseLeave={handleDrawEnd}
              onTouchStart={handleDrawStart}
              onTouchMove={handleDrawMove}
              onTouchEnd={handleDrawEnd}
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
