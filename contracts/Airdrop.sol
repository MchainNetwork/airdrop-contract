// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Airdrop is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public token;

    event BulkTransferCompleted(
        address indexed token,
        address indexed sender,
        uint256 totalAmount
    );
    event TokensRecovered(
        address indexed token,
        address indexed recipient,
        uint256 balance
    );

    constructor(IERC20 _token) {
        require(address(_token) != address(0), "Token address cannot be zero");
        token = _token;
    }

    function bulkTransfer(
        address[] memory recipients,
        uint256[] memory amounts
     ) public   {
        require(
            recipients.length == amounts.length,
            "The number of recipients should be equal to the number of amounts"
        );

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }

        require(
            token.balanceOf(msg.sender) >= totalAmount,
            "Insufficient balance for bulk transfer"
        );

        require(
            token.allowance(msg.sender, address(this)) >= totalAmount,
            "Contract not approved for the total transfer amount"
        );

        token.safeTransferFrom(msg.sender, address(this), totalAmount);

        for (uint256 i = 0; i < recipients.length; i++) {
            require(
                recipients[i] != address(0),
                "Recipient address cannot be zero"
            );
            token.safeTransfer(recipients[i], amounts[i]);
        }

        emit BulkTransferCompleted(address(token), msg.sender, totalAmount);
    }

    // Receives ether sent to the contract.
    receive() external payable {
        revert("Contract cannot accept Ether");
    }

    // Allows the contract owner to recover tokens accidentally sent to the contract.
    function recoverTokens(
        IERC20 tokenAddress,
        address recipient
    ) external onlyOwner {
        require(recipient != address(0), "Cannot send to zero address");
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No tokens to recover");
        token.safeTransfer(recipient, balance);

        emit TokensRecovered(address(tokenAddress), recipient, balance);
    }
}
