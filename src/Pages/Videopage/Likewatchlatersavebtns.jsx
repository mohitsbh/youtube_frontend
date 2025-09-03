import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { likevideo } from '../../action/video';
import { addtolikedvideo, deletelikedvideo } from "../../action/likedvideo";
import { addtowatchlater, deletewatchlater } from '../../action/watchlater';
import { downloadVideoById, getDownloadCount } from '../../action/download';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsThreeDots } from 'react-icons/bs';
import { FaDownload } from 'react-icons/fa';
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from 'react-icons/ai';
import { RiHeartAddFill, RiPlayListAddFill, RiShareForwardLine } from 'react-icons/ri';
import { MdPlaylistAddCheck } from 'react-icons/md';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Likewatchlatersavebtns = ({ vv, vid }) => {
  const dispatch = useDispatch();
  const [savevideo, setSavevideo] = useState(false);
  const [dislikebtn, setDislikebtn] = useState(false);
  const [likebtn, setLikebtn] = useState(false);

  const currentuser = useSelector(state => state.currentuserreducer);
  const likedvideolist = useSelector((state) => state.likedvideoreducer);
  const watchlaterlist = useSelector((state) => state.watchlaterreducer);

  useEffect(() => {
    const isLiked = likedvideolist?.data?.some((item) => {
      const itemVideoId = item?.videoid?._id || item?.videoid;
      const itemViewer = item?.viewer?._id || item?.viewer;
      return itemVideoId?.toString() === vid?.toString() && itemViewer?.toString() === currentuser?.result?._id?.toString();
    });
    const isSaved = watchlaterlist?.data?.some((item) => {
      const itemVideoId = item?.videoid?._id || item?.videoid;
      const itemViewer = item?.viewer?._id || item?.viewer;
      return itemVideoId?.toString() === vid?.toString() && itemViewer?.toString() === currentuser?.result?._id?.toString();
    });
    setLikebtn(isLiked);
    setSavevideo(isSaved);
  }, [likedvideolist, watchlaterlist, currentuser, vid]);

  const handleAuthAlert = () => alert("🔒 Please login to continue");

  const toggleSaveVideo = () => {
    if (!currentuser?.result) return handleAuthAlert();
    if (savevideo) {
      dispatch(deletewatchlater({ videoid: vid, viewer: currentuser.result._id }));
    } else {
      dispatch(addtowatchlater({ videoid: vid, viewer: currentuser.result._id }));
    }
    setSavevideo(!savevideo);
  };

  const toggleLikeVideo = async () => {
    if (!currentuser?.result) return handleAuthAlert();
    console.log("🔄 Toggling like for video:", vid, "Current like state:", likebtn);
    console.log("📹 Video data:", vv);
    console.log("👤 Current user:", currentuser?.result);
    
    if (likebtn) {
      console.log("🗑️ Removing like, current likes:", vv.Like);
      const res = await dispatch(deletelikedvideo({ videoid: vid, viewer: currentuser.result._id }));
      if (res?.success) {
        dispatch(likevideo({ id: vid, Like: Math.max((vv.Like || 1) - 1, 0) }));
        setLikebtn(false);
        toast && toast.info && toast.info('Removed like');
      }
    } else {
      console.log("❤️ Adding like, current likes:", vv.Like);
      const res = await dispatch(addtolikedvideo({ videoid: vid, viewer: currentuser.result._id }));
      if (res?.success) {
        dispatch(likevideo({ id: vid, Like: (vv.Like || 0) + 1 }));
        setLikebtn(true);
        setDislikebtn(false);
      } else if (res?.alreadyLiked) {
        // Ensure UI reflects server state
        setLikebtn(true);
      }
    }
  };

  const toggleDislikeVideo = () => {
    if (!currentuser?.result) return handleAuthAlert();
    if (!dislikebtn && likebtn) {
      dispatch(likevideo({ id: vid, Like: vv.Like - 1 }));
      dispatch(deletelikedvideo({ videoid: vid, viewer: currentuser.result._id }));
    }
    setLikebtn(false);
    setDislikebtn(!dislikebtn);
  };

  // const handleDownload = async () => {
  //   if (!currentuser?.result) return handleAuthAlert();

  //   const result = await dispatch(
  //     downloadVideoById(vid, "360p", vv.title, currentuser.result._id)
  //   );

  //   if (result?.success) {
  //     alert("✅ Video downloaded and added to My Downloads!");
  //   } else if (result?.reason === "NO_RESOLUTIONS") {
  //     alert("⚠️ No downloadable resolution available for this video.");
  //   } else {
  //     alert("❌ Failed to download video. Please try again.");
  //   }
  // };

  const handleDownload = async () => {
    if (!currentuser?.result) return handleAuthAlert();

    const res = await dispatch(getDownloadCount());
    if (!res.success) {
      alert("⚠️ Unable to check download limits. Please try later.");
      return;
    }

    const remaining = res.data.remaining;
    if (remaining === "Unlimited" || remaining > 0) {
      const result = await dispatch(
        downloadVideoById(vid, "360p", vv.videotitle || vv.title, currentuser.result._id)
      );

      if (result?.success) {
        alert("✅ Video downloaded and added to My Downloads!");
      } else if (result?.reason === "NO_RESOLUTIONS") {
        alert("⚠️ No downloadable resolution available for this video.");
      } else {
        alert("❌ Failed to download video. Please try again.");
      }
    } else {
      alert("⚠️ You have reached your daily download limit. Please upgrade to premium for unlimited downloads.");
      Navigate("/upgrade"); // <-- Use navigate here instead of Navigate()
    }
  };

  const renderButton = (onClick, icon, label, isActive = false) => (
    <OverlayTrigger placement="top" overlay={<Tooltip>{label}</Tooltip>}>
      <button
        onClick={onClick}
        className={`btn btn-sm theme-btn d-flex align-items-center gap-1 rounded ${isActive ? 'btn-info' : ''}`}
        type="button"
      >
        <span className="d-inline d-sm-none">{icon}</span>
        <span className="d-none d-sm-inline-flex align-items-center gap-1">
          {icon} {label}
        </span>
      </button>
    </OverlayTrigger>
  );

  return (
    <div className="d-flex flex-wrap justify-content-end gap-2 mt-3 px-2">
      {renderButton(() => { }, <BsThreeDots size={18} />, 'More')}
      {renderButton(toggleLikeVideo, likebtn ? <AiFillLike size={18} /> : <AiOutlineLike size={18} />, vv.Like)}
      {renderButton(toggleDislikeVideo, dislikebtn ? <AiFillDislike size={18} /> : <AiOutlineDislike size={18} />, 'Dislike')}
      {renderButton(toggleSaveVideo, savevideo ? <MdPlaylistAddCheck size={18} /> : <RiPlayListAddFill size={18} />, savevideo ? 'Saved' : 'Save')}
      {renderButton(() => { }, <RiHeartAddFill size={18} />, 'Thanks')}
      {renderButton(() => { }, <RiShareForwardLine size={18} />, 'Share')}
      {renderButton(handleDownload, <FaDownload size={18} />, 'Download')}
    </div>
  );
};

export default Likewatchlatersavebtns;
