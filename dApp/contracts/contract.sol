// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Authentication {
    mapping(string => string) public userPasswords;
    mapping(string => string) public userName;
    mapping(string => bool) public registered;

    // Event when a user registers
    event Registered(address user, string username);

    // Register function
    function register(string memory _username, string memory _password, string memory _name) public returns (bool) {
        require(!registered[_username], "Already registered");
        
        // Store user data
        userPasswords[_username] = _password;
        userName[_username] = _name;
        registered[_username] = true;

        // Emit registration event
        emit Registered(msg.sender, _username);
        return true;
    }

    // Login function to retrieve user data
    function getData(string memory _username) public view returns (bool, string memory, string memory) {
        require(registered[_username], "User not registered");
        
        // Return user data if registered
        return (true, userPasswords[_username], userName[_username]);
    }
}