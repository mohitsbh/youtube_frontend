// export const setcurrentuser=(data)=>{
//     return{
//         type:"FETCH_CURRENT_USER",
//         payload:data
//     }
// }

// actions/currentuser.js
// actions/currentuser.js
const setcurrentuser = (data) => {
  return {
    type: "FETCH_CURRENT_USER",
    payload: data,
  };
};

export default setcurrentuser;
