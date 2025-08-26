import { useState } from 'react';
import { Shield, Search, MessageCircle, ArrowLeft, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
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
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai'; message: string }>>([]);

  const runTask = async (taskId: TaskType) => {
    setActiveTask(taskId);
    setTaskResults(prev => ({
      ...prev,
      [taskId]: { status: 'processing' }
    }));

    // Simulate AI processing
    setTimeout(() => {
      const mockResults = {
        verify: {
          status: 'completed' as const,
          data: {
            isValid: true,
            score: 95,
            issues: ['Missing witness signature on page 3'],
            summary: 'Document appears to be valid with minor formatting issues.'
          }
        },
        analyze: {
          status: 'completed' as const,
          data: {
            alterabilityRisk: 'Low',
            confidence: 88,
            findings: ['Consistent font usage', 'No text insertion detected', 'Original PDF metadata intact'],
            summary: 'Low risk of alteration detected. Document appears authentic.'
          }
        },
        chat: { status: 'completed' as const }
      };

      setTaskResults(prev => ({
        ...prev,
        [taskId]: mockResults[taskId]
      }));
    }, 2000);
  };

  const handleChatSubmit = () => {
    if (!chatMessage.trim()) return;

    setChatHistory(prev => [...prev, { role: 'user', message: chatMessage }]);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your document, this clause means that...",
        "The legal implications of this section include...",
        "This type of agreement typically requires...",
        "According to standard legal practice..."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setChatHistory(prev => [...prev, { role: 'ai', message: randomResponse }]);
    }, 1000);

    setChatMessage('');
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

      {/* Chat Interface */}
      {activeTask === 'chat' && taskResults.chat.status === 'completed' && (
        <Card className="p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-4">Chat with AI Assistant</h3>
          
          <div className="h-64 overflow-y-auto border rounded-lg p-4 mb-4 bg-muted/30">
            {chatHistory.length === 0 ? (
              <p className="text-muted-foreground text-center">
                Ask me anything about your document...
              </p>
            ) : (
              <div className="space-y-3">
                {chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-3 rounded-lg max-w-[80%]",
                      chat.role === 'user'
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-card border"
                    )}
                  >
                    <p className="text-sm">{chat.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask about clauses, legal terms, or document details..."
              className="flex-1"
              rows={2}
            />
            <Button onClick={handleChatSubmit} disabled={!chatMessage.trim()}>
              Send
            </Button>
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