pragma solidity ^0.4.24;

contract OriginalToken {

    string public encryptedKey;
    string public link;
    address public owner;
    address private newOwner;
    
    constructor(string _encryptedKey, string _link) public {
        owner = msg.sender;
        link = _link;
        newOwner = address(0);
        encryptedKey = _encryptedKey;
    }
    
    function sendToken(address _to) public returns(bool) {
        require(owner == msg.sender,"not the owner");
        require(newOwner == address(0),"pending payment");
        newOwner = _to;
        return true;
    }
    
    
    function accept() public returns(bool) { 
        require(msg.sender == newOwner,"not the recipient");
        owner = newOwner;
        newOwner = address(0);
        return true;
    }

    function refuse() public returns(bool) {
        require(msg.sender == newOwner,"not the recipient");
        newOwner = address(0);
        return true;
    }
    
    function cancel() public returns(bool) {
        require(msg.sender == owner,"not the owner");
        newOwner = address(0);
        return true;
    }

    function setKey(string _newKey) public returns(bool) {
        require(msg.sender == owner,"not the owner");
        require(newOwner == address(0),"pending payment");
        encryptedKey = _newKey;
        return true;
    }
    
    function setLink(string _link) public returns(bool) {
        require(msg.sender == owner,"not the owner");
        require(newOwner == address(0),"pending payment");
        link = _link;
        return true;
    }

    function kill() public {
        require(msg.sender == owner,"not the owner");
        require(newOwner == address(0),"pending payement");
        selfdestruct(owner);
    }
}