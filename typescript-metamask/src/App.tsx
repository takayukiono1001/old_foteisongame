// App.js
// useStateを追加でインポートしています。
import React, { useEffect, useState } from "react";
import "./styles/App.css";

const App: React.FC = () => {
  //manage state
  const [currentAccount, setCurrentAccount] = useState<string>("");

  // connect wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window as any;

      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }

      // request access to account
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      // display account if connected
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  
  //confirms if MetaMask is installed
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window as any;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    // reuqest access to account
    const accounts = await ethereum.request({ method: "eth_accounts" });

    // use first account
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  // レンダリング関数です。まだ Connect されていない場合。
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img
        src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif"
        alt="Ninja donut gif"
      />
      {/* Connect Wallet ボタンが押されたときのみ connectWallet関数 を呼び出します。 */}
      <button
        onClick={connectWallet}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    </div>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">🐱‍👤 Ninja Name Service</p>
              <p className="subtitle">Your immortal API on the blockchain!</p>
            </div>
          </header>
        </div>

        {/* currentAccount が存在しない場合、Connect Wallet ボタンを表示します*/}
        {!currentAccount && renderNotConnectedContainer()}

        <div className="footer-container">
        </div>
      </div>
    </div>
  );

};

export default App;