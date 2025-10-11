import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiLoader, FiTrash2, FiHelpCircle, FiFileText } from 'react-icons/fi';
import { toast } from 'react-toastify';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const systemPrompt = `Ikaw ay isang AI assistant para sa Barangay Santol sa Balagtas, Bulacan. Ang iyong tungkulin ay tumulong sa mga residente sa kanilang mga katanungan tungkol sa mga serbisyo, dokumento, at pamamaraan ng barangay. Dapat kang maging matulungin, propesyonal, at malinaw sa iyong mga sagot. Dapat ay may kaalaman ka rin sa mga karaniwang serbisyo ng barangay tulad ng:

1. Mga kahilingan sa dokumento (barangay clearance, certificates, atbp.)
2. Pag-uulat ng mga insidente o alalahanin
3. Pangunahing impormasyon tungkol sa mga programa at serbisyo ng barangay
4. Mga alituntunin para sa iba't ibang pamamaraan ng barangay

Panatilihin ang propesyonal at matulunging tono, at kung hindi ka sigurado sa mga partikular na detalye, iayon ang mga user na bumisita o makipag-ugnayan sa barangay office ng direkta. 

MAHALAGA: Palaging sumagot sa Tagalog maliban kung ang user ay gumamit ng Ingles. Gumamit ng simple at madaling maintindihang Tagalog. Maging pormal pero friendly sa pakikipag-usap.`;

const ChatbotAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Magandang araw! Ako ang inyong Chatbot Assistant ng Barangay Santol. Paano ko po kayo matutulungan ngayong araw?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callGroqAPI = async (userMessage) => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            ...messages.map(msg => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text
            })),
            {
              role: "user",
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = {
      id: messages.length + 1,
      text: input.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await callGroqAPI(input.trim());
      
      const botMessage = {
        id: messages.length + 2,
        text: response,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast.error("Sorry, I'm having trouble connecting right now. Please try again later.");
      console.error('Error getting response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    if (window.confirm('Sigurado po ba kayong gusto ninyong burahin ang chat history?')) {
      setMessages([{
        id: 1,
        text: "Magandang araw! Ako ang inyong Chatbot Assistant ng Barangay Santol. Paano ko po kayo matutulungan ngayong araw?",
        sender: "bot",
        timestamp: new Date(),
      }]);
    }
  };

  const handleQuickAction = (action) => {
    let message = "";
    switch (action) {
      case "certificates":
        message = "Ano-ano po ang mga sertipiko na pwedeng makuha sa barangay at ano ang mga requirements?";
        break;
      case "faq":
        message = "Ano po ang mga karaniwang serbisyo na inaalok ng barangay?";
        break;
      default:
        return;
    }
    
    const userMessage = {
      id: messages.length + 1,
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    callGroqAPI(message)
      .then(response => {
        const botMessage = {
          id: messages.length + 2,
          text: response,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
      })
      .catch(error => {
        toast.error("Sorry, I'm having trouble connecting right now. Please try again later.");
        console.error('Error getting response:', error);
      })
      .finally(() => {
        setIsTyping(false);
      });
  };

  const QuickActionBubbles = () => (
    <div className="flex flex-col space-y-2 px-4 mb-4">
      <div className="text-xs text-gray-500 text-center mb-2">Suggested Questions</div>
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => handleQuickAction('certificates')}
          className="bg-white px-4 py-2 rounded-full text-xs border border-gray-200 hover:border-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/5 transition-colors text-gray-700"
        >
          🗂️ Mga Available na Sertipiko
        </button>
        <button
          onClick={() => handleQuickAction('faq')}
          className="bg-white px-4 py-2 rounded-full text-xs border border-gray-200 hover:border-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/5 transition-colors text-gray-700"
        >
          ❓ Mga Madalas na Tanong
        </button>
        <button
          onClick={() => handleQuickAction('blotter')}
          className="bg-white px-4 py-2 rounded-full text-xs border border-gray-200 hover:border-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/5 transition-colors text-gray-700"
        >
          📝 Paano Mag-file ng Blotter
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto h-[calc(100vh-1rem)]">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 h-full flex flex-col">
          {/* Header */}
          <div className="bg-[var(--color-primary)] p-3 sm:p-4 flex justify-between items-start">
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                Chatbot Assistant ng Barangay
              </h1>
              <p className="text-white/80 text-xs sm:text-sm mt-1">
                Magtanong tungkol sa mga serbisyo at pamamaraan ng barangay
              </p>
            </div>
            <button
              onClick={clearChat}
              className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              title="Clear chat"
            >
              <FiTrash2 className="text-white/80 hover:text-white w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50/50">
            <div className="space-y-3 sm:space-y-4">
              {messages.length === 1 && <QuickActionBubbles />}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl max-w-[90%] sm:max-w-[85%] shadow-sm ${
                      message.sender === "user"
                        ? "bg-[var(--color-secondary)] text-white ml-8 sm:ml-12"
                        : "bg-white text-gray-800 border border-gray-100 mr-8 sm:mr-12"
                    }`}
                  >
                    <div className="text-xs sm:text-sm whitespace-pre-wrap">{message.text}</div>
                    <div 
                      className={`text-[9px] sm:text-[10px] mt-1 ${
                        message.sender === "user" 
                          ? "text-white/70" 
                          : "text-gray-400"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl shadow-sm border border-gray-100 mr-12">
                    <div className="flex items-center gap-2">
                      <FiLoader className="w-4 h-4 animate-spin text-gray-400" />
                      <span className="text-sm text-gray-500">Typing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="border-t bg-white p-2 sm:p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Mag-type ng mensahe..."
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={isTyping || !input.trim()}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isTyping || !input.trim()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary)]/90'
                }`}
              >
                <span className="hidden sm:inline">Ipadala</span>
                <FiSend className={`w-4 h-4 ${isTyping ? 'animate-pulse' : ''}`} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotAssistant;
 