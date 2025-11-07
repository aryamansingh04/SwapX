import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Send, 
  Paperclip, 
  Search, 
  MoreVertical,
  MessageCircle,
  Phone,
  Plus,
  Lock,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  PhoneOff,
  Archive,
  ArchiveRestore,
  Bell,
  BellOff,
  Trash2,
  Check,
  CheckCheck,
  Copy,
  Forward,
  Reply,
  Star,
  Smile,
  Clock,
  UserPlus,
  UserCheck,
  UserX
} from "lucide-react";
import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Layout from "@/components/Layout";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  timestamp: Date;
  isOwn: boolean;
  status?: "sending" | "sent" | "delivered" | "read";
  isStarred?: boolean;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  lastSeen?: string;
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  isTyping?: boolean;
  connectionStatus?: "connected" | "pending-sent" | "pending-received" | "not-connected";
  messages: ChatMessage[];
}

interface CallHistory {
  id: string;
  chatId: string;
  name: string;
  avatar: string;
  type: "incoming" | "outgoing" | "missed";
  date: string;
  time: string;
  duration: string;
}

const mockChats: Chat[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    lastMessage: "Hi! Ready for our React session?",
    lastMessageTime: "10:30",
    lastSeen: "Just now",
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isTyping: false,
    connectionStatus: "connected",
    messages: [
      { 
        id: "1", 
        sender: "Sarah Johnson", 
        text: "Hi! Ready for our React session?", 
        time: "10:30", 
        timestamp: new Date(Date.now() - 300000),
        isOwn: false 
      },
      { 
        id: "2", 
        sender: "You", 
        text: "Yes! Looking forward to it", 
        time: "10:32", 
        timestamp: new Date(Date.now() - 180000),
        isOwn: true,
        status: "read"
      },
      { 
        id: "3", 
        sender: "Sarah Johnson", 
        text: "Great! I'll share my screen in 5 mins", 
        time: "10:33", 
        timestamp: new Date(Date.now() - 120000),
        isOwn: false 
      },
    ]
  },
  {
    id: "2",
    name: "Alex Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    lastMessage: "Thanks for the Python help!",
    lastMessageTime: "09:15",
    lastSeen: "2 minutes ago",
    unreadCount: 2,
    isPinned: false,
    isMuted: false,
    isTyping: false,
    connectionStatus: "connected",
    messages: [
      { 
        id: "1", 
        sender: "Alex Chen", 
        text: "Hey, can you help me with Python?", 
        time: "09:00", 
        timestamp: new Date(Date.now() - 3600000),
        isOwn: false 
      },
      { 
        id: "2", 
        sender: "You", 
        text: "Of course! What do you need?", 
        time: "09:05", 
        timestamp: new Date(Date.now() - 3300000),
        isOwn: true,
        status: "delivered"
      },
      { 
        id: "3", 
        sender: "Alex Chen", 
        text: "Thanks for the Python help!", 
        time: "09:15", 
        timestamp: new Date(Date.now() - 2700000),
        isOwn: false 
      },
    ]
  },
  {
    id: "3",
    name: "Maya Patel",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
    lastMessage: "Let's schedule a session",
    lastMessageTime: "Yesterday",
    lastSeen: "Yesterday at 8:30 PM",
    unreadCount: 0,
    isPinned: true,
    isMuted: false,
    isTyping: false,
    connectionStatus: "pending-received",
    messages: [
      { 
        id: "1", 
        sender: "Maya Patel", 
        text: "Hi! I'd love to learn Data Science", 
        time: "Yesterday", 
        timestamp: new Date(Date.now() - 86400000),
        isOwn: false 
      },
      { 
        id: "2", 
        sender: "You", 
        text: "Great! Let's schedule a session", 
        time: "Yesterday", 
        timestamp: new Date(Date.now() - 86000000),
        isOwn: true,
        status: "read"
      },
    ]
  },
  {
    id: "4",
    name: "Jordan Taylor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    lastMessage: "Thanks for the mobile dev tips!",
    lastMessageTime: "2 days ago",
    lastSeen: "2 days ago",
    unreadCount: 0,
    isPinned: false,
    isMuted: true,
    isArchived: true,
    isTyping: false,
    connectionStatus: "connected",
    messages: [
      { 
        id: "1", 
        sender: "Jordan Taylor", 
        text: "Can you teach me React Native?", 
        time: "2 days ago", 
        timestamp: new Date(Date.now() - 172800000),
        isOwn: false 
      },
      { 
        id: "2", 
        sender: "You", 
        text: "Absolutely! Here are some tips...", 
        time: "2 days ago", 
        timestamp: new Date(Date.now() - 172700000),
        isOwn: true,
        status: "read"
      },
      { 
        id: "3", 
        sender: "Jordan Taylor", 
        text: "Thanks for the mobile dev tips!", 
        time: "2 days ago", 
        timestamp: new Date(Date.now() - 172600000),
        isOwn: false 
      },
    ]
  },
];

