;(function () {
  var implementors = {}
  implementors['rand'] = [
    {
      text:
        'impl&lt;X:&nbsp;<a class="trait" href="rand/distributions/uniform/trait.SampleUniform.html" title="trait rand::distributions::uniform::SampleUniform">SampleUniform</a>&gt; <a class="trait" href="https://doc.rust-lang.org/nightly/core/convert/trait.From.html" title="trait core::convert::From">From</a>&lt;<a class="struct" href="https://doc.rust-lang.org/nightly/core/ops/range/struct.Range.html" title="struct core::ops::range::Range">Range</a>&lt;X&gt;&gt; for <a class="struct" href="rand/distributions/uniform/struct.Uniform.html" title="struct rand::distributions::uniform::Uniform">Uniform</a>&lt;X&gt;',
      synthetic: false,
      types: ['rand::distributions::uniform::Uniform'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/core/convert/trait.From.html" title="trait core::convert::From">From</a>&lt;<a class="struct" href="rand/prng/chacha/struct.ChaChaCore.html" title="struct rand::prng::chacha::ChaChaCore">ChaChaCore</a>&gt; for <a class="struct" href="rand/prng/chacha/struct.ChaChaRng.html" title="struct rand::prng::chacha::ChaChaRng">ChaChaRng</a>',
      synthetic: false,
      types: ['rand::prng::chacha::ChaChaRng'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/core/convert/trait.From.html" title="trait core::convert::From">From</a>&lt;<a class="enum" href="rand/rngs/enum.TimerError.html" title="enum rand::rngs::TimerError">TimerError</a>&gt; for <a class="struct" href="rand/struct.Error.html" title="struct rand::Error">Error</a>',
      synthetic: false,
      types: ['rand_core::error::Error'],
    },
  ]
  implementors['rand_core'] = [
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/core/convert/trait.From.html" title="trait core::convert::From">From</a>&lt;<a class="struct" href="rand_core/struct.Error.html" title="struct rand_core::Error">Error</a>&gt; for <a class="struct" href="https://doc.rust-lang.org/nightly/std/io/error/struct.Error.html" title="struct std::io::error::Error">Error</a>',
      synthetic: false,
      types: ['std::io::error::Error'],
    },
  ]
  if (window.register_implementors) {
    window.register_implementors(implementors)
  } else {
    window.pending_implementors = implementors
  }
})()
