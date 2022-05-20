import React from "react";
import { useState, useRef } from "react";
import { Icon, TextArea } from "web3uikit";
import { defaultImgs } from "../defaultimgs";
import  TweetInFeed  from "../components/TweetInFeed"
import "./Home.css";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";


const Home = () => {

  const {Moralis} = useMoralis()
  const user = Moralis.User.current()

// Execution function to interact with your smart contract
  const contractProcessor = useWeb3ExecuteFunction()

  const inputFileRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState()
  const [theFile, settheFile] = useState();
  const [tweet, settweet] = useState();

  const avalancheTweet = async () => {

    if(!tweet) return;

    let img;
    console.log(theFile);
    if(theFile){
      const data = theFile
      const file = new Moralis.File(data.name, data)
      await file.saveIPFS()
      img = file.ipfs()
    }else{
      img = "No img"
    }

    let options = {
      contractAddress: "0x4E87832300362e72861cd61476857319395Ed03f",
      functionName: "addTweet",
      abi: [{
          "inputs": [
            {
              "internalType": "string",
              "name": "tweetTxt",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "tweetImg",
              "type": "string"
            }
          ],
          "name": "addTweet",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        }],
        params: {
          tweetTxt: tweet,
          tweetImg: img,
        },
        msgValue: Moralis.Units.ETH(1)
    }

    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        saveTweet()
      },
      onError: (error) => {
        console.log(error.data.message);
      }
    });

  }


  const saveTweet = async () => {
    if(!tweet){
      return
    }

    const Tweets = Moralis.Object.extend("Tweets")

    const newTweet = new Tweets()

    newTweet.set("tweetTxt", tweet)
    newTweet.set("tweeterPfp", user.attributes.pfp)
    newTweet.set("tweeterAcc", user.attributes.ethAddress)
    newTweet.set("tweeterUserName", user.attributes.username)

    if(theFile){
      const data = theFile
      const file = new Moralis.File(data.name, data);
      await file.saveIPFS()
      newTweet.set("tweetImg", file.ipfs())
    }

    await newTweet.save()
    window.location.reload()

  }


  const chageHandler = (event) => {
    const img = event.target.files[0];
    settheFile(img);
    setSelectedFile(URL.createObjectURL(img));

  }

  const onImageClick = () => {
    inputFileRef.current.click();
  } 

  return (
    <>
      <div className="mainContent">

        <div className="profileTweet">
          <img
            src={ user.attributes.pfp ? user.attributes.pfp : defaultImgs[0]}
            className="profilePic"
            alt="profileTweet"
          >
          </img>


          <div className="tweetBox">

            <TextArea
              label=""
              name="tweetTxtArea"
              value="GM World"
              type="text"
              width="95%"
              onChange={e => settweet(e.target.value)}
            ></TextArea>
            {selectedFile && (
                <img src={selectedFile} className="tweetImg" alt="tweetImg"></img>
            )}


            <div className="imgOrTweet">
              <div className="imgDiv" onClick={onImageClick}>
                <input
                  type="file"
                  name="file"
                  ref={inputFileRef}
                  onChange={chageHandler}
                  style={{display: "none"}}
                ></input>
                <Icon fill="white" size={20} svg="image"></Icon>
              </div>
              <div className="tweetOptions">
                <div className="tweet" onClick={saveTweet}>
                  Tweet
                </div>
                <div className="tweet" style={{backgroundColor: "red"}} onClick={avalancheTweet }>
                  <Icon fill="white" size={20} svg="avax"></Icon>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        <TweetInFeed></TweetInFeed>
        

      </div>  
            
    </>
  );
};

export default Home;
