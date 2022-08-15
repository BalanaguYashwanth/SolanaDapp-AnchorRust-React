use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod postfeedapp {
    use super::*;
    pub fn create_post(ctx: Context<CreatePost>,text:String,media:String,position:i64,admin:bool,) -> ProgramResult {
        let post = &mut ctx.accounts.feed_post_app;
        post.admin  = admin;
        post.media = media;
        post.position = position;
        post.text = text;
        Ok(())
    }

    pub fn get_post(ctx:Context<GetPost>) -> ProgramResult{
        msg!("post feed text text{} media{} like{} admin{}",ctx.accounts.post_feed.text, ctx.accounts.post_feed.media,ctx.accounts.post_feed.position,ctx.accounts.post_feed.admin);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreatePost<'info,> {
    #[account(init,payer=user,space=9000)]
    feed_post_app : Account<'info,FeedPostApp>,
    #[account(mut)]
    user:Signer<'info,>,
    system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct GetPost<'info,>{
    #[account(mut)]
    user:Signer<'info,>,
    #[account(mut)]
    post_feed:Account<'info,FeedPostApp>,
}

#[account]
pub struct FeedPostApp{
    text:String,
    media:String,
    position:i64,
    admin:bool
}
