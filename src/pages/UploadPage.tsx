import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, CheckCircle, Clock, AlertTriangle, Sparkles, Shield, MessageSquare } from "lucide-react";

const UploadPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    const file = files[0];
    
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    }
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
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsUploading(false);
    navigate("/report");
  };

  const demoFiles = [
    { name: "Corporate_Privacy_Policy.pdf", icon: FileText, gradient: "from-blue-500 to-blue-600" },
    { name: "Q3_Financial_Report.pdf", icon: FileText, gradient: "from-green-500 to-green-600" },
    { name: "Employee_Handbook_2024.docx", icon: FileText, gradient: "from-purple-500 to-purple-600" },
  ];

  const recentUploads = [
    { name: "Q3_Compliance_Review.pdf", date: "2 hours ago", status: "completed", score: 87 },
    { name: "Internal_Audit_Report.pdf", date: "Yesterday", status: "completed", score: 92 },
    { name: "Policy_Update_Draft.pdf", date: "3 days ago", status: "pending", score: null },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-hero py-20 px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-large">
            <Upload className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-foreground tracking-tight leading-tight">
            Upload Your Document
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Upload a PDF document to analyze for compliance issues and generate detailed reports with AI-powered insights
          </p>
        </div>
      </div>

      <div className="px-8 -mt-12">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Main Upload Card */}
          <div className="bg-card-premium rounded-3xl border border-border/50 shadow-large p-12">
            <div
              className={`border-2 border-dashed rounded-2xl p-20 text-center transition-all duration-300 ${
                isDragOver
                  ? "border-primary bg-primary/5 scale-105"
                  : selectedFile
                  ? "border-green-500 bg-green-50/50"
                  : "border-border hover:border-primary hover:bg-primary/5 hover:shadow-soft"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-8">
                <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center shadow-soft transition-all duration-300 ${
                  selectedFile ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gradient-primary"
                }`}>
                  {selectedFile ? (
                    <CheckCircle className="w-12 h-12 text-white" />
                  ) : (
                    <Upload className="w-12 h-12 text-white" />
                  )}
                </div>
                
                <div>
                  <h3 className="text-3xl font-semibold text-foreground mb-4 tracking-tight">
                    {selectedFile ? selectedFile.name : "Drop your PDF here"}
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    {selectedFile ? "File ready for analysis" : "or click to browse files"}
                  </p>
                </div>
                
                {!selectedFile && (
                  <div>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="btn-primary cursor-pointer inline-flex items-center space-x-3 text-lg px-8 py-4"
                    >
                      <span>Choose File</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* File Notice */}
            <div className="mt-10 bg-gradient-to-r from-amber-50 to-amber-50/50 border border-amber-200/50 rounded-2xl p-6 flex items-start space-x-5">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-amber-800">Supported formats</p>
                <p className="text-base text-amber-700 mt-2">Only PDF files are currently supported. Maximum file size: 50MB</p>
              </div>
            </div>

            {/* Analyze Button */}
            {selectedFile && (
              <div className="mt-10 text-center">
                <button
                  onClick={handleAnalyze}
                  disabled={isUploading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center space-x-3 mx-auto text-lg px-10 py-4"
                >
                  {isUploading ? (
                    <>
                      <Clock className="w-6 h-6 animate-spin" />
                      <span>Analyzing Document...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      <span>Analyze Document</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Demo Files */}
          <div className="space-y-8">
            <h2 className="text-4xl font-semibold text-foreground tracking-tight">Try with Demo Files</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {demoFiles.map((file, index) => {
                const Icon = file.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedFile(new File([], file.name, { type: "application/pdf" }))}
                    className="card-premium text-left group p-8"
                  >
                    <div className="flex items-center space-x-5">
                      <div className={`w-16 h-16 bg-gradient-to-r ${file.gradient} rounded-2xl flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-200`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{file.name}</h3>
                        <p className="text-base text-muted-foreground">Sample document</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Features */}
          <div className="bg-card-premium rounded-3xl border border-border/50 shadow-large p-12">
            <h2 className="text-4xl font-semibold text-foreground mb-12 text-center tracking-tight">Core Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-soft">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-semibold text-2xl text-foreground">PDF Analysis</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Advanced document parsing and content extraction with AI-powered insights
                </p>
              </div>
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-soft">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-semibold text-2xl text-foreground">Issue Detection</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Identify compliance gaps and regulatory issues across multiple frameworks
                </p>
              </div>
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-soft">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-semibold text-2xl text-foreground">Interactive Chat</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Ask questions about your compliance analysis and get instant answers
                </p>
              </div>
            </div>
          </div>

          {/* Recent Uploads */}
          <div className="space-y-8 pb-16">
            <h2 className="text-4xl font-semibold text-foreground tracking-tight">Recent Uploads</h2>
            <div className="bg-card-premium rounded-3xl border border-border/50 shadow-large overflow-hidden">
              <div className="divide-y divide-border/50">
                {recentUploads.map((upload, index) => (
                  <div key={index} className="p-8 flex items-center justify-between hover:bg-gray-50/50 transition-all duration-200 group">
                    <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                        <FileText className="w-7 h-7 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{upload.name}</h3>
                        <p className="text-base text-muted-foreground">{upload.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-5">
                      {upload.score && (
                        <div className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                          upload.score >= 90 ? "bg-green-100 text-green-700" : 
                          upload.score >= 80 ? "bg-blue-100 text-blue-700" :
                          upload.score >= 70 ? "bg-orange-100 text-orange-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {upload.score}%
                        </div>
                      )}
                      <div className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                        upload.status === "completed" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {upload.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;