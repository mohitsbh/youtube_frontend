import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Pages
import Home from './Pages/Home/Home';
import Search from './Pages/Search/Search';
import Videopage from './Pages/Videopage/Videopage';
import Channel from './Pages/Channel/Channel';
import Library from './Pages/Library/Library';
import Likedvideo from './Pages/Likedvideo/Likedvideo';
import Watchhistory from './Pages/Watchhistory/Watchhistory';
import Watchlater from './Pages/Watchlater/Watchlater';
import Yourvideo from './Pages/Yourvideo/Yourvideo';
import Group from './Pages/Group/Group';
import UpgradePlan from './Pages/Payment/UpgradePlan';
import SearchResult from './Pages/SearchResult/SearchResult';

// Components
import GroupChat from './Component/GroupChat/GroupChat';
import MyDownloads from './Component/MyDownloads/MyDownloads';
import Download from './Pages/Download/Download';

// 🔁 Wrapper for Group Chat with `groupId` from URL
const GroupChatWrapper = () => {
  const { groupId } = useParams();
  const currentUser = useSelector((state) => state.currentuserreducer);
  return <GroupChat groupId={groupId} currentUser={currentUser} />;
};

const Allroutes = ({ seteditcreatechanelbtn, setvideouploadpage }) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search/:Searchquery" element={<Search />} />
      <Route path="/videopage/:vid" element={<Videopage />} />
      <Route path="/library" element={<Library />} />
      <Route path="/likedvideo" element={<Likedvideo />} />
      <Route path="/watchhistory" element={<Watchhistory />} />
      <Route path="/watchlater" element={<Watchlater />} />
      <Route path="/yourvideo" element={<Yourvideo />} />
      <Route path="/groups" element={<Group />} />
      <Route path="/groupchat/:groupId" element={<GroupChatWrapper />} />
      <Route path="/upgrade" element={<UpgradePlan />} />
      <Route path="/my-downloads" element={<Download />} />

      {/* Optional future routes */}
      {/* import Downloads from './Pages/Download/Downloads'; */}
      {/* <Route path="/downloads" element={<Downloads />} /> */}

      <Route
        path="/channel/:cid"
        element={
          <Channel
            seteditcreatechanelbtn={seteditcreatechanelbtn}
            setvideouploadpage={setvideouploadpage}
          />
        }
      />
    </Routes>
  );
};

export default Allroutes;
