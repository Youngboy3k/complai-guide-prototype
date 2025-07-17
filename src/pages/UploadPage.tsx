import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, CheckCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsUploading(false);
    navigate("/report");
  };

  // Mock recent uploads
  const recentUploads = [
    { name: "Q3_Financial_Report.pdf", date: "July 15, 2025", size: "2.4 MB" },
    { name: "Privacy_Policy_2024.pdf", date: "July 12, 2025", size: "1.8 MB" },
    { name: "Employee_Handbook.pdf", date: "July 10, 2025", size: "3.2 MB" }
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
              Upload a PDF document to get started with compliance analysis. 
              Our system will review the document and generate a comprehensive report.
            </p>
          </div>

          {/* Upload Card */}
          <Card className="shadow-large">
            <CardContent className="p-8">
              {!selectedFile ? (
                <div className="text-center">
                  <div 
                    className={`border-2 border-dashed rounded-lg p-12 transition-all duration-200 ${
                      dragActive 
                        ? "border-primary bg-primary/5 scale-102" 
                        : "border-border hover:border-primary/50 hover:bg-gradient-hero"
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <Upload className={`w-12 h-12 mx-auto mb-4 ${
                      dragActive ? "text-primary" : "text-muted-foreground"
                    }`} />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      {dragActive ? "Drop your PDF here" : "Choose a PDF file to upload"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Drag and drop your PDF here, or click to browse
                    </p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" className="cursor-pointer">
                        Select PDF File
                      </Button>
                    </label>
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
                      className="min-w-32"
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
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "PDF Analysis",
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
                  <div key={index} className={`flex items-center justify-between p-4 hover:bg-sidebar-hover transition-colors ${
                    index !== recentUploads.length - 1 ? "border-b border-border" : ""
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-foreground">{upload.name}</h4>
                        <p className="text-xs text-muted-foreground">{upload.date} • {upload.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
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