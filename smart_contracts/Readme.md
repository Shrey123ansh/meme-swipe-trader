# Copy Trading Contract Manual Tests

## 🔧 **Setup Prerequisites**
1. Deploy your Factory contract first
2. Deploy CopyTrading contract with Factory address
3. Have multiple test accounts ready (Trader1, Trader2, User1, User2, User3)
4. Each account should have sufficient ETH for testing

---

## 📋 **Test Scenarios**

### **Test 1: Trader Registration**

**Scenario 1.1: Valid Trader Registration**
```
Account: Trader1
Function: registerTrader(1000000000000000000, 1000) // 1 ETH min, 10% profit share
Expected: ✅ Success, TraderRegistered event emitted
Verify: traders[Trader1].isActive = true
```

**Scenario 1.2: Invalid Profit Sharing (>50%)**
```
Account: Trader2  
Function: registerTrader(500000000000000000, 6000) // 0.5 ETH min, 60% profit share
Expected: ❌ Revert "Profit sharing cannot exceed 50%"
```

**Scenario 1.3: Zero Minimum Investment**
```
Account: Trader2
Function: registerTrader(0, 1500) // 0 ETH min, 15% profit share
Expected: ❌ Revert "Minimum investment must be greater than 0"
```

**Scenario 1.4: Duplicate Registration**
```
Account: Trader1 (already registered)
Function: registerTrader(2000000000000000000, 2000)
Expected: ❌ Revert "Trader already registered"
```

**Scenario 1.5: Valid Second Trader**
```
Account: Trader2
Function: registerTrader(500000000000000000, 1500) // 0.5 ETH min, 15% profit share  
Expected: ✅ Success
Verify: allTraders.length = 2
```

---

### **Test 2: User Investments**

**Scenario 2.1: Valid Investment**
```
Account: User1
Function: invest(Trader1) 
Value: 2000000000000000000 (2 ETH)
Expected: ✅ Success, InvestmentMade event emitted
Verify: 
- investments[User1][Trader1].amount = 2 ETH
- traders[Trader1].totalPoolValue = 2 ETH  
- traders[Trader1].totalInvestors = 1
- Contract balance = 2 ETH
```

**Scenario 2.2: Investment Below Minimum**
```
Account: User2
Function: invest(Trader1)
Value: 500000000000000000 (0.5 ETH) // Below 1 ETH minimum
Expected: ❌ Revert "Investment below minimum"
```

**Scenario 2.3: Investment in Non-Active Trader**
```
Account: User2
Function: invest(0x0000000000000000000000000000000000000000) // Non-existent trader
Value: 1000000000000000000 (1 ETH)
Expected: ❌ Revert "Trader not active"
```

**Scenario 2.4: Multiple Users Same Trader**
```
Account: User2
Function: invest(Trader1)
Value: 3000000000000000000 (3 ETH)
Expected: ✅ Success
Verify:
- traders[Trader1].totalPoolValue = 5 ETH
- traders[Trader1].totalInvestors = 2
- Contract balance = 5 ETH
```

**Scenario 2.5: Same User Multiple Traders**
```
Account: User1
Function: invest(Trader2)  
Value: 1000000000000000000 (1 ETH)
Expected: ✅ Success
Verify:
- investments[User1][Trader2].amount = 1 ETH
- investorToTraders[User1] contains both Trader1 and Trader2
- Contract balance = 6 ETH
```

**Scenario 2.6: Additional Investment Same Trader**
```
Account: User1
Function: invest(Trader1)
Value: 1000000000000000000 (1 ETH)
Expected: ✅ Success  
Verify:
- investments[User1][Trader1].amount = 3 ETH (2+1)
- traders[Trader1].totalInvestors = 2 (no change)
- Contract balance = 7 ETH
```

---

### **Test 3: Token Trading**

**Setup: Create a token in Factory first**
```
Account: Any
Function: Factory.create("TestToken", "TEST")
Value: Factory fee amount
Note: Record the token address created
```

**Scenario 3.1: Valid Token Purchase**
```
Account: Trader1  
Function: buyToken(TOKEN_ADDRESS, 1000000000000000000000) // 1000 tokens
Value: Check Factory.getCost() for current price
Expected: ✅ Success, TokenPurchased event emitted
Verify:
- traders[Trader1].totalPoolValue reduced by ETH spent
- Factory contract shows token purchase
- Contract balance reduced
```

**Scenario 3.2: Non-Trader Attempts Purchase**
```
Account: User1
Function: buyToken(TOKEN_ADDRESS, 1000000000000000000000)
Value: 100000000000000000 (0.1 ETH)
Expected: ❌ Revert "Trader not active"
```

**Scenario 3.3: Insufficient Pool Balance**
```
Account: Trader1
Function: buyToken(TOKEN_ADDRESS, 1000000000000000000000)  
Value: 10000000000000000000 (10 ETH) // More than pool has
Expected: ❌ Revert "Insufficient trader pool balance"
```

---

### **Test 4: Adding Profits**

**Scenario 4.1: Trader Adds Profits**
```
Account: Trader1
Function: addProfits(Trader1)
Value: 2000000000000000000 (2 ETH)
Expected: ✅ Success, ProfitsAdded event emitted
Verify:
- traders[Trader1].totalPoolValue increased by 2 ETH
- Contract balance increased by 2 ETH
```

