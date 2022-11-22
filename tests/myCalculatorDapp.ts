import * as anchor from '@project-serum/anchor';
import * as assert from 'assert';
const {SystemProgram} = anchor.web3;

describe("myCalculatorDapp", () => {
    
    const provider= anchor.AnchorProvider.local();
    anchor.setProvider(provider)
    const calculator = anchor.web3.Keypair.generate();
    const program = anchor.workspace.MyCalculatorDapp

    it('Creates a calculator', async() => {
        await program.rpc.create("Welcome to Solana", {
            accounts: {
                calculator: calculator.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            },
            signers: [calculator]
        });
        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.greeting === "Welcome to Solana")
    })

    it('Adds two numbers', async() => {
        await program.rpc.add(new anchor.BN(142), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey

            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result.eq(new anchor.BN(145)))
    })

    it('Subtracts two numbers', async() => {
        await program.rpc.subt(new anchor.BN(50), new anchor.BN(60), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result.eq(new anchor.BN(-10)))
    })

    it('Multiplies two numbers', async() => {
        await program.rpc.mult(new anchor.BN(12), new anchor.BN(12), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result.eq(new anchor.BN(144)))
    })

    it('Divides two numbers', async() => {
        await program.rpc.div(new anchor.BN(10), new anchor.BN(2), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result.eq(new anchor.BN(5)))
        assert.ok(account.remainder.eq(new anchor.BN(0)))
    })

})
