import React, { useState, useEffect, useRef } from 'react';
import { FiMessageSquare, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useChat } from '../../contexts/ChatContext';
import ChatbotAssistant from './ChatbotAssistant';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
 import { saveChatMessages, loadChatMessages } from '../../utils/chatStorage';

const ChatbotWidget = () => {
  const { 
    isOpen, setIsOpen,
    isMinimized, setIsMinimized,
  } = useChat();
  
  const [showEndChatModal, setShowEndChatModal] = useState(false);
  const [messages, setMessages] = useState(() => loadChatMessages());
  const [isOverlapped, setIsOverlapped] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const chatContainerRef = useRef(null);
  const location = useLocation();
  const { currentUser } = useUser();

  // Only show for residents and hide in specific routes
  const shouldShow = currentUser?.type === 'residence' && 
    !location.pathname.includes('/resident/chatbot');

  useEffect(() => {
    // Only minimize on route change, don't reset messages
    setIsMinimized(true);
  }, [location.pathname]);

  useEffect(() => {
    // Handle clicks outside chat window
    const handleClickOutside = (event) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target)) {
        if (window.innerWidth < 768) { 
          setIsMinimized(true);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMinimized) {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMinimized]);

  // Update localStorage when messages change
  useEffect(() => {
    saveChatMessages(messages);
  }, [messages]);

  // Effect to detect overlapping modals or dropdowns
  useEffect(() => {
    const checkOverlap = () => {
      // Check for modals, dropdowns, or other overlaying elements
      const overlappingElements = document.querySelectorAll('.modal-overlay, .modal, [role="listbox"], [role="dialog"]');
      const hasOverlap = overlappingElements.length > 0;
      
      if (hasOverlap) {
        setIsMinimized(true);
        setIsBlocked(true);
      } else {
        setIsBlocked(false);
      }
    };

    //   mutation observer
    const observer = new MutationObserver(checkOverlap);
    
    // Start observing with appropriate options
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    // Initial check
    checkOverlap();

    // Cleanup
    return () => observer.disconnect();
  }, []);


  function handleClose() {

    if (window.innerWidth < 768 && !isMinimized) {
      setIsMinimized(true);

      setTimeout(() => {
        setShowEndChatModal(true);
      }, 250);
      return;
    }
    // otherwise show confirmation immediately
    setShowEndChatModal(true);
  }

  // End chat and reset everything
  const handleEndChat = () => {
    saveChatMessages([]); // Clear saved messages
    setMessages([]);
    setIsOpen(false);
    setIsMinimized(false);
    setShowEndChatModal(false);
  };


  const getModalZIndex = () => {

    return 999;
  };

  // Initialize messages with welcome message and FAQs
  const initialMessage = {
    id: 1,
    text: "Magandang araw! Ako ang inyong Chatbot Assistant ng Barangay Santol. Paano ko po kayo matutulungan ngayong araw?",
    sender: "bot",
    timestamp: new Date(),
  };

  // Set initial messages when opening chat
  const handleOpenChat = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([initialMessage]);
    }
  };

  // Handle mobile click outside
  const handleBackdropClick = () => {
    if (window.innerWidth < 768) {
      setIsMinimized(true);
    }
  };

  // Handle chat button click
  const handleChatButtonClick = () => {
    if (isMinimized) {
      setIsMinimized(false);
      setIsOpen(true);
    } else {
      setIsOpen(true);
      if (messages.length === 0) {
        setMessages([initialMessage]);
      }
    }
  };

  if (!shouldShow || isBlocked) return null;

  return (
    <>
      {/* Only show chat button when not overlapped */}
      {(!isOpen || isMinimized) && !isBlocked && (
        <button
          onClick={handleChatButtonClick}
          className="fixed bottom-6 right-6 z-[999] bg-red-900 text-white rounded-full shadow-lg hover:bg-red-800 transition-all duration-200 flex items-center gap-3 group px-5 py-4"
        >
          <FiMessageSquare className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-base">
            {isMinimized ? 'Continue Chat' : 'Chat with Assistant'}
          </span>
        </button>
      )}

      {/* Only show chat window when not overlapped */}
      {!isBlocked && (
        <div
          ref={chatContainerRef}
          className={`
            fixed z-[998] transition-all duration-300 transform
            ${isOpen && !isMinimized ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}
            bottom-0 right-0 w-full h-[100dvh]
            md:bottom-4 md:right-4 md:w-[400px] md:h-[600px] 
            lg:w-[450px]
          `}
          style={{ maxHeight: 'calc(100vh - 2rem)' }}
        >
          <div className="h-full flex flex-col bg-white overflow-hidden md:shadow-2xl md:rounded-2xl md:border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between bg-red-900 text-white px-4 py-3 rounded-t-xl">
              <span className="text-sm font-medium flex items-center gap-2">
                <FiMessageSquare className="w-4 h-4" />
                Chat with Assistant
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <FiChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClose}
                  className="p-1.5 hover:bg-white/10 rounded-lg"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden">
              <ChatbotAssistant 
                isWidget={true} 
                onClose={handleClose}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modified Modal Component */}
      <div style={{ position: 'relative', zIndex: getModalZIndex() }}>
        <ConfirmationModal
          isOpen={showEndChatModal}
          onClose={() => setShowEndChatModal(false)}
          onConfirm={handleEndChat}
          title="End Chat"
          message="Are you sure you want to end this chat? This will clear your conversation history."
          confirmText="End Chat"
          cancelText="Keep Chatting"
          type="warning"
        />
      </div>

      {/* Mobile Backdrop with lower z-index */}
      {isOpen && !isMinimized && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] md:hidden"
          onClick={handleBackdropClick}
        />
      )}
    </>
  );
};

export default ChatbotWidget;
