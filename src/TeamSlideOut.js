import React, { useState, useEffect } from 'react';
import { Drawer, List, Avatar, Button } from 'antd';
import { MessageOutlined, ArrowLeftOutlined } from '@ant-design/icons'; // Import ArrowLeftOutlined for the back button
import './TeamSlideOut.css';
import ChatComponent from './ChatComponent';
import { useAuth } from './context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeamMembers } from './teamSlice'; // Adjust the import path as necessary

const TeamSlideOut = () => {
  const { currentUser } = useAuth();
  const dispatch = useDispatch();
  
  const [visible, setVisible] = useState(false);
  const [currentChatMemberId, setCurrentChatMemberId] = useState(null);
  const teamMembers = useSelector(state => state.team.members);
  const [currentChatMember, setCurrentChatMember] = useState(null);

  useEffect(() => {
    dispatch(fetchTeamMembers());
  }, [dispatch]);

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
    setVisible(true);
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
            <>
              <Button 
                type="link" 
                onClick={handleBackToTeamMembers} 
                icon={<ArrowLeftOutlined />} 
                style={{ marginRight: '10px', padding: '0', border: 'none', boxShadow: 'none' }}
              />
              <Avatar src={currentChatMember.profilePic || "https://via.placeholder.com/150"} style={{ marginRight: '10px' }} />
              <span>{currentChatMember.name}</span>
            </>
          ) : "Team Members"
        }
        placement="right"
        closable={true}
        onClose={handleCloseDrawer}
        visible={visible}
        width={400}
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
