import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { searchGroups } from '../../action/group';

const GroupSearch = ({ onGroupSelect }) => {
  const [query, setQuery] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const dispatch = useDispatch();

  const groups = useSelector((state) => state.groups.allGroups || []);
  const currentUser = useSelector((state) => state.currentuserreducer?.result || {});

  useEffect(() => {
    dispatch(searchGroups(''));
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(searchGroups(query));
  };

  const toggleGroupDetails = (id) => {
    const newSelected = selectedGroupId === id ? null : id;
    setSelectedGroupId(newSelected);

    const selected = groups.find((g) => g._id === newSelected);
    if (onGroupSelect) onGroupSelect(selected || null);
  };

  const visibleGroups = groups.filter((group) =>
    group.members.includes(currentUser.email)

  );

  return (
    <div style={styles.wrapper}>
      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="🔍 Search groups..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.button}>
          Search
        </button>
      </div>

      <div>
        {visibleGroups.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center' }}>
            No groups found where you are a member.
          </p>
        ) : (
          visibleGroups.map((group) => (
            <div key={group._id} style={styles.groupCard}>
              <div
                style={styles.groupHeader}
                onClick={() => toggleGroupDetails(group._id)}
              >
                <strong>{group.name}</strong>
                <span style={styles.timestamp}>
                  {new Date(group.createdAt).toLocaleString()}
                </span>
              </div>
              {selectedGroupId === group._id && (
                <div style={styles.groupDetails}>
                  <p>
                    <strong>Created By:</strong>{' '}
                    {group.createdBy?.email || 'Unknown'}
                  </p>
                  <p><strong>Members:</strong></p>
                  <ul style={styles.memberList}>
                    {group.members.map((email, idx) => (
                      <li key={idx} style={styles.memberItem}>
                        {email}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    marginTop: '20px',
    color: '#fff',
  },
  searchBar: {
    marginBottom: '1rem',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  input: {
    flex: '1',
    minWidth: '240px',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #555',
    backgroundColor: '#1e1e1e',
    color: '#fff',
  },
  button: {
    padding: '10px 16px',
    backgroundColor: '#2196f3',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  groupCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    cursor: 'pointer',
    border: '1px solid #444',
  },
  groupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '16px',
    color: '#90caf9',
  },
  timestamp: {
    fontSize: '12px',
    color: '#aaa',
  },
  groupDetails: {
    marginTop: '10px',
    fontSize: '14px',
    color: '#eee',
  },
  memberList: {
    paddingLeft: '20px',
    marginTop: '5px',
  },
  memberItem: {
    fontSize: '13px',
    color: '#ccc',
  },
};

export default GroupSearch;
