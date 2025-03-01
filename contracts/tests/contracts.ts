import { BN, Program, Provider } from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js"
import { ProgramTestContext, startAnchor } from "solana-bankrun"
import { BankrunProvider } from "anchor-bankrun"
import { Contracts } from "../target/types/contracts";

const IDL = require('../target/idl/contracts.json');
const contractAddress = new PublicKey("FNUwDxfH4cwnM4HSkNxDivN4o5n7U17fVMchqrtkTJBp");

describe("contracts", () => {
  let context: ProgramTestContext;
  let provider: BankrunProvider;
  let stakeProgram: Program<Contracts>;
  const walletAddress = new PublicKey("DwNHVjdwU1ivHgSEmaNncvsmCmqM4EPB6mEqNGBayPVY")

  before(async () => {
    context = await startAnchor("", [{ name: "contracts", programId: contractAddress }], [])
    provider = new BankrunProvider(context);
    stakeProgram = new Program<Contracts>(IDL, provider);
  })

  it("initialize user", async () => {
    const txSignature = await stakeProgram.methods.initializeUserPda(
      walletAddress,
      new BN(1),
      true,
      false
    ).rpc()

    console.log("transaction Signature", txSignature)

    const [user_pda_address] = PublicKey.findProgramAddressSync([Buffer.from("user"), walletAddress.toBuffer()] , stakeProgram.programId);
    const user_pda = await stakeProgram.account.userPda.fetch(user_pda_address);

    console.log(user_pda);
  })

});
