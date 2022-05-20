import React from "react";
import { useMoralis } from "react-moralis";
import { Link } from "react-router-dom";
import { Icon } from "web3uikit";
import { defaultImgs } from "../defaultimgs";
import './Sidebar.css';


const Sidebar = () => {

  const { Moralis } = useMoralis()
  const user = Moralis.User.current()

  return (
    <>
      <div className="siderContent">
        <div className="menu">
          <div className="details">
          <Icon fill="#ffffff" size={33} svg="twitter"></Icon>
          </div>

          <Link to="/" className="link">
            <div className="menuItems">
              <Icon fill="#ffffff" size={33} svg="list"></Icon>
              Home
            </div>
          </Link>

          <Link to="/profile" className="link">
            <div className="menuItems">
              <Icon fill="#ffffff" size={33} svg="user"></Icon>
              Profile
            </div>
          </Link>
          
          <Link to="settings" className="link">
            <div className="menuItems">
              <Icon fill="#ffffff" size={33} svg="cog"></Icon>
              Settings
            </div>
          </Link>

        </div>

            <div className="details">
              <img src={ user.attributes.pfp ? user.attributes.pfp :  defaultImgs[0]} className="profilePic" alt="image1"/>
              <div className="profile">
                <div className="who">{user.attributes.username.slice(0,6)}</div>
                <div className="accWhen">{`${user.attributes.ethAddress.slice(0,4)}... ${user.attributes.ethAddress.slice(38)}`}</div>
              </div>

        </div>


      </div>
    </>
  );
};

export default Sidebar;

