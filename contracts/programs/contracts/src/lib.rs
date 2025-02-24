use anchor_lang::prelude::*;

declare_id!("FNUwDxfH4cwnM4HSkNxDivN4o5n7U17fVMchqrtkTJBp");

#[program]
pub mod contracts {
    use super::*;

    pub fn initialize_poll(ctx : Context<InitializePoll>, _poll_id : u64) -> Result<()>{
        Ok(())
    }
    
}

#[derive(Accounts)]
pub struct InitializePoll{
    
}


