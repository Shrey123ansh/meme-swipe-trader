// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.27;

interface IFactory {
    function buy(address _token, uint256 _amount) external payable;
}

contract CopyTrading {
    IFactory public immutable factory;
    
    struct Trader {
        address trader;
        string name;
        uint256 minimumInvestment;
        uint256 profitSharingPercentage; // in basis points (100 = 1%)
        uint256 totalPoolValue;
        uint256 totalInvestors;
        uint256 totalTrades; // Added: Track total number of trades
        bool isActive;
    }
    
    struct Investment {
        uint256 amount;
        uint256 timestamp;
    }
    
    // Mappings
    mapping(address => Trader) public traders;
    mapping(address => mapping(address => Investment)) public investments; // investor => trader => investment
    mapping(address => address[]) public investorToTraders; // investor => list of traders they follow
    mapping(address => address[]) public traderToInvestors; // trader => list of investors
    mapping(string => bool) public nameExists; // Track if trader name already exists
    
    // Arrays for iteration
    address[] public allTraders;
    
    // Counter for total traders
    uint256 public totalTraders;
    
    // Events
    event TraderRegistered(address indexed trader, string name, uint256 minimumInvestment, uint256 profitSharingPercentage);
    event InvestmentMade(address indexed investor, address indexed trader, uint256 amount);
    event ProfitsAdded(address indexed trader, uint256 amount);
    event Withdrawal(address indexed investor, address indexed trader, uint256 amount, uint256 profitShare);
    event TokenPurchased(address indexed trader, address indexed token, uint256 amount, uint256 ethSpent, uint256 tradeNumber); // Added tradeNumber
    
    constructor(address _factoryAddress) {
        factory = IFactory(_factoryAddress);
        totalTraders = 0;
    }
    
    // Updated trader registration with name parameter
    function registerTrader(
        string memory _name,
        uint256 _minimumInvestment, 
        uint256 _profitSharingPercentage
    ) external {
        require(bytes(_name).length > 0, "CopyTrading: Name cannot be empty");
        require(!nameExists[_name], "CopyTrading: Name already exists");
        require(_profitSharingPercentage <= 5000, "CopyTrading: Profit sharing cannot exceed 50%"); // Max 50%
        require(_minimumInvestment > 0, "CopyTrading: Minimum investment must be greater than 0");
        require(!traders[msg.sender].isActive, "CopyTrading: Trader already registered");
        
        traders[msg.sender] = Trader({
            trader: msg.sender,
            name: _name,
            minimumInvestment: _minimumInvestment,
            profitSharingPercentage: _profitSharingPercentage,
            totalPoolValue: 0,
            totalInvestors: 0,
            totalTrades: 0, // Initialize trade count
            isActive: true
        });
        
        // Mark name as taken
        nameExists[_name] = true;
        
        // Add to traders array and increment counter
        allTraders.push(msg.sender);
        totalTraders++;
        
        emit TraderRegistered(msg.sender, _name, _minimumInvestment, _profitSharingPercentage);
    }
    
    // User investment function
    function invest(address _trader) external payable {
        Trader storage trader = traders[_trader];
        require(trader.isActive, "CopyTrading: Trader not active");
        require(msg.value >= trader.minimumInvestment, "CopyTrading: Investment below minimum");
        
        // Check if this is a new investor for this trader
        if (investments[msg.sender][_trader].amount == 0) {
            trader.totalInvestors++;
            investorToTraders[msg.sender].push(_trader);
            traderToInvestors[_trader].push(msg.sender);
        }
        
        // Update investment
        investments[msg.sender][_trader].amount += msg.value;
        investments[msg.sender][_trader].timestamp = block.timestamp;
        
        // Update trader's total pool
        trader.totalPoolValue += msg.value;
        
        emit InvestmentMade(msg.sender, _trader, msg.value);
    }
    
    // Trader adds profits to pool
    function addProfits(address _trader) external payable {
        require(msg.sender == _trader, "CopyTrading: Only trader can add profits");
        require(traders[_trader].isActive, "CopyTrading: Trader not active");
        require(msg.value > 0, "CopyTrading: Must send ETH as profits");
        
        traders[_trader].totalPoolValue += msg.value;
        
        emit ProfitsAdded(_trader, msg.value);
    }
    
    // Enhanced trader buys tokens using pooled funds (with trade counting)
    function buyToken(address _token, uint256 _amount) external payable {
        require(traders[msg.sender].isActive, "CopyTrading: Trader not active");
        require(_amount > 0, "CopyTrading: Amount must be greater than 0");
        
        Trader storage trader = traders[msg.sender];
        require(address(this).balance >= msg.value, "CopyTrading: Insufficient pool balance");
        require(trader.totalPoolValue >= msg.value, "CopyTrading: Insufficient trader pool balance");
        
        // Increment trade count BEFORE making the trade
        trader.totalTrades++;
        
        // Call the factory's buy function
        factory.buy{value: msg.value}(_token, _amount);
        
        // Update pool value (subtract the ETH spent)
        trader.totalPoolValue -= msg.value;
        
        emit TokenPurchased(msg.sender, _token, _amount, msg.value, trader.totalTrades);
    }
    
    // User withdraws their proportional share
    function withdraw(address _trader) external {
        require(investments[msg.sender][_trader].amount > 0, "CopyTrading: No investment found");
        
        Trader storage trader = traders[_trader];
        uint256 userInvestment = investments[msg.sender][_trader].amount;
        
        // Calculate user's proportional share of current pool
        uint256 totalOriginalInvestments = getTotalOriginalInvestments(_trader);
        uint256 userShare = (trader.totalPoolValue * userInvestment) / totalOriginalInvestments;
        
        // Calculate profits (if any)
        uint256 userProfits = 0;
        if (userShare > userInvestment) {
            userProfits = userShare - userInvestment;
        }
        
        // Calculate trader's profit share
        uint256 traderProfitShare = (userProfits * trader.profitSharingPercentage) / 10000;
        uint256 userReceives = userShare - traderProfitShare;
        
        // Update state before transfers (reentrancy protection)
        investments[msg.sender][_trader].amount = 0;
        trader.totalInvestors--;
        trader.totalPoolValue -= userShare;
        
        // Remove investor from trader's list
        _removeInvestorFromTrader(_trader, msg.sender);
        _removeTraderFromInvestor(msg.sender, _trader);
        
        // Transfer ETH to user
        require(address(this).balance >= userReceives, "CopyTrading: Insufficient contract balance");
        (bool userSuccess, ) = payable(msg.sender).call{value: userReceives}("");
        require(userSuccess, "CopyTrading: User transfer failed");
        
        // Transfer profit share to trader (if any)
        if (traderProfitShare > 0) {
            (bool traderSuccess, ) = payable(_trader).call{value: traderProfitShare}("");
            require(traderSuccess, "CopyTrading: Trader transfer failed");
        }
        
        emit Withdrawal(msg.sender, _trader, userReceives, traderProfitShare);
    }
    
    // Helper function to calculate total original investments for a trader
    function getTotalOriginalInvestments(address _trader) public view returns (uint256) {
        uint256 total = 0;
        address[] memory investorList = traderToInvestors[_trader];
        
        for (uint i = 0; i < investorList.length; i++) {
            total += investments[investorList[i]][_trader].amount;
        }
        
        return total;
    }
    
    // Helper function to remove investor from trader's list
    function _removeInvestorFromTrader(address _trader, address _investor) internal {
        address[] storage investors = traderToInvestors[_trader];
        for (uint i = 0; i < investors.length; i++) {
            if (investors[i] == _investor) {
                investors[i] = investors[investors.length - 1];
                investors.pop();
                break;
            }
        }
    }
    
    // Helper function to remove trader from investor's list
    function _removeTraderFromInvestor(address _investor, address _trader) internal {
        address[] storage traderList = investorToTraders[_investor];
        for (uint i = 0; i < traderList.length; i++) {
            if (traderList[i] == _trader) {
                traderList[i] = traderList[traderList.length - 1];
                traderList.pop();
                break;
            }
        }
    }
    
    // Updated view functions to include trade count
    function getTraderInfo(address _trader) external view returns (
        string memory name,
        uint256 minimumInvestment,
        uint256 profitSharingPercentage,
        uint256 totalPoolValue,
        uint256 totalInvestors,
        uint256 totalTrades, // Added trade count
        bool isActive
    ) {
        Trader memory trader = traders[_trader];
        return (
            trader.name,
            trader.minimumInvestment,
            trader.profitSharingPercentage,
            trader.totalPoolValue,
            trader.totalInvestors,
            trader.totalTrades,
            trader.isActive
        );
    }
    
    // Get trader name by address
    function getTraderName(address _trader) external view returns (string memory) {
        return traders[_trader].name;
    }
    
    // Get trader's total trades count
    function getTraderTotalTrades(address _trader) external view returns (uint256) {
        return traders[_trader].totalTrades;
    }
    
    // Check if a name is already taken
    function isNameTaken(string memory _name) external view returns (bool) {
        return nameExists[_name];
    }
    
    // Get total number of traders
    function getTotalTraders() external view returns (uint256) {
        return totalTraders;
    }
    
    // Enhanced getAllTraderDetails to include trade counts
    function getAllTraderDetails() external view returns (
        address[] memory addresses,
        string[] memory names,
        uint256[] memory minimumInvestments,
        uint256[] memory profitSharingPercentages,
        uint256[] memory totalPoolValues,
        uint256[] memory totalInvestorsCounts,
        uint256[] memory totalTradesCounts, // Added trade counts
        bool[] memory isActiveList
    ) {
        uint256 length = allTraders.length;
        
        addresses = new address[](length);
        names = new string[](length);
        minimumInvestments = new uint256[](length);
        profitSharingPercentages = new uint256[](length);
        totalPoolValues = new uint256[](length);
        totalInvestorsCounts = new uint256[](length);
        totalTradesCounts = new uint256[](length); // Initialize trade counts array
        isActiveList = new bool[](length);
        
        for (uint256 i = 0; i < length; i++) {
            address traderAddr = allTraders[i];
            Trader memory trader = traders[traderAddr];
            
            addresses[i] = traderAddr;
            names[i] = trader.name;
            minimumInvestments[i] = trader.minimumInvestment;
            profitSharingPercentages[i] = trader.profitSharingPercentage;
            totalPoolValues[i] = trader.totalPoolValue;
            totalInvestorsCounts[i] = trader.totalInvestors;
            totalTradesCounts[i] = trader.totalTrades; // Add trade count
            isActiveList[i] = trader.isActive;
        }
        
        return (addresses, names, minimumInvestments, profitSharingPercentages, totalPoolValues, totalInvestorsCounts, totalTradesCounts, isActiveList);
    }
    
    // Get traders sorted by most trades (for leaderboard)
    function getTopTradersByTrades(uint256 _limit) external view returns (
        address[] memory addresses,
        string[] memory names,
        uint256[] memory tradeCounts
    ) {
        uint256 length = allTraders.length;
        if (_limit > length) _limit = length;
        
        // Create arrays to hold trader data
        address[] memory allAddresses = new address[](length);
        uint256[] memory allTradeCounts = new uint256[](length);
        
        // Populate arrays with trader data
        for (uint256 i = 0; i < length; i++) {
            allAddresses[i] = allTraders[i];
            allTradeCounts[i] = traders[allTraders[i]].totalTrades;
        }
        
        // Simple bubble sort (for small arrays)
        for (uint256 i = 0; i < length - 1; i++) {
            for (uint256 j = 0; j < length - i - 1; j++) {
                if (allTradeCounts[j] < allTradeCounts[j + 1]) {
                    // Swap trade counts
                    uint256 tempCount = allTradeCounts[j];
                    allTradeCounts[j] = allTradeCounts[j + 1];
                    allTradeCounts[j + 1] = tempCount;
                    
                    // Swap addresses
                    address tempAddr = allAddresses[j];
                    allAddresses[j] = allAddresses[j + 1];
                    allAddresses[j + 1] = tempAddr;
                }
            }
        }
        
        // Return top traders up to limit
        addresses = new address[](_limit);
        names = new string[](_limit);
        tradeCounts = new uint256[](_limit);
        
        for (uint256 i = 0; i < _limit; i++) {
            addresses[i] = allAddresses[i];
            names[i] = traders[allAddresses[i]].name;
            tradeCounts[i] = allTradeCounts[i];
        }
        
        return (addresses, names, tradeCounts);
    }
    
    function getUserInvestment(address _investor, address _trader) external view returns (uint256) {
        return investments[_investor][_trader].amount;
    }
    
    function getUserPortfolioValue(address _investor, address _trader) external view returns (uint256) {
        if (investments[_investor][_trader].amount == 0) return 0;
        
        uint256 userInvestment = investments[_investor][_trader].amount;
        uint256 totalOriginalInvestments = getTotalOriginalInvestments(_trader);
        
        if (totalOriginalInvestments == 0) return 0;
        
        return (traders[_trader].totalPoolValue * userInvestment) / totalOriginalInvestments;
    }
    
    function getInvestorTraders(address _investor) external view returns (address[] memory) {
        return investorToTraders[_investor];
    }
    
    function getTraderInvestors(address _trader) external view returns (address[] memory) {
        return traderToInvestors[_trader];
    }
    
    function getAllTraders() external view returns (address[] memory) {
        return allTraders;
    }
    
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // Emergency function for trader to deactivate (stops new investments)
    function deactivateTrader() external {
        require(traders[msg.sender].isActive, "CopyTrading: Trader not active");
        traders[msg.sender].isActive = false;
        
        // Note: We don't decrement totalTraders here because the trader still exists,
        // just inactive. Trade count is preserved for historical data.
    }
    
    // Function to reactivate trader (in case they want to come back)
    function reactivateTrader() external {
        require(traders[msg.sender].trader != address(0), "CopyTrading: Trader not registered");
        require(!traders[msg.sender].isActive, "CopyTrading: Trader already active");
        
        traders[msg.sender].isActive = true;
        // Trade count remains preserved
    }
    
    // Fallback function to receive ETH
    receive() external payable {}
}