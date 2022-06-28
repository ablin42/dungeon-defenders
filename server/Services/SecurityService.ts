import ethers from 'ethers';

export function validateSignature(address: string, signature: string, request: any) {
    const signedMessage = JSON.stringify(request);
    const signerAddress = ethers.utils.verifyMessage(signedMessage, signature);
    return signerAddress === address;
}