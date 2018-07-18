pragma solidity ^0.4.24;

import "./OriginalToken.sol";

contract OriginalTokenMock is OriginalToken {
    constructor(string _encryptedKey, string _link) public {
        owner = msg.sender;
        link = _link;
        newOwner = address(0);
        encryptedKey = _encryptedKey;
    }
}