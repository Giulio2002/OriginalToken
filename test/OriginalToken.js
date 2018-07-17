var OriginalToken = artifacts.require("./OriginalToken");
var assertRevert = require("../utils/assertRevert.js");
require("babel-polyfill");

const key = "encrypedPassword";
const link = "https://pbs.twimg.com/media/B2h00oHCYAAQ_X8.jpg" 

contract('OriginalToken', function([author,friend]) {
  let token;
  beforeEach(async function() {
    token = await OriginalToken.new(key, link,{from: author});
  })

  it("should start with the right setup", async function(){
    assert.equal(await token.owner(),author);
    assert.equal(await token.encryptedKey(),key);
    assert.equal(await token.link(),link);
  })
  it("the author should send the content to his friend and the friend accept it successfully", async function() {
    /*
      Ok, listen up the functon 'sendToken' would have been called 'send'
      without 'token' but because truffle is a good framework if i call it 'send'
      it requires 857473574957397543754597348653978489 ethers to execute the function :-)*/
    await token.sendToken(friend,{
      from: author,
    });
    //the user accept
    await token.accept({
      from: friend,
    })
    assert.equal(await token.owner(),friend);
  })

    it("the author should send the content to his friend and the friend refuse it successfully", async function() {

    await token.sendToken(friend,{
      from: author,
    });
    //the user refuse
    await token.refuse({
      from: friend,
    })
    assert.equal(await token.owner(),author);
  })
});
