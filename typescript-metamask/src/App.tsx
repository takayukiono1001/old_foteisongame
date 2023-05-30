// App.js
import React, { useEffect, useState } from "react";
import "./styles/App.css";

const App: React.FC = () => {
  //manage account state
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [nftImageURI, setNftImageURI] = useState<string>("");

  const contractAddress = "0x6144d927ee371de7e7f8221b596f3432e7a8e6d9";
  const tokenId = "858";

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

  // connect wallet
  const connectWallet = async () => {
    try {
      // enable metamask API
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

  // check if the wallet is connected to Mumbai testnet
  const switchNetwork = async () => {
    const { ethereum } = window as any;
    if (ethereum.networkVersion === "80001") {
      console.log("Connected to Mumbai testnet");
    } else {
      alert("Switch to Mumbai testnet");
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x13881" }],
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  const fetchNFTImage = async () => {
    try {
      // Opensea APIを使用してNFTのメタデータを取得
      const response = await fetch(`https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}`);
      const data = await response.json();
      console.log("Data:", data.top_ownerships[0].owner.address);

      // NFTオーナーが接続されたウォレットと一致するか確認
      if (data && data.top_ownerships[0].owner.address.toLowerCase() === currentAccount.toLowerCase()) {
        const imageUrl = data.image_url;
        setNftImageURI(imageUrl);
      } else {
        console.log("NFT owner does not match the connected wallet account");
      }
    } catch (error) {
      console.log("Error fetching NFT image:", error);
    }
  };
  
  // const renderNotConnectedContainer = () => (
  //   <div className="connect-wallet-container">

  //     {/* Connect Wallet ボタンが押されたときのみ connectWallet関数 を呼び出します。 */}
  //     <button
  //       onClick={connectWallet}
  //       className="cta-button connect-wallet-button"
  //     >
  //       Connect Wallet
  //     </button>
  //   </div>
  // );

  //first check if MetaMask is connected
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // after connecting wallet, execute switchNetwork function
  useEffect(() => {
    if (currentAccount) {
      switchNetwork();
      fetchNFTImage(); // Fetch NFT image when the currentAccount changes
    } else {
      console.log("No current account");
    }
  }, [currentAccount]);

  // amount of square
  const totalSquares = 99 * 99;
  
  return (

    <div id="_next">
      <div id="app">
        <div data-rk>
          <style></style>
          <div className="background">
          <div className="scrollable-wrapper">
            <div className="square_zone">
              {[...Array(totalSquares)].map((_, index) => (
                <div className="square" key={index} />
              ))}
            </div>
          </div>
            <main>
              <div className="profile_zone">
                <div className="profile_main">
                  <div className="image_area">
                    {nftImageURI !== "" && <img src={nftImageURI} alt="NFT" />}
                  </div>
                  <div className="name_area">sher1ock.eth</div>
                  <div className="position">
                    <div className="position_icon"></div>
                    <div className="position_number"></div>
                  </div>
                  <div className="balance">
                    <div className="balance_icon"></div>
                    <div className="balance_number"></div>
                  </div>
                  <div className="transaction">
                    <div className="transaction_icon"></div>
                    <div className="transaction_status"></div>
                  </div>
                </div>
              </div>
              <div className="wallet_zone">
                {currentAccount === "" ? (
                <button onClick={connectWallet} className="cta-button connect-wallet-button">
                  Connect Wallet
                </button>
                ) : (
                <div className="wallet-address">
                   {currentAccount}
                </div>
                  )}
              </div>
              <div className="button_zone"></div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );

};

export default App;