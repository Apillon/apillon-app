export default function useRpc() {
  const rpcApiKeyStore = useRpcApiKeyStore();

  function onKeyCreated(apiKey: RpcApiKeyInterface) {
    rpcApiKeyStore.selectedId = apiKey.id;
  }

  return {
    onKeyCreated,
  };
}
