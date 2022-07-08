/* eslint-disable react/no-unescaped-entities */
// *EXTERNALS*
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import {
  DEFENDER_CONTRACT_ADDRESS,
  GEMS_CONTRACT_ADDRESS,
  LOOT_CONTRACT_ADDRESS,
  FAUCET_CONTRACT_ADDRESS,
  STAKE_CONTRACT_ADDRESS,
} from 'dungeon-defenders-contracts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';

// *INTERNALS*
import { NETWORK_EXPLORER, HARB_DONATION_ADDRESS, RAMSEY_DONATION_ADDRESS } from '../constants';

const CONTRACTS = [
  {
    name: 'Gems',
    address: GEMS_CONTRACT_ADDRESS,
  },
  {
    name: 'GemsFaucet',
    address: FAUCET_CONTRACT_ADDRESS,
  },
  {
    name: 'DungeonDefender',
    address: DEFENDER_CONTRACT_ADDRESS,
  },
  {
    name: 'DungeonLoot',
    address: LOOT_CONTRACT_ADDRESS,
  },
  {
    name: 'Staking',
    address: STAKE_CONTRACT_ADDRESS,
  },
];

const About = () => {
  const handleClipboard = (ADDRESS: string) => {
    const selector = ADDRESS === HARB_DONATION_ADDRESS ? '#harb' : '#ramsey';
    const tooltip = document.querySelector(`${selector} > .tooltiptextSpecial`);

    if (tooltip && !tooltip.classList.contains('tooltip-visible')) {
      tooltip.classList.add('tooltipAnim');
      tooltip.classList.add('tooltip-visible');
      setTimeout(() => {
        if (tooltip) {
          tooltip.classList.remove('tooltip-visible');
          tooltip.classList.remove('tooltipAnim');
        }
      }, 3000);
    }

    navigator.clipboard.writeText(ADDRESS);
  };

  return (
    <div className="text-center mt-5 mb-5">
      <div className="container">
        <h1 className="fw-light mb-3">Team</h1>
        <div className="row mb-5">
          <div className="col-lg-4 offset-2">
            <h3>0xharb</h3>
            <img src="https://i.imgur.com/pwSuocH.png" />
            <p className="text-muted">Fullstack Dev / JS lover / Web3 enjoyoooor</p>
            <div>
              <a className="m-2" target="_blank" rel="noreferrer" href="https://github.com/ablin42">
                <FontAwesomeIcon icon={faGithub} fontSize={25} color="#456cd1" />
              </a>
              <a className="m-2" target="_blank" rel="noreferrer" href="https://twitter.com/0xharb">
                <FontAwesomeIcon icon={faTwitter} fontSize={25} color="#456cd1" />
              </a>
              <a className="m-2 d-inline-block" href="#">
                <FontAwesomeIcon
                  icon={faEthereum}
                  fontSize={25}
                  onClick={() => handleClipboard(HARB_DONATION_ADDRESS)}
                  color="#456cd1"
                />
                <div className="tooltipSpecial" id="harb">
                  <span className="tooltiptextSpecial">Copied to clipboard!</span>
                </div>
              </a>
            </div>
          </div>

          <div className="col-lg-4">
            <h3>Ramsey</h3>
            <img src="https://i.imgur.com/ppKyvY7.png" />
            <p className="text-muted">Best Teammate Ever (Put your desc here + links..)</p>
            <div>
              <a className="m-2" target="_blank" rel="noreferrer" href="https://github.com/rkhadder">
                <FontAwesomeIcon icon={faGithub} fontSize={25} color="#456cd1" />
              </a>
              <a className="m-2 d-inline-block" href="#">
                <FontAwesomeIcon
                  icon={faEthereum}
                  fontSize={25}
                  onClick={() => handleClipboard(RAMSEY_DONATION_ADDRESS)}
                  color="#456cd1"
                />
                <div className="tooltipSpecial" id="ramsey">
                  <span className="tooltiptextSpecial">Copied to clipboard!</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="album bg-dark">
        <div className="container pt-5 pb-5">
          <div className="col-lg-8 offset-lg-2">
            <h1 className="fw-light mb-3">About Dungeon Defenders</h1>
            <div className="text-start">
              <h2>Overview</h2>
              <p>
                Dungeon Defenders is a dungeon crawler where you explore procedurally generated dungeons, fight
                monsters, collect loot, and level up your character. Your character and loot live entirely on-chain
                while the gameplay happens off-chain. Your character will evolve as they increase levels and retrieve
                loot
              </p>
              <hr />

              <h2>Tokens</h2>
              <h5>Defenders</h5>
              <p>
                Defenders are <b>evolutive ERC721</b> tokens. The NFT will contain the attributes of the character,
                their levels, their win/loss ratio.{' '}
                <b>Things that happen in the dungeon will be reflected on the character’s NFT</b>
              </p>
              <h5>Gems</h5>
              <p>
                Gems are an <b>ERC20</b> token. Gems are the <b>currency</b> of the game & the most common loot that you
                will receive for defending a dungeon. Gems can be used to buy characters, weapons, or level up your
                character. Gems can be transferred, or sold, to other players
              </p>
              <h5>Loot</h5>
              <p>
                Loot is an ERC721 token. The player can attach <b>Loot</b> to his <b>Defender</b> to be <b>staked</b>{' '}
                along upon entering the dungeon. Loot will give in-game attribute boosts
              </p>
              <hr />

              <h2>Mechanics</h2>
              <p>
                The gameplay will happen off-chain. To enter the dungeon, a player must pay gems and stake their
                character and Loot NFTs. While staked, that NFTs cannot be used to do anything else (i.e. cannot be
                transferred nor enter another dungeon). The result of the dungeon is then committed to the chain
              </p>
              <h5>Victory</h5>
              <p>
                When the player beats a dungeon their character NFT will receive experience that works towards leveling
                up their character, the player will receive gems, and possibly receive additional Loot NFTs
              </p>
              <h5>Loss</h5>
              <p>The contract can be unstaked for no rewards. You will lose the gems you paid to enter</p>
            </div>

            <h1 className="fw-light mb-3 mt-5">FAQ</h1>
            <Accordion defaultActiveKey="0" alwaysOpen>
              <Accordion.Item eventKey="0">
                <Accordion.Header>I can't mint a Defender</Accordion.Header>
                <Accordion.Body>
                  Make sure you have <b>0.01 Ether</b> available, if the error persist it is most likely because the
                  name you entered is too long/contains invalid characters
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Where can I mint loot ?</Accordion.Header>
                <Accordion.Body>
                  Loot can only be minted by the staking contract upon completion of the dungeon, keep in mind it has a
                  droprate so you won't be getting a new one every time
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>I can't claim from the faucet</Accordion.Header>
                <Accordion.Body>
                  Check under the claim button if the faucet has enough funds, if not, wait for it to refill or contact
                  the team
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>I can't enter the dungeon</Accordion.Header>
                <Accordion.Body>
                  Make sure you have correctly set the <b>allowance</b> to allow the staking contract to use your
                  Defender, Loot and Gems, and that you own the NFTs and enough Gems. Check that your Defender isn't
                  already staked
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="4">
                <Accordion.Header>I can't claim after completing the dungeon</Accordion.Header>
                <Accordion.Body>
                  If you've completed the dungeon & you're unable to claim after a few minutes, an error most likely
                  occured when allocating your rewards. Come back roughly 20 minutes later and you should be able to
                  call the '<b>Emergency Withdraw</b>' function to safely withdraw your NFTs and your Gems
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <h1 className="fw-light mb-3 mt-5">Contracts</h1>
            <div className="col-8 offset-2">
              <table className="table table-dark table-striped text-start">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {CONTRACTS.map((contract) => (
                    <tr key={contract.name}>
                      <td>
                        <b>{contract.name}</b>
                      </td>
                      <td>
                        <a target="_blank" rel="noreferrer" href={`${NETWORK_EXPLORER}/address/${contract.address}`}>
                          {contract.address}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;