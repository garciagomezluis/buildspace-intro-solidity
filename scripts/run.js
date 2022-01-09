const main = async () => {
    const [deployer, randomPerson] = await hre.ethers.getSigners();

    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.1")
    });
    await waveContract.deployed();

    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);

    console.log("Contract deployed to:", waveContract.address);
    console.log("Contract deployed by:", deployer.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));

    let waveCount = await waveContract.getTotalWaves();
    console.log(waveCount.toString());

    let waveTxn1 = await waveContract.wave("hola mundo desde deployer");
    await waveTxn1.wait();    

    waveCount = await waveContract.getTotalWaves();
    console.log(waveCount.toString());

    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));

    let waveTxn2 = await waveContract.connect(randomPerson).wave("hola mundo desde otra cuenta");
    await waveTxn2.wait();

    waveCount = await waveContract.getTotalWaves();
    console.log(waveCount.toString());

    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));

    waveTxn = await waveContract.connect(randomPerson).wave("hola mundo desde otra cuenta");
    await waveTxn.wait();

    waveCount = await waveContract.getTotalWaves();
    console.log(waveCount.toString());

    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));

    console.log(await waveContract.getWaves());
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch(error) {
        console.log(error);
        process.exit(1);
    }
}

runMain();
