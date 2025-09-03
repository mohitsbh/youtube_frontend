import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import GroupModal from '../../Component/GroupModal/GroupModal';
import GroupSearch from '../../Component/GroupSearch/GroupSearch';
import GroupChat from '../../Component/GroupChat/GroupChat';
import { fetchUserGroups, updateGroup } from '../../action/group';
import { toast } from 'react-toastify';

const Group = () => {
  const dispatch = useDispatch();
  const currentuser = useSelector((state) => state.currentuserreducer);
  const groups = useSelector((state) => state.groups.userGroups);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [editingGroup, setEditingGroup] = useState(false);
  const [editName, setEditName] = useState('');
  const [editMembers, setEditMembers] = useState('');

  const userEmail = currentuser?.email || currentuser?.result?.email;
  const UserName = currentuser?.name || currentuser?.result?.name;

  useEffect(() => {
    if (currentuser?.token) {
      dispatch(fetchUserGroups());
    }
  }, [dispatch, currentuser?.token]);

  const handleEditGroup = () => {
    if (!selectedGroup) return;
    setEditName(selectedGroup.name);
    setEditMembers(selectedGroup.members.join(', '));
    setEditingGroup(true);
  };

  const handleSaveGroup = () => {
    const updatedGroup = {
      ...selectedGroup,
      name: editName,
      members: editMembers.split(',').map(email => email.trim())
    };
    dispatch(updateGroup(updatedGroup));
    setSelectedGroup(updatedGroup);
    setEditingGroup(false);
  };

  if (!userEmail) {
    return (
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="card text-white bg-dark p-4 border-danger shadow" style={{ maxWidth: "400px" }}>
          <h4 className="text-danger">⚠️ Access Denied</h4>
          <p className="mt-3">You must be logged in to create or search groups.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-dark text-light py-3 min-vh-100">
      <div className="card bg-dark text-white shadow-lg p-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3">
          <h2 className="text-info fs-5 text-break m-0">
            👋 Welcome, <span className="d-inline-block text-truncate" style={{ maxWidth: "240px" }}>{UserName}</span>
          </h2>
          {/* <a href="/" className="btn btn-outline-info btn-sm">⬅ Home</a> */}
        </div>

        <div className="mb-3">
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            ➕ Create New Group
          </button>
        </div>

        <GroupModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onGroupCreated={(newGroup) => {
            setSelectedGroup(newGroup);  // auto-select new group
            setModalOpen(false);
            toast.success("✅ Group created successfully!");

            // Scroll to chat section
            setTimeout(() => {
              const chatSection = document.getElementById('group-chat');
              if (chatSection) {
                chatSection.scrollIntoView({ behavior: 'smooth' });
              }
            }, 300);
          }}
        />




        <h4 className="text-mute mt-4 mb-3">🔍 Search Existing Groups</h4>
        <GroupSearch onGroupSelect={(group) => setSelectedGroup(group)} />

        {selectedGroup && selectedGroup.members.includes(userEmail) ? (
          <div className="mt-4">
            <div className="mt-4" id="group-chat">
              <h5 className="text-info mb-3">💬 Group Chat: {selectedGroup.name}</h5>
              <GroupChat group={selectedGroup} />
            </div>
            <div className="mt-4">
              <button className="btn btn-outline-warning btn-sm" onClick={handleEditGroup}>✏️ Edit Group</button>
            </div>

            {editingGroup && (
              <div className="mt-3 bg-secondary p-3 rounded">
                <h6 className="text-white">Edit Group Details</h6>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Group Name"
                />
                <textarea
                  className="form-control mb-2"
                  rows="3"
                  value={editMembers}
                  onChange={(e) => setEditMembers(e.target.value)}
                  placeholder="Comma separated member emails"
                />
                <button className="btn btn-success btn-sm me-2" onClick={handleSaveGroup}>💾 Save</button>
                <button className="btn btn-secondary btn-sm" onClick={() => setEditingGroup(false)}>Cancel</button>
              </div>
            )}
          </div>
        ) : selectedGroup ? (
          <div className="mt-3">
            <p className="text-danger">🚫 You are not a member of this group.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Group;
