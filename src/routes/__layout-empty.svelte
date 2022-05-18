<script lang='ts'>
    import '../app.css'
    import { initializeApp } from 'firebase/app';
    import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

    import { onMount } from 'svelte';

	import '../lib/i18n';
    import { locale, _ } from 'svelte-i18n';

    const locales = [{name: 'en_GB', label: 'EN'},
                     {name: 'si_LK', label: 'SI'},
                     {name: 'ta_LK', label: 'TA'} ];

    // TODO: What's the right way to initialize this?\

    let app = null;

    onMount( () => {
        const firebaseConfig = {
            apiKey: "AIzaSyCZFHnONhIibx8BoaQ5YXEuGU_YYifZtgw",
            authDomain: "citizen-forum.firebaseapp.com",
            projectId: "citizen-forum",
            storageBucket: "citizen-forum.appspot.com",
            messagingSenderId: "191667775174",
            appId: "1:191667775174:web:be866f3b6e992e3be899c7",
            measurementId: "G-EQ3M8ZHJ64"
        };

        // Initialize Firebase
        app = initializeApp(firebaseConfig);
        // TODO: Do we need this?
        const auth = getAuth(app);
        // const analytics = getAnalytics(app);
    })


    async function loginWithGoogle() {

        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider)
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
             //console.log(user, credential, token, result);
            // ...
        }
        catch(error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
            console.log(error);
        }
    }
</script>

<div class="flex">
    <div class="btn-group">
        {#each locales as loc}
            <button class="btn" class:btn-active="{loc.name == $locale}"
                on:click={() => $locale = loc.name}>{loc.label}</button>
        {/each}
    </div>
    <div>
        <span role="button" class="btn" on:click="{loginWithGoogle}">Login with Google</span>
    </div>
</div>
<div class='max-w-6xl mx-auto bg-base-100 min-h-screen'>
    <slot></slot>
</div>