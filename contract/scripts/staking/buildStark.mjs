import { Provider, stark, shortString } from 'starknet';
const { getSelectorFromName } = stark;
import { readFileSync} from 'fs';

// Helper function to read input from the contract
const getContractAddress = () => {
  const data = readFileSync('./localhost.deployments.txt', 'utf8');
  const lines = data.trim().split("\n")
  const lastLine = lines[lines.length - 1]
  const address = lastLine.slice(0, 66) // Just pull out the address
  return(address)
}

const parseResponse = (response) => {
  // console.log(`Raw: ${response}`)
  console.log('Raw: ');
  console.log(response);
  // console.log(`Name: ${shortString.decodeShortString(response.result[4])}`)
}

// getContractAddress();
const CONTRACT_ADDRESS = getContractAddress() // Grab contract address from deployments.txt so we don't have to copy/pasta every time
const network = "http://localhost:5001/";

const provider = new Provider({baseUrl: network})

const TOKEN_ID = "5";
const OWNER_ADDRESS = BigInt("0x062cdb5f547735b352813397a5d2621c950cd98c6ac606d6d8898b11d7bd7e96").toString(10);
const ENVIRONMENT = "3";
const SIZE = "20"
const NAME = BigInt(shortString.encodeShortString("Gremp's Dunes")).toString(10);

// Set tokenId for #5
console.log('set address for #5')
const setTokenResponse = await provider.addTransaction({
  type: "INVOKE_FUNCTION",
  contract_address: CONTRACT_ADDRESS,
  entry_point_selector: getSelectorFromName("set_dungeon"),
  calldata: [TOKEN_ID, OWNER_ADDRESS, ENVIRONMENT, SIZE, NAME]
});

console.log(parseResponse(setTokenResponse))
/*
// Read dungeon metadata
const getTokenResponse = await provider.callContract({
  contract_address: CONTRACT_ADDRESS,
  entry_point_selector: getSelectorFromName("get_dungeon"),
  calldata: [TOKEN_ID]
}) 

console.log(`get_dungeon(): ${getTokenResponse.result}`); 


// Read Owner
const getOwnerResponse = await provider.callContract({
  contract_address: CONTRACT_ADDRESS,
  entry_point_selector: getSelectorFromName("get_owner"),
  calldata: [TOKEN_ID]
}) 

console.log(`get_owner(): ${getOwnerResponse.result}`); 

// Read Environment
const getEnvironmentResponse = await provider.callContract({
  contract_address: CONTRACT_ADDRESS,
  entry_point_selector: getSelectorFromName("get_environment"),
  calldata: [TOKEN_ID]
}) 

console.log(`get_environment(): ${getEnvironmentResponse.result}`); 

// Read Size
const getSizeResponse = await provider.callContract({
  contract_address: CONTRACT_ADDRESS,
  entry_point_selector: getSelectorFromName("get_size"),
  calldata: [TOKEN_ID]
}) 

console.log(`get_size(): ${getSizeResponse.result}`); 

// Read Name
const getNameResponse = await provider.callContract({
  contract_address: CONTRACT_ADDRESS,
  entry_point_selector: getSelectorFromName("get_name"),
  calldata: [TOKEN_ID]
}) 
console.log(shortString.decodeShortString(getNameResponse.result[0]))
*/