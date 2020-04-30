<template>
    <v-app>
        <v-app-bar
                app
                color="primary"
                dark
        >
            <div class="d-flex align-center">
                Not Affiliated with Marvel Comics in any way.
            </div>

            <v-spacer/>

            <v-btn
                    href="https://github.com/tircnf/pile"
                    target="_blank"
                    text
            >

                <span class="mr-2">Link to Somewhere</span>
                <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
        </v-app-bar>

        <v-content>
            <div id="nav">
                <router-link to="/">Home</router-link>
                |
                <router-link to="/about">About</router-link>
            </div>

            <keep-alive>
                <router-view/>
            </keep-alive>

        </v-content>
    </v-app>
</template>

<script>
    // import HelloWorld from './components/HelloWorld';

    export default {
        name: 'App',

        components: {
            // HelloWorld,
        },

        data: () => ({
            //
        }),
    };
</script>

<style scoped="true">
    #nav {
        text-align: center;
    }
</style>
