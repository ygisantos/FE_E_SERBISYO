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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-[var(--color-primary)] p-4 flex justify-between items-start">
            <div>
              <h1 className="text-xl font-semibold text-white flex items-center gap-2">
               Chatbot Assistant ng Barangay
              </h1>
              <p className="text-white/80 text-sm mt-1">
                Magtanong tungkol sa mga serbisyo at pamamaraan ng barangay
              </p>
            </div>
            <button
              onClick={clearChat}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              title="Clear chat"
            >
              <FiTrash2 className="text-white/80 hover:text-white w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-[calc(100vh-16rem)] overflow-y-auto p-4 bg-gray-50/50">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl max-w-[85%] shadow-sm ${
                      message.sender === "user"
                        ? "bg-[var(--color-secondary)] text-white ml-12"
                        : "bg-white text-gray-800 border border-gray-100 mr-12"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                    <div 
                      className={`text-[10px] mt-1 ${
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
          <div className="border-t bg-white p-4">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Mag-type ng mensahe..."
                className="flex-1 px-4 py-3 bg- gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent text-sm"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={isTyping || !input.trim()}
                className={`px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                  isTyping || !input.trim()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary)]/90'
                }`}
              >
                <span>Ipadala</span>
                <FiSend className={`w-4 h-4 ${isTyping ? 'animate-pulse' : ''}`} />
              </button>
            </form>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={() => handleQuickAction('certificates')}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-[var(--color-secondary)] hover:shadow-md transition-all duration-200 flex items-start gap-4"
          >
            <div className="p-2 rounded-lg bg-[var(--color-secondary)]/10">
              <FiFileText className="w-6 h-6 text-[var(--color-secondary)]" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900">Mga Sertipiko</h3>
              <p className="text-sm text-gray-600 mt-1">
                Alamin ang mga available na sertipiko at requirements
              </p>
            </div>
          </button>
          <button 
            onClick={() => handleQuickAction('faq')}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-[var(--color-secondary)] hover:shadow-md transition-all duration-200 flex items-start gap-4"
          >
            <div className="p-2 rounded-lg bg-[var(--color-secondary)]/10">
              <FiHelpCircle className="w-6 h-6 text-[var(--color-secondary)]" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900">Mga Madalas na Tanong</h3>
              <p className="text-sm text-gray-600 mt-1">
                Mga karaniwang tanong tungkol sa serbisyo ng barangay
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotAssistant;
