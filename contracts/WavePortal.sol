// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {

    event NewWave(address indexed from, string message, uint256 timestamp);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] private _waves;

    uint256 private prizeAmount = 0.0001 ether;

    uint256 private seed;

    mapping(address => uint256) lastWavedAt;

    constructor() payable {
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        require(lastWavedAt[msg.sender] + 30 seconds <= block.timestamp, "Wait 30 seconds");

        _waves.push(Wave(msg.sender, _message, block.timestamp));

        seed = (block.timestamp + block.difficulty + seed) % 100;
        console.log("Random # generated: %d", seed);

        if(seed <= 50) {
            console.log("%s won!", msg.sender);

            require(prizeAmount <= address(this).balance, "Not enough funds");

            (bool success, ) = (msg.sender).call{value: prizeAmount}("");

            require(success, "Failed reward");
        }

        lastWavedAt[msg.sender] = block.timestamp;

        emit NewWave(msg.sender, _message, block.timestamp);

        console.log("New wave %s %s", msg.sender, _message);
    }

    function getWaves() public view returns(Wave[] memory) {
        console.log("Asked for all waves");

        return _waves;
    }

    function getTotalWaves() public view returns(uint256) {
        console.log("Total waves %s", _waves.length);

        return _waves.length;
    }

}
