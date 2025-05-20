
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, Send, User } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

const CommunitySyncChat: React.FC = () => {
  const { communityMessages, addCommunityMessage } = useData();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newMessage.trim()) return;
    
    const locationStr = user.location.city && user.location.state 
      ? `${user.location.city}, ${user.location.state}`
      : "Unknown location";
    
    addCommunityMessage(newMessage.trim(), user.name, locationStr);
    setNewMessage("");
  };

  return (
    <Card className="flex flex-col h-[400px]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
            <CardTitle>Community Messages</CardTitle>
          </div>
        </div>
        <CardDescription>
          Connect with others in your area
        </CardDescription>
      </CardHeader>
      <ScrollArea className="flex-1 px-4 py-2">
        {communityMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center p-4">
            <div className="text-muted-foreground">
              <p>No messages yet.</p>
              <p className="text-sm">Be the first to share updates with your community!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {communityMessages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                <div className="bg-accent rounded-full p-2 h-8 w-8 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-lg p-3 flex-1">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm">{msg.userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{msg.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{msg.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      <CardFooter className="border-t p-3">
        <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
          <Textarea 
            placeholder="Type your message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 min-h-0 h-10 py-2"
          />
          <Button type="submit" size="sm" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default CommunitySyncChat;
