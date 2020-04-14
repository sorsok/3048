;(function () {
  var implementors = {}
  implementors['rand'] = [
    {
      text:
        'impl <a class="trait" href="rand/trait.CryptoRng.html" title="trait rand::CryptoRng">CryptoRng</a> for <a class="struct" href="rand/prng/chacha/struct.ChaChaRng.html" title="struct rand::prng::chacha::ChaChaRng">ChaChaRng</a>',
      synthetic: false,
      types: ['rand::prng::chacha::ChaChaRng'],
    },
    {
      text:
        'impl <a class="trait" href="rand/trait.CryptoRng.html" title="trait rand::CryptoRng">CryptoRng</a> for <a class="struct" href="rand/prng/chacha/struct.ChaChaCore.html" title="struct rand::prng::chacha::ChaChaCore">ChaChaCore</a>',
      synthetic: false,
      types: ['rand::prng::chacha::ChaChaCore'],
    },
    {
      text:
        'impl <a class="trait" href="rand/trait.CryptoRng.html" title="trait rand::CryptoRng">CryptoRng</a> for <a class="struct" href="rand/prng/hc128/struct.Hc128Rng.html" title="struct rand::prng::hc128::Hc128Rng">Hc128Rng</a>',
      synthetic: false,
      types: ['rand::prng::hc128::Hc128Rng'],
    },
    {
      text:
        'impl <a class="trait" href="rand/trait.CryptoRng.html" title="trait rand::CryptoRng">CryptoRng</a> for <a class="struct" href="rand/prng/hc128/struct.Hc128Core.html" title="struct rand::prng::hc128::Hc128Core">Hc128Core</a>',
      synthetic: false,
      types: ['rand::prng::hc128::Hc128Core'],
    },
    {
      text:
        'impl&lt;R, Rsdr&gt; <a class="trait" href="rand/trait.CryptoRng.html" title="trait rand::CryptoRng">CryptoRng</a> for <a class="struct" href="rand/rngs/adapter/struct.ReseedingRng.html" title="struct rand::rngs::adapter::ReseedingRng">ReseedingRng</a>&lt;R, Rsdr&gt; <span class="where fmt-newline">where<br>&nbsp;&nbsp;&nbsp;&nbsp;R: <a class="trait" href="rand_core/block/trait.BlockRngCore.html" title="trait rand_core::block::BlockRngCore">BlockRngCore</a> + <a class="trait" href="rand/trait.SeedableRng.html" title="trait rand::SeedableRng">SeedableRng</a> + <a class="trait" href="rand/trait.CryptoRng.html" title="trait rand::CryptoRng">CryptoRng</a>,<br>&nbsp;&nbsp;&nbsp;&nbsp;Rsdr: <a class="trait" href="rand/trait.RngCore.html" title="trait rand::RngCore">RngCore</a> + <a class="trait" href="rand/trait.CryptoRng.html" title="trait rand::CryptoRng">CryptoRng</a>,&nbsp;</span>',
      synthetic: false,
      types: ['rand::rngs::adapter::reseeding::ReseedingRng'],
    },
    {
      text:
        'impl <a class="trait" href="rand/trait.CryptoRng.html" title="trait rand::CryptoRng">CryptoRng</a> for <a class="struct" href="rand/rngs/struct.EntropyRng.html" title="struct rand::rngs::EntropyRng">EntropyRng</a>',
      synthetic: false,
      types: ['rand::rngs::entropy::EntropyRng'],
    },
    {
      text:
        'impl <a class="trait" href="rand/trait.CryptoRng.html" title="trait rand::CryptoRng">CryptoRng</a> for <a class="struct" href="rand/rngs/struct.JitterRng.html" title="struct rand::rngs::JitterRng">JitterRng</a>',
      synthetic: false,
      types: ['rand::rngs::jitter::JitterRng'],
    },
    {
      text:
        'impl <a class="trait" href="rand/trait.CryptoRng.html" title="trait rand::CryptoRng">CryptoRng</a> for <a class="struct" href="rand/rngs/struct.StdRng.html" title="struct rand::rngs::StdRng">StdRng</a>',
      synthetic: false,
      types: ['rand::rngs::std::StdRng'],
    },
    {
      text:
        'impl <a class="trait" href="rand/trait.CryptoRng.html" title="trait rand::CryptoRng">CryptoRng</a> for <a class="struct" href="rand/rngs/struct.ThreadRng.html" title="struct rand::rngs::ThreadRng">ThreadRng</a>',
      synthetic: false,
      types: ['rand::rngs::thread::ThreadRng'],
    },
    {
      text:
        'impl <a class="trait" href="rand/trait.CryptoRng.html" title="trait rand::CryptoRng">CryptoRng</a> for <a class="struct" href="rand/rngs/struct.OsRng.html" title="struct rand::rngs::OsRng">OsRng</a>',
      synthetic: false,
      types: ['rand::rngs::os::OsRng'],
    },
  ]
  if (window.register_implementors) {
    window.register_implementors(implementors)
  } else {
    window.pending_implementors = implementors
  }
})()
