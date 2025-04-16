
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Program {
  id: string;
  name: string;
}

const ProgramsManager = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [newProgramName, setNewProgramName] = useState("");

  // Load programs from localStorage on component mount
  useEffect(() => {
    const storedPrograms = localStorage.getItem("academicPrograms");
    if (storedPrograms) {
      setPrograms(JSON.parse(storedPrograms));
    } else {
      // Set default programs if none exist
      const defaultPrograms = [
        { id: "bsc", name: "BSc" },
        { id: "bsccsit", name: "BScCSIT" },
        { id: "bca", name: "BCA" },
        { id: "bbs", name: "BBS" }
      ];
      setPrograms(defaultPrograms);
      localStorage.setItem("academicPrograms", JSON.stringify(defaultPrograms));
    }
  }, []);

  // Save programs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("academicPrograms", JSON.stringify(programs));
  }, [programs]);

  const handleAddProgram = () => {
    if (!newProgramName.trim()) {
      toast({
        title: "Error",
        description: "Program name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    // Create a simple ID from the name (lowercase, no spaces)
    const newId = newProgramName.toLowerCase().replace(/\s+/g, "");
    
    // Check for duplicates
    if (programs.some(p => p.id === newId || p.name.toLowerCase() === newProgramName.toLowerCase())) {
      toast({
        title: "Error",
        description: "A program with this name already exists",
        variant: "destructive"
      });
      return;
    }

    const newProgram: Program = {
      id: newId,
      name: newProgramName
    };

    setPrograms([...programs, newProgram]);
    setNewProgramName("");
    
    toast({
      title: "Success",
      description: `${newProgramName} has been added to academic programs`,
    });
  };

  const handleRemoveProgram = (id: string) => {
    setPrograms(programs.filter(program => program.id !== id));
    
    toast({
      title: "Success",
      description: "Program has been removed",
    });
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">Academic Programs</h2>
      
      <div className="mb-6 flex items-end gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="new-program">Add New Program</Label>
          <Input
            id="new-program"
            placeholder="Enter program name (e.g., MEd)"
            value={newProgramName}
            onChange={(e) => setNewProgramName(e.target.value)}
          />
        </div>
        <Button onClick={handleAddProgram} className="bg-study-600 hover:bg-study-700">
          <Plus className="mr-2 h-4 w-4" /> Add Program
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Program Name</TableHead>
            <TableHead>Program ID</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                No academic programs found. Add your first program above.
              </TableCell>
            </TableRow>
          ) : (
            programs.map(program => (
              <TableRow key={program.id}>
                <TableCell className="font-medium">{program.name}</TableCell>
                <TableCell>{program.id}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleRemoveProgram(program.id)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProgramsManager;
