import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiLoader } from 'react-icons/fi';
import { useChat } from '../../contexts/ChatContext';
import { saveChatMessages, loadChatMessages } from '../../utils/chatStorage';
import barangayData from '../../data/datasets/barangay.data.json';   
import { showCustomToast } from '../../components/Toast/CustomToast';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const systemPrompt = `Ikaw ay ang official na AI assistant ng ${barangayData.barangayInfo.name}. MAHALAGA:

1. Sumagot LANG gamit ang datos mula sa official na dataset ng barangay.
2. Kung ang tanong ay HINDI tungkol sa:
   - Mga dokumento at requirements
   - Contact information at oras ng opisina
   - Mga serbisyo ng barangay (sumbong/reklamo)
   - Mga hotline numbers
   - FAQs na nasa dataset
   DAPAT sumagot ng: "Pasensya po, pero limitado lang po ang aking kaalaman sa mga official na datos ng barangay. Para sa tanong na iyan, mas mainam po na direktang makipag-ugnayan sa barangay office."

3. BAWAL gumawa o mag-imbento ng sariling sagot.
4. Kung walang exact na sagot sa dataset, i-redirect sa barangay office.

DATASET NG BARANGAY:
${JSON.stringify(barangayData, null, 2)}`;

const formatMessage = (text) => {
  // Format lists (numbered and bulleted)
  text = text.replace(/^\d+\.\s/gm, (match) => `<div class="pl-4 py-0.5">${match}</div>`);
  text = text.replace(/^[-•]\s/gm, (match) => `<div class="pl-4 py-0.5">${match}</div>`);

  // Format important sections
  text = text.replace(
    /(MAHALAGA|PAALALA|NOTE|TANDAAN):(.*?)(\n|$)/gi,
    '<div class="bg-red-50 p-2 rounded-lg border border-red-200 my-2"><span class="font-semibold text-red-700">$1:</span>$2</div>'
  );

  // Format section headers
  text = text.replace(
    /^(.*?:)(\n|$)/gm,
    '<div class="font-semibold text-gray-900 mt-2 mb-1">$1</div>'
  );

  // Convert newlines to breaks
  text = text.replace(/\n/g, '<br />');

  return text;
};

const ChatbotAssistant = ({ isWidget = false, onClose }) => {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Initialize with saved messages or welcome message
  const [messages, setMessages] = useState(() => {
    const savedMessages = loadChatMessages();
    return savedMessages.length > 0 ? savedMessages : [{
      id: 1,
      text: "👋 Magandang araw! Ako ang inyong Chatbot Assistant ng Barangay Santol. Paano ko po kayo matutulungan ngayong araw?",
      sender: "bot",
      timestamp: new Date(),
    }];
  });

  // Save messages whenever they change
  useEffect(() => {
    saveChatMessages(messages);
  }, [messages]);

  const quickLinks = [
    {
      label: "📝 Available na Dokumento",
      value: "Ano ang mga available na dokumento sa barangay at requirements nito?"
    },
    {
      label: "⏰ Oras ng Opisina",
      value: "Ano po ang office hours ng barangay?"
    },
    {
      label: "📞 Emergency Hotlines",
      value: "Ano ang mga emergency hotline numbers ng barangay?"
    },
    {
      label: "❓ Sumbong/Reklamo",
      value: "Paano po mag-report ng reklamo sa barangay?"
    },
    {
      label: "🎯 Mission & Vision",
      value: "Ano po ang mission at vision ng Barangay Santol?"
    }
  ];

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

  const handleQuickLinkClick = (value) => {
    setInput(value);
    handleSendMessage({ preventDefault: () => {} }, value);
  };

  const handleSendMessage = async (e, quickValue = null) => {
    e.preventDefault();
    const messageToSend = quickValue || input;
    if (!messageToSend.trim() || isTyping) return;

    const userMessage = {
      id: messages.length + 1,
      text: messageToSend,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await callGroqAPI(messageToSend.trim());
      
      const botMessage = {
        id: messages.length + 2,
        text: response,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      showCustomToast("Sorry, I'm having trouble connecting right now. Please try again later." ,'error');
      console.error('Error getting response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = (message) => (
    <div
      key={message.id}
      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`px-4 py-2 rounded-xl max-w-[85%] ${
          message.sender === "user"
            ? "bg-red-900 text-white"
            : "bg-white border border-gray-100"
        }`}
      >
        <div 
          className="text-sm"
          dangerouslySetInnerHTML={{ 
            __html: message.sender === "bot" ? formatMessage(message.text) : message.text 
          }}
        />
        <div 
          className={`text-[10px] mt-1 ${
            message.sender === "user" ? "text-white/70" : "text-gray-400"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Welcome Message */}
          {messages.length === 1 && (
            <div className="space-y-4">
              {/* Quick Links Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                {quickLinks.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickLinkClick(link.value)}
                    className="text-left px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-red-500 hover:bg-red-50/50 transition-colors"
                  >
                    <span className="text-sm text-gray-900">{link.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          {messages.map(renderMessage)}
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 px-4 py-2 rounded-xl">
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

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Mag-type ng mensahe..."
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
              isTyping || !input.trim()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-red-900 text-white hover:bg-red-800 hover:shadow-md hover:scale-105 cursor-pointer'
            }`}
          >
            <span className="hidden sm:inline">Ipadala</span>
            <FiSend className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotAssistant;
