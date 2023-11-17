// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

//Compared to state variables, constant variables use less gas.
contract Constants {
    address public constant MY_ADDR =
        0x777788889999AaAAbBbbCcccddDdeeeEfFFfCcCc;
    uint public constant MY_UINT = 123;
}
