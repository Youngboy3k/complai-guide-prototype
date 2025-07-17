import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Copy, Check, FileText, Calendar, Clock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ReportInfo {
  documentName: string;
  analysisDate: string;
  analysisTime: string;
  overallScore: number;
  issueCount: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
}

// Simple dropdown component
const Select = ({ value, onValueChange, children, placeholder }: { 
  value: string; 
  onValueChange: (value: string) => void; 
  children: React.ReactNode;
  placeholder?: string;
}) => (
  <select 
    value={value} 
    onChange={(e) => onValueChange(e.target.value)} 
    className="px-3 py-2 border border-border rounded-md text-sm bg-background min-w-48"
  >
    {placeholder && <option value="">{placeholder}</option>}
    {children}
  </select>
);

const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <option value={value}>{children}</option>
);

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [currentReport, setCurrentReport] = useState<ReportInfo | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock available reports
  const availableReports = [
    {
      id: "report1",
      documentName: "Corporate_Privacy_Policy.pdf",
      analysisDate: "7/17/2025",
      analysisTime: "7/17/2025 at 2:30 PM",
      overallScore: 78,
      issueCount: 6,
      highIssues: 2,
      mediumIssues: 3,
      lowIssues: 1
    },
    {
      id: "report2", 
      documentName: "Q3_Financial_Report.pdf",
      analysisDate: "7/15/2025",
      analysisTime: "7/15/2025 at 10:15 AM",
      overallScore: 85,
      issueCount: 4,
      highIssues: 1,
      mediumIssues: 2,
      lowIssues: 1
    },
    {
      id: "report3",
      documentName: "Employee_Handbook_2024.docx",
      analysisDate: "7/12/2025", 
      analysisTime: "7/12/2025 at 4:45 PM",
      overallScore: 72,
      issueCount: 7,
      highIssues: 3,
      mediumIssues: 2,
      lowIssues: 2
    }
  ];

  // Dummy AI responses based on current report
  const getDummyResponse = (reportName: string) => {
    const baseResponses = [
      `Based on the compliance analysis of ${reportName}, this issue requires immediate attention due to regulatory requirements.`,
      `I recommend reviewing the current policy framework in ${reportName} and updating it to align with industry standards.`,
      `The document ${reportName} shows good compliance in most areas, but there are a few gaps that need to be addressed.`,
      `This is a common compliance issue that many organizations face with documents like ${reportName}. Here's what I suggest...`,
      `According to the analysis of ${reportName}, you should prioritize the high-severity issues first.`,
      `The data retention policy in ${reportName} needs to be updated to meet current GDPR requirements.`,
      `I can help you understand the specific requirements for each compliance area mentioned in ${reportName}.`,
      `Let me break down the specific sections that need attention in ${reportName}.`,
      `The risk assessment shows that implementing these changes in ${reportName} will significantly improve your compliance score.`,
      `Would you like me to explain the regulatory framework that applies to the issues found in ${reportName}?`
    ];
    return baseResponses[Math.floor(Math.random() * baseResponses.length)];
  };

  // Load current report from localStorage on mount
  useEffect(() => {
    // Check for specifically selected report first
    const selectedReport = localStorage.getItem('selectedReportForChat');
    if (selectedReport) {
      try {
        const reportInfo = JSON.parse(selectedReport);
        setCurrentReport(reportInfo);
        setSelectedReportId("selected");
        setMessages([{
          id: "1",
          content: `Hello! I'm your compliance assistant. You've selected "${reportInfo.documentName}" analyzed on ${reportInfo.analysisTime}. The document has a compliance score of ${reportInfo.overallScore}% with ${reportInfo.issueCount} issues identified. What would you like to know about this report?`,
          sender: "ai",
          timestamp: new Date()
        }]);
        // Clear the selected report from storage after loading
        localStorage.removeItem('selectedReportForChat');
        return;
      } catch (error) {
        console.error('Error parsing selected report:', error);
      }
    }

    // Fallback to current report
    const storedReport = localStorage.getItem('currentReport');
    if (storedReport) {
      try {
        const reportInfo = JSON.parse(storedReport);
        setCurrentReport(reportInfo);
        setSelectedReportId("current");
        setMessages([{
          id: "1",
          content: `Hello! I'm your compliance assistant. I've reviewed "${reportInfo.documentName}" analyzed on ${reportInfo.analysisTime}. The document has a compliance score of ${reportInfo.overallScore}% with ${reportInfo.issueCount} issues identified. What would you like to know about this report?`,
          sender: "ai",
          timestamp: new Date()
        }]);
      } catch (error) {
        console.error('Error parsing current report:', error);
        setDefaultMessage();
      }
    } else {
      setDefaultMessage();
    }
  }, []);

  const setDefaultMessage = () => {
    setMessages([{
      id: "1",
      content: "Hello! I'm your compliance assistant. Please select a report from the dropdown above to start discussing compliance findings. What would you like to know?",
      sender: "ai",
      timestamp: new Date()
    }]);
  };

  const handleReportChange = (reportId: string) => {
    setSelectedReportId(reportId);
    
    if ((reportId === "current" || reportId === "selected") && currentReport) {
      setMessages([{
        id: "1",
        content: `Hello! I'm your compliance assistant. I've reviewed "${currentReport.documentName}" analyzed on ${currentReport.analysisTime}. The document has a compliance score of ${currentReport.overallScore}% with ${currentReport.issueCount} issues identified. What would you like to know about this report?`,
        sender: "ai",
        timestamp: new Date()
      }]);
    } else if (reportId) {
      const selectedReport = availableReports.find(r => r.id === reportId);
      if (selectedReport) {
        setMessages([{
          id: "1",
          content: `Hello! I've switched to discussing "${selectedReport.documentName}" analyzed on ${selectedReport.analysisTime}. This document has a compliance score of ${selectedReport.overallScore}% with ${selectedReport.issueCount} issues identified (${selectedReport.highIssues} high, ${selectedReport.mediumIssues} medium, ${selectedReport.lowIssues} low severity). What would you like to know about this report?`,
          sender: "ai",
          timestamp: new Date()
        }]);
      }
    } else {
      setDefaultMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const activeReport = selectedReportId === "current" ? currentReport : 
                          availableReports.find(r => r.id === selectedReportId);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: activeReport ? getDummyResponse(activeReport.documentName) : 
                "Please select a report first to get specific compliance advice.",
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyMessage = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const quickQuestions = [
    "What are the most critical issues in this report?",
    "How can I improve the compliance score?",
    "What are the GDPR requirements mentioned?",
    "Can you explain the high-severity issues?",
    "What should be my priority for fixing these issues?",
    "Are there any regulatory deadlines I should know about?"
  ];

  // Get current active report for display
  const getActiveReport = () => {
    if (selectedReportId === "current" || selectedReportId === "selected") return currentReport;
    return availableReports.find(r => r.id === selectedReportId);
  };

  const activeReport = getActiveReport();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Compliance Assistant
            </h1>
            <p className="text-muted-foreground">
              Ask questions about your compliance reports and get detailed explanations.
            </p>
          </div>

          {/* Report Selection */}
          <Card className="shadow-medium mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-medium text-foreground">Select Report to Discuss</h3>
                    <p className="text-sm text-muted-foreground">Choose which compliance report you'd like to chat about</p>
                  </div>
                </div>
                <Select 
                  value={selectedReportId} 
                  onValueChange={handleReportChange}
                  placeholder="Choose a report..."
                >
                  {currentReport && (
                    <SelectItem value={selectedReportId === "selected" ? "selected" : "current"}>
                      {currentReport.documentName} (Selected)
                    </SelectItem>
                  )}
                  {availableReports.map(report => (
                    <SelectItem key={report.id} value={report.id}>
                      {report.documentName}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              
              {/* Active Report Info */}
              {activeReport && (
                <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{activeReport.documentName}</h4>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{activeReport.analysisDate}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{activeReport.analysisTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={activeReport.overallScore >= 80 ? "default" : activeReport.overallScore >= 60 ? "secondary" : "destructive"}>
                        {activeReport.overallScore}% Score
                      </Badge>
                      <div className="text-right text-sm">
                        <div className="font-medium text-foreground">{activeReport.issueCount} Issues</div>
                        <div className="text-xs text-muted-foreground">
                          {activeReport.highIssues}H • {activeReport.mediumIssues}M • {activeReport.lowIssues}L
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Container */}
          <Card className="shadow-large">
            <CardHeader className="border-b border-border flex-shrink-0">
              <CardTitle className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-primary" />
                <span>Chat with AI Assistant</span>
                {activeReport && (
                  <span className="text-sm font-normal text-muted-foreground">
                    • {activeReport.documentName}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0 flex flex-col" style={{ height: "60vh" }}>
              {/* Messages Area - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      {message.sender === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div className={`max-w-[70%] ${
                      message.sender === "user" ? "text-right" : "text-left"
                    }`}>
                      <div className={`group relative rounded-lg px-4 py-3 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground"
                      }`}>
                        <p className="text-sm leading-relaxed break-words">{message.content}</p>
                        {message.sender === "ai" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                            onClick={() => copyMessage(message.id, message.content)}
                          >
                            {copiedMessageId === message.id ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                        {copiedMessageId === message.id && (
                          <span className="text-xs text-green-600">Copied!</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-secondary rounded-lg px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area - Fixed at bottom */}
              <div className="border-t border-border p-6 flex-shrink-0 bg-background">
                <div className="flex space-x-4">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={activeReport ? `Ask about ${activeReport.documentName}...` : "Select a report first..."}
                    disabled={isTyping || !selectedReportId}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping || !selectedReportId}
                    className="flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Press Enter to send • {selectedReportId ? "AI responses tailored to selected report" : "Select a report to start chatting"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Questions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-left justify-start h-auto py-3 px-4 text-wrap"
                onClick={() => {
                  setInputValue(question);
                }}
                disabled={isTyping || !selectedReportId}
              >
                <span className="text-sm text-left">{question}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;