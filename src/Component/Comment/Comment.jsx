import React, { useState, useRef, useEffect } from 'react';
import './Comment.css';
import Displaycommment from './Displaycommment';
import { useSelector, useDispatch } from 'react-redux';
import { postcomment, getallcomment } from '../../action/comment';

const Comment = ({ videoid }) => {
  const dispatch = useDispatch();
  const [commenttext, setcommentext] = useState('');

  const inputRef = useRef(null);
  const commentListRef = useRef(null);

  const currentuser = useSelector((state) => state.currentuserreducer);
  const commentlist = useSelector((state) => state.commentreducer);

  // Load comments on mount
  useEffect(() => {
    dispatch(getallcomment());
  }, [dispatch]);

  const containsOnlyValidCharacters = (text) =>
    /^[a-zA-Z0-9\s.,!?'"()]+$/.test(text);

  const handleonsubmit = (e) => {
    e.preventDefault();

    if (!currentuser) return alert('Please login to comment');
    if (!commenttext.trim()) return alert('Please type your comment!');
    if (!containsOnlyValidCharacters(commenttext))
      return alert('Special characters are not allowed!');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        dispatch(
          postcomment({
            videoid,
            userId: currentuser?.result?._id,
            commentbody: commenttext.trim(),
            usercommented: currentuser?.result?.name,
            latitude,
            longitude,
          })
        );

        setcommentext('');
        inputRef.current?.focus();
        setTimeout(() => {
          commentListRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      (error) => {
        console.warn('⚠️ Location denied or failed:', error.message);

        // Post without location if blocked
        dispatch(
          postcomment({
            videoid,
            userId: currentuser?.result?._id,
            commentbody: commenttext.trim(),
            usercommented: currentuser?.result?.name,
          })
        );

        setcommentext('');
        inputRef.current?.focus();
        setTimeout(() => {
          commentListRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    );
  };

  const filteredComments = commentlist?.data?.filter(
    (c) => c.videoid === videoid
  );

  return (
    <>
      {/* 💬 Comment Input */}
      <form className="comments_sub_form_comments" onSubmit={handleonsubmit}>
        <input
          type="text"
          onChange={(e) => setcommentext(e.target.value)}
          placeholder="Add comment..."
          value={commenttext}
          ref={inputRef}
          className="comment_ibox"
        />
        <input
          type="submit"
          value="Add"
          className="comment_add_btn_comments"
          disabled={!commenttext.trim()}
        />
      </form>

      {/* 📝 Display Comments */}
      <div className="display_comment_container" ref={commentListRef}>
        {filteredComments?.length ? (
          [...filteredComments]
            .reverse()
            .map((m) => (
              <Displaycommment
                key={m._id}
                cid={m._id}
                userid={m.userId}
                commentbody={m.commentbody}
                commentedon={m.commentedon || m.createdAt}
                usercommented={m.usercommented}
                location={m.location || 'Unknown'}
                countryCode={m.countryCode}
                latitude={m.latitude}
                longitude={m.longitude}
                canTranslate={true}
              />
            ))
        ) : (
          <p className="no_comments_msg">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </>
  );
};

export default Comment;
