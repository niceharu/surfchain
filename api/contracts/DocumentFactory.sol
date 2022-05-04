// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract DocumentFactory {

    struct Document {
        string hash;   // short name (up to 32 bytes)
    }

    Document[] public documents;
    string[] public hashArray;

    /**
     * @dev Store value in variable
     * @param hash value to store
     */
    function store(string memory hash) public {
        documents.push(Document(hash));
    }

    /**
     * @dev Return value 
     * @return value of 'documents'
     */
    function retrieve() public view returns (Document[] memory){
        return documents;
    }

    function setHash(string memory hash) public {
        hashArray.push(hash);
    }

    function getHash() public view returns(string[] memory) {
        return hashArray;
    }
} 