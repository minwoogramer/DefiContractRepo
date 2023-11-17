import { expect } from "chai";
import { ethers } from "hardhat";
import { TimesheetContract, TimesheetContract__factory } from "../typechain-types";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

describe("TimesheetContract", function () {
  let TimesheetContract: TimesheetContract__factory;
  let timesheetContract: TimesheetContract;
  let addr1: any;
  let addr2: any;
  let addrs: any;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    TimesheetContract = await ethers.getContractFactory("TimesheetContract");
    [addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call TimesheetContract.deploy() and await
    // for it to be deployed(), which happens once its transaction has been mined.
    timesheetContract = await TimesheetContract.deploy();

    return timesheetContract.getAddress();
  });

  describe("Timesheet entries", function () {
    it("Should create a new timesheet with account", async function () {
      await timesheetContract.connect(addr1).addTimesheetWithAccount("Worked 5 hours");

      // validate timesheet entry
      const [timestamp, workerAddress, description] = await timesheetContract.getTimesheet(0);
      expect(workerAddress).to.equal(addr1.address);
      expect(description).to.equal("Worked 5 hours");
      // you might want to validate the timestamp as well
    });

    it("Should create a new timesheet with worker name", async function () {
      await timesheetContract.connect(addr1).addTimesheetWithWorkerName("Alice", "Completed the project");

      // validate timesheet entry
      const [timestamp, workerName, description] = await timesheetContract.getTimesheetWithWorkerName(0);
      expect(workerName).to.equal("Alice");
      expect(description).to.equal("Completed the project");
      // you might want to validate the timestamp as well
    });

    it("Should not allow to get a timesheet out of bounds", async function () {
      // attempt to fetch a timesheet at an index where there is none should revert
      await expect(timesheetContract.getTimesheet(0)).to.be.revertedWith("Index out of bounds.");
    });

    it("Should return the correct count of timesheets", async function () {
      // no timesheet entry at the beginning
      expect(await timesheetContract.getTimesheetCount()).to.equal(0);

      await timesheetContract.connect(addr1).addTimesheetWithAccount("Worked for 3 hours");
      await timesheetContract.connect(addr2).addTimesheetWithAccount("Worked for 4 hours");

      // should be 2 after adding
      expect(await timesheetContract.getTimesheetCount()).to.equal(2);
    });

    it("Should emit event when timesheet with account is added", async function () {
      // Wait for the event to be emitted upon calling the function
      await expect(timesheetContract.connect(addr1).addTimesheetWithAccount("Worked 5 hours"))
        .to.emit(timesheetContract, "TimesheetAdded")
        .withArgs(anyValue, addr1.address, "Worked 5 hours"); // anyValue is used to ignore timestamp matching
    });

    it("Should emit event when timesheet with worker name is added", async function () {
      await expect(timesheetContract.connect(addr1).addTimesheetWithWorkerName("Alice", "Completed the project"))
        .to.emit(timesheetContract, "TimesheetWithWorkerNameAdded")
        .withArgs(anyValue, "Alice", "Completed the project");
    });

    it("Should not allow to get a timesheet with worker name out of bounds", async function () {
      await expect(timesheetContract.getTimesheetWithWorkerName(0)).to.be.revertedWith("Index out of bounds.");
    });

    it("Should return the correct count of timesheets with worker names", async function () {
      expect(await timesheetContract.getTimesheetWithWorkerNameCount()).to.equal(0);

      await timesheetContract.connect(addr1).addTimesheetWithWorkerName("Bob", "Worked on integration");
      await timesheetContract.connect(addr2).addTimesheetWithWorkerName("Alice", "Worked on frontend");

      expect(await timesheetContract.getTimesheetWithWorkerNameCount()).to.equal(2);
    });
  });
});
