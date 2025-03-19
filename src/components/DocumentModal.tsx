
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
import { Camera, Trash, Save, Plus } from "lucide-react";

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

  const handleTakePicture = () => {
    console.log("Slikanje dokumenta");
    // Implement camera functionality here
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-gray-50 border-gray-200 shadow-sm">
        <DialogHeader>
          <DialogTitle className="text-xl text-center text-gray-700">Unos dokumenata</DialogTitle>
        </DialogHeader>
        
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
                      <Button
                        variant="ghost"
                        className="p-2 h-auto"
                        onClick={handleTakePicture}
                      >
                        <Camera className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="p-2 h-auto"
                        onClick={() => handleDeleteDocument(doc.id)}
                      >
                        <Trash className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex mt-4 justify-between">
          <div className="space-x-2">
            <Button 
              onClick={handleAddDocument}
              className="bg-gray-700 hover:bg-gray-800 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Dodaj
            </Button>
            <Button 
              onClick={handleDelete}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <Trash className="mr-2 h-4 w-4" />
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
