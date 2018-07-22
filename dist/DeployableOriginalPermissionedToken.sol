pragma solidity ^0.4.24;

// File: contracts/Original.sol

interface Original {
    function sendToken(address _to) external returns(bool);
    function accept() external returns(bool);
    function refuse() external returns(bool);
    function cancel() external returns(bool);
    function setKey(string _newKey) external returns(bool);
    function setLink(string _link) external returns(bool);
    function isPending() external constant returns(bool);
    function kill() external returns(bool);
}

// File: contracts/OriginalPermissionedToken.sol

contract OriginalPermissionedToken is Original {

    address public owner;
    string internal key;
    string internal link;
    address internal newOwner;

    function sendToken(address _to) external returns(bool) {
        require(owner == msg.sender,"not the owner");
        require(newOwner == address(0),"pending payment");
        newOwner = _to;
        return true;
    }
    
    
    function accept() external returns(bool) { 
        require(msg.sender == newOwner,"not the recipient");
        owner = newOwner;
        newOwner = address(0);
        return true;
    }

    function refuse() external returns(bool) {
        require(msg.sender == newOwner,"not the recipient");
        newOwner = address(0);
        return true;
    }
    
    function cancel() external returns(bool) {
        require(msg.sender == owner,"not the owner");
        require(newOwner != address(0),"pending payment");
        newOwner = address(0);
        return true;
    }

    function isPending() external constant returns(bool) {
        return newOwner != address(0);
    }

    function setKey(string _newKey) external returns(bool) {
        require(msg.sender == owner,"not the owner");
        require(newOwner == address(0),"pending payment");
        key = _newKey;
        return true;
    }
    
    function setLink(string _link) external returns(bool) {
        require(msg.sender == owner,"not the owner");
        require(newOwner == address(0),"pending payment");
        link = _link;
        return true;
    }

    function kill() external returns(bool) {
        require(msg.sender == owner,"not the owner");
        require(newOwner == address(0),"pending payement");
        selfdestruct(owner);
        return true;
    }

    function getKey() external constant returns(string) {
        require(msg.sender == owner);
        return key;
    }

    function getLink() external constant returns(string) {
        require(msg.sender == owner);
        return link;
    }
}

// File: contracts/OriginalPermissionedTokenMock.sol

contract DeployableOriginalPermissionedToken is OriginalPermissionedToken {
    constructor(string _key, string _link) public {
        owner = msg.sender;
        link = _link;
        newOwner = address(0);
        key = _key;
    }
}
