export const saveChatMessages = (messages) => {
  try {
    const messagesWithStringDates = messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp.toISOString() // Convert Date to string before saving
    }));
    localStorage.setItem('chat_messages', JSON.stringify(messagesWithStringDates));
  } catch (error) {
    console.error('Error saving chat messages:', error);
  }
};

export const loadChatMessages = () => {
  try {
    const saved = localStorage.getItem('chat_messages');
    if (!saved) return [];
    
    const messages = JSON.parse(saved);
    return messages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp) // Convert string back to Date object
    }));
  } catch (error) {
    console.error('Error loading chat messages:', error);
    return [];
  }
};
