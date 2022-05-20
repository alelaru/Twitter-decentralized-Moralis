import React from "react";
import { Link } from "react-router-dom";
import { defaultImgs } from "../defaultimgs";
import './Profile.css';
import TweetInFeed from "../components/TweetInFeed"
import { useMoralis } from "react-moralis";



const Profile = () => {
  
  const {Moralis} = useMoralis()
  const user = Moralis.User.current()

  return (
    <>
     <div className="pageIdentify"> Profile</div>
     <img className="profileBanner" alt="profile" src={ user.attributes.banner ? user.attributes.banner :  defaultImgs[1]} />

     <div className="pfpContainer">
       <img src={ user.attributes.pfp ? user.attributes.pfp :  defaultImgs[0]} className="profilePFP" alt="attributes"/>
       <div className="profileName">{user.attributes.username.slice(0,6)}</div>
       <div className="profileWallet">{`${user.attributes.ethAddress.slice(0,4)}...
          ${user.attributes.ethAddress.slice(38)}`}</div>
       <Link to="/settings">
         <div className="profileEdit">Edit profile</div>
       </Link>
       <div className="profileBio">
         { user.attributes.bio ? user.attributes.bio :  "Your average Web3 Mage"}
         Your average Web3 Mage
       </div>
       <div className="profileTabs">
         <div className="profileTab">
           Your tweets
         </div>
       </div>
     </div>

     <TweetInFeed profile={true}></TweetInFeed>
    </>
  );
};

export default Profile;

