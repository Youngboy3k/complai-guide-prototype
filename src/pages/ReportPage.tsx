import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle, FileText, MessageCircle, Download, Share2, Filter, Calendar, Clock, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Define Select components if they don't exist
const Select = ({ value, onValueChange, children }: { value: string; onValueChange: (value: string) => void; children: React.ReactNode }) => (
  <select value={value} onChange={(e) => onValueChange(e.target.value)} className="px-3 py-2 border border-border rounded-md text-sm bg-background">
    {children}
  </select>
);

const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <option value={value}>{children}</option>
);

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
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("severity");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [selectedReportForChat, setSelectedReportForChat] = useState<string>("current");

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
    // Ensure we always get a consistent score for the same file
    const scoreBase = file?.name ? file.name.length * 7 : 150;
    const score = 65 + (scoreBase % 30); // Score between 65-95, deterministic
    
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

    // Add file-specific issues based on file name/type
    if (file?.name.toLowerCase().includes('privacy') || file?.name.toLowerCase().includes('gdpr')) {
      baseReport.issues.unshift({
        severity: "high",
        title: "GDPR Privacy Rights Section",
        description: "Privacy policy requires updates to clearly define user rights under GDPR including right to erasure and data portability.",
        section: "Section 1.1",
        recommendation: "Add comprehensive privacy rights section covering all GDPR requirements and user request procedures."
      });
    }

    if (file?.name.toLowerCase().includes('financial') || file?.name.toLowerCase().includes('audit')) {
      baseReport.issues.unshift({
        severity: "medium", 
        title: "Financial Reporting Standards",
        description: "Financial reporting procedures need alignment with current accounting standards and audit trail requirements.",
        section: "Section 2.1",
        recommendation: "Update financial reporting procedures to meet current GAAP/IFRS standards and ensure complete audit trails."
      });
    }

    if (file?.name.toLowerCase().includes('employee') || file?.name.toLowerCase().includes('handbook') || file?.name.toLowerCase().includes('hr')) {
      baseReport.issues.unshift({
        severity: "medium",
        title: "Employee Data Protection",
        description: "Employee handbook lacks adequate data protection and privacy provisions for employee personal information.",
        section: "Section 6.2", 
        recommendation: "Add comprehensive employee data protection policies including consent, access rights, and data retention schedules."
      });
    }

    // Add image-specific analysis if it's an image file
    if (file?.type.startsWith('image/')) {
      baseReport.title = "Document Image Analysis Report";
      baseReport.summary = `The uploaded image "${file.name}" has been processed for document analysis. Our OCR technology has extracted text content and performed compliance analysis on the visible information.`;
      baseReport.issues.unshift({
        severity: "low",
        title: "Image Quality Assessment",
        description: "Document image quality affects OCR accuracy. Some text may not have been properly extracted for analysis.",
        section: "Image Processing",
        recommendation: "For best results, upload high-resolution images with clear, readable text. Consider converting to PDF format."
      });
    }

    return baseReport;
  };

  // Get analysis date/time for display
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

  // Mock available reports for selection
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
    },
    {
      id: "report3",
      documentName: "Employee_Security_Guidelines.pdf",
      analysisDate: "7/10/2025", 
      analysisTime: "7/10/2025, 4:45 PM",
      overallScore: 72,
      issueCount: 7,
      isCurrent: false
    }
  ];

  const analysisDateTime = getAnalysisDateTime();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return AlertTriangle;
      case "medium":
        return AlertTriangle;
      case "low":
        return AlertTriangle;
      default:
        return AlertTriangle;
    }
  };

  const filteredIssues = selectedSeverity === "all" 
    ? dummyReport.issues 
    : dummyReport.issues.filter(issue => issue.severity === selectedSeverity);

  // Sort issues based on selected criteria
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    switch (sortBy) {
      case "severity":
        const severityOrder: { [key: string]: number } = { "high": 3, "medium": 2, "low": 1 };
        return (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
      case "section":
        return a.section.localeCompare(b.section);
      case "time":
        // Sort by section number (assuming sections are numbered)
        const getSectionNumber = (section: string) => {
          const match = section.match(/\d+/);
          return match ? parseInt(match[0]) : 0;
        };
        return getSectionNumber(a.section) - getSectionNumber(b.section);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <FileText className="w-4 h-4" />
              <span>{dummyReport.documentName}</span>
              <span>•</span>
              <Calendar className="w-4 h-4" />
              <span>Analyzed on {dummyReport.analysisDate}</span>
              <span>•</span>
              <Clock className="w-4 h-4" />
              <span>{analysisDateTime}</span>
              {uploadedFile && (
                <>
                  <span>•</span>
                  <span>{dummyReport.fileSize}</span>
                </>
              )}
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {dummyReport.title}
            </h1>
            
            {/* File Info Banner */}
            {uploadedFile && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">Successfully Analyzed</h3>
                    <p className="text-sm text-muted-foreground">
                      Your document "{uploadedFile.name}" has been processed and analyzed for compliance issues.
                    </p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {analysisDateTime}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary Card */}
          <Card className="shadow-large mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Executive Summary</span>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Share2 className="w-4 h-4" />
                    <span>Share Report</span>
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                {dummyReport.summary}
              </p>
              
              {/* Compliance Score Progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Compliance Score</span>
                  <Badge variant={dummyReport.overallScore >= 80 ? "default" : dummyReport.overallScore >= 60 ? "secondary" : "destructive"}>
                    {dummyReport.overallScore}%
                  </Badge>
                </div>
                <Progress value={dummyReport.overallScore} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {dummyReport.overallScore >= 80 ? "Excellent compliance" : 
                   dummyReport.overallScore >= 60 ? "Good compliance with some improvements needed" : 
                   "Significant improvements required"}
                </p>
              </div>

              {/* Issue Breakdown */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                {[
                  { label: "High", count: dummyReport.issues.filter(i => i.severity === "high").length, color: "text-destructive" },
                  { label: "Medium", count: dummyReport.issues.filter(i => i.severity === "medium").length, color: "text-orange-600" },
                  { label: "Low", count: dummyReport.issues.filter(i => i.severity === "low").length, color: "text-muted-foreground" }
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
                    <div className="text-sm text-muted-foreground">{stat.label} Issues</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Report Selection for Chat */}
          <Card className="shadow-medium mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span>Chat with Report</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Select a report to discuss with the AI assistant. You can ask questions about compliance issues, recommendations, and regulatory requirements.
              </p>
              
              <div className="space-y-3 mb-6">
                {availableReports.map((report) => (
                  <div key={report.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                    <input
                      type="radio"
                      id={report.id}
                      name="reportSelection"
                      value={report.id}
                      checked={selectedReportForChat === report.id}
                      onChange={(e) => setSelectedReportForChat(e.target.value)}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <label htmlFor={report.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">
                              {report.documentName}
                              {report.isCurrent && (
                                <Badge variant="outline" className="ml-2 text-xs">Current</Badge>
                              )}
                            </h4>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>Analyzed: {report.analysisDate}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{report.analysisTime}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={report.overallScore >= 80 ? "default" : report.overallScore >= 60 ? "secondary" : "destructive"}>
                            {report.overallScore}%
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {report.issueCount} issues
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => {
                  // Store selected report info for chat
                  const selectedReport = availableReports.find(r => r.id === selectedReportForChat);
                  if (selectedReport) {
                    const reportInfo = {
                      documentName: selectedReport.documentName,
                      analysisDate: selectedReport.analysisDate,
                      analysisTime: selectedReport.analysisTime,
                      overallScore: selectedReport.overallScore,
                      issueCount: selectedReport.issueCount,
                      highIssues: selectedReportForChat === "current" ? dummyReport.issues.filter(i => i.severity === "high").length : Math.floor(Math.random() * 3) + 1,
                      mediumIssues: selectedReportForChat === "current" ? dummyReport.issues.filter(i => i.severity === "medium").length : Math.floor(Math.random() * 3) + 1,
                      lowIssues: selectedReportForChat === "current" ? dummyReport.issues.filter(i => i.severity === "low").length : Math.floor(Math.random() * 2) + 1
                    };
                    localStorage.setItem('selectedReportForChat', JSON.stringify(reportInfo));
                    navigate("/chat");
                  }
                }}
                className="flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Selected Report</span>
              </Button>
            </CardContent>
          </Card>

          {/* Issues Section */}
          <Card className="shadow-large mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Identified Issues ({sortedIssues.length})</CardTitle>
                <div className="flex items-center space-x-4">
                  {/* Severity Filter */}
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <div className="flex space-x-1">
                      {["all", "high", "medium", "low"].map((severity) => (
                        <Button
                          key={severity}
                          variant={selectedSeverity === severity ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedSeverity(severity)}
                          className="capitalize"
                        >
                          {severity === "all" ? "All" : severity}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Sort Options */}
                  <div className="flex items-center space-x-2">
                    <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectItem value="severity">Sort by Severity</SelectItem>
                      <SelectItem value="section">Sort by Section</SelectItem>
                      <SelectItem value="time">Sort by Time</SelectItem>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {sortedIssues.map((issue, index) => {
                const SeverityIcon = getSeverityIcon(issue.severity);
                return (
                  <div key={index} className="border border-border rounded-lg p-6 bg-card">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          issue.severity === "high" ? "bg-destructive/10" : 
                          issue.severity === "medium" ? "bg-secondary" : "bg-muted"
                        }`}>
                          <SeverityIcon className={`w-5 h-5 ${
                            issue.severity === "high" ? "text-destructive" : "text-muted-foreground"
                          }`} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-foreground">
                            {issue.title}
                          </h3>
                          <Badge variant={getSeverityColor(issue.severity)}>
                            {issue.severity.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {issue.section}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          {issue.description}
                        </p>
                        <div className="bg-secondary/50 rounded-md p-3">
                          <p className="text-sm font-medium text-foreground mb-1">
                            Recommendation:
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {issue.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {sortedIssues.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Issues Found</h3>
                  <p className="text-muted-foreground">
                    No issues match the selected filter criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Analyze Another Document</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;