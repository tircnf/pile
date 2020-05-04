<template>
    <div>

        <v-card>
            <v-card-title>Character Search</v-card-title>
            <v-card-subtitle>Enter the first few letters of the Marvel Character. Press 'enter' to run the serach.
            </v-card-subtitle>
            <v-card-text>

                <div class="d-flex flex-no-wrap">
                    <v-avatar
                            class="mr-5 mt-1"
                            tile
                            xsize="125"

                    >
                        <v-img src="../assets/marvel-banner.jpg"
                        />
                    </v-avatar>
                    <v-text-field
                            :name="new Date().toString() + Math.random()"
                            :outlined="true"
                            @keyup.enter="search"
                            v-model="name"
                    />

                    <v-btn @click="search" class="primary mt-2 ml-2">
                        Search
                        <v-icon v-if="searching">mdi-loading mdi-spin</v-icon>
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>


        <div v-if="character">
            <v-card>
                <v-card-title>
                    <v-icon v-if="!character">mdi-waiting mdi-spinner</v-icon>
                    <span v-else>{{character.name}}</span>
                </v-card-title>

                <v-card-subtitle v-html="character.description"/>
                <!--suppress HtmlUnknownTarget -->
                <v-img
                        :src="`${character.thumbnail.path}.jpg`"
                        max-height="700px"
                        contain
                />

                <pre style="word-break: break-word">{{character}}</pre>

            </v-card>
        </div>
        <div v-else>

            <label v-if="characterTotal">showing 1 - {{Math.min(characterOffset,characterTotal)}} of {{characterTotal}}
                {{selectedCharacter}}</label>

            <v-row>
                <v-col cols="12">
                    <h3>Characters
                        <v-icon v-if="loading">mdi-loading mdi-spin</v-icon>
                    </h3>
                    <v-list shaped>
                        <v-list-item-group v-model="selectedCharacter">
                            <v-list-item :key="character.id" v-for="(character,index) in characterList">
                                <v-list-item-icon>
                                    <!--suppress HtmlUnknownTarget -->
                                    <!--                                <v-img-->
                                    <!--                                        :src="`${character.thumbnail.path}/standard_large.jpg`"-->
                                    <!--                                        :alt="`thumbnail image for {{character.name}}`"-->
                                    <!--                                />-->
                                    <v-img
                                            :alt="`thumbnail image for {{character.name}}`"
                                            :src="`${character.thumbnail.path}/landscape_large.jpg`"
                                            height="140"
                                            width="190"
                                            contain
                                    />
                                    <!--                                <v-img-->
                                    <!--                                        :src="`${character.thumbnail.path}/portrait_large.jpg`"-->
                                    <!--                                        :alt="`thumbnail image for {{character.name}}`"-->
                                    <!--                                />-->
                                </v-list-item-icon>

                                <v-list-item-content>
                                    <div>
                                        <h5>{{index+1}} {{character.name}}</h5>
                                        <ul class="mb-3">
                                            <li> Comics: {{character.comics.available}}</li>
                                            <li> Series: {{character.series.available}}</li>
                                            <li> Events: {{character.events.available}}</li>
                                        </ul>
                                        <p><span v-html="character.description"/></p>
                                    </div>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                    <v-btn @click="loadMoreCharacters"
                           class="primary"
                           v-if="characterOffset < characterTotal && characterOffset > 0"
                    >
                        Load More Characters
                        <v-icon v-if="loading">mdi-loading mdi-spin</v-icon>
                    </v-btn>
                    <label v-if="characterOffset >= characterTotal && characterTotal">Search Complete.</label>
                </v-col>
            </v-row>
        </div>
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
            character: null,
            name: "",
            searchString: "",
            characterOffset: 0,
            characterLimit: 70,
            characterList: [],
            characterTotal: null,
            searching: false,
            loading: false,
            selectedCharacter: null
        }),
        methods: {
            loadMoreCharacters() {
                this.loading = true;
                return api.searchCharacters(this.searchString, this.characterOffset, this.characterLimit)
                    .then(json => {
                        this.characterList.push(...json.data.results);
                        this.characterOffset += this.characterLimit;
                        this.characterLimit = Math.min(100, this.characterLimit + 20); // grab 20 extra next time.
                        this.loading = false;
                        return json;
                    })

            },
            search() {
                if (this.searching) {
                    return;
                }
                if (!this.name) {
                    return;
                }

                // if we have a selected character, remove it.
                if (this.characterId) {
                    this.$router.push({name: "character"});
                }

                this.searchString = this.name;
                this.searching = true;

                this.characterList = [];
                this.characterTotal = null;

                this.characterOffset = 0;
                this.characterLimit = 70;
                this.loadMoreCharacters()
                    .then(json => {
                        this.searching = false;
                        this.characterTotal = json.data.total;
                    })
            }
        },
        watch: {
            characterId: {
                immediate: true,
                handler: function (newValue) {
                    this.character = null;
                    if (newValue) {

                        api.fetchCharacter(newValue)
                            .then(json => {
                                this.character = json;
                            })
                    }
                }
            },
            selectedCharacter: {
                handler: function (newValue) {
                    if (newValue !== undefined) {
                        this.$router.push({
                            name: "character",
                            params: {characterId: this.characterList[newValue].id.toString()}
                        })
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
