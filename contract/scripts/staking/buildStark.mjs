import { Provider, stark } from 'starknet';
const { getSelectorFromName } = stark;

const CONTRACT_ADDRESS = "0x054196132f8195260540188857d1db3f10f661c2166b846b93a85dc780953825";
const network = "http://localhost:5001/";

const provider = new Provider({baseUrl: network})

// Set tokenId to 5
console.log('set tokenId to 5');
const setTokenResponse = await provider.addTransaction({
  type: "INVOKE_FUNCTION",
  contract_address: CONTRACT_ADDRESS,
  entry_point_selector: getSelectorFromName("set_tokenId"),
  calldata: ["5"]
});
console.log(setTokenResponse);

// Read tokenId
const getTokenResponse = await provider.callContract({
  contract_address: CONTRACT_ADDRESS,
  entry_point_selector: getSelectorFromName("get_tokenId"),
  calldata: ["5"]
})

console.log(`get_tokenId(): ${getTokenResponse.result[0]}`);