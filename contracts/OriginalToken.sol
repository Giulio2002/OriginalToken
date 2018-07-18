pragma solidity ^0.4.24;

import "./Original.sol";

contract OriginalToken is Original {

    string public encryptedKey;
    string public link;
    address public owner;
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
        encryptedKey = _newKey;
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
}