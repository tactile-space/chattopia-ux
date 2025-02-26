
import { useState, useRef, useEffect } from "react";
import { 
  MessageCircle, 
  Search, 
  Home, 
  Plus, 
  ArrowLeft,
  Send,
  Paperclip,
  Mic
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  content: string;
  sender: "user" | "other";
  timestamp: Date;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

const dummyChats: Chat[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "/placeholder.svg",
    lastMessage: "See you tomorrow!",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    unread: true,
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar: "/placeholder.svg",
    lastMessage: "How about lunch?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unread: false,
  },
  {
    id: "3",
    name: "Carol White",
    avatar: "/placeholder.svg",
    lastMessage: "The meeting is at 3 PM",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    unread: true,
  },
];

const dummyMessages: Message[] = [
  {
    id: "1",
    content: "Hey, how are you?",
    sender: "other",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: "2",
    content: "I'm good, thanks! How about you?",
    sender: "user",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "3",
    content: "Great! Do you want to grab coffee later?",
    sender: "other",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
];

const Index = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      const isKeyboard = window.innerHeight < window.outerHeight * 0.75;
      setIsKeyboardVisible(isKeyboard);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const ChatList = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <h1 className="text-2xl font-bold mb-4 text-indigo-900">Chats</h1>
        <div className="flex gap-2 mb-4">
          <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Random Chat
          </Button>
          <Button className="flex-1" variant="outline">
            <Home className="w-4 h-4 mr-2" />
            Enter Room
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
          <Input
            placeholder="Search chats..."
            className="pl-9 border-indigo-100 focus-visible:ring-indigo-400"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {dummyChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center p-3 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer ${
                selectedChat?.id === chat.id ? "bg-indigo-50" : ""
              }`}
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 overflow-hidden">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-indigo-900">{chat.name}</span>
                  <span className="text-xs text-indigo-500">
                    {formatTime(chat.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-indigo-600/70 truncate">
                  {chat.lastMessage}
                </p>
              </div>
              {chat.unread && (
                <div className="ml-2 h-2 w-2 rounded-full bg-indigo-500" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  const ChatView = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-indigo-50">
      <div className="flex items-center p-4 border-b bg-white/80 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedChat(null)}
          className="mr-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center flex-1">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 overflow-hidden">
            <img
              src={selectedChat?.avatar}
              alt={selectedChat?.name}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="ml-3 font-medium text-indigo-900">{selectedChat?.name}</span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 messages-container">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`message-bubble ${
                  message.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-indigo-100 text-indigo-900"
                }`}
              >
                <p>{message.content}</p>
                <div
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-indigo-100"
                      : "text-indigo-400"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className={`p-4 border-t bg-white/80 backdrop-blur-sm ${isKeyboardVisible ? 'pb-20' : ''}`}>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 border-indigo-100 focus-visible:ring-indigo-400"
          />
          <Button variant="ghost" size="icon" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
            <Mic className="h-5 w-5" />
          </Button>
          <Button 
            onClick={handleSendMessage} 
            size="icon" 
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="flex h-full">
        <div className={`${
          selectedChat ? 'hidden lg:block lg:w-1/3 lg:border-r border-indigo-100' : 'w-full'
        }`}>
          <ChatList />
        </div>
        {selectedChat && (
          <div className="w-full lg:w-2/3">
            <ChatView />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

