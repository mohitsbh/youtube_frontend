import React from 'react';
import { useSelector } from 'react-redux';
import WHL from '../../Component/WHL/WHL';

const Watchlater = () => {
  const watchlatervideolist = useSelector((state) => state.watchlaterreducer || []);

  return (
    <div className="container py-4">
      <h2 className="text-white mb-4">🕒 Watch Later</h2>
      <WHL page="Watch Later" videolist={watchlatervideolist} />
    </div>
  );
};

export default Watchlater;
