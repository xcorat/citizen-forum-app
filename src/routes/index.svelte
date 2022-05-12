<script lang="ts">
    import { dictionary, locale, _ } from 'svelte-i18n'; 
    import { dev } from '$app/env';
    const googleFormAddrDebug = "1wdiZObfkHM33v4a7cA2DWZRtKhWNfrh3rwPOWXYDlTU" //import.meta.env.VITE_GOOGLE_FORM_ADDR_DEBUG as string;

    const gform_dev_url = "https://docs.google.com/forms/d/e/" + googleFormAddrDebug + "/viewform"
    const gform_url = (dev)? gform_dev_url: "https://rb.gy/hj6ogz";

</script>

<div class="hero min-h-screen" style="background-image: url(/images/protests-image1.jpeg?w=1000&h=800);">
    <div class="hero-overlay bg-opacity-60"></div>
    <div class="hero-content text-center text-neutral-content">
      <div class="max-w-lg">
        <h1 class="mb-5 text-5xl font-bold">{$_('home.hero_title')}</h1>
        <p class="mb-5">
            {$_('home.hero_sub')}
        </p>
        <a role="button" class="btn btn-primary" href={gform_url} target=”_blank”>Google {$_('nav.fill')}</a>
        <a role="button" class="btn" href="/form">Web {$_('nav.fill')}</a>
        <a role="button" class="btn" href="/responses">{$_('nav.read_responses')}</a>
        
      </div>
    </div>
</div>