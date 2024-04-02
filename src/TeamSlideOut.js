import React, { useState, useEffect } from 'react';
import { Drawer, List, Avatar, Button } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { db } from './firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import './TeamSlideOut.css';
import ChatComponent from './ChatComponent';
import { useAuth } from './context/AuthContext';

const TeamSlideOut = () => {
  const { currentUser } = useAuth();
  const [visible, setVisible] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [currentChatMemberId, setCurrentChatMemberId] = useState(null);
  // State to hold the details of the current chat member
  const [currentChatMember, setCurrentChatMember] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const members = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTeamMembers(members);
      } catch (error) {
        console.error("Failed to fetch team members:", error);
      }
    };

    fetchTeamMembers();
  }, []);

  useEffect(() => {
    const member = teamMembers.find(member => member.id === currentChatMemberId);
    setCurrentChatMember(member);
  }, [currentChatMemberId, teamMembers]);

  const handleBackToTeamMembers = () => {
    setCurrentChatMemberId(null);
  };

  const handleCloseDrawer = () => {
    setVisible(false);
    setCurrentChatMemberId(null);
  };
  const openChatWith = (memberId) => {
    setCurrentChatMemberId(memberId);
    setVisible(true); // Ensure drawer remains open for chat
};
  return (
    <>
      <Button
        shape="rectangle"
        icon={<MessageOutlined />}
        onClick={() => setVisible(true)}
        className={`slide-out-toggle ${visible ? 'open' : ''}`}
      />
      <Drawer
        title={
          currentChatMember ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={currentChatMember.profilePic || "https://via.placeholder.com/150"} style={{ marginRight: '10px' }} />
              <span>{currentChatMember.name}</span>
            </div>
          ) : "Team Members"
        }
        placement="right"
        closable={true}
        onClose={handleCloseDrawer}
        visible={visible}
        width={500}
      >
        {currentChatMember ? (
          <ChatComponent
            recipientId={currentChatMemberId}
            currentUserId={currentUser?.uid}
            onBack={handleBackToTeamMembers}
          />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={teamMembers}
            renderItem={member => (
              <List.Item onClick={() => openChatWith(member.id)}>
                <List.Item.Meta
                  avatar={<Avatar src={member.profilePic || "https://via.placeholder.com/150"} />}
                  title={<span style={{ cursor: 'pointer' }}>{member.name}</span>}
                  description={member.role}
                />
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </>
  );
};

export default TeamSlideOut;
