// import * as api from "../Api";

// // 🔹 Create a new group
// export const createGroup = (groupData) => async (dispatch) => {
//   try {
//     const { data } = await api.createGroup(groupData);
//     dispatch({ type: "CREATE_GROUP", payload: data });
//   } catch (error) {
//     console.error("❌ Error creating group:", error);
//     alert("Failed to create group");
//   }
// };

// // 🔍 Search groups by query
// export const searchGroups = (query) => async (dispatch) => {
//   try {
//     const { data } = await api.searchGroups(query);
//     dispatch({ type: "SET_GROUPS", payload: data });
//   } catch (error) {
//     console.error("❌ Search groups failed:", error.message);
//   }
// };

// // 👥 Fetch groups created/joined by the current user
// export const fetchUserGroups = () => async (dispatch) => {
//   try {
//     const { data } = await api.getUserGroups();
//     dispatch({ type: "FETCH_USER_GROUPS_SUCCESS", payload: data });
//   } catch (error) {
//     console.error("❌ Could not fetch user groups:", error.message);
//   }
// };


import * as api from "../Api";

export const createGroup = (groupData) => async (dispatch) => {
  try {
    const { data } = await api.createGroup(groupData);
    dispatch({ type: "CREATE_GROUP", payload: data });

    return { type: "CREATE_GROUP", payload: data }; // ✅ so modal can access the new group
  } catch (error) {
    console.error("❌ Failed to create group:", error?.response?.data || error.message);
    alert("Failed to create group");
    throw error;
  }
};


// 🔍 Search for public/joinable groups
export const searchGroups = (query) => async (dispatch) => {
  try {
    const { data } = await api.searchGroups(query);
    dispatch({ type: "SET_GROUPS", payload: data });
  } catch (error) {
    console.error("❌ Group search error:", error?.response?.data || error.message);
  }
};

// 📥 Fetch current user's groups
export const fetchUserGroups = () => async (dispatch) => {
  try {
    const { data } = await api.getUserGroups();
    dispatch({ type: "FETCH_USER_GROUPS_SUCCESS", payload: data });
  } catch (error) {
    console.error("❌ Failed to fetch user groups:", error?.response?.data || error.message);
  }
};
// ✏️ Update group name or members
export const updateGroup = (groupId, updateData) => async (dispatch) => {
  try {
    const { data } = await api.updateGroup(groupId, updateData);

    // Optional: update the group in userGroups list
    dispatch({
      type: "UPDATE_GROUP",
      payload: data,
    });

    return { success: true, data };
  } catch (error) {
    console.error("❌ Failed to update group:", error?.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

