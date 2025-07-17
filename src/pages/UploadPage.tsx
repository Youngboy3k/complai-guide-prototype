import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, CheckCircle, MessageCircle, Info, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      event.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    const fileInfo = {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      lastModified: selectedFile.lastModified,
      uploadDate: new Date().toISOString(),
      analysisDate: new Date().toISOString(),
      analysisTime: new Date().toLocaleString()
    };
    
    localStorage.setItem('uploadedFile', JSON.stringify(fileInfo));
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsUploading(false);
    navigate("/report");
  };

  // Mock recent uploads with dates and times
  const recentUploads = [
    { 
      name: "Q3_Financial_Report.pdf", 
      date: "July 15, 2025", 
      time: "2:30 PM",
      size: "2.4 MB",
      analysisDate: "2025-07-15T14:30:00Z"
    },
    { 
      name: "Privacy_Policy_2024.pdf", 
      date: "July 12, 2025", 
      time: "10:15 AM",
      size: "1.8 MB",
      analysisDate: "2025-07-12T10:15:00Z"
    },
    { 
      name: "Employee_Handbook.pdf", 
      date: "July 10, 2025", 
      time: "4:45 PM",
      size: "3.2 MB",
      analysisDate: "2025-07-10T16:45:00Z"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Upload Your Compliance Document
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload a document to get started with compliance analysis. 
              Our system will review the document and generate a comprehensive report.
            </p>
          </div>

          {/* File Upload Status */}
          <Card className="shadow-medium mb-6 bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-900 mb-1">File Upload Notice</h3>
                  <p className="text-sm text-amber-700 mb-2">
                    File picker buttons may not work in all environments. Please use:
                  </p>
                  <div className="text-xs text-amber-600">
                    ✅ <strong>Drag & Drop</strong> (works everywhere) • ✅ <strong>Demo files</strong> (always work)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Card */}
          <Card className="shadow-large">
            <CardContent className="p-8">
              {!selectedFile ? (
                <div className="text-center">
                  {/* Primary: Drag & Drop Zone */}
                  <div 
                    className={`border-2 border-dashed rounded-lg p-12 mb-6 transition-all duration-200 cursor-pointer ${
                      dragActive 
                        ? "border-primary bg-primary/5 scale-102" 
                        : "border-border hover:border-primary/50 hover:bg-gradient-hero"
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <Upload className={`w-16 h-16 mx-auto mb-4 ${
                      dragActive ? "text-primary" : "text-muted-foreground"
                    }`} />
                    <h3 className="text-xl font-medium text-foreground mb-2">
                      {dragActive ? "Drop your file here!" : "Drag & Drop Your File Here"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports PDF, DOC, DOCX, TXT, and image files
                    </p>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                      <Upload className="w-4 h-4 mr-1" />
                      Recommended Method
                    </div>
                  </div>

                  {/* Secondary: Demo Files */}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Or try these sample documents:
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const fakeFile = new File(
                            ['Sample compliance policy with GDPR requirements...'], 
                            'Corporate_Privacy_Policy.pdf', 
                            { type: 'application/pdf' }
                          );
                          setSelectedFile(fakeFile);
                        }}
                      >
                        📄 Privacy Policy
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const fakeFile = new File(
                            ['Employee handbook with HR policies...'], 
                            'Employee_Handbook_2024.docx', 
                            { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
                          );
                          setSelectedFile(fakeFile);
                        }}
                      >
                        📋 Employee Handbook
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const fakeFile = new File(
                            ['Financial reporting and audit procedures...'], 
                            'Q3_Financial_Report.pdf', 
                            { type: 'application/pdf' }
                          );
                          setSelectedFile(fakeFile);
                        }}
                      >
                        💰 Financial Report
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-secondary rounded-lg p-6 mb-6">
                    <FileText className="w-12 h-12 text-primary mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-foreground mb-1">
                      {selectedFile.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Type: {selectedFile.type || 'Unknown'}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedFile(null)}
                      disabled={isUploading}
                    >
                      Choose Different File
                    </Button>
                    <Button
                      onClick={handleAnalyze}
                      disabled={isUploading}
                      className="min-w-36"
                    >
                      {isUploading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                          <span>Analyzing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Analyze Document</span>
                        </div>
                      )}
                    </Button>
                  </div>

                  {isUploading && (
                    <div className="mt-6">
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full transition-all duration-1000" style={{ width: "60%" }}></div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Processing your document... Please wait
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "Document Analysis",
                description: "Comprehensive review of your compliance documents"
              },
              {
                icon: CheckCircle,
                title: "Issue Detection",
                description: "Automatically identify potential compliance issues"
              },
              {
                icon: MessageCircle,
                title: "Interactive Chat",
                description: "Ask questions about your compliance report"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-4 rounded-lg hover:bg-gradient-hero transition-colors">
                  <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Recent Uploads */}
          <div className="mt-12">
            <h2 className="text-lg font-medium text-foreground mb-6">Recent Uploads</h2>
            <Card className="shadow-medium">
              <CardContent className="p-0">
                {recentUploads.map((upload, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 hover:bg-sidebar-hover transition-colors cursor-pointer ${
                    index !== recentUploads.length - 1 ? "border-b border-border" : ""
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-foreground">{upload.name}</h4>
                        <p className="text-xs text-muted-foreground">{upload.date} at {upload.time} • {upload.size}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => {
                        const mockFileInfo = {
                          name: upload.name,
                          size: parseFloat(upload.size) * 1024 * 1024,
                          type: 'application/pdf',
                          lastModified: Date.now(),
                          uploadDate: upload.analysisDate,
                          analysisDate: upload.analysisDate,
                          analysisTime: `${upload.date} at ${upload.time}`
                        };
                        localStorage.setItem('uploadedFile', JSON.stringify(mockFileInfo));
                        navigate("/report");
                      }}
                    >
                      View Report
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;