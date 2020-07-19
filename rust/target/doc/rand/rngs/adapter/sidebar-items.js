initSidebarItems({
  struct: [
    [
      'ReadRng',
      'An RNG that reads random bytes straight from any type supporting `std::io::Read`, for example files.',
    ],
    [
      'ReseedingRng',
      'A wrapper around any PRNG which reseeds the underlying PRNG after it has generated a certain number of random bytes.',
    ],
  ],
})