// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

//mainly use intitial contract statements
contract ConstructorIntro {
    address public owner;
    uint public x;

    constructor(uint _x) {
        // Here the owner is set to the caller
        owner = msg.sender;
        x = _x;
    }
}
