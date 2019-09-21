package io.mobidex

import org.kethereum.bip32.model.ExtendedKey
import org.kethereum.bip32.toKey
import org.kethereum.bip39.dirtyPhraseToMnemonicWords
import org.kethereum.bip39.toSeed
import org.kethereum.model.Address
import org.kethereum.model.Transaction
import org.kethereum.model.createTransactionWithDefaults
import java.math.BigInteger

fun mnemonicToKey(mnemonic: String, password: String): ExtendedKey {
    val words = dirtyPhraseToMnemonicWords(mnemonic)
    val seed = words.toSeed(password)
    val key = seed.toKey("m/44'/60'/0'/0/0")
    return key
}

fun createTransaction(
        from: Address,
        gasLimit: BigInteger,
        gasPrice: BigInteger,
        input: ByteArray,
        nonce: BigInteger,
        to: Address,
        value: BigInteger
): Transaction {
    val tx = createTransactionWithDefaults(
            chain = null,
            creationEpochSecond = null,
            from = from,
            gasLimit = gasLimit,
            gasPrice = gasPrice,
            input = input,
            nonce = nonce,
            to = to,
            txHash = null,
            value = value)
    return tx;
}