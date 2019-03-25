package io.mobidex.adapters

import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import io.mobidex.R
import io.mobidex.models.Product
import kotlinx.android.synthetic.main.product.view.*

class ProductsAdapter(private val products: Array<Product>) : RecyclerView.Adapter<ProductsAdapter.ProductViewHolder>() {
    class ProductViewHolder(val view: View) : RecyclerView.ViewHolder(view)

    override fun onCreateViewHolder(parent: ViewGroup,  viewType: Int): ProductViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.product, parent, false);
        return ProductViewHolder(view)
    }

    override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
        holder.view.product_logo.product_title.text = "BTC"
        holder.view.product_price.price_data.text = "1"
        holder.view.product_24avg.avg_data.text = "1"
    }

    override fun getItemCount() = products.size
}
