import React, { useState } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import {
  editcomment,
  deletecomment,
  likeComment,
  dislikeComment,
  translateComment,
} from '../../action/comment';
import './Comment.css';

const Displaycommment = ({
  cid,
  commentbody,
  userid,
  commentedon,
  usercommented,
  location = 'Unknown',
  countryCode,
  latitude,
  longitude,
  canTranslate = false,
}) => {
  const [edit, setEdit] = useState(false);
  const [cmtnody, setCommentbdy] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [loadingTranslation, setLoadingTranslation] = useState(false);

  const dispatch = useDispatch();
  const currentuser = useSelector((state) => state.currentuserreducer);

  const currentComment = useSelector((state) =>
    state.commentreducer.data.find((c) => c._id === cid)
  );

  const translatedText =
    currentComment?.translations?.[selectedLanguage] || '';

  const likes = currentComment?.likes || [];
  const dislikes = currentComment?.dislikes || [];
  const isOwner = currentuser?.result?._id === userid;

  const handleEdit = (ctbdy) => {
    setEdit(true);
    setCommentbdy(ctbdy);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!cmtnody.trim()) return alert('Type your comment');
    dispatch(editcomment({ id: cid, commentbody: cmtnody }));
    setEdit(false);
    setCommentbdy('');
  };

  const handleDel = () => {
    if (window.confirm('Delete this comment?')) {
      dispatch(deletecomment(cid));
    }
  };

  const handleTranslate = async () => {
    setLoadingTranslation(true);
    await dispatch(translateComment(cid, selectedLanguage));
    setLoadingTranslation(false);
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'mr', label: 'Marathi' },
    { code: 'fr', label: 'French' },
    { code: 'es', label: 'Spanish' },
    { code: 'de', label: 'German' },
  ];

  return (
    <div className="card bg-dark text-light mb-3 p-3">
      {edit ? (
        <form className="row g-2" onSubmit={handleEditSubmit}>
          <div className="col-12 col-md-9">
            <input
              type="text"
              value={cmtnody}
              onChange={(e) => setCommentbdy(e.target.value)}
              placeholder="Edit comment..."
              className="form-control"
            />
          </div>
          <div className="col-6 col-md-2 d-grid">
            <button type="submit" className="btn btn-success">Change</button>
          </div>
          <div className="col-6 col-md-1 d-grid">
            <button
              type="button"
              className="btn btn-outline-light"
              onClick={() => setEdit(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="mb-2">{commentbody}</p>

          {canTranslate && (
            <div className="row g-2 mb-2 align-items-center">
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2 d-grid">
                <button
                  onClick={handleTranslate}
                  className="btn btn-info btn-sm"
                  disabled={loadingTranslation}
                >
                  {loadingTranslation ? 'Translating...' : 'Translate'}
                </button>
              </div>
            </div>
          )}

          {translatedText && (
            <a
              href={`https://translate.google.com/?sl=auto&tl=${selectedLanguage}&text=${encodeURIComponent(
                commentbody
              )}&op=translate`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-info fst-italic text-decoration-none"
            >
              🔁 {translatedText}
            </a>
          )}
        </>
      )}

      <small className="text-white">
        - {usercommented} from {location || 'Unknown'}{' '}
        {countryCode ? (
          <img
            src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`}
            alt={countryCode}
            style={{ marginLeft: '4px', verticalAlign: 'middle' }}
          />
        ) : (
          <span>🌍</span>
        )}
        {latitude && longitude && (
          <a
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0dcaf0', marginLeft: '8px' }}
          >
            📍 Map
          </a>
        )}
        , {moment(commentedon).fromNow()}
      </small>

      <div className="mt-2 d-flex gap-3">
        <button
          className={`btn btn-sm ${likes.includes(currentuser?.result?._id) ? 'btn-success' : 'btn-outline-success'
            }`}
          onClick={() => dispatch(likeComment(cid, currentuser?.result?._id))}
        >
          👍 {likes.length}
        </button>

        <button
          className={`btn btn-sm ${dislikes.includes(currentuser?.result?._id) ? 'btn-danger' : 'btn-outline-danger'
            }`}
          onClick={() => dispatch(dislikeComment(cid, currentuser?.result?._id))}
        >
          👎 {dislikes.length}
        </button>
      </div>

      {isOwner && (
        <div className="mt-3 d-flex gap-3">
          <button className="btn btn-sm btn-warning" onClick={() => handleEdit(commentbody)}>
            ✏️ Edit
          </button>
          <button className="btn btn-sm btn-danger" onClick={handleDel}>
            🗑 Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Displaycommment;
