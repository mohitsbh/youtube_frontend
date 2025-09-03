import React, { useEffect, useState, useMemo } from 'react';
import { Col } from 'react-bootstrap';
import Showvideolist from '../Showvideolist/Showvideolist';
import { useSelector } from 'react-redux';
import { getVideoById } from '../../Api';

const WHLvideolist = ({ page, currentuser, videolist }) => {
  // Pull cached videos from the store at top-level (hooks must not be called conditionally)
  const allVideos = useSelector((state) => state.videoreducer?.data || []);
  const findVideoInStore = (id) => allVideos.find((v) => v._id?.toString() === id?.toString());

  // Normalize input to an array
  const list = Array.isArray(videolist) ? videolist : Array.isArray(videolist?.data) ? videolist.data : [];

  // Determine normalized current user id string (accept either an id string or object)
  const currentUserId = (currentuser?._id || currentuser)?.toString();

  const extractVideo = (item) => {
    const raw = item;
    // If there's a nested video object
    if (raw?.videoid && typeof raw.videoid === 'object') {
      return { videoObj: raw.videoid, vid: raw.videoid._id };
    }
    // If videoid is an id string
    if (raw?.videoid && typeof raw.videoid === 'string') {
      const found = findVideoInStore(raw.videoid);
      return { videoObj: found || { _id: raw.videoid }, vid: raw.videoid };
    }
    // If item itself looks like a video
    if (raw?._id) return { videoObj: raw, vid: raw._id };
    // Fallback: no video info
    return { videoObj: null, vid: null };
  };
  // Compute finalList (deduped, normalized) using useMemo so it's stable for hooks
  const finalList = useMemo(() => {
    // Filter items based on the page type.
    let filtered = [];
    if (page === 'Downloads') {
      filtered = list.filter((v) => v && (v.videoid || v?.video));
    } else {
      filtered = list.filter((v) => {
        if (!v) return false;
        const viewerId = v?.viewer?._id || v?.viewer;
        if (viewerId) return viewerId.toString() === currentUserId;
        const uploaderId = v?.uploader?._id || v?.uploader;
        if (uploaderId) return uploaderId.toString() === currentUserId;
        return false;
      });
    }

    const seen = new Set();
    const out = [];
    for (const item of filtered) {
      const { videoObj, vid } = extractVideo(item);
      const id = vid?._id || vid || (typeof vid === 'string' ? vid : undefined);
      if (!id) continue;
      const key = id.toString();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ raw: item, video: videoObj || item, id: key });
    }
    return out;
  }, [list, allVideos, currentUserId, page]);

  // If some entries have only id placeholders (no uploader/views), lazy-fetch details
  const [hydrated, setHydrated] = useState({});

  useEffect(() => {
    let mounted = true;
    const idsToFetch = finalList
      .filter((e) => e.video && (!e.video.uploader || !e.video.views))
      .map((e) => e.id)
      .filter(Boolean);

    if (idsToFetch.length === 0) return;

    const fetchAll = async () => {
      for (const id of idsToFetch) {
        try {
          const res = await getVideoById(id);
          if (res?.data && mounted) {
            setHydrated((prev) => ({ ...prev, [id]: res.data }));
          }
        } catch (err) {
          console.warn('Failed to hydrate video', id, err?.message || err);
        }
      }
    };
    fetchAll();

    return () => {
      mounted = false;
    };
  }, [finalList]);

  // Build final entries using hydrated data when available
  const renderedList = finalList.map((e) => ({
    ...e,
    video: hydrated[e.id] || e.video,
  }));

  if (renderedList.length === 0) {
    return <h5 className="text-white text-center">No videos found in {page}</h5>;
  }

  return (
    <>
      {renderedList.slice().reverse().map((entry) => (
        <Col key={entry.id}>
          <Showvideolist video={entry.video} />
        </Col>
      ))}
    </>
  );
};

export default WHLvideolist;
