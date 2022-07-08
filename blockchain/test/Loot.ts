import { expect } from "chai";
import { ethers } from "hardhat";
import { LootFactory } from "../typechain";

// ? Used to test randomness, not a proper test
describe("Loot", function () {
  describe("factory", function () {
    let contract: LootFactory;
    beforeEach(async () => {
      const factory = await ethers.getContractFactory("LootFactory");
      const tx = await factory.deploy();
      contract = (await tx.deployed()) as LootFactory;
    });

    it("Generates a random loot number", async () => {
      let name = "LootName";
      let nameByte32 = ethers.utils.formatBytes32String(name);

      let tx = await contract._createLoot(nameByte32);
      await tx.wait();
      for (let i = 0; i < 10; i++) {
        name = Math.random().toString().substring(0, 12);
        nameByte32 = ethers.utils.formatBytes32String(name);
        tx = await contract._createLoot(nameByte32);
        await tx.wait();
      }
    });
  });
});
