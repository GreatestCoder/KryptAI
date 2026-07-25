import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { conversationStore } from "../lib/stores/conversationStore";
import { messageStore } from "../lib/stores/messageStore";
import LoadingBubble from "./LoadingBubble";
import EmptyState from "./EmptyState";


export default function MessageList() {
    const bottomRef = useRef(null);
    const { selectedConversation } = conversationStore();
    const { messages, getMessages, isLoadingMessages, isSendingMessage, currentAgent } = messageStore();

    useEffect(() => {
        if (!selectedConversation) return;
        getMessages(selectedConversation._id);
    }, [selectedConversation, getMessages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, isSendingMessage]);

    if (!selectedConversation) {
        return (
            <div className="flex-1"> <EmptyState hasConversation={false} /> </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto px-6 py-6">
            {messages.length === 0 && !isLoadingMessages ? (
                <div className="h-full"><EmptyState hasConversation /></div>
            ) : (
                <div className="space-y-6">
                    {messages.map((message) => (
                        <MessageBubble key={message._id} role={message.role} content={message.content}
                            images={message.images || []}
                            artifacts={message.artifacts || []}
                        />
                    ))}

                    {isSendingMessage && (<LoadingBubble agent={currentAgent} />)}
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    );
}