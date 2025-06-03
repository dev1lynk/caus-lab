import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CloudUpload, Info, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@shared/schema";

interface DataUploadProps {
  project: Project;
}

export default function DataUpload({ project }: DataUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('csvFile', file);
      
      const response = await fetch(`/api/projects/${project.id}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Upload successful",
        description: `Processed ${data.dataRows} rows with ${data.variables.length} variables.`,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${project.id}`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const validateFile = (file: File): boolean => {
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
      return false;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 2MB.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const sampleData = [
    { Date: "2024-01-01", Revenue: "$125,430", Marketing: "$15,200", Sales: "85", Support: "12" },
    { Date: "2024-01-02", Revenue: "$132,150", Marketing: "$16,800", Sales: "92", Support: "8" },
  ];

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Data Upload
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>Max 2MB, 2000 rows</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {(project.dataRows || 0) === 0 ? (
          <>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer",
                dragActive 
                  ? "border-primary bg-primary/5" 
                  : "border-muted-foreground/25 hover:border-primary/50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <CloudUpload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium text-foreground mb-2">
                Drop your CSV files here
              </h4>
              <p className="text-muted-foreground mb-4">
                or click to browse from your computer
              </p>
              <div className="space-y-4">
                <div>
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="csv-upload"
                  />
                  <Button asChild>
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      Choose File
                    </label>
                  </Button>
                </div>
                {selectedFile && (
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{selectedFile.name}</span>
                    </div>
                    <Button 
                      onClick={handleUpload}
                      disabled={uploadMutation.isPending}
                    >
                      {uploadMutation.isPending ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                )}
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                Supported format: CSV • Free plan: 5 variables max
              </div>
            </div>
          </>
        ) : (
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              Data uploaded successfully! {project.dataRows} rows processed with {project.variables.length} variables.
            </AlertDescription>
          </Alert>
        )}

        {/* Sample Data Preview */}
        <div className="p-4 bg-muted rounded-lg">
          <h5 className="text-sm font-medium text-foreground mb-3">
            Sample Data Preview
          </h5>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  {Object.keys(sampleData[0]).map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, cellIndex) => (
                      <td key={cellIndex}>{value}</td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="text-muted-foreground">...</td>
                  <td className="text-muted-foreground">...</td>
                  <td className="text-muted-foreground">...</td>
                  <td className="text-muted-foreground">...</td>
                  <td className="text-muted-foreground">...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
