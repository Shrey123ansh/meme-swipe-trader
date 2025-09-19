interface Window {
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, handler: Function) => void;
    removeListener: (event: string, handler: Function) => void;
    isMetaMask?: boolean;
  };
}