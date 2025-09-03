import React from 'react';
import './Describechannel.css';
import { FaEdit, FaUpload } from "react-icons/fa";
import { useSelector } from 'react-redux';

const Describechannel = ({ setvideouploadpage, cid, seteditcreatechanelbtn }) => {
  const channel = useSelector(state => state.chanelreducer);
  const currentchannel = channel.find(c => c._id === cid); // safer syntax
  const currentuser = useSelector(state => state.currentuserreducer);

  // ✅ Prevent rendering if currentchannel is undefined
  if (!currentchannel) {
    return (
      <div className="container3_chanel">
        <p>Channel not found.</p>
      </div>
    );
  }

  const isOwner = currentuser?.result?._id === currentchannel._id;

  return (
    <div className="container3_chanel">
      <div className="chanel_logo_chanel">
        <b>{currentchannel.name?.charAt(0).toUpperCase()}</b>
      </div>
      <div className="description_chanel">
        <b>{currentchannel.name}</b>
        <p>{currentchannel.desc}</p>
      </div>
      {isOwner && (
        <>
          <p className="editbtn_chanel" onClick={() => seteditcreatechanelbtn(true)}>
            <FaEdit />
            <b>Edit Channel</b>
          </p>
          <p className="uploadbtn_chanel" onClick={() => setvideouploadpage(true)}>
            <FaUpload />
            <b>Upload Video</b>
          </p>
        </>
      )}
    </div>
  );
};

export default Describechannel;
