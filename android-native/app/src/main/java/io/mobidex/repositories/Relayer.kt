package io.mobidex.repositories

import io.mobidex.clients.StandardRelayerClient
import io.mobidex.models.AssetPairItem
import kotlinx.coroutines.newSingleThreadContext
import kotlinx.coroutines.runBlocking

fun getAssetPairs(page: Int = 1, perPage: Int = 10) : List<AssetPairItem>{
    val client = StandardRelayerClient("https://mobidex.io/relayer/v2")
    var response = newSingleThreadContext("relayer").use { runBlocking { client.getAssetPairsAsync() } }
    return response
}