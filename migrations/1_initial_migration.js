var Migrations = artifacts.require("./Migrations.sol");
var OriginalToken = artifacts.require("./OriginalToken.sol");

const key = "encrypedPassword";
const link = "https://pbs.twimg.com/media/B2h00oHCYAAQ_X8.jpg" 

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(OriginalToken,key,link);
};