**Scenario 4.2: Non-Trader Adds Profits**
```
Account: User1  
Function: addProfits(Trader1)
Value: 1000000000000000000 (1 ETH)
Expected: ❌ Revert "Only trader can add profits"
```

**Scenario 4.3: Zero Profit Addition**
```
Account: Trader1
Function: addProfits(Trader1)
Value: 0
Expected: ❌ Revert "Must send ETH as profits"
```

---

### **Test 5: Withdrawals & Profit Sharing**

**Setup State for Testing:**
- Trader1: 1 ETH min, 10% profit share
- User1: Invested 3 ETH in Trader1  
- User2: Invested 3 ETH in Trader1
- Total original investments: 6 ETH
- Current pool value: 8 ETH (includes 2 ETH profits)
- Expected User1 share: (8 × 3)/6 = 4 ETH
- Expected User1 profits: 4 - 3 = 1 ETH
- Expected trader profit share: 1 × 10% = 0.1 ETH
- Expected User1 receives: 4 - 0.1 = 3.9 ETH

**Scenario 5.1: User Withdrawal with Profits**
```
Account: User1
Function: withdraw(Trader1)
Expected: ✅ Success, Withdrawal event emitted
Verify:
- User1 receives 3.9 ETH
- Trader1 receives 0.1 ETH  
- investments[User1][Trader1].amount = 0
- traders[Trader1].totalInvestors = 1
- traders[Trader1].totalPoolValue = 4 ETH (8 - 4)
- Contract balance reduced by 4 ETH
```

**Scenario 5.2: Withdrawal with No Investment**  
```
Account: User3 (never invested)
Function: withdraw(Trader1)
Expected: ❌ Revert "No investment found"
```

**Scenario 5.3: Withdrawal with Losses**
```
Setup: Simulate losses by reducing pool value
- Current state: User2 has 3 ETH invested, pool value is 4 ETH
- User2 share: 4 ETH (entire pool)
- No profits (4 - 3 = 1, but proportionally it's a loss)

Account: User2  
Function: withdraw(Trader1)
Expected: ✅ Success
Verify:
- User2 receives 4 ETH (full pool)
- No profit share to trader (no profits)
- Pool empty after withdrawal
```

---

### **Test 6: View Functions**

**Scenario 6.1: Get Trader Info**
```
Function: getTraderInfo(Trader1)  
Expected: Returns minimumInvestment, profitSharingPercentage, totalPoolValue, totalInvestors, isActive
```

**Scenario 6.2: Get User Investment**
```
Function: getUserInvestment(User1, Trader1)
Expected: Returns investment amount
```

**Scenario 6.3: Get Portfolio Value**  
```
Function: getUserPortfolioValue(User1, Trader1)
Expected: Returns current value based on pool share
```

**Scenario 6.4: Get All Traders**
```
Function: getAllTraders()
Expected: Returns array of all registered trader addresses
```

**Scenario 6.5: Get Investor's Traders**
```
Function: getInvestorTraders(User1) 
Expected: Returns array of traders User1 has invested in
```

---

### **Test 7: Edge Cases & Security**

**Scenario 7.1: Trader Deactivation**
```
Account: Trader1
Function: deactivateTrader()
Expected: ✅ Success, trader becomes inactive
Verify: traders[Trader1].isActive = false

Then test:
Account: User3
Function: invest(Trader1)
Value: 2 ETH
Expected: ❌ Revert "Trader not active"
```

**Scenario 7.2: Contract Balance Check**
```
Function: getContractBalance()
Expected: Returns current ETH balance of contract
```

**Scenario 7.3: Emergency ETH Recovery (if needed)**
```
Send ETH directly to contract:
Account: Any
Send ETH to contract address
Verify: receive() function accepts ETH
```

---

### **Test 8: Complex Scenarios**

**Scenario 8.1: Multiple Traders Multiple Users**
```
Setup:
- Trader1: 1 ETH min, 10% share, Pool: 5 ETH
- Trader2: 0.5 ETH min, 15% share, Pool: 3 ETH  
- User1: 2 ETH in Trader1, 1 ETH in Trader2
- User2: 3 ETH in Trader1
- User3: 2 ETH in Trader2

Test various withdrawals and verify calculations
```

**Scenario 8.2: Rapid Investment/Withdrawal Cycles**
```
Test multiple invest() and withdraw() calls in succession
Verify state consistency
```

---

## ✅ **Expected Results Summary**

After all tests:
- All valid operations should succeed  
- All invalid operations should revert with correct error messages
- State variables should be consistent
- ETH balances should match expectations
- Events should be emitted correctly
- View functions should return accurate data

## 🐛 **Testing Checklist**

- [ ] All trader registration scenarios
- [ ] All investment scenarios  
- [ ] Token trading functionality
- [ ] Profit addition and sharing
- [ ] Withdrawal calculations
- [ ] View function accuracy
- [ ] Edge cases and security
- [ ] Complex multi-user scenarios
- [ ] Event emission verification
- [ ] State consistency checks

## 📝 **Notes for Testing**

1. **Gas Costs**: Monitor gas usage for optimization opportunities
2. **Event Logs**: Verify all events emit correct data
3. **State Changes**: Check all state variables after each operation
4. **Reentrancy**: Test rapid successive calls
5. **Math Accuracy**: Verify all percentage and proportion calculations
6. **Edge Values**: Test with very small and very large numbers