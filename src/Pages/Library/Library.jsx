import React, { useMemo } from 'react';
import { Container, Row, Card } from 'react-bootstrap';
import { FaHistory, FaDownload } from 'react-icons/fa';
import { MdOutlineWatchLater } from 'react-icons/md';
import { AiOutlineLike } from 'react-icons/ai';
import { useSelector, shallowEqual } from 'react-redux';
import Leftsidebar from '../../Component/Leftsidebar/Leftsidebar';
import WHLvideolist from '../../Component/WHL/WHLvideolist';
import './Library.css';

const Library = () => {
  const currentuser = useSelector((state) => state.currentuserreducer);
  const rawLiked = useSelector((state) => state.likedvideoreducer, shallowEqual);
  const rawWatchLater = useSelector((state) => state.watchlaterreducer, shallowEqual);
  const rawHistory = useSelector((state) => state.historyreducer, shallowEqual);
  const rawDownloads = useSelector((state) => state.download, shallowEqual);

  // Ensure we always pass plain arrays to child components. Some reducers
  // store { data: [...] } while others return the array directly.
  const toArray = (maybeArr) => {
    if (Array.isArray(maybeArr)) return maybeArr;
    if (Array.isArray(maybeArr?.data)) return maybeArr.data;
    return [];
  };

  const likedvideolist = useMemo(() => toArray(rawLiked), [rawLiked]);
  const watchlatervideolist = useMemo(() => toArray(rawWatchLater), [rawWatchLater]);
  const watchhistoryvideolist = useMemo(() => toArray(rawHistory), [rawHistory]);
  const downloadHistory = useMemo(() => toArray(rawDownloads), [rawDownloads]);

  const userId = currentuser?.result?._id;

  return (
    <div className="d-flex bg-dark text-light min-vh-100">
      <Leftsidebar />
      <Container fluid className="p-3">
        <LibrarySection icon={<FaHistory />} title="History" userId={userId} videolist={watchhistoryvideolist} />
        <LibrarySection icon={<MdOutlineWatchLater />} title="Watch Later" userId={userId} videolist={watchlatervideolist} />
        <LibrarySection icon={<AiOutlineLike />} title="Liked Videos" userId={userId} videolist={likedvideolist} />
        <LibrarySection icon={<FaDownload />} title="Downloads" userId={userId} videolist={downloadHistory} />
      </Container>
    </div>
  );
};

const LibrarySection = ({ icon, title, userId, videolist }) => (
  <Card className="bg-black text-light mb-4 shadow-sm border-0 rounded">
    <Card.Header className="d-flex align-items-center gap-2 fs-5 bg-dark text-info border-bottom">
      {icon} <strong>{title}</strong>
    </Card.Header>
    <Card.Body>
      {videolist?.length === 0 ? (
        <div className="text-center text-muted">No videos in {title}</div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-3">
          <WHLvideolist page={title} currentuser={userId} videolist={videolist} />
        </Row>
      )}
    </Card.Body>
  </Card>
);

export default Library;
