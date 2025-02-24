use anchor_lang::prelude::*;

declare_id!("FNUwDxfH4cwnM4HSkNxDivN4o5n7U17fVMchqrtkTJBp");

#[program]
pub mod contracts {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {
    
}
