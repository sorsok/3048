;(function () {
  var implementors = {}
  implementors['rand'] = [
    {
      text:
        'impl&lt;T, R&gt; <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/struct.Generator.html" title="struct rand::Generator">Generator</a>&lt;T, R&gt; <span class="where fmt-newline">where<br>&nbsp;&nbsp;&nbsp;&nbsp;R: <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a>,&nbsp;</span>',
      synthetic: true,
      types: ['rand::Generator'],
    },
    {
      text:
        'impl&lt;R&gt; <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/struct.AsciiGenerator.html" title="struct rand::AsciiGenerator">AsciiGenerator</a>&lt;R&gt; <span class="where fmt-newline">where<br>&nbsp;&nbsp;&nbsp;&nbsp;R: <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a>,&nbsp;</span>',
      synthetic: true,
      types: ['rand::AsciiGenerator'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/struct.Alphanumeric.html" title="struct rand::distributions::Alphanumeric">Alphanumeric</a>',
      synthetic: true,
      types: ['rand::distributions::other::Alphanumeric'],
    },
    {
      text:
        'impl&lt;X&gt; <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/uniform/struct.Uniform.html" title="struct rand::distributions::uniform::Uniform">Uniform</a>&lt;X&gt; <span class="where fmt-newline">where<br>&nbsp;&nbsp;&nbsp;&nbsp;&lt;X as <a class="trait" href="rand/distributions/uniform/trait.SampleUniform.html" title="trait rand::distributions::uniform::SampleUniform">SampleUniform</a>&gt;::<a class="type" href="rand/distributions/uniform/trait.SampleUniform.html#associatedtype.Sampler" title="type rand::distributions::uniform::SampleUniform::Sampler">Sampler</a>: <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a>,&nbsp;</span>',
      synthetic: true,
      types: ['rand::distributions::uniform::Uniform'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/struct.OpenClosed01.html" title="struct rand::distributions::OpenClosed01">OpenClosed01</a>',
      synthetic: true,
      types: ['rand::distributions::float::OpenClosed01'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/struct.Open01.html" title="struct rand::distributions::Open01">Open01</a>',
      synthetic: true,
      types: ['rand::distributions::float::Open01'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/struct.Gamma.html" title="struct rand::distributions::Gamma">Gamma</a>',
      synthetic: true,
      types: ['rand::distributions::gamma::Gamma'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/struct.ChiSquared.html" title="struct rand::distributions::ChiSquared">ChiSquared</a>',
      synthetic: true,
      types: ['rand::distributions::gamma::ChiSquared'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/struct.FisherF.html" title="struct rand::distributions::FisherF">FisherF</a>',
      synthetic: true,
      types: ['rand::distributions::gamma::FisherF'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/struct.StudentT.html" title="struct rand::distributions::StudentT">StudentT</a>',
      synthetic: true,
      types: ['rand::distributions::gamma::StudentT'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/struct.Normal.html" title="struct rand::distributions::Normal">Normal</a>',
      synthetic: true,
      types: ['rand::distributions::normal::Normal'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/struct.LogNormal.html" title="struct rand::distributions::LogNormal">LogNormal</a>',
      synthetic: true,
      types: ['rand::distributions::normal::LogNormal'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/struct.StandardNormal.html" title="struct rand::distributions::StandardNormal">StandardNormal</a>',
      synthetic: true,
      types: ['rand::distributions::normal::StandardNormal'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/struct.Exp.html" title="struct rand::distributions::Exp">Exp</a>',
      synthetic: true,
      types: ['rand::distributions::exponential::Exp'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/struct.Exp1.html" title="struct rand::distributions::Exp1">Exp1</a>',
      synthetic: true,
      types: ['rand::distributions::exponential::Exp1'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/struct.Pareto.html" title="struct rand::distributions::Pareto">Pareto</a>',
      synthetic: true,
      types: ['rand::distributions::pareto::Pareto'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/struct.Poisson.html" title="struct rand::distributions::Poisson">Poisson</a>',
      synthetic: true,
      types: ['rand::distributions::poisson::Poisson'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/struct.Binomial.html" title="struct rand::distributions::Binomial">Binomial</a>',
      synthetic: true,
      types: ['rand::distributions::binomial::Binomial'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/struct.Bernoulli.html" title="struct rand::distributions::Bernoulli">Bernoulli</a>',
      synthetic: true,
      types: ['rand::distributions::bernoulli::Bernoulli'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/struct.Cauchy.html" title="struct rand::distributions::Cauchy">Cauchy</a>',
      synthetic: true,
      types: ['rand::distributions::cauchy::Cauchy'],
    },
    {
      text:
        'impl&lt;\'a, D, R, T&gt; !<a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/struct.DistIter.html" title="struct rand::distributions::DistIter">DistIter</a>&lt;\'a, D, R, T&gt;',
      synthetic: true,
      types: ['rand::distributions::DistIter'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/struct.Standard.html" title="struct rand::distributions::Standard">Standard</a>',
      synthetic: true,
      types: ['rand::distributions::Standard'],
    },
    {
      text:
        'impl&lt;T&gt; <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/struct.Weighted.html" title="struct rand::distributions::Weighted">Weighted</a>&lt;T&gt; <span class="where fmt-newline">where<br>&nbsp;&nbsp;&nbsp;&nbsp;T: <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a>,&nbsp;</span>',
      synthetic: true,
      types: ['rand::distributions::Weighted'],
    },
    {
      text:
        'impl&lt;\'a, T&gt; !<a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/struct.WeightedChoice.html" title="struct rand::distributions::WeightedChoice">WeightedChoice</a>&lt;\'a, T&gt;',
      synthetic: true,
      types: ['rand::distributions::WeightedChoice'],
    },
    {
      text:
        'impl&lt;X&gt; <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/uniform/struct.UniformInt.html" title="struct rand::distributions::uniform::UniformInt">UniformInt</a>&lt;X&gt; <span class="where fmt-newline">where<br>&nbsp;&nbsp;&nbsp;&nbsp;X: <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a>,&nbsp;</span>',
      synthetic: true,
      types: ['rand::distributions::uniform::UniformInt'],
    },
    {
      text:
        'impl&lt;X&gt; <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/uniform/struct.UniformFloat.html" title="struct rand::distributions::uniform::UniformFloat">UniformFloat</a>&lt;X&gt; <span class="where fmt-newline">where<br>&nbsp;&nbsp;&nbsp;&nbsp;X: <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a>,&nbsp;</span>',
      synthetic: true,
      types: ['rand::distributions::uniform::UniformFloat'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/distributions/uniform/struct.UniformDuration.html" title="struct rand::distributions::uniform::UniformDuration">UniformDuration</a>',
      synthetic: true,
      types: ['rand::distributions::uniform::UniformDuration'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/prng/struct.XorShiftRng.html" title="struct rand::prng::XorShiftRng">XorShiftRng</a>',
      synthetic: true,
      types: ['rand::prng::xorshift::XorShiftRng'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/prng/chacha/struct.ChaChaRng.html" title="struct rand::prng::chacha::ChaChaRng">ChaChaRng</a>',
      synthetic: true,
      types: ['rand::prng::chacha::ChaChaRng'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/prng/chacha/struct.ChaChaCore.html" title="struct rand::prng::chacha::ChaChaCore">ChaChaCore</a>',
      synthetic: true,
      types: ['rand::prng::chacha::ChaChaCore'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/prng/hc128/struct.Hc128Rng.html" title="struct rand::prng::hc128::Hc128Rng">Hc128Rng</a>',
      synthetic: true,
      types: ['rand::prng::hc128::Hc128Rng'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/prng/hc128/struct.Hc128Core.html" title="struct rand::prng::hc128::Hc128Core">Hc128Core</a>',
      synthetic: true,
      types: ['rand::prng::hc128::Hc128Core'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/prng/isaac/struct.IsaacRng.html" title="struct rand::prng::isaac::IsaacRng">IsaacRng</a>',
      synthetic: true,
      types: ['rand::prng::isaac::IsaacRng'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/prng/isaac/struct.IsaacCore.html" title="struct rand::prng::isaac::IsaacCore">IsaacCore</a>',
      synthetic: true,
      types: ['rand::prng::isaac::IsaacCore'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/prng/isaac64/struct.Isaac64Rng.html" title="struct rand::prng::isaac64::Isaac64Rng">Isaac64Rng</a>',
      synthetic: true,
      types: ['rand::prng::isaac64::Isaac64Rng'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/prng/isaac64/struct.Isaac64Core.html" title="struct rand::prng::isaac64::Isaac64Core">Isaac64Core</a>',
      synthetic: true,
      types: ['rand::prng::isaac64::Isaac64Core'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/rngs/struct.JitterRng.html" title="struct rand::rngs::JitterRng">JitterRng</a>',
      synthetic: true,
      types: ['rand::rngs::jitter::JitterRng'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/rngs/struct.EntropyRng.html" title="struct rand::rngs::EntropyRng">EntropyRng</a>',
      synthetic: true,
      types: ['rand::rngs::entropy::EntropyRng'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/rngs/struct.SmallRng.html" title="struct rand::rngs::SmallRng">SmallRng</a>',
      synthetic: true,
      types: ['rand::rngs::small::SmallRng'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/rngs/struct.StdRng.html" title="struct rand::rngs::StdRng">StdRng</a>',
      synthetic: true,
      types: ['rand::rngs::std::StdRng'],
    },
    {
      text:
        'impl !<a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/rngs/struct.ThreadRng.html" title="struct rand::rngs::ThreadRng">ThreadRng</a>',
      synthetic: true,
      types: ['rand::rngs::thread::ThreadRng'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/rngs/struct.OsRng.html" title="struct rand::rngs::OsRng">OsRng</a>',
      synthetic: true,
      types: ['rand::rngs::os::OsRng'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="enum" href="rand/rngs/enum.TimerError.html" title="enum rand::rngs::TimerError">TimerError</a>',
      synthetic: true,
      types: ['rand::rngs::jitter::TimerError'],
    },
    {
      text:
        'impl&lt;R&gt; <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/rngs/adapter/struct.ReadRng.html" title="struct rand::rngs::adapter::ReadRng">ReadRng</a>&lt;R&gt; <span class="where fmt-newline">where<br>&nbsp;&nbsp;&nbsp;&nbsp;R: <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a>,&nbsp;</span>',
      synthetic: true,
      types: ['rand::rngs::adapter::read::ReadRng'],
    },
    {
      text:
        'impl&lt;R, Rsdr&gt; <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/rngs/adapter/struct.ReseedingRng.html" title="struct rand::rngs::adapter::ReseedingRng">ReseedingRng</a>&lt;R, Rsdr&gt; <span class="where fmt-newline">where<br>&nbsp;&nbsp;&nbsp;&nbsp;R: <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a>,<br>&nbsp;&nbsp;&nbsp;&nbsp;Rsdr: <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a>,<br>&nbsp;&nbsp;&nbsp;&nbsp;&lt;R as <a class="trait" href="rand_core/block/trait.BlockRngCore.html" title="trait rand_core::block::BlockRngCore">BlockRngCore</a>&gt;::<a class="type" href="rand_core/block/trait.BlockRngCore.html#associatedtype.Results" title="type rand_core::block::BlockRngCore::Results">Results</a>: <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a>,&nbsp;</span>',
      synthetic: true,
      types: ['rand::rngs::adapter::reseeding::ReseedingRng'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand/rngs/mock/struct.StepRng.html" title="struct rand::rngs::mock::StepRng">StepRng</a>',
      synthetic: true,
      types: ['rand::rngs::mock::StepRng'],
    },
  ]
  implementors['rand_core'] = [
    {
      text:
        'impl !<a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand_core/struct.Error.html" title="struct rand_core::Error">Error</a>',
      synthetic: true,
      types: ['rand_core::error::Error'],
    },
    {
      text:
        'impl <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="enum" href="rand_core/enum.ErrorKind.html" title="enum rand_core::ErrorKind">ErrorKind</a>',
      synthetic: true,
      types: ['rand_core::error::ErrorKind'],
    },
    {
      text:
        'impl&lt;R:&nbsp;?<a class="trait" href="https://doc.rust-lang.org/nightly/core/marker/trait.Sized.html" title="trait core::marker::Sized">Sized</a>&gt; <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand_core/block/struct.BlockRng.html" title="struct rand_core::block::BlockRng">BlockRng</a>&lt;R&gt; <span class="where fmt-newline">where<br>&nbsp;&nbsp;&nbsp;&nbsp;R: <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a>,<br>&nbsp;&nbsp;&nbsp;&nbsp;&lt;R as <a class="trait" href="rand_core/block/trait.BlockRngCore.html" title="trait rand_core::block::BlockRngCore">BlockRngCore</a>&gt;::<a class="type" href="rand_core/block/trait.BlockRngCore.html#associatedtype.Results" title="type rand_core::block::BlockRngCore::Results">Results</a>: <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a>,&nbsp;</span>',
      synthetic: true,
      types: ['rand_core::block::BlockRng'],
    },
    {
      text:
        'impl&lt;R:&nbsp;?<a class="trait" href="https://doc.rust-lang.org/nightly/core/marker/trait.Sized.html" title="trait core::marker::Sized">Sized</a>&gt; <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a> for <a class="struct" href="rand_core/block/struct.BlockRng64.html" title="struct rand_core::block::BlockRng64">BlockRng64</a>&lt;R&gt; <span class="where fmt-newline">where<br>&nbsp;&nbsp;&nbsp;&nbsp;R: <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a>,<br>&nbsp;&nbsp;&nbsp;&nbsp;&lt;R as <a class="trait" href="rand_core/block/trait.BlockRngCore.html" title="trait rand_core::block::BlockRngCore">BlockRngCore</a>&gt;::<a class="type" href="rand_core/block/trait.BlockRngCore.html#associatedtype.Results" title="type rand_core::block::BlockRngCore::Results">Results</a>: <a class="trait" href="https://doc.rust-lang.org/nightly/std/panic/trait.UnwindSafe.html" title="trait std::panic::UnwindSafe">UnwindSafe</a>,&nbsp;</span>',
      synthetic: true,
      types: ['rand_core::block::BlockRng64'],
    },
  ]
  if (window.register_implementors) {
    window.register_implementors(implementors)
  } else {
    window.pending_implementors = implementors
  }
})()
