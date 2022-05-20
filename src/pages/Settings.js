import React from "react";
import { Input } from "web3uikit";
import './Settings.css';
// Images used for the NFTS
import pfp1 from "../images/pfp1.png"
import pfp2 from "../images/pfp2.png"
import pfp3 from "../images/pfp3.png"
import pfp4 from "../images/pfp4.png"
import pfp5 from "../images/pfp5.png"
import { useState } from "react";
import { useRef } from "react";
import { defaultImgs } from "../defaultimgs";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { useEffect } from "react";
// import Web3Api from "moralis/types/generated/web3Api";


const Settings = () => {

  const [selectedPFP, setSelectedPFP] = useState()
  const inputFile = useRef(null)
  const [selectedImage, setselectedImage] = useState(defaultImgs[1]);
  const [theFile, settheFile] = useState();
  const [userName, setuserName] = useState();
  const [bio, setbio] = useState();
  const { Moralis, isAuthenticated, account } = useMoralis();
  const Web3API = useMoralisWeb3Api();
  const [pfps, setPfps] = useState([])

  const pfpsDefault = [pfp1, pfp2, pfp3, pfp4, pfp5]



  const resolveLink = (url) => {
    if(!url || !url.includes("ipfs://")) return url
    return url.replace("ipfs://", "https://gateway.ipfs.io/ipfs/")
  }

  useEffect(() => {

    const fetchNFTs = async () => {

      console.log("Entre1");

      const options = {
        chain: "fuji",
        address: "account"
      }
      console.log("Entre2");

      
      const mumbaiNFTs = await Web3API.account.getNFTs(options)
      const images = mumbaiNFTs.result.map(
        (e) => resolveLink(JSON.parse(e.metadata)?.image)
      );
      
      setPfps(images)
    }

    // Web3Api.account.getNFTs()
    // Web3API.account.getNFTs

    fetchNFTs()
    
  }, [isAuthenticated, account, Web3API]);
  

  //functions for saving the image NFT
  
  const chageHandler = (event) => {
    const img = event.target.files[0];
    settheFile(img)
    setselectedImage(URL.createObjectURL(img));
  }

// Save the information in Moralis
  const saveEdits = async () => {
    const User = Moralis.Object.extend("_User")
    const query = new Moralis.Query(User)
    const myDetails = await query.first();

    if(bio){
      myDetails.set("bio", bio)
    }

    if(selectedPFP){
      myDetails.set("pfp", selectedPFP)
    }

    if(userName){
      myDetails.set("username", userName)
    }

    if(theFile){
      const data = theFile
      const file = new Moralis.File(data.name, data)
      await file.saveIPFS()
      myDetails.set("banner", file.ipfs())
    }

    await myDetails.save()
    window.location.reload()

  }

  const onBannerClick = () => {
    inputFile.current.click();
  }

  return (
    <>
      <div className="pageIdentify"> Settings</div>
      <div className="settingsPage">
        <Input
          label="Name"
          name="NameChange"
          width="100%"
          labelBgColor="#141d26"
          onChange={(e) => setuserName(e.target.value) }
        ></Input>
        <Input
          label="Bio"
          name="bioChange"
          width="100%"
          labelBgColor="#141d26"
          onChange={(e) => setbio(e.target.value)}
        ></Input>      

        <div className="pfp">
          Profile Image (Your NFTs)
          <div className="pfpOptions">

            {pfps ? pfps.map((e, i) => {
                return(
                  <>
                    <img alt="img" src={e}  className={selectedPFP === e ? "pfpOptionSelected" :"pfpOption"} onClick={() => setSelectedPFP(pfps[i])}/>
                  </>
                )
              })
              : pfpsDefault.map((e, i) => {
                return(
                  <>
                    <img alt="img" src={e}  className={selectedPFP === e ? "pfpOptionSelected" :"pfpOption"} onClick={() => setSelectedPFP(pfps[i])}/>
                  </>
                )
              })
            }
          </div>
        </div>

{/* Frontend to save the image */}
        <div className="pfp">
          Profile Banner
          <div className="pfpOptions">
              <img 
                alt={selectedImage}
                src={selectedImage}  
                className="banner"
                onClick={onBannerClick}/>
              <input
                type="file"
                name="file"
                ref={inputFile}
                onChange={chageHandler}
                style={{display: "none"}}
              ></input>
          </div>
        </div>

        {/* ***********Missing saving functionality************ */}
        <div className="save" onClick={saveEdits}> 
          Save
        </div>

      </div>

    </>
  );
};

export default Settings;

