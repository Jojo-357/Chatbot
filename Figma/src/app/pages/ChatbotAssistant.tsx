import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const sampleResponses = [
  "Based on your symptoms, I recommend scheduling an appointment with your primary care physician. In the meantime, ensure you stay hydrated and get adequate rest.",
  "These symptoms could indicate several conditions. I suggest monitoring them for the next 24 hours. If they worsen or you develop a fever, please seek immediate medical attention.",
  "For mild symptoms like these, over-the-counter medication may help. However, if symptoms persist for more than 3 days, please consult a healthcare provider.",
  "This is a common concern. I recommend keeping a symptom diary and noting any triggers. Your doctor can use this information for a more accurate diagnosis.",
  "Based on what you've described, this appears to be a minor issue. However, if you're concerned, it's always best to consult with a medical professional for peace of mind.",
];

export function ChatbotAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your VitaNexis AI Health Assistant. You can ask me about symptoms, general health queries, or medical information. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: sampleResponses[Math.floor(Math.random() * sampleResponses.length)],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
          AI Chatbot Assistant
        </h1>
        <p className="text-lg text-gray-600">
          Describe your symptoms or ask health-related questions
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <strong>Disclaimer:</strong> This AI assistant provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-cyan-500 to-teal-500"
                    : "bg-gradient-to-br from-teal-500 to-cyan-600"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Message Content */}
              <div
                className={`flex-1 max-w-[80%] ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block px-4 py-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1 px-2">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your symptoms or health questions here..."
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="mt-4 bg-white rounded-xl shadow-md p-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Quick Questions:</p>
        <div className="flex flex-wrap gap-2">
          {[
            "I have a headache and fever",
            "What are symptoms of flu?",
            "Home remedies for cold",
            "When should I see a doctor?",
          ].map((question) => (
            <button
              key={question}
              onClick={() => setInput(question)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}