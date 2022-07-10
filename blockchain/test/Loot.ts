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
      // const ARRAY = [0, 0, 0, 0];
      // let name = "LootName";
      // let nameByte32 = ethers.utils.formatBytes32String(name);

      // let result = await contract.callStatic._createLoot(nameByte32);
      // ARRAY[+result] = ARRAY[+result] + 1;
      // for (let i = 0; i < 1000; i++) {
      //   name = Math.random().toString().substring(0, 12);
      //   nameByte32 = ethers.utils.formatBytes32String(name);
      //   result = await contract.callStatic._createLoot(nameByte32);
      //   ARRAY[+result] = ARRAY[+result] + 1;
      // }
      // console.log(ARRAY);
    });
  });
});
