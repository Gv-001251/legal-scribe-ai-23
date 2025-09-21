import { useState } from 'react';
import { Shield, Search, MessageCircle, ArrowLeft, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useDocumentVerification } from '@/hooks/useDocumentVerification';
import { VerificationResultsDetailed } from './VerificationResultsDetailed';
import type { DocumentType, UploadedFile } from '../DocumentWizard';

interface TaskDashboardProps {
  documentType: DocumentType | null;
  uploadedFile: UploadedFile | null;
  onBack: () => void;
}

type TaskType = 'verify' | 'analyze' | 'chat';

interface TaskResult {
  status: 'pending' | 'processing' | 'completed' | 'error';
  data?: any;
}

const tasks = [
  {
    id: 'verify' as TaskType,
    title: 'Verify Document',
    description: 'AI validation of document structure, signatures, and required fields',
    icon: Shield,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    id: 'analyze' as TaskType,
    title: 'Analyze Alterability',
    description: 'Check for potential modifications or tampering indicators',
    icon: Search,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    id: 'chat' as TaskType,
    title: 'Chat with AI',
    description: 'Ask questions about your document and get detailed explanations',
    icon: MessageCircle,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
];

export const TaskDashboard = ({ documentType, uploadedFile, onBack }: TaskDashboardProps) => {
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [taskResults, setTaskResults] = useState<Record<TaskType, TaskResult>>({
    verify: { status: 'pending' },
    analyze: { status: 'pending' },
    chat: { status: 'pending' },
  });
  const [chatMessage, setChatMessage] = useState('');
  
  // Use the real document verification hook
  const {
    isLoading,
    error,
    verificationResult,
    alterabilityResult,
    chatHistory,
    verifyDocument,
    analyzeAlterability,
    sendChatMessage,
    clearError,
    resetResults,
    clearChatHistory,
  } = useDocumentVerification();

  const runTask = async (taskId: TaskType) => {
    if (!uploadedFile) {
      console.error('No file uploaded');
      return;
    }

    // Get the actual File object from uploadedFile
    const file = uploadedFile.file;

    setActiveTask(taskId);
    setTaskResults(prev => ({
      ...prev,
      [taskId]: { status: 'processing' }
    }));

    try {
      clearError();
      
      if (taskId === 'verify') {
        console.log('Starting document verification...', {
          fileName: uploadedFile.name,
          fileType: uploadedFile.type,
          documentType: documentType
        });
        await verifyDocument(file, documentType || 'other');
        console.log('Document verification completed');
        setTaskResults(prev => ({
          ...prev,
          [taskId]: { status: 'completed' }
        }));
      } else if (taskId === 'analyze') {
        console.log('Starting alterability analysis...');
        await analyzeAlterability(uploadedFile.file);
        console.log('Alterability analysis completed');
        setTaskResults(prev => ({
          ...prev,
          [taskId]: { status: 'completed' }
        }));
      } else if (taskId === 'chat') {
        setTaskResults(prev => ({
          ...prev,
          [taskId]: { status: 'completed' }
        }));
      }
    } catch (err) {
      console.error(`Task ${taskId} failed:`, err);
      setTaskResults(prev => ({
        ...prev,
        [taskId]: { status: 'error' }
      }));
    }
  };

  const handleChatSubmit = async () => {
    if (!chatMessage.trim() || !uploadedFile) return;

    try {
      await sendChatMessage(uploadedFile.file, chatMessage);
      setChatMessage('');
    } catch (err) {
      console.error('Chat submission failed:', err);
    }
  };

  const getStatusIcon = (status: TaskResult['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-warning animate-spin" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: TaskResult['status']) => {
    const variants = {
      pending: 'secondary',
      processing: 'default',
      completed: 'default',
      error: 'destructive'
    } as const;

    const labels = {
      pending: 'Not Started',
      processing: 'Processing...',
      completed: 'Completed',
      error: 'Error'
    };

    return (
      <Badge variant={variants[status]} className="ml-auto">
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Document Analysis Dashboard
        </h2>
        <p className="text-muted-foreground">
          Choose an analysis task to begin processing your {documentType} document
        </p>
        {uploadedFile && (
          <p className="text-sm text-muted-foreground mt-2">
            File: <span className="font-medium">{uploadedFile.name}</span>
          </p>
        )}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Demo Mode:</strong> This is a demonstration using simulated AI analysis. 
            Results are generated based on your document name and type for testing purposes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {tasks.map((task) => {
          const Icon = task.icon;
          const result = taskResults[task.id];
          const isActive = activeTask === task.id;

          return (
            <Card
              key={task.id}
              className={cn(
                "p-6 cursor-pointer transition-all duration-200 hover:shadow-md",
                {
                  "ring-2 ring-primary ring-offset-2": isActive,
                  "border-success/50 bg-success-light/50": result.status === 'completed',
                }
              )}
              onClick={() => runTask(task.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn("p-3 rounded-lg", task.bgColor)}>
                  <Icon className={cn("w-6 h-6", task.color)} />
                </div>
                {getStatusIcon(result.status)}
              </div>
              
              <h3 className="font-semibold text-foreground mb-2">{task.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
              
              <div className="flex items-center justify-between">
                {getStatusBadge(result.status)}
              </div>

              {result.status === 'completed' && result.data && task.id !== 'chat' && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {task.id === 'verify' ? 'Validity Score:' : 'Risk Level:'} 
                    <span className="ml-2 text-primary">
                      {task.id === 'verify' ? `${result.data.score}%` : result.data.alterabilityRisk}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">{result.data.summary}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Verification Results */}
      {(activeTask === 'verify' || activeTask === 'analyze') && (verificationResult || alterabilityResult || isLoading || error) && (
        <div className="mb-6">
          <VerificationResultsDetailed
            verificationResult={verificationResult}
            alterabilityResult={alterabilityResult}
            isLoading={isLoading}
            error={error}
            activeTask={activeTask}
          />
        </div>
      )}

      {/* Chat Interface */}
      {activeTask === 'chat' && taskResults.chat.status === 'completed' && (
        <Card className="p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">AI Legal Assistant</h3>
            <Badge variant="secondary" className="ml-auto">Online</Badge>
          </div>
          
          <div className="h-80 overflow-y-auto border rounded-lg p-4 mb-4 bg-muted/30">
            {chatHistory.length === 0 ? (
              <div className="text-center space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-muted-foreground mb-2">
                    👋 Hi! I'm your AI Legal Assistant. I can help you understand your document.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try asking me about:
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">What does this document mean?</span>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Explain the clauses</span>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Legal implications</span>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Risks and obligations</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex",
                      chat.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "p-3 rounded-lg max-w-[80%]",
                        chat.role === 'user'
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border shadow-sm"
                      )}
                    >
                      {chat.role === 'ai' && (
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-muted-foreground">AI Assistant</span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{chat.message}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-card border shadow-sm p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-muted-foreground">AI is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask about clauses, legal terms, risks, obligations, or any document details..."
              className="flex-1"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleChatSubmit();
                }
              }}
            />
            <Button 
              onClick={handleChatSubmit} 
              disabled={!chatMessage.trim() || isLoading}
              className="px-6"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </div>
          
          <div className="mt-3 text-xs text-muted-foreground text-center">
            💡 Tip: Ask specific questions like "What are my obligations?" or "Explain the termination clause"
          </div>
        </Card>
      )}

      <div className="flex justify-start">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Upload</span>
        </Button>
      </div>
    </div>
  );
};