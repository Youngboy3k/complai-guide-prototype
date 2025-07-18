import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Copy, Check, FileText, Calendar, Clock, MessageSquare, Sparkles } from "lucide-react";

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

  // Dummy AI responses
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
    const selectedReport = localStorage.getItem('selectedReportForChat');
    if (selectedReport) {
      try {
        const reportInfo = JSON.parse(selectedReport);
        setCurrentReport(reportInfo);
        setSelectedReportId("selected");
        setMessages([{
          id: "1",
          content: `Hello! I'm your compliance assistant. 🤖 You've selected "${reportInfo.documentName}" analyzed on ${reportInfo.analysisTime}. The document has a compliance score of ${reportInfo.overallScore}% with ${reportInfo.issueCount} issues identified. What would you like to know about this report?`,
          sender: "ai",
          timestamp: new Date()
        }]);
        localStorage.removeItem('selectedReportForChat');
        return;
      } catch (error) {
        console.error('Error parsing selected report:', error);
      }
    }

    const storedReport = localStorage.getItem('currentReport');
    if (storedReport) {
      try {
        const reportInfo = JSON.parse(storedReport);
        setCurrentReport(reportInfo);
        setSelectedReportId("current");
        setMessages([{
          id: "1",
          content: `Hello! I'm your compliance assistant. 🤖 I've reviewed "${reportInfo.documentName}" analyzed on ${reportInfo.analysisTime}. The document has a compliance score of ${reportInfo.overallScore}% with ${reportInfo.issueCount} issues identified. What would you like to know about this report?`,
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
      content: "Hello! I'm your compliance assistant. 🤖 Please select a report from the dropdown above to start discussing compliance findings. What would you like to know?",
      sender: "ai",
      timestamp: new Date()
    }]);
  };

  const handleReportChange = (reportId: string) => {
    setSelectedReportId(reportId);
    
    if ((reportId === "current" || reportId === "selected") && currentReport) {
      setMessages([{
        id: "1",
        content: `Hello! I'm your compliance assistant. 🤖 I've reviewed "${currentReport.documentName}" analyzed on ${currentReport.analysisTime}. The document has a compliance score of ${currentReport.overallScore}% with ${currentReport.issueCount} issues identified. What would you like to know about this report?`,
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

  const getActiveReport = () => {
    if (selectedReportId === "current" || selectedReportId === "selected") return currentReport;
    return availableReports.find(r => r.id === selectedReportId);
  };

  const activeReport = getActiveReport();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-hero py-16 px-8">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-large">
            <MessageSquare className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-foreground tracking-tight">
            Compliance Assistant
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Ask questions about your compliance reports and get detailed explanations from our AI assistant
          </p>
        </div>
      </div>

      <div className="px-8 -mt-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Report Selection */}
          <div className="bg-card-premium rounded-3xl border border-border/50 shadow-large p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-5">
                <div className="w-12 h-12 bg-gradient-blue-subtle rounded-2xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-foreground">Select Report to Discuss</h3>
                  <p className="text-lg text-muted-foreground">Choose which compliance report you'd like to chat about</p>
                </div>
              </div>
              <select 
                value={selectedReportId} 
                onChange={(e) => handleReportChange(e.target.value)}
                className="input-premium min-w-80 text-lg"
              >
                <option value="">Choose a report...</option>
                {currentReport && (
                  <option value={selectedReportId === "selected" ? "selected" : "current"}>
                    {currentReport.documentName} (Selected)
                  </option>
                )}
                {availableReports.map(report => (
                  <option key={report.id} value={report.id}>
                    {report.documentName}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Active Report Info */}
            {activeReport && (
              <div className="bg-gradient-blue-subtle rounded-2xl p-6 border border-primary/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-soft">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-foreground">{activeReport.documentName}</h4>
                      <div className="flex items-center space-x-6 text-base text-muted-foreground mt-1">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{activeReport.analysisDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{activeReport.analysisTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className={`px-5 py-3 rounded-2xl text-lg font-bold ${
                      activeReport.overallScore >= 80 ? "bg-green-100 text-green-700" : 
                      activeReport.overallScore >= 60 ? "bg-orange-100 text-orange-700" : 
                      "bg-red-100 text-red-700"
                    }`}>
                      {activeReport.overallScore}% Score
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold text-foreground">{activeReport.issueCount} Issues</div>
                      <div className="text-base text-muted-foreground">
                        {activeReport.highIssues}H • {activeReport.mediumIssues}M • {activeReport.lowIssues}L
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Container */}
          <div className="bg-card-premium rounded-3xl border border-border/50 shadow-large overflow-hidden" style={{ height: "70vh" }}>
            <div className="bg-gradient-blue-subtle border-b border-border/50 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-soft">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Chat with AI Assistant</h3>
                  {activeReport && (
                    <p className="text-base text-muted-foreground">{activeReport.documentName}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col h-full">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 min-h-0">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-4 ${
                      message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft ${
                      message.sender === "user" 
                        ? "bg-gradient-primary text-white" 
                        : "bg-gray-100 text-muted-foreground"
                    }`}>
                      {message.sender === "user" ? (
                        <User className="w-6 h-6" />
                      ) : (
                        <Bot className="w-6 h-6" />
                      )}
                    </div>
                    <div className={`max-w-[75%] ${
                      message.sender === "user" ? "text-right" : "text-left"
                    }`}>
                      <div className={`group relative rounded-2xl px-6 py-4 ${
                        message.sender === "user"
                          ? "bg-gradient-primary text-white"
                          : "bg-gray-50 text-foreground"
                      }`}>
                        <p className="text-base leading-relaxed break-words">{message.content}</p>
                        {message.sender === "ai" && (
                          <button
                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-200 rounded-xl"
                            onClick={() => copyMessage(message.id, message.content)}
                          >
                            {copiedMessageId === message.id ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 mt-2">
                        <p className="text-sm text-muted-foreground">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                        {copiedMessageId === message.id && (
                          <span className="text-sm text-green-600 font-semibold">Copied!</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 text-muted-foreground flex items-center justify-center shadow-soft">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div className="bg-gray-50 rounded-2xl px-6 py-4">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="bg-gradient-blue-subtle border-t border-border/50 p-6">
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about compliance issues, recommendations, or regulations..."
                    className="flex-1 input-premium text-lg"
                    disabled={isTyping}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none p-4"
                  >
                    <Send className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Questions */}
          <div className="bg-card-premium rounded-3xl border border-border/50 shadow-large p-8 mb-16">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-soft">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Quick Questions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(question)}
                  className="text-left p-5 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-soft border border-gray-200"
                >
                  <p className="text-base text-foreground font-medium">{question}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;