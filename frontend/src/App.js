import './App.css';
import {useEffect, useState} from 'react'
import * as anchor from "@project-serum/anchor";
import {Buffer} from 'buffer';
import idl from './idl.json'
import { Connection, PublicKey, clusterApiUrl  } from '@solana/web3.js';
import { Program, AnchorProvider, web3, utils } from '@project-serum/anchor';
import { FeedPostDesign } from './feedPostDesign';

const {SystemProgram,Keypair} = web3;

window.Buffer = Buffer
const programID = new PublicKey(idl.metadata.address)
const network = clusterApiUrl("devnet")
const opts = {
  preflightCommitment:"processed",
}
const feedPostApp = Keypair.generate();
const connection = new Connection(network, opts.preflightCommitment);
const connection1 = new Connection(network, 'confirmed');


const App = () => {
  const [Loading, setLoading] = useState(false)
  const [datas,setData] = useState([])
  const [walletaddress, setWalletAddress] = useState("");
  
  const { solana } = window;
  const getProvider = () => {
    //Creating a provider, the provider is authenication connection to solana
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };

  const checkIfWalletIsConnected = async () => {
    try {
      setLoading(true)
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          const response = await solana.connect({
            onlyIfTrusted: true, //second time if anyone connected it won't show anypop on screen
          });
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found!, Get a Phantom Wallet");
      }
    } catch (error) {
      console.log(error.message);
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  const onLoad = () => {
    checkIfWalletIsConnected();
    getPosts();
  };

  const connectWalletRenderPopup = async () => {
    try{
      setLoading(true)
      if (solana) {
        const response = await solana.connect();
        setWalletAddress(response.publicKey.toString());
      }
    }catch(err){
      console.log(err)
    }finally{
      setLoading(false)
    }
  };

  const connect = () => {
    return (
      <button onClick={connectWalletRenderPopup} className="buttonStyle"> {Loading ? <p>loading...</p>: <p>Connect Your Wallet To Post </p>}    </button>
    );
  };

  const createPostFunction = async(text,hastag,position) =>{
    const provider = getProvider()
    const program = new Program(idl,programID,provider)
    const num = new anchor.BN(position);
    try{
      const tx = await program.rpc.createPost(text,hastag,num,false,{
        accounts:{
          feedPostApp:feedPostApp.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers:[feedPostApp]
      })
      //const account_data  = await program.account.feedPostApp.fetch(feedPostApp.publicKey)
      //console.log('user_data',user_data,'tx',tx,'feedpostapp',feedPostApp.publicKey.toString(),'user',provider.wallet.publicKey.toString(),'systemProgram',SystemProgram.programId.toString())
      onLoad();
    }catch(err){
      console.log(err)
    }
  }

  const getPosts = async() =>{
    const provider = getProvider();
    const program = new Program(idl,programID,provider)
    try{
      setLoading(true)
      Promise.all(
        ((await connection1.getProgramAccounts(programID)).map(async(tx,index)=>(
          {
          ...(await program.account.feedPostApp.fetch(tx.pubkey)),
            pubkey:tx.pubkey.toString(),
        }
        )))
    ).then(result=>{
      result.sort(function(a,b){return b.position.words[0] - a.position.words[0] })
      setData([...result])
    })
    }catch(err){
      console.log(err)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className='App'>
      <FeedPostDesign posts={datas} createPostFunction={createPostFunction}  walletaddress={walletaddress} connect={connect} Loading={Loading} />
    </div>
  );
};

export default App;
