const { ethers, getNamedAccounts, network } = require("hardhat");
const { getWeth, AMOUNT } = require("../scripts/getWeth.js");
const { networkConfig } = require("../helper-hardhat-config");

async function main() {
    await getWeth();
    const { deployer } = await getNamedAccounts();
    const pool = await getPool(deployer);
    
    const wethTokenAddress = networkConfig[network.config.chainId].wethToken;
    const daiTokenAddress = networkConfig[network.config.chainId].daiToken;

    const iWeth = await ethers.getContractAt(
        "IWeth",
        wethTokenAddress,
        deployer
    );
    
    const balance = await iWeth.balanceOf(deployer);
    console.log(`Deployer's WETH balance: ${ethers.utils.formatEther(balance)} WETH`);
    
    if (balance.lt(AMOUNT)) {
        console.log("Insufficient balance");
        return;
    }
    
    console.log("Approving WETH for Pool...");
    await approveErc20(wethTokenAddress, pool.address, AMOUNT, deployer);
    
    console.log("Supplying WETH to Pool...");
    try {
        const userData = await pool.getUserAccountData(deployer);
        console.log("User account data:", userData);

        
        const supplyTx = await pool.supply(
            wethTokenAddress,   
            AMOUNT,             
            deployer,          
            0,                 
            {
                gasLimit: 500000,
                gasPrice: (await ethers.provider.getGasPrice()).mul(120).div(100) // 20% higher
            }
        );
        
        console.log("Supply transaction submitted:", supplyTx.hash);
        console.log(supplyTx);
        const receipt = await supplyTx.wait();
        console.log("Supply transaction status:", receipt.status);
        
        if (receipt.status === 0) {
            const tx = await ethers.provider.getTransaction(receipt.transactionHash);
            const code = await ethers.provider.call(tx, tx.blockNumber);
            console.log("Revert reason:", ethers.utils.toUtf8String(code.slice(138)));
        }
    } catch (error) {
        console.error("Detailed error information:");
        console.error("Error message:", error.message);
        if (error.transaction) {
            console.error("Transaction data:", error.transaction.data);
        }
        if (error.receipt) {
            console.error("Transaction receipt:", error.receipt);
        }
        throw error;
    }
}

async function approveErc20(erc20Address, spenderAddress, amount, signer) {
    const erc20Token = await ethers.getContractAt("IERC20", erc20Address, signer);
    
    // First check existing allowance
    const currentAllowance = await erc20Token.allowance(signer, spenderAddress);
    console.log("Current allowance:", currentAllowance.toString());
    
    if (currentAllowance.lt(amount)) {
        console.log("Approving exact amount needed...");
        const tx = await erc20Token.approve(spenderAddress, amount, {
            gasLimit: 100000,
            gasPrice: (await ethers.provider.getGasPrice()).mul(120).div(100)
        });
        await tx.wait(1);
        
        // Verify approval
        const newAllowance = await erc20Token.allowance(signer, spenderAddress);
        console.log("New allowance:", newAllowance.toString());
    } else {
        console.log("Sufficient allowance already exists");
    }
}

// ... rest of the helper functions remain the same ...

async function borrowDai(daiAddress, pool, amountDaiToBorrow, account) {
    try {
        const borrowTx = await pool.borrow(
            daiAddress,
            amountDaiToBorrow,
            BORROW_MODE,
            0, // referralCode
            account,
            { gasLimit: 1000000 }
        );
        await borrowTx.wait(1);
        console.log("Borrow transaction confirmed!");
    } catch (error) {
        throw new Error(`Borrow failed: ${error.message}`);
    }
}

// ... rest of the helper functions remain the same ...
async function getPool(account) {
    const poolAddressesProvider = await ethers.getContractAt(
        "IPoolAddressesProvider",
        networkConfig[network.config.chainId].lendingPoolAddressesProvider,
        account
    );

  
    
    const poolAddress = await poolAddressesProvider.getPool();
    const pool = await ethers.getContractAt("IPool", poolAddress, account);
    return pool;
}

async function getBorrowUserData(pool, account) {
    const {
        totalCollateralBase,
        totalDebtBase,
        availableBorrowsBase
    } = await pool.getUserAccountData(account);
    console.log(`You have ${totalCollateralBase} worth of ETH deposited.`);
    console.log(`You have ${totalDebtBase} worth of ETH borrowed.`);
    console.log(`You can borrow ${availableBorrowsBase} worth of ETH.`);
    return { availableBorrowsETH: availableBorrowsBase, totalDebtETH: totalDebtBase };
}

async function getDaiPrice() {
    const daiEthPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        networkConfig[network.config.chainId].daiEthPriceFeed
    );
    const price = (await daiEthPriceFeed.latestRoundData())[1];
    console.log(`The DAI/ETH price is ${price.toString()}`);
    return price;
}

async function approveErc20(erc20Address, spenderAddress, amount, signer) {
    try {
        const erc20Token = await ethers.getContractAt("IERC20", erc20Address, signer);
        const txResponse = await erc20Token.approve(spenderAddress, amount);
        console.log("Waiting for approval transaction to be mined...");
        await txResponse.wait(1);
        const allowance = await erc20Token.allowance(signer, spenderAddress);
        if (allowance.gte(amount)) {
            console.log("Approval successful! Spender has been granted the allowance." + allowance);
        } else {
            console.error("Approval failed. The spender's allowance is less than the expected amount.");
        }
    } catch (error) {
        console.error("Error during approval process:", error);
    }
}


async function borrowDai(daiAddress, pool, amountDaiToBorrow, account) {
    const borrowTx = await pool.borrow(
        daiAddress,
        amountDaiToBorrow,
        BORROW_MODE,
        0,
        account
    );
    await borrowTx.wait(1);
    console.log("You've borrowed!");
}

async function repay(amount, daiAddress, pool, account) {
    await approveErc20(daiAddress, pool.address, amount, account);
    const repayTx = await pool.repay(daiAddress, amount, BORROW_MODE, account);
    await repayTx.wait(1);
    console.log("Repaid!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
