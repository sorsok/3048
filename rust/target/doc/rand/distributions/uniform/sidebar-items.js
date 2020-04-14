initSidebarItems({
  struct: [
    ['Uniform', 'Sample values uniformly between two bounds.'],
    ['UniformDuration', 'The back-end implementing [`UniformSampler`] for `Duration`.'],
    ['UniformFloat', 'The back-end implementing [`UniformSampler`] for floating-point types.'],
    ['UniformInt', 'The back-end implementing [`UniformSampler`] for integer types.'],
  ],
  trait: [
    [
      'SampleUniform',
      'Helper trait for creating objects using the correct implementation of [`UniformSampler`] for the sampling type.',
    ],
    ['UniformSampler', 'Helper trait handling actual uniform sampling.'],
  ],
})
