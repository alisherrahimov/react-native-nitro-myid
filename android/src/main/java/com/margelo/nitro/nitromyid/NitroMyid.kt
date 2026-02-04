package com.margelo.nitro.nitromyid
  
import com.facebook.proguard.annotations.DoNotStrip

@DoNotStrip
class NitroMyid : HybridNitroMyidSpec() {
  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }
}
