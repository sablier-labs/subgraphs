| Event Signature                                                                                                                                                                                     | Handler                |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `CreateLockupLinearStream(uint256,address,indexed address,indexed address,(uint128 summer, uint128 indexed address(bool),(bool),(uint40, indexed address),(string),address)`                        | handleCreateLinear_V20 |
| `CreateLockupLinearStream(uint256,address,indexed address,indexed address,(uint128 summer, indexed address(bool),(bool),(uint40, indexed address),(string),address)`                                | handleCreateLinear_V21 |
| `CreateLockupLinearStream(uint256,address indexed address indexed address (uint128, indexed address),(bool),(uint40, indexed address),(string),address`                                             | handleCreateLinear_V22 |
| `CreateLockupLinearStream(indexed uint256,(address-address-address-(indexed address, indexed address),(indexed address),(indexed address, bool, bool), (uint40, indexed address), string, address)` | handleCreateLinear_V23 |

## Evolution for CreateLockupLinearStream

### v1.0

```solidity
event CreateLockupLinearStream(
    uint256 streamId,             // param 0
    address funder,               // param 1
    address indexed sender,       // param 2
    address indexed recipient,    // param 3
    Lockup.CreateAmounts amounts, // param 4
    IERC20 indexed asset,         // param 5
    bool cancelable,              // param 6
    LockupLinear.Range range,     // param 7
    address broker                // param 8
);
```

### v1.1

```solidity
event CreateLockupLinearStream(
    uint256 streamId,             // param 0
    address funder,               // param 1
    address indexed sender,       // param 2
    address indexed recipient,    // param 3
    Lockup.CreateAmounts amounts, // param 4
    IERC20 indexed asset,         // param 5
    bool cancelable,              // param 6
    bool transferable,            // param 7
    LockupLinear.Range range,     // param 8
    address broker                // param 9
);
```

### v1.2

```solidity
event CreateLockupLinearStream(
    uint256 streamId,                     // param 0
    address funder,                       // param 1
    address indexed sender,               // param 2
    address indexed recipient,            // param 3
    Lockup.CreateAmounts amounts,         // param 4
    IERC20 indexed asset,                 // param 5
    bool cancelable,                      // param 6
    bool transferable,                    // param 7
    LockupLinear.Timestamps timestamps,   // param 8
    address broker                        // param 9
);

```

### v2.0

```solidity
struct UnlockAmounts {
    uint128 start;
    uint128 cliff;
}

struct CreateEventCommon {
    address funder;
    address sender;
    address recipient;
    Lockup.CreateAmounts amounts;
    IERC20 token;
    bool cancelable;
    bool transferable;
    Lockup.Timestamps timestamps;
    string shape;
    address broker;
}

event CreateLockupLinearStream(
    uint256 indexed streamId,                 // param 0
    Lockup.CreateEventCommon commonParams,    // param 1
    uint40 cliffTime,                         // param 2
    Lockup.Linear.UnlockAmounts unlockAmounts // param 3
);

```
