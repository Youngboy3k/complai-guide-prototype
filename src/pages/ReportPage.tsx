import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle, FileText, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ReportPage = () => {
  const navigate = useNavigate();

  const dummyReport = {
    title: "Compliance Analysis Report",
    documentName: "Corporate_Policy_2024.pdf",
    analysisDate: new Date().toLocaleDateString(),
    summary: "The document has been analyzed for compliance with current regulations. Several areas require attention to ensure full compliance with industry standards and regulatory requirements.",
    overallScore: 73,
    issues: [
      {
        severity: "high",
        title: "Data Retention Policy Gaps",
        description: "The current data retention policy does not specify retention periods for customer data in accordance with GDPR Article 5(1)(e).",
        section: "Section 3.2",
        recommendation: "Update policy to include specific retention periods and deletion procedures."
      },
      {
        severity: "medium",
        title: "Access Control Documentation",
        description: "Access control procedures lack detailed role-based permissions matrix.",
        section: "Section 5.1",
        recommendation: "Implement comprehensive role-based access control documentation."
      },
      {
        severity: "low",
        title: "Training Record Format",
        description: "Employee training records do not follow standardized format requirements.",
        section: "Section 7.3",
        recommendation: "Standardize training record formats to include all required fields."
      },
      {
        severity: "medium",
        title: "Incident Response Timeline",
        description: "Incident response procedures lack specific timeline requirements for notification.",
        section: "Section 4.5",
        recommendation: "Define clear timelines for incident notification and response procedures."
      }
    ]
  };

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
              <span>Analyzed on {dummyReport.analysisDate}</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {dummyReport.title}
            </h1>
          </div>

          {/* Summary Card */}
          <Card className="shadow-large mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Executive Summary</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Compliance Score:</span>
                  <Badge variant={dummyReport.overallScore >= 80 ? "default" : dummyReport.overallScore >= 60 ? "secondary" : "destructive"}>
                    {dummyReport.overallScore}%
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {dummyReport.summary}
              </p>
            </CardContent>
          </Card>

          {/* Issues Section */}
          <Card className="shadow-large mb-8">
            <CardHeader>
              <CardTitle>Identified Issues ({dummyReport.issues.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {dummyReport.issues.map((issue, index) => {
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
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate("/chat")}
              className="flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Discuss This Report</span>
            </Button>
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