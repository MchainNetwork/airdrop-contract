const { expect } = require('chai');
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const Airdrop = artifacts.require('Airdrop');
const ERC20 = artifacts.require('ERC20Mock');

contract('Airdrop', function ([owner, recipient, recipient2]) {
  const initialAmount = new BN(110000000);
  const tokenName = 'Test Token';
  const tokenSymbol = 'TST';

  beforeEach(async function () {
    this.token = await ERC20.new(tokenName, tokenSymbol, initialAmount, {
      from: owner,
    });
    this.airdrop = await Airdrop.new(this.token.address, { from: owner });

    // Approve the airdrop contract to spend owner's tokens
    await this.token.approve(this.airdrop.address, initialAmount, {
      from: owner,
    });
  });

  describe('Bulk Transfer Functionality', function () {
    it('should allow bulk transfer of tokens', async function () {
      const recipients = [recipient, recipient2];
      const amounts = [new BN(10), new BN(20)];

      await this.airdrop.bulkTransfer(recipients, amounts, { from: owner });

      const recipientBalance1 = await this.token.balanceOf(recipient);
      const recipientBalance2 = await this.token.balanceOf(recipient2);

      expect(recipientBalance1).to.be.bignumber.equal(amounts[0]);
      expect(recipientBalance2).to.be.bignumber.equal(amounts[1]);
    });

    it('should emit BulkTransferCompleted event', async function () {
      const recipients = [recipient, recipient2];
      const amounts = [new BN(10), new BN(20)];

      const receipt = await this.airdrop.bulkTransfer(recipients, amounts, {
        from: owner,
      });

      const totalAmount = amounts.reduce((acc, val) => acc.add(val), new BN(0));

      expectEvent(receipt, 'BulkTransferCompleted', {
        sender: owner,
        totalAmount: totalAmount,
      });
    });

    it('should not allow bulk transfer if lengths of recipients and amounts do not match', async function () {
      const recipients = [recipient];
      const amounts = [new BN(10), new BN(20)];

      await expectRevert(
        this.airdrop.bulkTransfer(recipients, amounts, { from: owner }),
        'The number of recipients should be equal to the number of amounts'
      );
    });

    it('should not allow bulk transfer if total amount exceeds sender’s balance', async function () {
      const recipients = [recipient, recipient2];
      const amounts = [new BN(10), initialAmount];

      await expectRevert(
        this.airdrop.bulkTransfer(recipients, amounts, { from: owner }),
        'Insufficient balance for bulk transfer'
      );
    });
  });

  describe('Token Recovery Functionality', function () {
    it('should allow the owner to recover accidental tokens sent to the contract', async function () {
      // Send some tokens to the airdrop contract
      const accidentalAmount = new BN(10);
      await this.token.transfer(this.airdrop.address, accidentalAmount, {
        from: owner,
      });

      // Check the balance of the airdrop contract
      const initialContractBalance = await this.token.balanceOf(
        this.airdrop.address
      );
      expect(initialContractBalance).to.be.bignumber.equal(accidentalAmount);

      // Recover the tokens
      await this.airdrop.recoverTokens(this.token.address, recipient, {
        from: owner,
      });

      // Check the final balance of the airdrop contract and recipient
      const finalContractBalance = await this.token.balanceOf(
        this.airdrop.address
      );
      const recipientBalance = await this.token.balanceOf(recipient);

      expect(finalContractBalance).to.be.bignumber.equal(new BN(0));
      expect(recipientBalance).to.be.bignumber.equal(accidentalAmount);
    });
  });
});
