package io.mobidex.screens

import android.os.Bundle
import android.support.v4.app.Fragment
import android.support.v7.widget.LinearLayoutManager
import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import io.mobidex.R
import io.mobidex.adapters.ProductsAdapter
import io.mobidex.models.Product

class ProductsFragment() : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        var root: View = inflater.inflate(R.layout.products, container, false)
        val products: Array<Product> = arrayOf(Product("0x000000000000000000000", "0x Protocol", "ZRX", 18), Product("0x000000000000000000000", "Maker DAO", "DAI", 18))

        val viewManager = LinearLayoutManager(this.context)
        val viewAdapter = ProductsAdapter(products)

        root.findViewById<RecyclerView>(R.id.products_list).apply {
            setHasFixedSize(true)
            layoutManager = viewManager
            adapter = viewAdapter
        }

        return root
    }
}