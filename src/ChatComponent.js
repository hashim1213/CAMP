import React, { useState, useEffect, useRef } from "react";
import { db } from "./firebase-config";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { Input, Button, List, Avatar } from "antd";
import { LeftOutlined } from "@ant-design/icons"; // Import the icon for the back button
import "./ChatComponent.css";
import { SendOutlined } from '@ant-design/icons';

const ChatComponent = ({ recipientId, currentUserId, onBack }) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const sortedParticipants = [currentUserId, recipientId].sort();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (currentUserId && recipientId) {
      const sortedParticipants = [currentUserId, recipientId].sort();
      const messagesCollectionRef = collection(db, "messages");
      const q = query(
        messagesCollectionRef,
        where("participants", "==", sortedParticipants),
        orderBy("createdAt")
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const loadedMessages = [];
        querySnapshot.forEach((doc) => {
          loadedMessages.push({ id: doc.id, ...doc.data() });
        });
        setMessages(loadedMessages);
      });

      scrollToBottom();

      return () => unsubscribe();
    }
  }, [currentUserId, recipientId]);

  const sendMessage = async () => {
    console.log("Sending message:", inputValue); // Debugging line
    if (inputValue.trim() === "") return;
    try {
      await addDoc(collection(db, "messages"), {
        senderId: currentUserId,
        recipientId: recipientId,
        text: inputValue,
        createdAt: new Date(),
        participants: sortedParticipants,
      });
      setInputValue("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-container">
      
      <div className="messages">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.senderId === currentUserId ? 'sent' : 'received'}`}>
           
            <div className="message-content">
              <div className="message-title">{message.senderId === currentUserId ? '' : ''}</div>
              <div className="message-text">{message.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div ref={messagesEndRef} />
      <div className="chat-input-group">
        <Input 
          className="chat-input" 
          value={inputValue} 
          onChange={e => setInputValue(e.target.value)} 
          onPressEnter={sendMessage} 
        />
       <Button type="primary" onClick={sendMessage} className="send-button" icon={<SendOutlined />} />

      </div>
    </div>
  );
};
export default ChatComponent;
