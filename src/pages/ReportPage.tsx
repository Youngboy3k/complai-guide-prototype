import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle, FileText, MessageCircle, Download, Share2, Filter, Calendar, Clock, ArrowUpDown, Search } from "lucide-react";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  uploadDate: string;
  analysisDate?: string;
  analysisTime?: string;
}

const ReportPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"chat" | "issues">("chat");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("severity");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [selectedReportForChat, setSelectedReportForChat] = useState<string>("current");
  const [searchQuery, setSearchQuery] = useState("");

  // Load uploaded file info from localStorage
  useEffect(() => {
    const storedFile = localStorage.getItem('uploadedFile');
    if (storedFile) {
      try {
        const fileInfo = JSON.parse(storedFile);
        setUploadedFile(fileInfo);
      } catch (error) {
        console.error('Error parsing uploaded file info:', error);
      }
    }
  }, []);

  // Generate dynamic report based on file type
  const generateDynamicReport = (file: UploadedFile | null) => {
    const scoreBase = file?.name ? file.name.length * 7 : 150;
    const score = 65 + (scoreBase % 30);
    
    const baseReport = {
      title: "Compliance Analysis Report",
      documentName: file?.name || "Sample_Document.pdf",
      analysisDate: new Date().toLocaleDateString(),
      summary: file 
        ? `The document "${file.name}" has been analyzed for compliance with current regulations. ${score >= 80 ? 'The document shows good overall compliance' : 'Several areas require attention'} to ensure full compliance with industry standards and regulatory requirements.`
        : "The document has been analyzed for compliance with current regulations. Several areas require attention to ensure full compliance with industry standards and regulatory requirements.",
      overallScore: score,
      fileSize: file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "2.1 MB",
      fileType: file?.type || "application/pdf",
      uploadDate: file?.uploadDate || new Date().toISOString(),
      issues: [
        {
          severity: "high",
          title: "Data Retention Policy Gaps",
          description: "The current data retention policy does not specify retention periods for customer data in accordance with GDPR Article 5(1)(e). This is a critical compliance requirement.",
          section: "Section 3.2",
          recommendation: "Update policy to include specific retention periods and deletion procedures for all data types."
        },
        {
          severity: "medium",
          title: "Access Control Documentation",
          description: "Access control procedures lack detailed role-based permissions matrix. Current documentation is insufficient for audit requirements.",
          section: "Section 5.1", 
          recommendation: "Implement comprehensive role-based access control documentation with clear permission matrices."
        },
        {
          severity: "low",
          title: "Training Record Format", 
          description: "Employee training records do not follow standardized format requirements. Some records are missing required fields.",
          section: "Section 7.3",
          recommendation: "Standardize training record formats to include all required fields: date, duration, trainer, and assessment results."
        },
        {
          severity: "medium",
          title: "Incident Response Timeline",
          description: "Incident response procedures lack specific timeline requirements for notification. Current procedures are too vague.",
          section: "Section 4.5", 
          recommendation: "Define clear timelines: 24 hours for internal notification, 72 hours for regulatory reporting."
        },
        {
          severity: "high",
          title: "Regular Compliance Audits",
          description: "No evidence of regular compliance audits or reviews. This creates risk of ongoing non-compliance.",
          section: "Section 8.1",
          recommendation: "Establish quarterly internal audits and annual external compliance reviews."
        }
      ]
    };

    // Add file-specific issues
    if (file?.name.toLowerCase().includes('privacy') || file?.name.toLowerCase().includes('gdpr')) {
      baseReport.issues.unshift({
        severity: "high",
        title: "GDPR Privacy Rights Section",
        description: "Privacy policy requires updates to clearly define user rights under GDPR including right to erasure and data portability.",
        section: "Section 1.1",
        recommendation: "Add comprehensive privacy rights section covering all GDPR requirements and user request procedures."
      });
    }

    return baseReport;
  };

  const getAnalysisDateTime = () => {
    if (uploadedFile?.analysisTime) {
      return uploadedFile.analysisTime;
    }
    if (uploadedFile?.analysisDate) {
      const date = new Date(uploadedFile.analysisDate);
      return date.toLocaleString();
    }
    return new Date().toLocaleString();
  };

  const dummyReport = generateDynamicReport(uploadedFile);

  const availableReports = [
    {
      id: "current",
      documentName: dummyReport.documentName,
      analysisDate: dummyReport.analysisDate,
      analysisTime: getAnalysisDateTime(),
      overallScore: dummyReport.overallScore,
      issueCount: dummyReport.issues.length,
      isCurrent: true
    },
    {
      id: "report1",
      documentName: "Corporate_Privacy_Policy.pdf",
      analysisDate: "7/15/2025",
      analysisTime: "7/15/2025, 2:30 PM",
      overallScore: 78,
      issueCount: 5,
      isCurrent: false
    },
    {
      id: "report2", 
      documentName: "Q3_Financial_Report.pdf",
      analysisDate: "7/12/2025",
      analysisTime: "7/12/2025, 10:15 AM",
      overallScore: 85,
      issueCount: 4,
      isCurrent: false
    }
  ];

  const analysisDateTime = getAnalysisDateTime();

  const getSeverityIcon = (severity: string) => {
    return AlertTriangle;
  };

  const filteredIssues = selectedSeverity === "all" 
    ? dummyReport.issues 
    : dummyReport.issues.filter(issue => issue.severity === selectedSeverity);

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    switch (sortBy) {
      case "severity":
        const severityOrder: { [key: string]: number } = { "high": 3, "medium": 2, "low": 1 };
        return (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
      case "section":
        return a.section.localeCompare(b.section);
      default:
        return 0;
    }
  });

  const handleChatWithReport = () => {
    const selectedReport = availableReports.find(r => r.id === selectedReportForChat);
    if (selectedReport) {
      localStorage.setItem('selectedReportForChat', JSON.stringify(selectedReport));
    }
    navigate("/chat");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-hero py-16 px-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-3 text-base text-muted-foreground mb-6">
            <FileText className="w-5 h-5" />
            <span>{dummyReport.documentName}</span>
            <span>•</span>
            <Calendar className="w-5 h-5" />
            <span>Analyzed on {dummyReport.analysisDate}</span>
            <span>•</span>
            <Clock className="w-5 h-5" />
            <span>{analysisDateTime}</span>
            {uploadedFile && (
              <>
                <span>•</span>
                <span>{dummyReport.fileSize}</span>
              </>
            )}
          </div>
          
          <h1 className="text-5xl font-bold text-foreground mb-8 tracking-tight">
            {dummyReport.title}
          </h1>
        </div>
      </div>

      <div className="px-8 -mt-8">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-green-50 to-green-50/50 border border-green-200/50 rounded-3xl p-8">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-soft">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-green-800">Analysis Complete</h3>
                <p className="text-lg text-green-700 mt-2">
                  Your document "{dummyReport.documentName}" has been successfully analyzed for compliance issues.
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg text-green-700">
                  {analysisDateTime}
                </div>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-card-premium rounded-3xl border border-border/50 shadow-large p-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-semibold text-foreground tracking-tight">Executive Summary</h2>
              <div className="flex items-center space-x-4">
                <button className="btn-secondary flex items-center space-x-3">
                  <Download className="w-5 h-5" />
                  <span>Download PDF</span>
                </button>
                <button className="btn-secondary flex items-center space-x-3">
                  <Share2 className="w-5 h-5" />
                  <span>Share Report</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {dummyReport.summary}
              </p>
              
              {/* Compliance Score */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold text-foreground">Compliance Score</span>
                  <div className={`px-5 py-2 rounded-2xl text-lg font-bold ${
                    dummyReport.overallScore >= 80 ? "bg-green-100 text-green-700" : 
                    dummyReport.overallScore >= 60 ? "bg-blue-100 text-blue-700" : 
                    "bg-red-100 text-red-700"
                  }`}>
                    {dummyReport.overallScore}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-primary h-3 rounded-full transition-all duration-1000" 
                    style={{ width: `${dummyReport.overallScore}%` }}
                  ></div>
                </div>
                <p className="text-base text-muted-foreground">
                  {dummyReport.overallScore >= 80 ? "Excellent compliance" : 
                   dummyReport.overallScore >= 60 ? "Good compliance with some improvements needed" : 
                   "Significant improvements required"}
                </p>
              </div>

              {/* Issue Breakdown */}
              <div className="grid grid-cols-3 gap-8 pt-6 border-t border-border/50">
                {[
                  { label: "High", count: dummyReport.issues.filter(i => i.severity === "high").length, color: "text-red-600", bg: "bg-red-100" },
                  { label: "Medium", count: dummyReport.issues.filter(i => i.severity === "medium").length, color: "text-orange-600", bg: "bg-orange-100" },
                  { label: "Low", count: dummyReport.issues.filter(i => i.severity === "low").length, color: "text-gray-600", bg: "bg-gray-100" }
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.count}</div>
                    <div className={`text-sm font-semibold ${stat.color} ${stat.bg} px-3 py-1 rounded-xl inline-block`}>
                      {stat.label} Issues
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Navigation (Apple-style) */}
          <div className="bg-card-premium rounded-3xl border border-border/50 shadow-large overflow-hidden">
            <div className="bg-gray-100 p-2 m-6 rounded-2xl tab-control">
              <button
                onClick={() => setActiveTab("chat")}
                className={activeTab === "chat" ? "tab-active" : "tab-inactive"}
              >
                Chat with Report
              </button>
              <button
                onClick={() => setActiveTab("issues")}
                className={activeTab === "issues" ? "tab-active" : "tab-inactive"}
              >
                Browse Issues ({dummyReport.issues.length})
              </button>
            </div>

            <div className="p-8">
              {activeTab === "chat" ? (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground mb-4">Discuss Your Report</h3>
                    <p className="text-lg text-muted-foreground">
                      Select a report to discuss with our AI assistant. Get detailed explanations about compliance issues, recommendations, and regulatory requirements.
                    </p>
                  </div>

                  <div className="bg-gradient-blue-subtle rounded-2xl p-6 border border-primary/10">
                    <div className="flex items-center space-x-4 mb-6">
                      <Search className="w-6 h-6 text-primary" />
                      <h4 className="text-xl font-semibold text-foreground">Quick Search</h4>
                    </div>
                    <input
                      type="text"
                      placeholder="Ask about specific compliance topics..."
                      className="input-premium text-lg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="space-y-4">
                    {availableReports.map((report) => (
                      <div key={report.id} className="flex items-center space-x-4 p-6 border border-border/50 rounded-2xl hover:bg-gray-50/50 transition-all duration-200">
                        <input
                          type="radio"
                          id={report.id}
                          name="reportSelection"
                          value={report.id}
                          checked={selectedReportForChat === report.id}
                          onChange={(e) => setSelectedReportForChat(e.target.value)}
                          className="w-5 h-5 text-primary focus:ring-primary"
                        />
                        <label htmlFor={report.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-blue-subtle rounded-2xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-foreground">
                                  {report.documentName}
                                  {report.isCurrent && (
                                    <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-xl">Current</span>
                                  )}
                                </h4>
                                <div className="flex items-center space-x-6 text-sm text-muted-foreground mt-1">
                                  <span>{report.analysisTime}</span>
                                  <span>{report.issueCount} issues</span>
                                </div>
                              </div>
                            </div>
                            <div className={`px-4 py-2 rounded-xl text-sm font-bold ${
                              report.overallScore >= 90 ? "bg-green-100 text-green-700" : 
                              report.overallScore >= 80 ? "bg-blue-100 text-blue-700" :
                              report.overallScore >= 70 ? "bg-orange-100 text-orange-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {report.overallScore}%
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleChatWithReport}
                    className="btn-primary w-full flex items-center justify-center space-x-3 text-lg py-4"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span>Start Chat</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground mb-4">Compliance Issues</h3>
                    <p className="text-lg text-muted-foreground">
                      Review all identified compliance issues, filter by severity, and explore detailed recommendations.
                    </p>
                  </div>

                  <div className="bg-gradient-blue-subtle rounded-2xl p-6 border border-primary/10">
                    <div className="flex items-center space-x-6 mb-6">
                      <Filter className="w-6 h-6 text-primary" />
                      <h4 className="text-xl font-semibold text-foreground">Filters & Search</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="text-sm font-semibold text-foreground mb-2 block">Report</label>
                        <select className="input-premium">
                          <option>{dummyReport.documentName}</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-semibold text-foreground mb-2 block">Severity</label>
                        <div className="flex space-x-2">
                          {["all", "high", "medium", "low"].map(severity => (
                            <button
                              key={severity}
                              onClick={() => setSelectedSeverity(severity)}
                              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                selectedSeverity === severity
                                  ? "bg-primary text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {severity === "all" ? "All" : severity.charAt(0).toUpperCase() + severity.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-semibold text-foreground mb-2 block">Sort By</label>
                        <select 
                          className="input-premium"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                        >
                          <option value="severity">Severity</option>
                          <option value="section">Section</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {sortedIssues.map((issue, index) => {
                      const Icon = getSeverityIcon(issue.severity);
                      return (
                        <div key={index} className="bg-white rounded-2xl border border-border/50 p-8 hover:shadow-soft transition-all duration-200">
                          <div className="flex items-start space-x-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                              issue.severity === "high" ? "bg-red-100" :
                              issue.severity === "medium" ? "bg-orange-100" :
                              "bg-gray-100"
                            }`}>
                              <Icon className={`w-6 h-6 ${
                                issue.severity === "high" ? "text-red-600" :
                                issue.severity === "medium" ? "text-orange-600" :
                                "text-gray-600"
                              }`} />
                            </div>
                            
                            <div className="flex-1 space-y-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="text-xl font-semibold text-foreground">{issue.title}</h4>
                                  <p className="text-base text-muted-foreground mt-1">{issue.section} • {dummyReport.documentName}</p>
                                </div>
                                <div className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                                  issue.severity === "high" ? "bg-red-100 text-red-700" :
                                  issue.severity === "medium" ? "bg-orange-100 text-orange-700" :
                                  "bg-gray-100 text-gray-700"
                                }`}>
                                  {issue.severity.toUpperCase()}
                                </div>
                              </div>
                              
                              <p className="text-base text-foreground leading-relaxed">
                                {issue.description}
                              </p>
                              
                              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                                <h5 className="font-semibold text-blue-800 mb-2">Recommendation</h5>
                                <p className="text-blue-700 text-base">
                                  {issue.recommendation}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;