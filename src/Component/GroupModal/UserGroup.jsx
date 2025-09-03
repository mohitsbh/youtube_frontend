import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserGroups } from '../../action/group';
import "./UserGroup.css";
const UserGroups = () => {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.group.userGroups);

  useEffect(() => {
    dispatch(fetchUserGroups());
  }, [dispatch]);

  return (
    <div>
      <h2>🧑‍🤝‍🧑 My Groups</h2>
      {groups.length === 0 ? (
        <p>No groups joined yet.</p>
      ) : (
        <ul>
          {groups.map((group) => (
            <li key={group._id}>{group.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserGroups;
z