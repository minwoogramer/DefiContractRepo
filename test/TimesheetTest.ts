import { ethers } from "hardhat";
import { BaseContract, ContractTransactionResponse, Contract } from "ethers";
import { TimesheetContract } from "../typechain-types/TimesheetContract";
import { expect } from "chai";

describe("TimesheetContract", function () {
  let timesheetContract: TimesheetContract;

  beforeEach(async () => {
    // Compile and deploy the contract
    const ContractFactory = await ethers.getContractFactory("TimesheetContract");
    timesheetContract = (await ContractFactory.deploy()) as TimesheetContract;
    await timesheetContract.waitForDeployment();
  });

  it("Should add a timesheet with an account address", async function () {
    const tx = await timesheetContract.addTimesheetWithAccount("Test Work");
    await tx.wait();

    const timesheetCount = await timesheetContract.getTimesheetCount();
    expect(timesheetCount).to.equal(1);

    const [timestamp, address, description] = await timesheetContract.getTimesheet(0);
    expect(description).to.equal("Test Work");
  });

  it("Should add a timesheet with a worker's name", async function () {
    const tx = await timesheetContract.addTimesheetWithWorkerName("Alice", "Test Work");
    await tx.wait();

    const timesheetCount = await timesheetContract.getTimesheetWithWorkerNameCount();
    expect(timesheetCount).to.equal(1);

    const [timestamp, name, description] = await timesheetContract.getTimesheetWithWorkerName(0);
    expect(name).to.equal("Alice");
    expect(description).to.equal("Test Work");
  });

  it("Should not allow fetching non-existent timesheets", async function () {
    await expect(timesheetContract.getTimesheet(0)).to.be.revertedWith("Index out of bounds.");
    await expect(timesheetContract.getTimesheetWithWorkerName(0)).to.be.revertedWith("Index out of bounds.");
  });
});
