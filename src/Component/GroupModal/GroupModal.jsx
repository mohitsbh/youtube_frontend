import React, { useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { createGroup, fetchUserGroups } from '../../action/group';
import "./GroupModal.css";

Modal.setAppElement('#root');

const GroupModal = ({ isOpen, onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState(['']);
  const dispatch = useDispatch();

  const handleAddMember = () => {
    setMembers([...members, '']);
  };

  const handleChangeMember = (index, value) => {
    const updatedMembers = [...members];
    updatedMembers[index] = value;
    setMembers(updatedMembers);
  };

  const handleSubmit = async () => {
    if (!groupName.trim() || members.some(m => !m.trim())) {
      alert("Please fill all fields.");
      return;
    }

    const creatorEmail = JSON.parse(localStorage.getItem("Profile"))?.result?.email;
    const allMembers = [...new Set([...members, creatorEmail])];

    try {
      const action = await dispatch(createGroup({ name: groupName, members: allMembers }));

      // 👉 Extract newly created group from action (if using redux-thunk + return)
      const newGroup = action?.payload || null;

      // ✅ Refresh list
      await dispatch(fetchUserGroups());

      // ✅ Pass new group to parent component
      if (newGroup && typeof onGroupCreated === "function") {
        onGroupCreated(newGroup);
      }

      // reset modal fields
      setGroupName('');
      setMembers(['']);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create group");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Create Group"
      className="group-modal"
      overlayClassName="group-modal-overlay"
    >
      <div className="modal-content">
        <h2>Create New Group</h2>

        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="modal-input"
        />

        {members.map((email, index) => (
          <input
            key={index}
            type="email"
            placeholder={`Member Email ${index + 1}`}
            value={email}
            onChange={(e) => handleChangeMember(index, e.target.value)}
            className="modal-input"
          />
        ))}

        <button className="add-member-btn" onClick={handleAddMember}>
          + Add Another Member
        </button>

        <div className="modal-buttons">
          <button className="primary-btn" onClick={handleSubmit}>Create Group</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
};

export default GroupModal;
