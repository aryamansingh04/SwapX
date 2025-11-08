import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { getMessages, sendMessage as sendMessageAPI, Message } from "@/lib/chat";

interface UseMessagesOptions {
  connectionId: number;
}

interface UseMessagesReturn {
  messages: Message[];
  sendMessage: (content: string) => Promise<Message>;
  loading: boolean;
  error: string | null;
}



export function useMessages({ connectionId }: UseMessagesOptions): UseMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    let mounted = true;

    const loadMessages = async () => {
      if (!connectionId || connectionId <= 0) {
        setError("Valid connection ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const initialMessages = await getMessages(connectionId);
        
        if (mounted) {
          setMessages(initialMessages);
        }
      } catch (err) {
        if (mounted) {
          const errorMessage = err instanceof Error ? err.message : "Failed to load messages";
          setError(errorMessage);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadMessages();

    return () => {
      mounted = false;
    };
  }, [connectionId]);

  
  useEffect(() => {
    if (!connectionId || connectionId <= 0) {
      return;
    }

    const channelName = `room-${connectionId}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `connection_id=eq.${connectionId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prevMessages) => {
            
            const exists = prevMessages.some((msg) => msg.id === newMessage.id);
            if (exists) {
              return prevMessages;
            }
            return [...prevMessages, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [connectionId]);

  
  const sendMessage = useCallback(
    async (content: string): Promise<Message> => {
      if (!connectionId || connectionId <= 0) {
        throw new Error("Valid connection ID is required");
      }

      if (!content || content.trim() === "") {
        throw new Error("Message content is required");
      }

      try {
        setError(null);
        const newMessage = await sendMessageAPI(connectionId, content);
        
        
        
        setMessages((prevMessages) => {
          const exists = prevMessages.some((msg) => msg.id === newMessage.id);
          if (exists) {
            return prevMessages;
          }
          return [...prevMessages, newMessage];
        });

        return newMessage;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to send message";
        setError(errorMessage);
        throw err;
      }
    },
    [connectionId]
  );

  return {
    messages,
    sendMessage,
    loading,
    error,
  };
}

