import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, CheckCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsUploading(false);
    navigate("/report");
  };

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
                  <div className="border-2 border-dashed border-border rounded-lg p-12 hover:border-primary/50 transition-colors">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Choose a PDF file to upload
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
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;