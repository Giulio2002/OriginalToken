pragma solidity ^0.4.24;

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