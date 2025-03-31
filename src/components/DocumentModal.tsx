
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Plus, Eye } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Tooltip,
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface Document {
  id: string;
  naziv: string;
  opis: string;
  napomena: string;
}

interface DocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DocumentModal = ({ open, onOpenChange }: DocumentModalProps) => {
  const isMobile = useIsMobile();
  const [documents, setDocuments] = useState<Document[]>([
    { id: "1", naziv: "", opis: "", napomena: "" },
  ]);

  const handleInputChange = (
    id: string,
    field: keyof Document,
    value: string
  ) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.id === id ? { ...doc, [field]: value } : doc
      )
    );
  };

  const handleAddDocument = () => {
    const newId = (documents.length + 1).toString();
    setDocuments([...documents, { id: newId, naziv: "", opis: "", napomena: "" }]);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  const handleSave = () => {
    console.log("Spremanje dokumenata:", documents);
    onOpenChange(false);
  };

  const handleDelete = () => {
    setDocuments([{ id: "1", naziv: "", opis: "", napomena: "" }]);
  };

  const handleViewDocument = (id: string) => {
    console.log("Pregled dokumenta:", id);
    // Implement document viewing functionality here
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-gray-50 border-gray-200 shadow-sm flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl text-center text-gray-700">Unos dokumenata</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-grow overflow-y-auto">
          {isMobile ? (
            // Mobile layout - vertical with proper scrolling
            <div className="space-y-4 p-1">
              {documents.map((doc) => (
                <div key={doc.id} className="border border-gray-200 rounded-md p-3 bg-white">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Naziv</label>
                      <Input
                        value={doc.naziv}
                        onChange={(e) => handleInputChange(doc.id, "naziv", e.target.value)}
                        className="bg-gray-50 border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                        placeholder="Unesite naziv"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Opis</label>
                      <Input
                        value={doc.opis}
                        onChange={(e) => handleInputChange(doc.id, "opis", e.target.value)}
                        className="bg-gray-50 border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                        placeholder="Unesite opis"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Napomena</label>
                      <Textarea
                        value={doc.napomena}
                        onChange={(e) => handleInputChange(doc.id, "napomena", e.target.value)}
                        className="bg-gray-50 border-gray-300 focus:border-gray-400 focus:ring-gray-400 min-h-[60px]"
                        placeholder="Unesite napomenu"
                      />
                    </div>
                    
                    <div className="flex flex-col space-y-2 pt-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              className="justify-start"
                              onClick={() => handleViewDocument(doc.id)}
                            >
                              <Eye className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-gray-600">Pregledaj</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Pregled dokumenta</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Desktop layout - horizontal table
            <div className="overflow-x-auto">
              <Table className="border border-gray-200">
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="font-medium text-gray-700">Naziv</TableHead>
                    <TableHead className="font-medium text-gray-700">Opis</TableHead>
                    <TableHead className="font-medium text-gray-700">Napomena</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id} className="border-t border-gray-200">
                      <TableCell className="py-2">
                        <Input
                          value={doc.naziv}
                          onChange={(e) => handleInputChange(doc.id, "naziv", e.target.value)}
                          className="bg-gray-50 border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                          placeholder="Unesite naziv"
                        />
                      </TableCell>
                      <TableCell className="py-2">
                        <Input
                          value={doc.opis}
                          onChange={(e) => handleInputChange(doc.id, "opis", e.target.value)}
                          className="bg-gray-50 border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                          placeholder="Unesite opis"
                        />
                      </TableCell>
                      <TableCell className="py-2">
                        <Textarea
                          value={doc.napomena}
                          onChange={(e) => handleInputChange(doc.id, "napomena", e.target.value)}
                          className="bg-gray-50 border-gray-300 focus:border-gray-400 focus:ring-gray-400 min-h-[60px]"
                          placeholder="Unesite napomenu"
                        />
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="flex space-x-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="p-2 h-auto"
                                  onClick={() => handleViewDocument(doc.id)}
                                >
                                  <Eye className="h-4 w-4 text-gray-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Pregled dokumenta</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </ScrollArea>

        <div className="flex mt-4 justify-between pt-4">
          <div>
            <Button 
              onClick={handleAddDocument}
              className="bg-gray-700 hover:bg-gray-800 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Dodaj
            </Button>
          </div>
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

export default DocumentModal;
