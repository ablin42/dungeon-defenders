/* eslint-disable @typescript-eslint/ban-types */
// *EXTERNALS*
import toast from 'react-hot-toast';

export const sendTx = async (tx: Function) => {
  toast.loading(`Tx Pending...`);
  tx();
};
