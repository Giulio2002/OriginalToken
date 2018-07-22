var OriginalToken = artifacts.require("./OriginalPermissionedTokenMock");
var assertRevert = require("../utils/assertRevert.js");
require("babel-polyfill");

const key = "encrypedPassword";
const link = "https://pbs.twimg.com/media/B2h00oHCYAAQ_X8.jpg"

contract('OriginalPermissionedToken', function([author, friend, user]) {
    let token;
    beforeEach(async function() {
        token = await OriginalToken.new(key, link, {
            from: author
        });
    })

    it("should start with the right setup", async function() {
        assert.equal(await token.owner(), author);
        assert.equal(await token.getKey({from: author}), key);
        assert.equal(await token.getLink({from: author}), link);
    })
    
    it("the owner can change the key", async function() {
      await token.setKey("new key",{
        from: author
      })

      assert.equal(await token.getKey({from: author}),"new key")
    })

    it("the owner can change the link", async function() {
      await token.setLink("https://www.youtube.com/watch?v=tas0O586t80",{
        from: author
      })

      assert.equal(await token.getLink({from: author}),"https://www.youtube.com/watch?v=tas0O586t80")
    })
    
    it("the author should send the content to his friend and the friend accept it successfully", async function() {
        /*
          Ok, listen up the functon 'sendToken' would have been called 'send'
          without 'token' but because truffle is a good framework if i call it 'send'
          it requires 857473574957397543754597348653978489 ethers to execute the function :-)*/
        await token.sendToken(friend, {
            from: author,
        });
        //the user accept
        await token.accept({
            from: friend,
        })
        assert.equal(await token.owner(), friend);
    })

    it("the author should send the content to his friend and the friend refuse it successfully", async function() {

        await token.sendToken(friend, {
            from: author,
        });
        //the user refuse
        await token.refuse({
            from: friend,
        })
        assert.equal(await token.owner(), author);
    })

    it("the author should send the content to his friend and then he should cancel the transaction", async function() {

        await token.sendToken(friend, {
            from: author,
        });
        //the user refuse
        await token.cancel({
            from: author,
        })
        assert.equal(await token.owner(), author);
    })

    describe("When the token is going to be sent.the owner cannot: ", function() {
        
        beforeEach(async function() {
            await token.sendToken(friend, {
                from: author,
            });
        })
        
        it("start another payment", async function() {
            await assertRevert(token.sendToken(friend, {
                from: author,
            }))
        })
        
        it("change link", async function() {
            await assertRevert(token.setLink("https://www.youtube.com/watch?v=tas0O586t80", {
                from: author,
            }))
        })
        
        it("change key", async function() {
            await assertRevert(token.setKey("new key", {
                from: author,
            }))
        })
        
        it("kill the contract", async function() {
            await assertRevert(token.kill({
                from: author,
            }))
        })
    })

    describe("When the token has been accepted.the previous owner cannot: ", function() {
        
      beforeEach(async function() {
            await token.sendToken(friend, {
                from: author,
            });

            await token.accept({
                from: friend,
            })
        })
        
        it("start a payment", async function() {
            await assertRevert(token.sendToken(friend, {
                from: author,
            }))
        })
        
        it("change link", async function() {
            await assertRevert(token.setLink("https://www.youtube.com/watch?v=tas0O586t80", {
                from: author,
            }))
        })
        
        it("change key", async function() {
            await assertRevert(token.setKey("new key", {
                from: author,
            }))
        })
        
        it("kill the contract", async function() {
            await assertRevert(token.kill({
                from: author,
            }))
        })
    })

    describe("When the token has been refused.the new owner cannot: ", function() {
        
        beforeEach(async function() {
            await token.sendToken(friend, {
                from: author,
            });

            await token.refuse({
                from: friend,
            })
        })
        
        it("start a payment", async function() {
            await assertRevert(token.sendToken(friend, {
                from: friend,
            }))
        })
        
        it("change link", async function() {
            await assertRevert(token.setLink("https://www.youtube.com/watch?v=tas0O586t80", {
                from: friend,
            }))
        })
        
        it("change key", async function() {
            await assertRevert(token.setKey("new key", {
                from: friend,
            }))
        })
        
        it("kill the contract", async function() {
            await assertRevert(token.kill({
                from: friend,
            }))
        })
    })

    describe("When the token transfer has been cancelled.the new owner cannot: ", function() {
        
        beforeEach(async function() {
            await token.sendToken(friend, {
                from: author,
            });

            await token.cancel({
                from: author,
            })
        })
        
        it("start a payment", async function() {
            await assertRevert(token.sendToken(friend, {
                from: friend,
            }))
            assert.isFalse(await token.isPending());
        })
        
        it("change link", async function() {
            await assertRevert(token.setLink("https://www.youtube.com/watch?v=tas0O586t80", {
                from: friend,
            }))
        })
        
        it("change key", async function() {
            await assertRevert(token.setKey("new key", {
                from: friend,
            }))
        })
        
        it("kill the contract", async function() {
            await assertRevert(token.kill({
                from: friend,
            }))
        })
    })

    describe("When the token transfer has been cancelled.the owner can: ", function() {
        
        beforeEach(async function() {
            await token.sendToken(friend, {
                from: author,
            });

            await token.cancel({
                from: author,
            })
        })
        
        it("start another payment", async function() {
            await token.sendToken(friend, {
                from: author,
            })

            assert(await token.isPending());
        })
        
        it("change link", async function() {
            await token.setLink("https://www.youtube.com/watch?v=tas0O586t80", {
                from: author,
            })

            assert.equal(await token.getLink({from : author}),"https://www.youtube.com/watch?v=tas0O586t80");
        })
        
        it("change key", async function() {
            await token.setKey("new key", {
                from: author,
            })

            assert.equal(await token.getKey({from: author}),"new key");
        })
        
        it("kill the contract", async function() {
            await token.kill({
                from: author,
            })
            assert.equal(web3.eth.getCode(token.address), "0x0");
        })
    })

    describe("When the token transfer has been accepted.the new owner can: ", function() {
        
        beforeEach(async function() {
            await token.sendToken(friend, {
                from: author,
            });

            await token.accept({
                from: friend,
            })
        })
        
        it("start another payment", async function() {
            await token.sendToken(friend, {
                from: friend,
            })
            assert(await token.isPending());
        })
        
        it("change link", async function() {
            await token.setLink("https://www.youtube.com/watch?v=tas0O586t80", {
                from: friend,
            })

            assert.equal(await token.getLink({from: friend}),"https://www.youtube.com/watch?v=tas0O586t80");
        })
        
        it("change key", async function() {
            await token.setKey("new key", {
                from: friend,
            })

            assert.equal(await token.getKey({from: friend}),"new key");
        })
        
        it("kill the contract", async function() {
            await token.kill({
                from: friend,
            })
            assert.equal(web3.eth.getCode(token.address), "0x0");
        })
    })

    describe("When the token transfer has been refused.the owner can: ", function() {
        
        beforeEach(async function() {
            await token.sendToken(friend, {
                from: author,
            });

            await token.refuse({
                from: friend,
            })
        })
        
        it("start another payment", async function() {
            await token.sendToken(friend, {
                from: author,
            })

            assert(await token.isPending());
        })
        
        it("change link", async function() {
            await token.setLink("https://www.youtube.com/watch?v=tas0O586t80", {
                from: author,
            })

            assert.equal(await token.getLink({from: author}),"https://www.youtube.com/watch?v=tas0O586t80");
        })
        
        it("change key", async function() {
            await token.setKey("new key", {
                from: author,
            })

            assert.equal(await token.getKey({from: author}),"new key");
        })
        
        it("kill the contract", async function() {
            await token.kill({
                from: author,
            })
            assert.equal(web3.eth.getCode(token.address), "0x0");
        })
    })

    describe("should fail if:", function() {
      it("a normal user try to set a new key",async function() {
        await assertRevert(token.setKey("new key",{
          from: user
        }))
      })

      it("a normal user try to set a new link",async function() {
          await assertRevert(token.setLink("https://www.youtube.com/watch?v=tas0O586t80", {
              from: user,
          }))
      })

      it("a normal user try to send the token",async function() {
          await assertRevert(token.sendToken(user, {
              from: user,
          }))
      })

      it("a normal user try to kill the contract",async function() {
          await assertRevert(token.kill({
              from: user,
          }))
      })

      it("a normal user tries to accept the token without it has been sent",async function() {
          await assertRevert(token.accept({
              from: user,
          }))
      })

      it("a normal user tries to cancel the token trasfer without it has been sent",async function() {
          await assertRevert(token.cancel({
              from: user,
          }))
      })

      it("the owner tries to cancel the token trasfer without it has been sent",async function() {
          await assertRevert(token.cancel({
              from: author,
          }))
      })

      it("a normal user tries to refuse the token without it has been sent",async function() {
          await assertRevert(token.refuse({
              from: author,
          }))
      })

      it("a normal user cannot change the key",async function() {
        await assertRevert(token.setKey("new key",{
              from: user,
        }))
      })

      it("a normal user cannot change the link",async function() {
        await assertRevert(token.setLink("https://www.youtube.com/watch?v=tas0O586t80",{
              from: user,
        }))
      })

      it("a normal user cannot read the key",async function() {
        await assertRevert(token.getKey({
              from: user,
        }))
      })

      it("a normal user cannot change read the link",async function() {
        await assertRevert(token.getLink({
              from: user,
        }))
      })
    })
});
