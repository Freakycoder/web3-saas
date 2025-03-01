use anchor_lang::prelude::*;

declare_id!("FNUwDxfH4cwnM4HSkNxDivN4o5n7U17fVMchqrtkTJBp");

#[program]
pub mod contracts {
    use super::*;

    pub fn initialize_user_pda(
        ctx: Context<InitializeUserPda>,
        user_pubkey: Pubkey,
        amount: u64,
        is_active: bool,
        is_completed: bool,
    ) -> Result<()> {
        let user_pda = &mut ctx.accounts.user_pda;
        user_pda.user_pubkey = user_pubkey;
        user_pda.user_amount = amount;
        user_pda.is_active = is_active;
        user_pda.is_completed = is_completed;
        Ok(())
    }

    pub fn initialize_vault(ctx : Context<InitializeVaultPda>, program_id : Pubkey) -> Result<()>{
        Ok(())
    }

    pub fn stake(ctx: Context<StakedAccounts>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(user_pubkey : Pubkey)]
pub struct InitializeUserPda<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer = signer,
        space = 8 + UserPda::INIT_SPACE,
        seeds = [b"user".as_ref(), user_pubkey.as_ref() ],
        bump
    )]
    pub user_pda: Account<'info, UserPda>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(program_id : Pubkey)]
pub struct InitializeVaultPda<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer = signer,
        space = 8 + Vault::INIT_SPACE,
        seeds = [b"user".as_ref(), program_id.as_ref() ],
        bump
    )]
    pub vault_pda: Account<'info, UserPda>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(program_id : Pubkey)]
pub struct StakedAccounts<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault".as_ref(), program_id.as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct UserPda {
    pub user_pubkey: Pubkey,
    pub user_amount: u64,
    pub is_active: bool,
    pub is_completed: bool,
}

#[account]
#[derive(InitSpace)]
pub struct Vault {
    vault_amount: u64,
}
