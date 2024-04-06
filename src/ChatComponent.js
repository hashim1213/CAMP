import React, { useState, useEffect, useRef } from "react";

import { useDispatch, useSelector } from 'react-redux';
import { db } from "./firebase-config";
import { collection, query, where, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { Input, Button } from "antd";
import { SendOutlined, CheckOutlined, EyeOutlined } from '@ant-design/icons';
import "./ChatComponent.css";
import { setMessages, setStatus, sendMessage } from './chatSlice'; // Ensure correct imports
import { format, parseISO } from 'date-fns';

const ChatComponent = ({ recipientId, currentUserId }) => {
  const [inputValue, setInputValue] = useState("");
  const messages = useSelector(state => state.chat.messages);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const unsubscribeRef = useRef(null); // Define unsubscribeRef
  const currentUser = useSelector(state => state.user.userDetails);
  useEffect(() => {
    if (currentUserId && recipientId && currentUser) {
      const sortedParticipants = [currentUserId, recipientId].sort();
      const messagesCollectionRef = collection(db, "messages");
      const q = query(
        messagesCollectionRef,
        where("participants", "==", sortedParticipants),
        orderBy("createdAt")
      );


      unsubscribeRef.current = onSnapshot(q, (querySnapshot) => {
        const loadedMessages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        dispatch(setMessages(loadedMessages));
      });

      dispatch(setStatus('listening'));

      return () => {
        if (unsubscribeRef.current) unsubscribeRef.current();
        dispatch(setStatus('idle'));
      };
    }
  }, [currentUserId, recipientId, dispatch, currentUser]); // Include currentUser in the dependency array if it's a prop or state


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isNewDay = (currentMessage, previousMessage) => {
    if (!previousMessage || !currentMessage.createdAt || !previousMessage.createdAt) return true;

    const currentDate = format(parseISO(currentMessage.createdAt?.toDate().toISOString()), 'yyyy-MM-dd');
    const previousDate = format(parseISO(previousMessage.createdAt?.toDate().toISOString()), 'yyyy-MM-dd');

    return currentDate !== previousDate;
  };


  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Dispatch action to send message
    await dispatch(sendMessage({
      senderId: currentUserId,
      recipientId: recipientId,
      text: inputValue,
      participants: [currentUserId, recipientId].sort(),
      createdAt: serverTimestamp(), // Add server timestamp
    }));

    setInputValue("");
    scrollToBottom(); // Assuming this function is defined elsewhere in your component
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => {
          const previousMessage = messages[index - 1];
          return (
            <React.Fragment key={message.id}>
              {message.createdAt && isNewDay(message, previousMessage) && (
                <div className="message-date-center">
                  {format(parseISO(message.createdAt?.toDate().toISOString()), 'PPP')}
                </div>
              )}

              <div className={`message ${message.senderId === currentUserId ? 'sent' : 'received'}`}>
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  {message.createdAt && (
                    <div className="message-timestamp">
                      {format(parseISO(message.createdAt?.toDate().toISOString()), 'p')}
                    </div>
                  )}
                </div>
               
                  <div className="message-status">
                    {message.read ? <EyeOutlined /> : message.delivered ? <CheckOutlined /> : null}
                  </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-group">
        <Input
          className="chat-input"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onPressEnter={handleSendMessage}
        />
        <Button type="primary" onClick={handleSendMessage} className="send-button" icon={<SendOutlined />} />
      </div>
    </div>
  );
};

export default ChatComponent;
