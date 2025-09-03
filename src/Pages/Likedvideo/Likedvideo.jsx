import React from 'react';
import { useSelector } from 'react-redux';
import WHL from '../../Component/WHL/WHL';

const Likedvideo = () => {
  const likedvideolist = useSelector((state) => state.likedvideoreducer);

  return (
    <div className="container-fluid bg-dark text-light py-1 min-vh-100">
      <div className="row justify-content-center">
        <div className="col-12 text-center">
          <h2 className="text-info">❤️ Liked Videos</h2>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <WHL page={"Liked Video"} videolist={likedvideolist} />
        </div>
      </div>
    </div>
  );
};

export default Likedvideo;
