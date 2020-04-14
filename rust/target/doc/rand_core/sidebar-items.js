initSidebarItems({
  enum: [['ErrorKind', 'Error kind which can be matched over.']],
  mod: [
    ['block', 'The `BlockRngCore` trait and implementation helpers'],
    ['impls', 'Helper functions for implementing `RngCore` functions.'],
    ['le', 'Little-Endian utilities'],
  ],
  struct: [['Error', 'Error type of random number generators']],
  trait: [
    [
      'CryptoRng',
      'A marker trait used to indicate that an [`RngCore`] or [`BlockRngCore`] implementation is supposed to be cryptographically secure.',
    ],
    ['RngCore', 'The core of a random number generator.'],
    ['SeedableRng', 'A random number generator that can be explicitly seeded.'],
  ],
})