const Chat = () => {
  const { connectionId } = useParams<{ connectionId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(connectionId || null);
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [showCallHistory, setShowCallHistory] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [newChatAvatar, setNewChatAvatar] = useState("");
  
  // Mock call history data
  const [callHistory] = useState<CallHistory[]>([
    {
      id: "1",
      chatId: "1",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      type: "outgoing",
      date: "2024-01-15",
      time: "14:30",
      duration: "15:32"
    },
    {
      id: "2",
      chatId: "2",
      name: "Alex Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      type: "incoming",
      date: "2024-01-14",
      time: "10:15",
      duration: "08:45"
    },
    {
      id: "3",
      chatId: "3",
      name: "Maya Patel",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
      type: "missed",
      date: "2024-01-13",
      time: "16:20",
      duration: "—"
    },
    {
      id: "4",
      chatId: "1",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      type: "incoming",
      date: "2024-01-12",
      time: "09:00",
      duration: "22:10"
    },
    {
      id: "5",
      chatId: "2",
      name: "Alex Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      type: "outgoing",
      date: "2024-01-11",
      time: "11:30",
      duration: "05:20"
    },
  ]);

  // Sync selectedChatId with URL params and clear unread count
  useEffect(() => {
    if (connectionId) {
      setSelectedChatId(connectionId);
      // Clear unread count when chat is opened via URL
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === connectionId
            ? { ...chat, unreadCount: 0 }
            : chat
        )
      );
    } else {
      setSelectedChatId(null);
    }
  }, [connectionId]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const selectedChat = chats.find(chat => chat.id === selectedChatId);
  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArchiveFilter = showArchived ? chat.isArchived : !chat.isArchived;
    return matchesSearch && matchesArchiveFilter;
  });

  // Calculate total unread count from non-archived chats
  const totalUnreadCount = chats
    .filter(chat => !chat.isArchived)
    .reduce((total, chat) => total + chat.unreadCount, 0);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages]);

  // Helper function to format date separators
  const formatDateSeparator = (date: Date) => {
    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "MMMM d, yyyy");
    }
  };

  // Helper function to get message status icon
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "sending":
        return <Clock className="h-3 w-3" />;
      case "sent":
        return <Check className="h-3 w-3" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return <CheckCheck className="h-3 w-3" />;
    }
  };

  // Helper function to format message time
  const formatMessageTime = (timestamp: Date) => {
    return format(timestamp, "h:mm a");
  };

  // Group messages by date
  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { date: Date; messages: ChatMessage[] }[] = [];
    let currentDate: Date | null = null;
    let currentGroup: ChatMessage[] = [];

    messages.forEach((msg) => {
      const msgDate = new Date(msg.timestamp);
      msgDate.setHours(0, 0, 0, 0);
      
      if (!currentDate || msgDate.getTime() !== currentDate.getTime()) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate!, messages: currentGroup });
        }
        currentDate = msgDate;
        currentGroup = [msg];
      } else {
        currentGroup.push(msg);
      }
    });

    if (currentGroup.length > 0 && currentDate) {
      groups.push({ date: currentDate, messages: currentGroup });
    }

    return groups;
  };

  const handleSend = () => {
    if (!message.trim() || !selectedChatId) return;
    
    // Check if connection is accepted
    const currentChat = chats.find(chat => chat.id === selectedChatId);
    if (currentChat?.connectionStatus !== "connected") {
      toast.error("You need to be connected to send messages");
      return;
    }
    
    const now = new Date();
    const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "You",
        text: message,
      time: format(now, "h:mm a"),
      timestamp: now,
        isOwn: true,
      status: "sending",
    };

    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id === selectedChatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: newMessage.text,
            lastMessageTime: newMessage.time,
          };
        }
        return chat;
      })
    );
    
    setMessage("");

    // Simulate message delivery and read status
    setTimeout(() => {
      setChats(prevChats =>
        prevChats.map(chat => {
          if (chat.id === selectedChatId) {
            return {
              ...chat,
              messages: chat.messages.map(msg =>
                msg.id === newMessage.id
                  ? { ...msg, status: "sent" as const }
                  : msg
              ),
            };
          }
          return chat;
        })
      );
    }, 500);

    setTimeout(() => {
      setChats(prevChats =>
        prevChats.map(chat => {
          if (chat.id === selectedChatId) {
            return {
              ...chat,
              messages: chat.messages.map(msg =>
                msg.id === newMessage.id
                  ? { ...msg, status: "delivered" as const }
                  : msg
              ),
            };
          }
          return chat;
        })
      );
    }, 1000);

    setTimeout(() => {
      setChats(prevChats =>
        prevChats.map(chat => {
          if (chat.id === selectedChatId) {
            return {
              ...chat,
              messages: chat.messages.map(msg =>
                msg.id === newMessage.id
                  ? { ...msg, status: "read" as const }
                  : msg
              ),
            };
          }
          return chat;
        })
      );
    }, 2000);
  };

  // Message context menu handlers
  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Message copied");
    setSelectedMessageId(null);
  };

  const handleReplyMessage = (message: ChatMessage) => {
    // In a real app, this would set up a reply context
    toast.success("Reply feature coming soon");
    setSelectedMessageId(null);
  };

  const handleForwardMessage = (message: ChatMessage) => {
    toast.success("Forward feature coming soon");
    setSelectedMessageId(null);
  };

  const handleStarMessage = (messageId: string) => {
    if (!selectedChatId) return;
    setChats(prevChats =>
      prevChats.map(chat => {
        if (chat.id === selectedChatId) {
          return {
            ...chat,
            messages: chat.messages.map(msg =>
              msg.id === messageId
                ? { ...msg, isStarred: !msg.isStarred }
                : msg
            ),
          };
        }
        return chat;
      })
    );
    setSelectedMessageId(null);
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!selectedChatId) return;
    setChats(prevChats =>
      prevChats.map(chat => {
        if (chat.id === selectedChatId) {
          return {
            ...chat,
            messages: chat.messages.filter(msg => msg.id !== messageId),
          };
        }
        return chat;
      })
    );
    toast.success("Message deleted");
    setSelectedMessageId(null);
  };

  // Emoji picker
  const commonEmojis = [
    "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
    "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
    "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩",
    "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣",
    "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬",
    "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗",
    "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯",
    "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐",
    "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈",
    "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽", "👾",
    "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿",
    "👍", "👎", "👊", "✊", "🤛", "🤜", "🤞", "✌️", "🤟", "🤘",
    "👌", "🤌", "🤏", "👈", "👉", "👆", "👇", "☝️", "👋", "🤚",
    "🖐️", "✋", "🖖", "👏", "🙌", "🤲", "🤝", "🙏", "✍️", "💪",
    "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃", "❤️", "🧡", "💛",
    "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞",
    "💓", "💗", "💖", "💘", "💝", "💟", "☮️", "✝️", "☪️", "🕉️",
    "☸️", "✡️", "🔯", "🕎", "☯️", "☦️", "🛐", "⛎", "♈", "♉",
    "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓",
    "🆔", "⚛️", "🉑", "☢️", "☣️", "📴", "📳", "🈶", "🈚", "🈸",
    "🈺", "🈷️", "✴️", "🆚", "💮", "🉐", "㊙️", "㊗️", "🈴", "🈵",
    "🈹", "🈲", "🅰️", "🅱️", "🆎", "🆑", "🅾️", "🆘", "❌", "⭕",
    "🛑", "⛔", "📛", "🚫", "💯", "💢", "♨️", "🚷", "🚯", "🚳",
    "🚱", "🔞", "📵", "🚭", "❗", "❕", "❓", "❔", "‼️", "⁉️",
    "🔅", "🔆", "〽️", "⚠️", "🚸", "🔱", "⚜️", "🔰", "♻️", "✅",
    "🈯", "💹", "❇️", "✳️", "❎", "🌐", "💠", "Ⓜ️", "🌀", "💤",
    "🏧", "🚾", "♿", "🅿️", "🈳", "🈂️", "🛂", "🛃", "🛄", "🛅",
    "🚹", "🚺", "🚼", "🚻", "🚮", "🎦", "📶", "🈁", "🔣", "ℹ️",
    "🔤", "🔡", "🔠", "🔢", "🔟", "🔯", "🔮", "🕎", "💯", "🔞",
  ];

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setEmojiPickerOpen(false);
  };

  // File attachment handler
  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if connection is accepted
    if (!selectedChatId) return;
    const currentChat = chats.find(chat => chat.id === selectedChatId);
    if (currentChat?.connectionStatus !== "connected") {
      toast.error("You need to be connected to send files");
      e.target.value = "";
      return;
    }

    const file = files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (file.size > maxSize) {
      toast.error("File size should be less than 10MB");
      return;
    }

    // In a real app, you would upload the file and get a URL
    // For now, we'll just show a toast and add a message with file info
    const fileType = file.type.startsWith("image/") ? "📷 Image" : 
                     file.type.startsWith("video/") ? "🎥 Video" :
                     file.type.includes("pdf") ? "📄 PDF" :
                     "📎 File";
    
    const fileMessage = `${fileType}: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
    
    // Add the file message to the chat
    if (!selectedChatId) return;
    
    const now = new Date();
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "You",
      text: fileMessage,
      time: format(now, "h:mm a"),
      timestamp: now,
      isOwn: true,
      status: "sending",
    };

    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id === selectedChatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: fileMessage,
            lastMessageTime: newMessage.time,
          };
        }
        return chat;
      })
    );

    // Simulate file upload and message delivery
    setTimeout(() => {
      setChats(prevChats =>
        prevChats.map(chat => {
          if (chat.id === selectedChatId) {
            return {
              ...chat,
              messages: chat.messages.map(msg =>
                msg.id === newMessage.id
                  ? { ...msg, status: "sent" as const }
                  : msg
              ),
            };
          }
          return chat;
        })
      );
    }, 500);

    setTimeout(() => {
      setChats(prevChats =>
        prevChats.map(chat => {
          if (chat.id === selectedChatId) {
            return {
              ...chat,
              messages: chat.messages.map(msg =>
                msg.id === newMessage.id
                  ? { ...msg, status: "delivered" as const }
                  : msg
              ),
            };
          }
          return chat;
        })
      );
    }, 1000);

    toast.success(`${fileType} attached: ${file.name}`);
    
    // Reset file input
    e.target.value = "";
  };

  const handleChatSelect = (chatId: string) => {
    // Clear unread count when chat is selected
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? { ...chat, unreadCount: 0 }
          : chat
      )
    );
    setSelectedChatId(chatId);
    navigate(`/chat/${chatId}`);
  };

  // Connection request handlers
  const handleSendConnectionRequest = (chatId: string) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? { ...chat, connectionStatus: "pending-sent" as const }
          : chat
      )
    );
    toast.success("Connection request sent!");
  };

  const handleAcceptConnection = (chatId: string) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? { ...chat, connectionStatus: "connected" as const }
          : chat
      )
    );
    toast.success("Connection accepted! You can now chat.");
  };

  const handleRejectConnection = (chatId: string) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? { ...chat, connectionStatus: "not-connected" as const }
          : chat
      )
    );
    toast.success("Connection request rejected");
  };

  const handleCall = (chatId?: string) => {
    if (chatId) {
      // Navigate to meeting scheduler for specific user
      navigate(`/meeting/${chatId}`);
    } else {
      // Toggle call history view in sidebar
      setShowCallHistory(!showCallHistory);
    }
  };

  const getCallIcon = (type: CallHistory["type"]) => {
    switch (type) {
      case "incoming":
        return <PhoneIncoming className="h-4 w-4 text-green-500" />;
      case "outgoing":
        return <PhoneOutgoing className="h-4 w-4 text-blue-500" />;
      case "missed":
        return <PhoneMissed className="h-4 w-4 text-red-500" />;
      default:
        return <Phone className="h-4 w-4" />;
    }
  };

  const getCallBadgeVariant = (type: CallHistory["type"]) => {
    switch (type) {
      case "incoming":
        return "default";
      case "outgoing":
        return "secondary";
      case "missed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleCallHistoryItemClick = (call: CallHistory) => {
    setShowCallHistory(false);
    navigate(`/chat/${call.chatId}`);
  };

  const handleNewChat = () => {
    if (!newChatName.trim()) {
      toast.error("Please enter a name");
      return;
    }
    
    const newChat: Chat = {
      id: Date.now().toString(),
      name: newChatName,
      avatar: newChatAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${newChatName}`,
      lastMessage: "Not connected",
      lastMessageTime: "Now",
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      connectionStatus: "not-connected",
      messages: []
    };
    
    setChats(prevChats => [newChat, ...prevChats]);
    setNewChatOpen(false);
    setNewChatName("");
    setNewChatAvatar("");
    navigate(`/chat/${newChat.id}`);
    toast.success("New chat created! Send a connection request to start chatting.");
  };

  const handleArchiveChat = () => {
    if (selectedChatId) {
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === selectedChatId
            ? { ...chat, isArchived: true }
            : chat
        )
      );
      navigate("/chat");
      toast.success("Chat archived");
    } else {
      // Archive all chats
      setChats(prevChats =>
        prevChats.map(chat => ({ ...chat, isArchived: true }))
      );
      toast.success("All chats archived");
    }
  };

  const handleUnarchiveChat = (chatId?: string) => {
    if (chatId) {
      // Unarchive a specific chat
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === chatId
            ? { ...chat, isArchived: false }
            : chat
        )
      );
      toast.success("Chat unarchived");
    } else {
      // Unarchive all chats
      setChats(prevChats =>
        prevChats.map(chat => ({ ...chat, isArchived: false }))
      );
      setShowArchived(false);
      toast.success("All chats unarchived");
    }
  };

  const handleMuteChat = () => {
    if (selectedChatId) {
      const chat = chats.find(c => c.id === selectedChatId);
      const newMuteStatus = !chat?.isMuted;
      setChats(prevChats =>
        prevChats.map(c =>
          c.id === selectedChatId
            ? { ...c, isMuted: newMuteStatus }
            : c
        )
      );
      toast.success(newMuteStatus ? "Chat muted" : "Chat unmuted");
    } else {
      // Toggle mute for all chats
      const allMuted = chats.every(chat => chat.isMuted);
      setChats(prevChats =>
        prevChats.map(chat => ({ ...chat, isMuted: !allMuted }))
      );
      toast.success(!allMuted ? "All chats muted" : "All chats unmuted");
    }
  };

  const handleDeleteChat = () => {
    if (selectedChatId) {
      setChats(prevChats => prevChats.filter(chat => chat.id !== selectedChatId));
      navigate("/chat");
      toast.success("Chat deleted");
    } else {
      // Delete all chats
      setChats([]);
      navigate("/chat");
      toast.success("All chats deleted");
    }
  };


  return (
    <Layout>
      <div className="fixed inset-0 top-16 flex bg-background h-[calc(100vh-4rem)]">
      {/* Left Sidebar */}
      <div className="w-[30%] min-w-[300px] border-r bg-muted/30 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "User"}`}
                  alt={user?.name || "User"}
                />
                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <h1 className="text-xl font-semibold">
                {showCallHistory ? "Call History" : showArchived ? "Archived Chats" : "Chats"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setNewChatOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Chat Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => {
                      setShowCallHistory(false);
                      setShowArchived(false);
                    }}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    View Chats
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => {
                      setShowCallHistory(true);
                      setShowArchived(false);
                    }}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    View Call History
                  </DropdownMenuItem>
                  {showArchived ? (
                    <>
                      {selectedChatId && chats.find(c => c.id === selectedChatId)?.isArchived ? (
                        <DropdownMenuItem onClick={() => handleUnarchiveChat(selectedChatId)}>
                          <ArchiveRestore className="mr-2 h-4 w-4" />
                          Unarchive This Chat
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleUnarchiveChat()}>
                          <ArchiveRestore className="mr-2 h-4 w-4" />
                          Unarchive All
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => {
                        setShowArchived(false);
                        setShowCallHistory(false);
                      }}>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Back to Chats
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem onClick={() => setShowArchived(true)}>
                      <Archive className="mr-2 h-4 w-4" />
                      View Archived
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {!showArchived && (
                    <DropdownMenuItem onClick={handleArchiveChat}>
                      <Archive className="mr-2 h-4 w-4" />
                      {selectedChatId ? "Archive This Chat" : "Archive All Chats"}
                    </DropdownMenuItem>
                  )}
                  {showArchived && selectedChatId && (
                    <DropdownMenuItem onClick={handleArchiveChat}>
                      <Archive className="mr-2 h-4 w-4" />
                      Archive This Chat
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleMuteChat}>
                    {selectedChatId && chats.find(c => c.id === selectedChatId)?.isMuted ? (
                      <>
                        <Bell className="mr-2 h-4 w-4" />
                        Unmute {selectedChatId ? "This Chat" : "All Chats"}
                      </>
                    ) : (
                      <>
                        <BellOff className="mr-2 h-4 w-4" />
                        Mute {selectedChatId ? "This Chat" : "All Chats"}
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleDeleteChat}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {selectedChatId ? "Delete This Chat" : "Delete All Chats"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search or start new chat"
              className="pl-10 bg-muted/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Navigation Icons */}
        <div className="flex items-center justify-center gap-2 px-2 py-2 border-b">
          <Button 
            variant={showCallHistory || showArchived ? "outline" : "default"}
            size="icon" 
            className="h-10 w-10 relative"
            onClick={() => {
              setShowCallHistory(false);
              setShowArchived(false);
              navigate("/chat");
            }}
          >
            <MessageCircle className="h-5 w-5" />
            {totalUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
              </span>
            )}
          </Button>
          <Button 
            variant={showCallHistory ? "default" : "ghost"}
            size="icon" 
            className="h-10 w-10"
            onClick={() => handleCall()}
          >
            <Phone className="h-5 w-5" />
          </Button>
        </div>

        {/* Chat List, Call History, or Archived */}
        <ScrollArea className="flex-1">
          {showCallHistory ? (
            <div className="divide-y">
              {callHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground px-4">
                  <PhoneOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No call history yet</p>
                </div>
              ) : (
                callHistory.map((call) => (
                  <button
                    key={call.id}
                    onClick={() => handleCallHistoryItemClick(call)}
                    className="w-full p-3 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-transparent">
                        <AvatarImage src={call.avatar} alt={call.name} />
                        <AvatarFallback>{call.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm truncate">{call.name}</span>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            {getCallIcon(call.type)}
                            <Badge variant={getCallBadgeVariant(call.type)} className="text-xs">
                              {call.type}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{call.date} at {call.time}</span>
                          <span className="font-medium">{call.duration}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground px-4">
              {showArchived ? (
                <>
                  <Archive className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No archived chats</p>
                </>
              ) : (
                <>
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No chats yet</p>
                  <p className="text-xs mt-2">Click the + button to start a new chat</p>
                </>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`w-full p-3 hover:bg-muted/50 transition-colors ${
                    selectedChatId === chat.id ? 'bg-muted' : ''
                  }`}
                >
                <button
                  onClick={() => handleChatSelect(chat.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-transparent">
                      <AvatarImage src={chat.avatar} alt={chat.name} />
                      <AvatarFallback>{chat.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{chat.name}</span>
                          {chat.connectionStatus === "pending-sent" && (
                            <Clock className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                          )}
                          {chat.connectionStatus === "pending-received" && (
                            <UserPlus className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                          )}
                          {chat.connectionStatus === "not-connected" && (
                            <UserX className="h-3 w-3 text-gray-500" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">{chat.lastMessageTime}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-muted-foreground truncate flex-1">
                          {chat.connectionStatus === "connected" 
                            ? chat.lastMessage 
                            : chat.connectionStatus === "pending-sent" 
                            ? "Connection request sent"
                            : chat.connectionStatus === "pending-received"
                            ? "Connection request received"
                            : "Not connected"}
                        </p>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {chat.isPinned && (
                            <span className="text-muted-foreground" title="Pinned">
                              📌
                            </span>
                          )}
                          {chat.isMuted && (
                            <span className="text-muted-foreground" title="Muted">
                              🔕
                            </span>
                          )}
                          {chat.connectionStatus === "connected" && chat.unreadCount > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
                {showArchived && (
                  <div className="mt-2 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleUnarchiveChat(chat.id)}>
                          <ArchiveRestore className="mr-2 h-4 w-4" />
                          Unarchive
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setChats(prevChats => prevChats.filter(c => c.id !== chat.id));
                            toast.success("Chat deleted");
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Right Section - Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Connection Status Banner */}
            {selectedChat.connectionStatus !== "connected" && (
              <div className="border-b bg-yellow-500/10 dark:bg-yellow-900/20 border-yellow-500/20 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    {selectedChat.connectionStatus === "pending-sent" && (
                      <>
                        <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        <span className="text-yellow-700 dark:text-yellow-300">
                          Connection request pending. Waiting for {selectedChat.name} to accept.
                        </span>
                      </>
                    )}
                    {selectedChat.connectionStatus === "pending-received" && (
                      <>
                        <UserPlus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-blue-700 dark:text-blue-300">
                          {selectedChat.name} sent you a connection request.
                        </span>
                      </>
                    )}
                    {selectedChat.connectionStatus === "not-connected" && (
                      <>
                        <UserX className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          You need to send a connection request to start chatting.
                        </span>
                      </>
                    )}
                  </div>
                  {selectedChat.connectionStatus === "pending-received" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectConnection(selectedChat.id)}
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAcceptConnection(selectedChat.id)}
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                    </div>
                  )}
                  {selectedChat.connectionStatus === "not-connected" && (
                    <Button
                      size="sm"
                      onClick={() => handleSendConnectionRequest(selectedChat.id)}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Send Request
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {/* Chat Header */}
            <div className="p-4 border-b bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedChat.avatar} alt={selectedChat.name} />
                  <AvatarFallback>{selectedChat.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
                  <h2 className="font-semibold">{selectedChat.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedChat.isTyping ? (
                      <span className="text-primary">typing...</span>
                    ) : selectedChat.lastSeen ? (
                      selectedChat.lastSeen
                    ) : (
                      "Online"
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleCall(selectedChat.id)}
                >
                  <Phone className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Chat Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {selectedChat.isArchived ? (
                      <DropdownMenuItem onClick={() => handleUnarchiveChat(selectedChatId)}>
                        <ArchiveRestore className="mr-2 h-4 w-4" />
                        Unarchive Chat
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => {
                        const chat = chats.find(c => c.id === selectedChatId);
                        if (chat) {
                          setChats(prevChats =>
                            prevChats.map(c =>
                              c.id === selectedChatId
                                ? { ...c, isArchived: true }
                                : c
                            )
                          );
                          navigate("/chat");
                          toast.success("Chat archived");
                        }
                      }}>
                        <Archive className="mr-2 h-4 w-4" />
                        Archive Chat
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => {
                      const chat = chats.find(c => c.id === selectedChatId);
                      const newMuteStatus = !chat?.isMuted;
                      setChats(prevChats =>
                        prevChats.map(c =>
                          c.id === selectedChatId
                            ? { ...c, isMuted: newMuteStatus }
                            : c
                        )
                      );
                      toast.success(newMuteStatus ? "Chat muted" : "Chat unmuted");
                    }}>
                      {selectedChat.isMuted ? (
                        <>
                          <Bell className="mr-2 h-4 w-4" />
                          Unmute Chat
                        </>
                      ) : (
                        <>
                          <BellOff className="mr-2 h-4 w-4" />
                          Mute Chat
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => {
                        if (selectedChatId) {
                          setChats(prevChats => prevChats.filter(chat => chat.id !== selectedChatId));
                          navigate("/chat");
                          toast.success("Chat deleted");
                        }
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Chat
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
              {selectedChat.connectionStatus !== "connected" ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  {selectedChat.connectionStatus === "pending-sent" && (
                    <>
                      <div className="mb-4 p-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                        <Clock className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Connection Request Pending</h3>
                      <p className="text-muted-foreground mb-4 max-w-md">
                        You've sent a connection request to <strong>{selectedChat.name}</strong>. 
                        You can start chatting once they accept your request.
                      </p>
                    </>
                  )}
                  {selectedChat.connectionStatus === "pending-received" && (
                    <>
                      <div className="mb-4 p-4 rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <UserPlus className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Connection Request Received</h3>
                      <p className="text-muted-foreground mb-4 max-w-md">
                        <strong>{selectedChat.name}</strong> wants to connect with you. 
                        Accept the request to start chatting.
                      </p>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => handleRejectConnection(selectedChat.id)}
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Decline
                        </Button>
                        <Button
                          onClick={() => handleAcceptConnection(selectedChat.id)}
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Accept & Start Chatting
                        </Button>
                      </div>
                    </>
                  )}
                  {selectedChat.connectionStatus === "not-connected" && (
                    <>
                      <div className="mb-4 p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                        <UserX className="h-12 w-12 text-gray-600 dark:text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Not Connected</h3>
                      <p className="text-muted-foreground mb-4 max-w-md">
                        You need to send a connection request to <strong>{selectedChat.name}</strong> before you can start chatting.
                      </p>
                      <Button
                        onClick={() => handleSendConnectionRequest(selectedChat.id)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Send Connection Request
                      </Button>
                    </>
                  )}
                </div>
              ) : (
              <div className="space-y-4 pb-4">
                {groupMessagesByDate(selectedChat.messages).map((group, groupIndex) => (
                  <div key={groupIndex}>
                    {/* Date Separator */}
                    <div className="flex justify-center my-4">
                      <div className="px-3 py-1 bg-muted/80 backdrop-blur-sm rounded-full text-xs text-muted-foreground font-medium">
                        {formatDateSeparator(group.date)}
                      </div>
                    </div>
                    {/* Messages in this group */}
                    {group.messages.map((msg, msgIndex) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} mb-1 group`}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <div
                              className={`max-w-[65%] cursor-pointer ${
                                msg.isOwn ? 'order-1' : 'order-2'
                              }`}
                            >
                              <div
                                className={`rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-shadow ${
                      msg.isOwn
                                    ? 'bg-[#DCF8C6] text-gray-900 rounded-br-none'
                                    : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                                }`}
                                onContextMenu={(e) => {
                                  e.preventDefault();
                                  setSelectedMessageId(msg.id);
                                }}
                              >
                                <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                                <div className={`flex items-center justify-end gap-1 mt-1 ${msg.isOwn ? 'ml-2' : ''}`}>
                                  <span className="text-[10px] text-gray-500">
                                    {formatMessageTime(msg.timestamp)}
                                  </span>
                                  {msg.isOwn && (
                                    <span className="ml-1 flex-shrink-0">
                                      {getStatusIcon(msg.status)}
                                    </span>
                                  )}
                                  {msg.isStarred && (
                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 ml-1" />
                                  )}
                  </div>
                </div>
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align={msg.isOwn ? "end" : "start"} className="w-48">
                            <DropdownMenuItem onClick={() => handleReplyMessage(msg)}>
                              <Reply className="mr-2 h-4 w-4" />
                              Reply
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleForwardMessage(msg)}>
                              <Forward className="mr-2 h-4 w-4" />
                              Forward
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyMessage(msg.text)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStarMessage(msg.id)}>
                              <Star className={`mr-2 h-4 w-4 ${msg.isStarred ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                              {msg.isStarred ? "Unstar" : "Star"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
              </div>
            ))}
          </div>
                ))}
                {/* Typing Indicator */}
                {selectedChat.isTyping && (
                  <div className="flex justify-start mb-1">
                    <div className="bg-white rounded-lg rounded-bl-none px-4 py-3 shadow-sm border border-gray-200">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            {selectedChat.connectionStatus === "connected" ? (
              <div className="p-3 border-t bg-[#F0F2F5] dark:bg-gray-800">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                />
                
                <div className="flex items-end gap-2">
                  {/* Emoji Picker */}
                  <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 rounded-full"
                        type="button"
                      >
                        <Smile className="h-5 w-5" />
              </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-80 p-2" 
                      align="start"
                      side="top"
                    >
                      <div className="grid grid-cols-8 gap-1 max-h-64 overflow-y-auto">
                        {commonEmojis.map((emoji, index) => (
                          <button
                            key={index}
                            onClick={() => handleEmojiSelect(emoji)}
                            className="text-2xl hover:bg-muted rounded p-1 transition-colors cursor-pointer"
                            type="button"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  {/* File Attachment Button */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-full"
                    onClick={handleFileAttach}
                    type="button"
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      className="rounded-full bg-white dark:bg-gray-700 border-0 pl-4 pr-12 py-6 h-auto resize-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>
                  {message.trim() ? (
                    <Button 
                      onClick={handleSend} 
                      size="icon" 
                      className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
                    >
                      <Send className="h-5 w-5" />
              </Button>
                  ) : (
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                      <Phone className="h-5 w-5" />
              </Button>
                  )}
            </div>
          </div>
            ) : (
              <div className="p-3 border-t bg-[#F0F2F5] dark:bg-gray-800">
                <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                  {selectedChat.connectionStatus === "pending-sent" && (
                    <span>Connection request pending. You can't send messages yet.</span>
                  )}
                  {selectedChat.connectionStatus === "pending-received" && (
                    <span>Accept the connection request to start chatting.</span>
                  )}
                  {selectedChat.connectionStatus === "not-connected" && (
                    <span>Send a connection request to start chatting.</span>
                  )}
    </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center bg-muted/10">
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <MessageCircle className="h-32 w-32 text-muted-foreground/20" />
                  <Phone className="h-16 w-16 text-muted-foreground/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-muted-foreground mb-2">SwapX Chat</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Select a chat to start messaging
              </p>
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                <span>End-to-end encrypted</span>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* New Chat Dialog */}
      <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start New Chat</DialogTitle>
            <DialogDescription>
              Create a new chat conversation with a user
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter name or email"
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNewChat()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL (Optional)</Label>
              <Input
                id="avatar"
                placeholder="Enter avatar URL"
                value={newChatAvatar}
                onChange={(e) => setNewChatAvatar(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNewChat()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewChatOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleNewChat}>
              Start Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Chat;
