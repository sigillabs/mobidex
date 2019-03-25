package io.mobidex.clients

import io.ktor.client.HttpClient
import io.ktor.client.engine.android.Android
import io.ktor.client.request.get
import io.mobidex.models.AssetPairItem
import io.mobidex.models.AssetPairsResponse

class StandardRelayerClient(private val url: String) {
    suspend fun getAssetPairsAsync(page: Int = 1, perPage: Int = 10): List<AssetPairItem> {
        val client = HttpClient(Android)
        val queryString = "networkId=1&page=$page&perPage=$perPage"
        val response = client.get<AssetPairsResponse>(url + "/asset_pairs?" + queryString)
        return response.records
    }
}
