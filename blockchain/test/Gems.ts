import { expect } from "chai";
import { ethers } from "hardhat";

describe("GEMS", function () {
  it("Should return the total supply", async function () {
    const GEMS = await ethers.getContractFactory("Gems");
    const contract = await GEMS.deploy();
    await contract.deployed();

    expect(await contract.totalSupply()).to.equal(0);
  });
});
