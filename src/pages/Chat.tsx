import { useState } from "react";
import { Send, Smile, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import AppHeader from "@/components/AppHeader";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: "1", sender: "Sarah Johnson", text: "Hi! Ready for our React session?", time: "10:30 AM", isOwn: false },
    { id: "2", sender: "You", text: "Yes! Looking forward to it", time: "10:32 AM", isOwn: true },
    { id: "3", sender: "Sarah Johnson", text: "Great! I'll share my screen in 5 mins", time: "10:33 AM", isOwn: false },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        sender: "You",
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
      },
    ]);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[image:var(--gradient-soft)] flex flex-col">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8 flex-1 flex flex-col max-w-4xl">
        <Card className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Sarah" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">Sarah Johnson</h2>
              <p className="text-sm text-muted-foreground">Online</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${msg.isOwn ? 'order-1' : 'order-2'}`}>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      msg.isOwn
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 px-2">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button variant="ghost" size="icon">
                <Smile className="h-4 w-4" />
              </Button>
              <Button onClick={handleSend} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Chat;
