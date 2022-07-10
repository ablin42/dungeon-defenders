// import { expect } from "chai";
// import { ethers } from "hardhat";
// import { DefenderFactory } from "../typechain";
// import { DefenderUtils } from "../typechain/DefenderUtils";

// describe("DDS", function () {
//   describe('factory', function () {
//     let contract: DefenderFactory;
//     beforeEach(async () => {
//       const factory = await ethers.getContractFactory("DefenderFactory");
//       const tx = await factory.deploy();
//       contract = await tx.deployed() as DefenderFactory;
//     })

//     it('Generates a random defender', async () => {
//       const name = 'DefendersName';
//       const nameByte32 = ethers.utils.formatBytes32String(name);

//       const tx = await contract.createRandomDefender(nameByte32);
//       const result = await tx.wait();
//       const newDefenderGeneratedEvent = result.events?.find(e => e.event === 'NewDefenderGenerated');

//       expect(newDefenderGeneratedEvent).to.not.be.undefined;
//       expect(newDefenderGeneratedEvent?.args).to.not.be.undefined;
//       expect(newDefenderGeneratedEvent?.args?.defenderId?.toNumber()).to.equal(0);
//       expect(ethers.utils.parseBytes32String(newDefenderGeneratedEvent?.args?.name)).to.equal(name);

//       const defender = await contract.defenders(0);
//       expect(ethers.utils.parseBytes32String(defender.name)).to.equal(name);
//       expect(defender.level).to.equal(1);
//       expect(defender.dungeonWins).to.equal(0);
//       expect(defender.dungeonLosses).to.equal(0);
//       expect(defender.characterType).to.be.lessThan(6);
//       expect(defender.health).to.be.greaterThan(0);
//       expect(defender.speed).to.be.greaterThan(0);
//       expect(defender.strength).to.be.greaterThan(0);
//       expect(defender.defense).to.be.greaterThan(0);
//     });
//   });

//   describe('defender utils', () => {
//     let contract: DefenderUtils;
//     beforeEach(async () => {
//       const factory = await ethers.getContractFactory("DefenderUtils");
//       const tx = await factory.deploy();
//       contract = await tx.deployed() as DefenderUtils;
      
//       const name = 'DefendersName';
//       const nameByte32 = ethers.utils.formatBytes32String(name);
//       const tx2 = await contract.createRandomDefender(nameByte32);
//       await tx2.wait();
//     });

//     it('successfully increments levels', async () => {
//       const tx = await contract.gainExperience(0, 1000);
//       const result = await tx.wait();
//       const defenderLeveledUpEvent = result.events?.find(e => e.event === 'DefenderLeveledUp');

//       expect(defenderLeveledUpEvent).to.not.be.undefined;
//       expect(defenderLeveledUpEvent?.args).to.not.be.undefined;
//       expect(defenderLeveledUpEvent?.args?.defenderId?.toNumber()).to.equal(0);
//       expect(defenderLeveledUpEvent?.args?.level).to.equal(4);

//       const defender = await contract.defenders(0);
//       expect(defender.level).to.equal(4);
//     })
    
//     it('reverts due to max level', async () => {
//       const tx = await contract.gainExperience(0, 10000);
//       await tx.wait();
//       const defender = await contract.defenders(0);
//       expect(defender.level).to.equal(10);
//       await expect(contract.gainExperience(0, 9968)).to.be.revertedWith('Defender is already max level');
//     })
//   });
// });
