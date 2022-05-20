import React from "react";
import { defaultImgs } from "../defaultimgs";
import './TweetInFeed.css';
import { Icon } from "web3uikit";
import { useMoralis } from "react-moralis";
import { useState } from "react";
import { useEffect } from "react";


const TweetInFeed = ({profile}) => {

  const [tweetArr, settweetArr] = useState();
  const {Moralis, account } = useMoralis()

  useEffect(() => {
    async function getTweets(){
      try{
        const Tweets = Moralis.Object.extend("Tweets")
        const query = new Moralis.Query(Tweets)
        // We need this to include in Profile page our own tweets``
        if(profile){
          query.equalTo("tweeterAcc", account)
        }
        const results = await query.find()

        settweetArr(results)
        // console.log(results);
      }catch(error){
        console.log(error.message);
      }
    }
    getTweets()
  }, [profile]);
  

  return (
    <>

      {tweetArr?.map((e, i) => {return(
        <div key={i}>
          <div  className="feedTweet">
            <img src={e.attributes.tweeterPfp ? e.attributes.tweeterPfp : defaultImgs[0] } alt={"Profile pic"} className="profilePic"/>
            <div className="completeTweet">
              <div className="who">
                {e.attributes.tweeterUserName.slice(0,6)}
                <div className="accWhen">
                  {`${e.attributes.tweeterAcc.slice(0,4)}...${e.attributes.tweeterAcc.slice(38)} -
                  ${e.attributes.createdAt.toLocaleString('en-us', { month: 'short'})}
                  ${e.attributes.createdAt.toLocaleString('en-us', { day: 'numeric'})}                
                  `}
                </div>
              </div>
              <div className="tweetContent">
                  {e.attributes.tweetTxt}
                  {e.attributes.tweetImg && (
                  <img src={e.attributes.tweetImg} alt={`Img: ${i}`} className="tweetImg" />
                  )}
                </div>


              <div className="interactions">
                <div className="interactionsNums">
                  <Icon fill="#3f3f3f" size={20} svg="messageCircle"></Icon>
                </div>
                <div className="interactionsNums">
                  <Icon fill="#3f3f3f" size={20} svg="star"></Icon>
                  12
                </div>        
                <div className="interactionsNums">
                  <Icon fill="#3f3f3f" size={20} svg="avax"></Icon>
                </div>
              </div>
            </div>
          </div>      
        </div>
      )}).reverse()

      }

      {/* <div className="feedTweet">


        <img src={defaultImgs[0]} className="profilePic"/>
        <div className="completeTweet">
          <div className="who">
            Juhizzz
            <div className="accWhen">0x42..38  - 1h</div>
          </div>
          <div className="tweetContent">
            Nice day programming some stuff
            <img src={golf} className="tweetImg" />
          </div>


          <div className="interactions">
            <div className="interactionsNums">
              <Icon fill="#3f3f3f" size={20} svg="messageCircle"></Icon>
            </div>
            <div className="interactionsNums">
              <Icon fill="#3f3f3f" size={20} svg="star"></Icon>
              12
            </div>        
            <div className="interactionsNums">
              <Icon fill="#3f3f3f" size={20} svg="avax"></Icon>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default TweetInFeed;

