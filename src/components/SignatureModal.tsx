
import React, { useRef, useState, useEffect, useCallback } from "react";
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
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
  const [hasContent, setHasContent] = useState(false);

  // Initialize canvas context only once
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;
    
    setContext(ctx);
    
    // Set canvas dimensions to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = 300; // Fixed height
      
      // Reset drawing settings after resize
      ctx.lineWidth = 5; // Thicker line for better visibility
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000000"; // Black color
      ctx.fillStyle = "#000000"; // Black color for dot drawing
    };
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Call immediately to set initial size
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Reset canvas when modal opens - this is critical for ensuring drawing works each time
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Get the canvas element and ensure it has a context
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Only reset when the modal is open
    if (open) {
      console.log("Modal opened, resetting canvas and context");
      
      // Resize the canvas to fit the container
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = 300;
      }
      
      // Clear any existing content
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Reset the drawing settings
      ctx.lineWidth = 5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000000";
      ctx.fillStyle = "#000000";
      
      // Make sure the context is set
      setContext(ctx);
      
      // Reset state
      setHasContent(false);
      setIsDrawing(false);
      lastPositionRef.current = null;
      
      console.log("Canvas reset complete, hasContent:", false);
    }
  }, [open]);

  // Start drawing function
  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!context || !canvasRef.current) return;
    
    setIsDrawing(true);
    
    // Get the position
    const position = getEventPosition(e);
    if (!position) return;
    
    lastPositionRef.current = position;
    
    // Draw a small dot at the start point
    context.beginPath();
    context.fillStyle = "#000000";
    context.arc(position.x, position.y, 3, 0, 2 * Math.PI);
    context.fill();
    
    setHasContent(true); // Set content flag when user starts drawing
    console.log("Drawing started, hasContent set to:", true);
    
    // Prevent default behavior to avoid page scrolling/selection
    e.preventDefault();
  }, [context]);
  
  // Drawing function
  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !context || !canvasRef.current || !lastPositionRef.current) return;
    
    // Prevent default behavior
    e.preventDefault();
    
    // Get the current position
    const currentPosition = getEventPosition(e);
    if (!currentPosition) return;
    
    // Draw a line from the last position to the current one
    context.beginPath();
    context.strokeStyle = "#000000"; // Ensure black color for stroke
    context.lineWidth = 5; // Thicker line for better visibility
    context.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();
    
    // Update the last position
    lastPositionRef.current = currentPosition;
    setHasContent(true); // Ensure content flag is set during drawing
  }, [isDrawing, context]);
  
  // End drawing function
  const endDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(false);
    lastPositionRef.current = null;
    e.preventDefault();
  }, []);
  
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
    setHasContent(false); // Reset content flag when cleared
    console.log("Canvas cleared, hasContent reset to:", false);
    toast("Potpis obrisan");
  };
  
  // Save the signature
  const handleSave = () => {
    if (!canvasRef.current) return;
    
    try {
      console.log("Checking signature content. Has content:", hasContent);
      
      // Check if there is content to save
      if (!hasContent) {
        toast.error("Molimo nacrtajte potpis prije spremanja");
        console.log("No content to save");
        return;
      }
      
      // Convert to image data URL
      const dataUrl = canvasRef.current.toDataURL("image/png");
      console.log("Signature saved:", dataUrl.substring(0, 50) + "...");
      
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
