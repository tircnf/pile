<template>
    <v-app>
        <v-app-bar
                app
                color="primary"
                dark
        >
            <div class="d-flex align-center">
<!--                Not Affiliated with Marvel.-->
                <Breakpoints/>
            </div>

            <v-spacer/>



            <v-btn
                    href="http://marvel.com"
                    target="_blank"
                    text
            >

                <span class="mr-2">Data provided by Marvel. &copy; 2020 MARVEL</span>
                <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
        </v-app-bar>

        <v-content>
            <div id="nav">
                <router-link to="/">Home</router-link>
                |
                <router-link to="/about">About</router-link>
            </div>

            <v-container>
                <keep-alive>
                    <router-view/>
                </keep-alive>
            </v-container>

        </v-content>
    </v-app>
</template>

<script>
    // import HelloWorld from './components/HelloWorld';

    import Breakpoints from "./components/Breakpoints";
    export default {
        name: 'App',

        components: {
            Breakpoints
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
