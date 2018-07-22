pragma solidity ^0.4.24;

import "./OriginalPermissionedToken.sol";

contract OriginalPermissionedTokenMock is OriginalPermissionedToken {
    constructor(string _key, string _link) public {
        owner = msg.sender;
        link = _link;
        newOwner = address(0);
        key = _key;
    }
}