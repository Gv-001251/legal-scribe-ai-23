import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DocumentWizard from '@/components/DocumentWizard';
import { 
  User, 
  FileText, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  LogOut,
  History,
  Settings
} from 'lucide-react';

interface VerificationHistory {
  id: string;
  fileName: string;
  documentType: string;
  status: 'authentic' | 'fake' | 'questionable';
  date: string;
  authenticityScore: number;
}

export const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'verify' | 'history' | 'settings'>('verify');

  // Mock verification history
  const verificationHistory: VerificationHistory[] = [
    {
      id: '1',
      fileName: 'contract_agreement.pdf',
      documentType: 'Contract',
      status: 'authentic',
      date: '2024-01-15',
      authenticityScore: 92
    },
    {
      id: '2',
      fileName: 'lease_document.pdf',
      documentType: 'Lease',
      status: 'authentic',
      date: '2024-01-14',
      authenticityScore: 88
    },
    {
      id: '3',
      fileName: 'suspicious_document.pdf',
      documentType: 'Contract',
      status: 'fake',
      date: '2024-01-13',
      authenticityScore: 25
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'authentic':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'fake':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'authentic':
        return <Badge variant="default" className="bg-green-100 text-green-800">Authentic</Badge>;
      case 'fake':
        return <Badge variant="destructive">Fake</Badge>;
      default:
        return <Badge variant="secondary">Questionable</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">LegalDoc AI</h1>
                <p className="text-sm text-gray-500">Document Verification Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gray-100 rounded-full">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>
              <Button variant="outline" onClick={logout} className="flex items-center space-x-2">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('verify')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'verify'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Verify Document</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4" />
                <span>Verification History</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'verify' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Verification</h2>
              <p className="text-gray-600">
                Upload and verify your legal documents with our advanced AI analysis
              </p>
            </div>
            <DocumentWizard />
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification History</h2>
              <p className="text-gray-600">
                View all your previous document verifications and analysis results
              </p>
            </div>

            <div className="grid gap-6">
              {verificationHistory.map((item) => (
                <Card key={item.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(item.status)}
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.fileName}</h3>
                        <p className="text-sm text-gray-500">
                          {item.documentType} • Verified on {item.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Authenticity Score</p>
                        <p className="font-semibold text-gray-900">{item.authenticityScore}%</p>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Settings</h2>
              <p className="text-gray-600">
                Manage your account preferences and security settings
              </p>
            </div>

            <div className="grid gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <p className="text-gray-900">{user?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <p className="text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Member Since
                    </label>
                    <p className="text-gray-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
                <div className="space-y-4">
                  <Button variant="outline">Change Password</Button>
                  <Button variant="outline">Enable Two-Factor Authentication</Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
