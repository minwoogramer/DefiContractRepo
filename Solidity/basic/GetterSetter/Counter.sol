// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Counter {
    // Write your code here
    uint public count;

    function inc() external {
        count += 1;
    }

    function dec() external {
        count -= 1;
    }
}
