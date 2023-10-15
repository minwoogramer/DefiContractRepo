import { ethers, run, network } from "hardhat";

async function deployToNetwork(networkName: string) {
  console.log(`Deploying to ${networkName}...`);

  // Change the network context
  network.name = networkName;

  const Timesheet = await ethers.getContractFactory("TimesheetContract");
  const timesheet = await Timesheet.deploy();

  await timesheet.waitForDeployment();
  const address = await timesheet.getAddress();
  console.log(`Deployed to ${networkName} at address ${address}\n`);
}

async function main() {
  const networks = ["avalanche_wyzrs_subnet", "saga_wyzrs_chainlet"];

  for (const net of networks) {
    await deployToNetwork(net);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
