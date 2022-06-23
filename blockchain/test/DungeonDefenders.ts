import { expect } from "chai";
import { ethers } from "hardhat";

describe("DDS", function () {
  it("Should return the total supply", async function () {
    const DDS = await ethers.getContractFactory("DungeonDefenders");
    const contract = await DDS.deploy();
    await contract.deployed();

    expect(await contract.totalSupply()).to.equal(0);
  });
});
