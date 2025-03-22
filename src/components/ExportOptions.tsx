
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Download, 
  FileText, 
  FileJson, 
  File,
  FileDown,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SummaryContent } from '@/utils/summarizationService';

interface ExportOptionsProps {
  hasSummary: boolean;
  onExport: (format: string) => Promise<void>;
  summary: SummaryContent | null;
  transcript: Array<{
    id: string;
    speaker: string;
    text: string;
    timestamp: string;
  }>;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({
  hasSummary,
  onExport,
  summary,
  transcript
}) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const exportFormats = [
    { id: 'pdf', label: 'PDF Document', icon: File, description: 'Export as a formatted PDF document' },
    { id: 'docx', label: 'Word Document', icon: FileText, description: 'Export as a Microsoft Word document' },
    { id: 'md', label: 'Markdown', icon: FileDown, description: 'Export as Markdown for Notion or GitHub' },
    { id: 'json', label: 'JSON', icon: FileJson, description: 'Export structured data as JSON' },
  ];
  
  const handleExport = async (format: string) => {
    setIsExporting(true);
    setSelectedFormat(format);
    
    try {
      if (!summary) {
        throw new Error("No summary available");
      }
      await onExport(format);
      toast({
        title: "Export successful",
        description: `Your notes have been exported as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your notes. Please try again.",
        variant: "destructive",
      });
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
      setIsDialogOpen(false);
    }
  };
  
  return (
    <Card className="glass-panel border-none shadow-smooth animate-enter">
      <CardHeader className="pb-2 pt-6 px-6">
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          <CardTitle>Export Notes</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full glass-button hover:bg-white/20 text-foreground"
              disabled={!hasSummary}
            >
              <Download className="mr-2 h-5 w-5" />
              Export Notes
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Export Options</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {exportFormats.map((format) => (
                <Button
                  key={format.id}
                  variant="outline"
                  className="h-auto py-3 justify-start gap-4"
                  onClick={() => handleExport(format.id)}
                  disabled={isExporting}
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {isExporting && selectedFormat === format.id ? (
                      <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                    ) : (
                      <format.icon className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium">{format.label}</span>
                    <span className="text-xs text-muted-foreground">{format.description}</span>
                  </div>
                  {isExporting && selectedFormat === format.id && (
                    <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                  )}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ExportOptions;
