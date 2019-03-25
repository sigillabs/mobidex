package io.mobidex

import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.design.widget.BottomNavigationView
import android.support.annotation.NonNull
import android.view.MenuItem
import android.support.v4.app.Fragment
import io.mobidex.repositories.getAssetPairs
import io.mobidex.screens.*


class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val bottomTabsView = findViewById<BottomNavigationView>(R.id.bottom_tabs)

        bottomTabsView.setOnNavigationItemSelectedListener(object :
            BottomNavigationView.OnNavigationItemSelectedListener {
            override fun onNavigationItemSelected(@NonNull item: MenuItem): Boolean {
                selectBottomTab(item)
                return true
            }
        })

        selectBottomTab(bottomTabsView.menu.getItem(0))

        println(getAssetPairs())
    }

    private fun selectBottomTab(item: MenuItem) {
        item.isChecked = true

        when (item.itemId) {
            R.id.trade ->
                setMainContent(ProductsFragment())
            R.id.orders ->
                setMainContent(UserOrdersFragment())
            R.id.transactions ->
                setMainContent(TransactionHistoryFragment())
            R.id.wallet ->
                setMainContent(WalletFragment())
            R.id.settings ->
                setMainContent(SettingsFragment())
        }
    }

    private fun setMainContent(fragment: Fragment) {
        val transaction = supportFragmentManager.beginTransaction()
        transaction.replace(R.id.main_content, fragment)
        transaction.commit()
    }
}
