initSidebarItems({
  struct: [
    [
      'BlockRng',
      'A wrapper type implementing [`RngCore`] for some type implementing [`BlockRngCore`] with `u32` array buffer; i.e. this can be used to implement a full RNG from just a `generate` function.',
    ],
    [
      'BlockRng64',
      'A wrapper type implementing [`RngCore`] for some type implementing [`BlockRngCore`] with `u64` array buffer; i.e. this can be used to implement a full RNG from just a `generate` function.',
    ],
  ],
  trait: [
    [
      'BlockRngCore',
      'A trait for RNGs which do not generate random numbers individually, but in blocks (typically `[u32; N]`). This technique is commonly used by cryptographic RNGs to improve performance.',
    ],
  ],
})
