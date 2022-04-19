<script lang="ts">
    import { dictionary, locale, _ } from 'svelte-i18n';

</script>

<div class="hero min-h-screen" style="background-image: url(/images/protests-image1.jpeg?w=1000&h=800);">
    <div class="hero-overlay bg-opacity-60"></div>
    <div class="hero-content text-center text-neutral-content">
      <div class="max-w-md">
        <h1 class="mb-5 text-5xl font-bold">{$_('home.hero_title')}</h1>
        <p class="mb-5">
            {$_('home.hero_sub')}
        </p>
        <a role="button" class="btn btn-primary" href="/form">{$_('nav.fill')}</a>

        <a role="button" class="btn" href="/responses">{$_('nav.read_responses')}</a>
        
      </div>
    </div>
  </div>