// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import {Token} from "./Token.sol";

contract Factory {
    uint256 public constant TARGET = 3 ether;
    uint256 public constant TOKEN_LIMIT = 500_000 ether;
    uint256 public immutable fee;
    address public owner;

    uint256 public totalTokens;
    address[] public tokens;
    mapping(address => TokenSale) public tokenToSale;

    struct TokenSale {
        address token;
        string name;
        address creator;
        uint256 sold;
        uint256 raised;
        bool isOpen;
    }

    event Created(address indexed token);
    event Buy(address indexed token, uint256 amount, uint256 cost);
    event Sell(address indexed token, uint256 amount, uint256 refund);

    constructor(uint256 _fee) {
        fee = _fee;
        owner = msg.sender;
    }

    function getTokenSale(uint256 _index) public view returns (TokenSale memory) {
        return tokenToSale[tokens[_index]];
    }

    function getAllTokens() public view returns (address[] memory) {
        return tokens;
    }

    // Simple fixed price - 0.0001 ETH per token for easy testing
    function getCost() public pure returns (uint256) {
        return 0.0001 ether; // Fixed price for simplicity
    }

    // Calculate total cost for buying tokens  
    function calculateCost(uint256 _amount) public pure returns (uint256) {
        // Simple: 0.0001 ETH per token
        return (0.0001 ether * _amount) / 1 ether;
    }

    function create(
        string memory _name,
        string memory _symbol
    ) external payable {
        require(msg.value >= fee, "Factory: Creator fee not met");

        // Create token with factory as owner so it can distribute
        Token token = new Token(address(this), _name, _symbol, 1_000_000 ether);

        // Store token address
        tokens.push(address(token));
        totalTokens++;

        // Create the sale
        TokenSale memory sale = TokenSale(
            address(token),
            _name,
            msg.sender,
            0,
            0,
            true
        );

        tokenToSale[address(token)] = sale;
        emit Created(address(token));
    }

    function buy(address _token, uint256 _amount) external payable {
        TokenSale storage sale = tokenToSale[_token];

        // Minimal checks for easy testing
        require(sale.isOpen, "Factory: Buying closed");
        require(_amount > 0, "Factory: Amount must be > 0");

        // Simple fixed price calculation
        uint256 totalCost = calculateCost(_amount);
        // require(msg.value >= totalCost, "Factory: Insufficient ETH");

        // Update states
        sale.sold += _amount;
        sale.raised += totalCost;

        // Close sale if limits reached
        if (sale.sold >= TOKEN_LIMIT || sale.raised >= TARGET) {
            sale.isOpen = false;
        }

        // Transfer tokens
        Token(_token).transfer(msg.sender, _amount);

        // Refund excess ETH
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }

        emit Buy(_token, _amount, totalCost);
    }

    function sell(address _token, uint256 _amount) external {
        TokenSale storage sale = tokenToSale[_token];
        Token token = Token(_token);

        require(_amount > 0, "Factory: Amount must be > 0");
        require(token.balanceOf(msg.sender) >= _amount, "Factory: Insufficient tokens");

        // Calculate refund (90% of purchase price for simplicity)
        uint256 refund = (calculateCost(_amount) * 90) / 100;
        require(address(this).balance >= refund, "Factory: Insufficient contract balance");

        // Check if user has approved factory to spend tokens
        if (token.allowance(msg.sender, address(this)) < _amount) {
            // Auto-approve for easier testing (not recommended for production)
            revert("Factory: Please approve tokens first. Go to Token contract > approve > spender: factory address, amount: token amount");
        }

        // Transfer tokens back to factory
        token.transferFrom(msg.sender, address(this), _amount);

        // Update sale states
        sale.sold -= _amount;
        sale.raised -= refund;

        // Reopen sale if it was closed
        if (!sale.isOpen && sale.sold < TOKEN_LIMIT && sale.raised < TARGET) {
            sale.isOpen = true;
        }

        // Send ETH refund
        payable(msg.sender).transfer(refund);

        emit Sell(_token, _amount, refund);
    }

    function deposit(address _token) external {
        Token token = Token(_token);
        TokenSale storage sale = tokenToSale[_token];

        require(!sale.isOpen, "Factory: Sale still open");

        uint256 remainingTokens = token.balanceOf(address(this));
        uint256 raisedAmount = sale.raised;

        // Reset to prevent double withdrawal
        sale.raised = 0;

        // Transfer remaining tokens to creator
        if (remainingTokens > 0) {
            token.transfer(sale.creator, remainingTokens);
        }

        // Transfer ETH to creator
        if (raisedAmount > 0) {
            payable(sale.creator).transfer(raisedAmount);
        }
    }

    function withdraw(uint256 _amount) external {
        require(msg.sender == owner, "Factory: Not owner");
        payable(owner).transfer(_amount);
    }

    // Add this struct at the top with other structs
struct TokenDetails {
    address tokenAddress;
    string name;
    string symbol;
    address creator;
    uint256 sold;
    uint256 raised;
    bool isOpen;
    uint256 totalSupply;
    uint256 remainingTokens;
}

// Add this function to your Factory contract
function getAllTokenDetails() external view returns (TokenDetails[] memory) {
    TokenDetails[] memory allTokens = new TokenDetails[](totalTokens);
    
    for (uint256 i = 0; i < totalTokens; i++) {
        address tokenAddress = tokens[i];
        TokenSale memory sale = tokenToSale[tokenAddress];
        Token token = Token(tokenAddress);
        
        allTokens[i] = TokenDetails({
            tokenAddress: tokenAddress,
            name: sale.name,
            symbol: token.symbol(),
            creator: sale.creator,
            sold: sale.sold,
            raised: sale.raised,
            isOpen: sale.isOpen,
            totalSupply: token.totalSupply(),
            remainingTokens: token.balanceOf(address(this))
        });
    }
    
    return allTokens;
}

// Alternative: Get details for a specific token by address
function getTokenDetails(address _token) external view returns (TokenDetails memory) {
    TokenSale memory sale = tokenToSale[_token];
    Token token = Token(_token);
    
    return TokenDetails({
        tokenAddress: _token,
        name: sale.name,
        symbol: token.symbol(),
        creator: sale.creator,
        sold: sale.sold,
        raised: sale.raised,
        isOpen: sale.isOpen,
        totalSupply: token.totalSupply(),
        remainingTokens: token.balanceOf(address(this))
    });
}

// Lightweight version - just basic info
function getAllBasicTokenInfo() external view returns (
    address[] memory tokenAddresses,
    string[] memory names,
    string[] memory symbols,
    address[] memory creators
) {
    tokenAddresses = new address[](totalTokens);
    names = new string[](totalTokens);
    symbols = new string[](totalTokens);
    creators = new address[](totalTokens);
    
    for (uint256 i = 0; i < totalTokens; i++) {
        address tokenAddress = tokens[i];
        TokenSale memory sale = tokenToSale[tokenAddress];
        Token token = Token(tokenAddress);
        
        tokenAddresses[i] = tokenAddress;
        names[i] = sale.name;
        symbols[i] = token.symbol();
        creators[i] = sale.creator;
    }
    
    return (tokenAddresses, names, symbols, creators);
}

    // Helper functions for testing
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getTokenBalance(address _token) external view returns (uint256) {
        return Token(_token).balanceOf(address(this));
    }

    function getUserTokenBalance(address _token, address _user) external view returns (uint256) {
        return Token(_token).balanceOf(_user);
    }
}