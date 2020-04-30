<template>
    <div>
        <v-container>
            <h2>Hello
                <v-icon v-if="!character">mdi-waiting mdi-spinner</v-icon>
                <span v-else>{{character.name}}</span></h2>

        <pre>{{character}}</pre>

        </v-container>
    </div>
</template>

<script>

    import api from "../lib/api";

    export default {
        name: "Character.vue",
        props: {
            characterId: String
        },
        data: () => ({
            character: null
        }),
        watch: {
            characterId: {
                immediate: true,
                handler: function(newValue) {
                    this.character=null;

                    api.fetchCharacter(newValue)
                        .then(json => {
                            this.character=json;
                        })
                }
            }
        }
    }
</script>

<style scoped>

</style>
