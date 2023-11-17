// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

contract TimesheetContract {
    // Structure to hold timesheet details
    struct Timesheet {
        uint256 timesheetTimestamp; // When the work was done
        address workerAddress; // Who did the work
        string description; // Description of the work done
    }
    struct TimesheetWithWorkerName {
        uint256 timesheetTimestamp;
        string workerName;
        string description;
    }

    // Array to hold all timesheets
    Timesheet[] public timesheets;
    TimesheetWithWorkerName[] public timesheetsWithWorkerName;

    // Event to notify clients when a new timesheet is added
    event TimesheetAdded(
        uint256 timesheetTimestamp,
        address worker,
        string description
    );
    event TimesheetWithWorkerNameAdded(
        uint256 timesheetTimestamp,
        string workerName,
        string description
    );

    function addTimesheetWithAccount(string memory _description) public {
        Timesheet memory newTimesheet = Timesheet({
            timesheetTimestamp: block.timestamp,
            workerAddress: msg.sender,
            description: _description
        });

        timesheets.push(newTimesheet);
        emit TimesheetAdded(
            newTimesheet.timesheetTimestamp,
            newTimesheet.workerAddress,
            newTimesheet.description
        );
    }

    function addTimesheetWithWorkerName(
        string memory _workerName,
        string memory _description
    ) public {
        TimesheetWithWorkerName
            memory newTimesheetWithWorkerName = TimesheetWithWorkerName({
                timesheetTimestamp: block.timestamp,
                workerName: _workerName,
                description: _description
            });

        timesheetsWithWorkerName.push(newTimesheetWithWorkerName);
        emit TimesheetWithWorkerNameAdded(
            newTimesheetWithWorkerName.timesheetTimestamp,
            newTimesheetWithWorkerName.workerName,
            newTimesheetWithWorkerName.description
        );
    }

    /**
     * @dev Get a timesheet by its index.
     * @param index Index of the timesheet in the array.
     */
    function getTimesheet(
        uint256 index
    ) public view returns (uint256, address, string memory) {
        require(index < timesheets.length, "Index out of bounds.");
        Timesheet memory ts = timesheets[index];
        return (ts.timesheetTimestamp, ts.workerAddress, ts.description);
    }

    /**
     * @dev Get a timesheet with worker name by its index.
     * @param index Index of the timesheet in the array.
     */
    function getTimesheetWithWorkerName(
        uint256 index
    ) public view returns (uint256, string memory, string memory) {
        require(
            index < timesheetsWithWorkerName.length,
            "Index out of bounds."
        );
        TimesheetWithWorkerName memory ts = timesheetsWithWorkerName[index];
        return (ts.timesheetTimestamp, ts.workerName, ts.description);
    }

    /**
     * @dev Get total number of timesheets.
     */
    function getTimesheetCount() public view returns (uint256) {
        return timesheets.length;
    }

    /**
     * @dev Get total number of timesheets with worker names.
     */
    function getTimesheetWithWorkerNameCount() public view returns (uint256) {
        return timesheetsWithWorkerName.length;
    }
}
