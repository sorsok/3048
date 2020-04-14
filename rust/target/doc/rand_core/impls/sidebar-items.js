initSidebarItems({
  fn: [
    [
      'fill_bytes_via_next',
      'Implement `fill_bytes` via `next_u64` and `next_u32`, little-endian order.',
    ],
    [
      'fill_via_u32_chunks',
      'Implement `fill_bytes` by reading chunks from the output buffer of a block based RNG.',
    ],
    [
      'fill_via_u64_chunks',
      'Implement `fill_bytes` by reading chunks from the output buffer of a block based RNG.',
    ],
    ['next_u32_via_fill', 'Implement `next_u32` via `fill_bytes`, little-endian order.'],
    ['next_u64_via_fill', 'Implement `next_u64` via `fill_bytes`, little-endian order.'],
    ['next_u64_via_u32', 'Implement `next_u64` via `next_u32`, little-endian order.'],
  ],
})
