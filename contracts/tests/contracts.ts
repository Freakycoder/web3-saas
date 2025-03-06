import { BN, Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js"
import { ProgramTestContext, startAnchor } from "solana-bankrun"
import { BankrunProvider } from "anchor-bankrun"
import { Contracts } from "../target/types/contracts";

import * as ContractIDL from '../target/idl/contracts.json';
const contractAddress = new PublicKey("FNUwDxfH4cwnM4HSkNxDivN4o5n7U17fVMchqrtkTJBp");

describe("contracts", () => {
  let context: ProgramTestContext;
  let provider: BankrunProvider;
  let stakeProgram: Program<Contracts>;
  let walletAddress: PublicKey;
  let user_pda_address: PublicKey;
  let vault_pda: PublicKey;
  let vault_bump: number;
  const userId = new BN(12345678);

  before(async () => {
    context = await startAnchor("", [{ name: "contracts", programId: contractAddress }], [])
    provider = new BankrunProvider(context);
    stakeProgram = new Program<Contracts>(ContractIDL as Contracts, provider);
    walletAddress = provider.wallet.publicKey;
    [user_pda_address] = PublicKey.findProgramAddressSync([Buffer.from("user"), userId.toArrayLike(Buffer, "le", 8)], contractAddress);
    [vault_pda, vault_bump] = PublicKey.findProgramAddressSync([Buffer.from("vault"), contractAddress.toBuffer()], contractAddress);
  })

  it("initialize user", async () => {
    console.log("user wallet address: ", walletAddress.toString());
    const txSignature = await stakeProgram.methods.initializeUserPda(
      userId,
      new BN(1),
      true,
      false
    ).accountsPartial({
      signer: walletAddress,
      userPda: user_pda_address,
      systemProgram: SystemProgram.programId
    }).rpc()

    console.log("transaction Signature", txSignature)

    const user_pda = await stakeProgram.account.userPda.fetch(user_pda_address);

    console.log("user pda data: ", user_pda);
    console.log("user pda address: ", user_pda_address.toString());
  })

  it("initialize vault", async () => {
    const tx = await stakeProgram.methods.initializeVault(contractAddress).accountsPartial({
      signer: provider.wallet.publicKey,
      vaultPda: vault_pda,
      systemProgram: SystemProgram.programId
    }).rpc()
    console.log("vault initialized signature", tx);

    console.log("vault pda address: ", vault_pda.toString());

    const vault_amount = await stakeProgram.account.vault.fetch(vault_pda);
    console.log("initial vault balance:", vault_amount.vaultAmount);
    console.log("inital user wallet amount(SOL): ", await context.banksClient.getBalance(walletAddress));


  })

  it("user stake funds", async () => {
    const tx2 = await stakeProgram.methods
      .stakeFunds(new BN(1), vault_bump, contractAddress, userId)
      .accountsPartial({
        user: walletAddress,
        userPda: user_pda_address,
        vault: vault_pda,
        systemProgram: SystemProgram.programId
      }
      ).rpc()

    console.log("transaction signature for stake funds", tx2);
    console.log("final user wallet amount(SOL)", await context.banksClient.getBalance(walletAddress));
    const final_vault_amount = await stakeProgram.account.vault.fetch(vault_pda);
    console.log("final vault amount", final_vault_amount.vaultAmount);
  })

});
