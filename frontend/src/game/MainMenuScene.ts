import { getPublicAssetUrl } from "./utils";

export class MainMenuScene extends Phaser.Scene
{
    constructor ()
    {
        super('MainMenu');
    }
    
    preload ()
    {
        this.load.image('button', getPublicAssetUrl('Button.png'));
    }
    
    create ()
    {
		const button = this.add.nineslice(320, 320, 140, 65, 'button', 16)
			.setOrigin(0.5)
        this.add.text(320, 320, 'Stake', { fontFamily: 'CustomFont', fontSize: "2rem", color: "#ffffff" }).setOrigin(0.5)

        button.setInteractive();
        button.on('pointerdown', () => {
            alert('Attempting to stake')
            alert('NFTs staked')
            this.scene.start('Game')
        })
    }
}