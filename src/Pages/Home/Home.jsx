import React from 'react'
import Leftsidebar from '../../Component/Leftsidebar/Leftsidebar'
import Showvideogrid from '../../Component/Showvideogrid/Showvideogrid'
import { useSelector } from 'react-redux'

const Home = () => {
  const vids = useSelector(state => state.videoreducer)?.data?.filter(q => q).reverse();

  const navlist = [
    "All",
    "Python",
    "Java",
    "C++",
    "Movies",
    "Science",
    "Animation",
    "Gaming",
    "Comedy"
  ];

  return (
    <div className="container_Pages_App">
      <Leftsidebar />
      <div className="container2_Pages_App">

        {/* Bootstrap navigation */}
        <nav className="navbar navbar-dark bg-dark border-bottom border-secondary sticky-top overflow-auto flex-nowrap" style={{ zIndex: 1 }} >
          <div className="d-flex">
            {navlist.map((m) => (
              <button
                key={m}
                className="btn btn-dark rounded-pill mx-2 my-1 px-3"
              >
                {m}
              </button>
            ))}
          </div>
        </nav>

        <Showvideogrid vid={vids} />
      </div>
    </div>
  );
}

export default Home
