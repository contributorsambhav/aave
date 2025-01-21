const networkConfig = {
    31337: {
        name: "localhost",
        wethToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        lendingPoolAddressesProvider: "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        daiEthPriceFeed: "0x773616E4d11A78F511299002da57A0a94577F1f4",
        daiToken: "0x6b175474e89094c44da98b954eedeac495271d0f",
    },
    // Due to the changing testnets, this testnet might not work as shown in the video
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
        wethToken: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
        // This is the AaveV2 Lending Pool Addresses Provider
        lendingPoolAddressesProvider: "0x5E52dEc931FFb32f609681B8438A51c675cc232d",
        // This is LINK/ETH feed
        daiEthPriceFeed: "0xb4c4a493AB6356497713A78FFA6c60FB53517c63",
        // This is the LINK token
        daiToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    },
    // Due to the different testnets, we are leaving kovan in as a reference
    42: {
        name: "kovan",
        ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
        wethToken: "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
        lendingPoolAddressesProvider: "0x506B0B2CF20FAA8f38a4E2B524EE43e1f4458Cc5",
        daiEthPriceFeed: "0x22B58f1EbEDfCA50feF632bD73368b2FdA96D541",
        daiToken: "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD",
    },
    11155111 : {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
        wethToken: "0xfff9976782d46cc05630d1f6ebab18b2324d6b14",
        lendingPoolAddressesProvider: "0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A",
        daiEthPriceFeed: "0x14866185B1962B63C3Ea9E03Bc1da838bab34C19",
        daiToken: "0x68194a729C2450ad26072b3D33ADaCbcef39D574",
        
    }
    // 11155111: {
    //     name: "sepolia",
    //     wethToken: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    //     daiToken: "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357",
    //     lendingPoolAddressesProvider: "0x0496275d34753A48320CA58103d5220d394FF77F",
    //     daiEthPriceFeed: "0x14866185B1962B63C3Ea9E03Bc1da838bab34C19",
    //     daiToken: "0x68194a729C2450ad26072b3D33ADaCbcef39D574",
    //     ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    // },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}
