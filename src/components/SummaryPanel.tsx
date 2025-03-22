
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Edit, CheckCircle, X, BookText, ListChecks, Lightbulb } from 'lucide-react';
import { SummaryContent } from '@/utils/summarizationService';

interface SummaryPanelProps {
  transcript: Array<{
    id: string;
    speaker: string;
    text: string;
    timestamp: string;
  }>;
  isGeneratingSummary: boolean;
  onGenerateSummary: () => void;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({
  transcript,
  isGeneratingSummary,
  onGenerateSummary,
}) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [isEditing, setIsEditing] = useState(false);
  const [summaryContent, setSummaryContent] = useState<SummaryContent>({
    summary: '',
    keyPoints: [],
    actionItems: []
  });
  const [editedContent, setEditedContent] = useState({
    summary: '',
    keyPoints: '',
    actionItems: ''
  });
  
  const hasSummary = summaryContent.summary.length > 0;
  
  const handleStartEditing = () => {
    setIsEditing(true);
    setEditedContent({
      summary: summaryContent.summary,
      keyPoints: summaryContent.keyPoints.join('\n'),
      actionItems: summaryContent.actionItems.join('\n')
    });
  };
  
  const handleSaveEdits = () => {
    setIsEditing(false);
    setSummaryContent({
      summary: editedContent.summary,
      keyPoints: editedContent.keyPoints.split('\n').filter(i => i.trim() !== ''),
      actionItems: editedContent.actionItems.split('\n').filter(i => i.trim() !== '')
    });
  };
  
  const handleCancelEdits = () => {
    setIsEditing(false);
  };
  
  return (
    <Card className="glass-panel border-none shadow-smooth h-full flex flex-col animate-enter">
      <CardHeader className="pb-2 pt-6 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookText className="h-5 w-5 text-primary" />
            <CardTitle>AI Summary</CardTitle>
          </div>
          {hasSummary && !isEditing && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 gap-1.5"
              onClick={handleStartEditing}
            >
              <Edit className="h-3.5 w-3.5" />
              <span className="text-xs">Edit</span>
            </Button>
          )}
          {isEditing && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1.5"
                onClick={handleCancelEdits}
              >
                <X className="h-3.5 w-3.5" />
                <span className="text-xs">Cancel</span>
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="h-8 gap-1.5"
                onClick={handleSaveEdits}
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span className="text-xs">Save</span>
              </Button>
            </div>
          )}
        </div>
        {!hasSummary && transcript.length > 0 && (
          <CardDescription className="text-sm">
            Generate an AI summary from your recorded transcript.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1 px-6 pb-6 pt-2">
        {!hasSummary ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
            {transcript.length === 0 ? (
              <>
                <Sparkles className="h-12 w-12 mb-3 text-muted-foreground/50" />
                <h3 className="text-lg font-medium">No Summary Yet</h3>
                <p className="text-sm max-w-[20rem]">
                  Record a meeting to generate an AI-powered summary with key points.
                </p>
              </>
            ) : isGeneratingSummary ? (
              <div className="space-y-3">
                <div className="loader mx-auto">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <p>Generating summary...</p>
              </div>
            ) : (
              <div className="space-y-4 w-full max-w-md">
                <p className="text-sm">
                  Ready to create a summary from the transcript?
                </p>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={onGenerateSummary}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Summary
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="mx-auto mb-4">
              <TabsTrigger value="summary" className="flex gap-1.5">
                <BookText className="h-4 w-4" />
                <span>Summary</span>
              </TabsTrigger>
              <TabsTrigger value="keyPoints" className="flex gap-1.5">
                <ListChecks className="h-4 w-4" />
                <span>Key Points</span>
              </TabsTrigger>
              <TabsTrigger value="actionItems" className="flex gap-1.5">
                <Lightbulb className="h-4 w-4" />
                <span>Action Items</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1">
              <TabsContent value="summary" className="h-full">
                <ScrollArea className="h-[calc(100vh-22rem)]">
                  {isEditing ? (
                    <Textarea
                      value={editedContent.summary}
                      onChange={(e) => setEditedContent({...editedContent, summary: e.target.value})}
                      className="min-h-[300px] text-sm"
                    />
                  ) : (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {summaryContent.summary}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="keyPoints" className="h-full">
                <ScrollArea className="h-[calc(100vh-22rem)]">
                  {isEditing ? (
                    <Textarea
                      value={editedContent.keyPoints}
                      onChange={(e) => setEditedContent({...editedContent, keyPoints: e.target.value})}
                      className="min-h-[300px] text-sm"
                      placeholder="Enter key points (one per line)"
                    />
                  ) : (
                    <ul className="space-y-2 text-sm">
                      {summaryContent.keyPoints.map((point, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="actionItems" className="h-full">
                <ScrollArea className="h-[calc(100vh-22rem)]">
                  {isEditing ? (
                    <Textarea
                      value={editedContent.actionItems}
                      onChange={(e) => setEditedContent({...editedContent, actionItems: e.target.value})}
                      className="min-h-[300px] text-sm"
                      placeholder="Enter action items (one per line)"
                    />
                  ) : (
                    <ul className="space-y-2 text-sm">
                      {summaryContent.actionItems.map((item, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="text-primary">→</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryPanel;
