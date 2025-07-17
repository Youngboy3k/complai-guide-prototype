import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your compliance assistant. I've reviewed your document and I'm here to help answer any questions about the compliance report. What would you like to know?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dummy AI responses
  const dummyResponses = [
    "Based on the compliance analysis, this issue requires immediate attention due to regulatory requirements.",
    "I recommend reviewing the current policy framework and updating it to align with industry standards.",
    "The document shows good compliance in most areas, but there are a few gaps that need to be addressed.",
    "This is a common compliance issue that many organizations face. Here's what I suggest...",
    "According to the analysis, you should prioritize the high-severity issues first.",
    "The data retention policy needs to be updated to meet current GDPR requirements.",
    "I can help you understand the specific requirements for each compliance area mentioned in the report."
  ];

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
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: dummyResponses[Math.floor(Math.random() * dummyResponses.length)],
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
              Ask questions about your compliance report and get detailed explanations.
            </p>
          </div>

          {/* Chat Container */}
          <Card className="shadow-large h-[600px] flex flex-col">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-primary" />
                <span>Chat with AI Assistant</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
                       <div className={`group relative rounded-lg px-4 py-2 ${
                         message.sender === "user"
                           ? "bg-primary text-primary-foreground"
                           : "bg-secondary text-foreground"
                       }`}>
                         <p className="text-sm leading-relaxed">{message.content}</p>
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
                    <div className="bg-secondary rounded-lg px-4 py-2">
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

              {/* Input Area */}
              <div className="border-t border-border p-6">
                <div className="flex space-x-4">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about your compliance report..."
                    disabled={isTyping}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Press Enter to send • This is a demo with simulated responses
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Questions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "What are the most critical issues in my report?",
              "How can I improve my compliance score?",
              "What are the GDPR requirements mentioned?",
              "Can you explain the data retention policy gaps?"
            ].map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-left justify-start h-auto py-3 px-4"
                onClick={() => {
                  setInputValue(question);
                }}
                disabled={isTyping}
              >
                <span className="text-sm">{question}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;