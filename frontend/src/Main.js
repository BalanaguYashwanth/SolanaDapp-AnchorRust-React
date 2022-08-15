import React,{useEffect,useState} from "react";
import "./Main.css";
import idl from './idl.json' //copy from target folder inside idl.json

const App = () => {
  const [walletAddress, setWalletAdresss] = useState("");
  const [Loding, setLoading] = useState(false)

  useEffect(() => {
    const onLoad = () => {
      checkIfWalletConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  const checkIfWalletConnected = async () => {
    const { solana } = window;
    try {
		setLoading(true)
      if (solana) {
        if (solana.isPhantom) {
          console.log("phatom is connected");
          const response = await solana.connect({
            onlyIfTrusted: true, //second time if anyone connected it won't show anypop on screen
          });
          setWalletAdresss(response.publicKey.toString());
          console.log("public key", response.publicKey.toString());
        }
      }
    } catch (err) {
      console.log(err);
    }finally{
		setLoading(false)
	}
  };

  const connectWallet = async () => {
    const { solana } = window;
	try{
		setLoading(true)
		if (solana) {
			const response = await solana.connect(); //to disconnect use "solana.disconnect()"
			setWalletAdresss(response.publicKey.toString());
		  } else {
			alert("Please Install Solana's Phantom Wallet");
		  }
	}catch(err){
		console.log(err)
	}finally{
		setLoading(false)
	}
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">NFT drop machine with fair mint</p>
          <p>
            {!Loding ? (
              <button
                className="cta-button connect-wallet-button"
                onClick={!walletAddress ? connectWallet : undefined}
              >
                {!walletAddress ? (
                  <span> Connect Wallet </span>
                ) : (
                  <span> Connected </span>
                )}
              </button>
            ) : (
              <button className="cta-button connect-wallet-button">
                Loading...
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
