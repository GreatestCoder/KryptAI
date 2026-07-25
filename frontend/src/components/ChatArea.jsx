import Navbar from "./Navbar";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";


export default function ChatArea() {
    return (
        <main className="flex-1 flex flex-col min-w-0 bg-slate-950">
            <Navbar />
            <MessageList />
            <ChatInput />
        </main>
    );
}