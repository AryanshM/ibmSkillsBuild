import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const wellnessMessages = [
  "How can I support your wellness journey today?",
  "Remember to take breaks and hydrate!",
  "Your mental health matters. How are you feeling?",
  "Every small step towards wellness counts.",
  "Would you like personalized health insights?",
  "Mindfulness is a practice, not perfection.",
  "Your body tells you what it needs. Listen to it.",
  "What's one wellness goal you'd like to focus on today?",
];

function WellnessAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: wellnessMessages[Math.floor(Math.random() * wellnessMessages.length)],
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const responses = [
        "That's great! Self-care is important. Keep prioritizing your wellness.",
        "I appreciate you sharing that with me. How can I help?",
        "Wellness is a journey, not a destination. You're doing great!",
        "Would you like to explore more about this topic in our modules?",
        "Remember, small consistent steps lead to big changes.",
        "Your commitment to wellness is admirable. Keep going!",
        "That sounds important. Take care of yourself.",
        "I'm here to support you on your wellness journey.",
      ];

      const assistantMessage = {
        id: messages.length + 2,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    }, 800);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-2xl flex flex-col h-96 z-40 animate-slide-in border border-accent-primary/10">
          <div className="bg-gradient-sage text-white p-5 rounded-t-2xl flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Wellness Guide</h3>
              <p className="text-sm opacity-90">Here to support your journey</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-2 rounded-full transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-primary/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-accent-secondary text-white'
                      : 'bg-white text-text-primary border border-accent-primary/20'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-accent-primary/10 p-4 flex gap-2">
            <input
              type="text"
              placeholder="Share your wellness thoughts..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-white border border-accent-primary/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-secondary"
            />
            <button
              onClick={handleSendMessage}
              className="bg-accent-secondary text-white p-2 rounded-lg hover:bg-accent-secondary/80 transition"
              aria-label="Send"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-sage text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 animate-float"
        aria-label="Open wellness assistant"
        title="Wellness Assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </>
  );
}

export default WellnessAssistant;
