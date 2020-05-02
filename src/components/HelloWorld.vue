<template>
    <div class="helloworld">
        <v-row class="text-center">
            <v-col cols="12">
                <v-img
                        alt="marvel-banner"
                        contain
                        height="409"
                        src="../assets/marvel-banner.jpg"

                />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <h2>{{ msg }}</h2>
            </v-col>

            <v-col cols="">
                <v-text-field
                        :name="new Date().toString() + Math.random()"
                        :outlined="true"
                        @keyup.enter="search"
                        label="Enter the name for a 'starts with' match"
                        v-model="name"
                />
            </v-col>
            <v-col cols="2">
                <v-btn :disabled="!this.name"
                       @click="search"
                       class="primary"
                >Search
                </v-btn>
            </v-col>


        </v-row>
        <Breakpoints/>
        <v-row>
            <v-col cols="12" md="6">
                <h3>Characters
                    <v-icon v-if="characterResults.loading">mdi-loading mdi-spin</v-icon>
                </h3>
                <h5>{{characterSearchMessage}}</h5>
                <v-list shaped>
                    <v-list-item v-if="characterResults.attributionHTML">
                        <ul>
                            <li v-if="characterResults.data.count">Showing characterResults
                                {{characterResults.data.offset+1}} to {{characterResults.data.offset +
                                characterResults.data.count}}
                                of
                                {{characterResults.data.total}}
                            </li>
                            <li v-else>No Results found</li>
                        </ul>
                    </v-list-item>
                    <v-list-item-group v-model="selectedCharacter">
                        <v-list-item :key="character.id" v-for="(character,index) in characterResults.data.results">
                            <v-list-item-icon>
                                <!--suppress HtmlUnknownTarget -->
                                <v-img
                                        :src="`${character.thumbnail.path}/${thumbnailSize.name}.jpg`"
                                        :height="thumbnailSize.height"
                                        :width="thumbnailSize.width"
                                        alt="thumbnail image"
                                />
                                <!--                                <v-tooltip close-delay="100"-->
                                <!--                                           open-delay="350"-->
                                <!--                                           right-->
                                <!--                                >-->
                                <!--                                    <template v-slot:activator="{ on }">-->
                                <!--                                        &lt;!&ndash;suppress HtmlUnknownTarget &ndash;&gt;-->
                                <!--                                        <v-img-->
                                <!--                                                :height="thumbnailSize.height"-->
                                <!--                                                :src="`${character.thumbnail.path}/${thumbnailSize.name}.jpg`"-->
                                <!--                                                :width="thumbnailSize.width"-->
                                <!--                                                alt="thumbnail image"-->
                                <!--                                                v-on="on"-->
                                <!--                                        />-->
                                <!--                                    </template>-->
                                <!--                                    &lt;!&ndash;suppress HtmlUnknownTarget &ndash;&gt;-->
                                <!--                                    <v-img-->
                                <!--                                            :src="`${character.thumbnail.path}.jpg`"-->
                                <!--                                            alt="thumbnail image"-->
                                <!--                                            max-height="750"/>-->
                                <!--                                </v-tooltip>-->
                            </v-list-item-icon>

                            <v-list-item-content>
                                <div>
                                    <h5>{{index+1}} {{character.name}}</h5>
                                    <ul class="mb-3">
                                        <li> Comics: {{character.comics.available}}</li>
                                        <li> Series: {{character.series.available}}</li>
                                    </ul>
                                    <p><span v-html="character.description"/></p>
                                </div>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
                <v-btn @click="loadMoreCharacters">Load More Characters
                    <v-icon v-if="charactersLoading">mdi-loading mdi-spin</v-icon>
                </v-btn>
            </v-col>

            <v-col cols="12" md="6">
                <h3>Series
                    <v-icon v-if="seriesResults.loading">mdi-loading mdi-spin</v-icon>
                </h3>
                <h5>{{seriesSearchMessage}}</h5>
                <v-list shaped>
                    <v-list-item v-if="seriesResults.attributionHTML">
                        <ul>
                            <li v-if="seriesResults.data.count">Showing seriesResults
                                {{seriesResults.data.offset+1}} to {{seriesResults.data.offset +
                                seriesResults.data.count}}
                                of
                                {{seriesResults.data.total}}
                            </li>
                            <li v-else>No Results found</li>
                        </ul>
                    </v-list-item>
                    <v-list-item-group v-model="selectedSeries">
                        <v-list-item :key="series.id" v-for="(series,index) in seriesResults.data.results">
                            <v-list-item-icon>
                                <!--suppress HtmlUnknownTarget -->
                                <v-img
                                        :src="`${series.thumbnail.path}/${thumbnailSize.name}.jpg`"
                                        :height="thumbnailSize.height"
                                        :width="thumbnailSize.width"
                                        alt="thumbnail image"

                                />
                            </v-list-item-icon>

                            <v-list-item-content>
                                <div>

                                    <!--                        {{series.id}} - -->
                                    <h5>{{index+1}} {{series.title}}</h5>
                                    <ul class="mb-3">
                                        <li> Comics: {{series.comics.available}}</li>
                                        <li> Characters: {{series.characters.available}}</li>
                                    </ul>
                                    <p><span v-html="series.description"/></p>
                                    <!--                <pre>{{series}}</pre>-->
                                </div>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
                <v-btn @click="loadMoreSeries">Load More Series
                    <v-icon v-if="seriesLoading">mdi-loading mdi-spin</v-icon>
                </v-btn>
            </v-col>

        </v-row>
    </div>
</template>

<script>

    import api from "../lib/api";
    import Breakpoints from "./Breakpoints";

    export default {
        name: 'HelloWorld',
        components: {Breakpoints},
        props: {
            msg: String
        },
        data: () => ({
            apiKey: "b51a816f55c2b752fe029e625cd2d81b",
            endpoint: "https://gateway.marvel.com",
            name: "",
            selectedCharacter: null,
            selectedSeries: null,
            characterOffset: 0,
            characterLimit: 20,
            charactersLoading: false,

            seriesOffset: 0,
            seriesLimit: 20,
            seriesLoading: false,

            thumbnailSize: {
                // name: "portrait_small",
                // width: 50,
                // height: 75,

                name: "portrait_medium",
                width: 100,
                height: 150,

                //name: "portrait_xlarge",
                //width: "150",
                //height: "225",

                // name: "portrait_incredible",
                // width: 216,
                // height: 324

            },
            characterSearchMessage: "",
            characterResults: {
                data: {
                    results: []
                }
            },
            seriesSearchMessage: "",
            seriesResults: {
                data: {
                    results: []
                }
            },
        }),
        methods: {
            searchCharacters() {
                return api.searchCharacters(this.name, this.characterOffset, this.characterLimit)
                    .then(json=> {
                        this.characterOffset+=this.characterLimit;
                        this.characterLimit=Math.min(100, this.characterLimit+20); // grab 20 extra next time.
                        return json;
                    });
            },
            searchSeries() {
                return api.searchSeries(this.name, this.seriesOffset, this.seriesLimit)
                .then(json=> {
                    this.seriesOffset+=this.seriesLimit;
                    this.seriesLimit=Math.min(100, this.seriesLimit+=20);
                    return json;
                })
            },

            search() {
                if (!this.name) {
                    return;
                }

                this.characterResults = {
                    loading: true,
                    data: {
                        results: []
                    }
                };

                this.seriesSearchMessage = "";
                this.seriesResults = {
                    loading: true,
                    data: {
                        results: []
                    }
                };

                this.characterOffset=0;
                this.characterLimit=20;

                this.seriesOffset=0;
                this.seriesLimit=20;


                this.searchCharacters(this.name).then(json => {
                    console.log("response = ", json);
                    if (json.code === 409) {
                        this.seriesResults.loading = false;
                        this.seriesSearchMessage = json.status;
                        return;
                    }
                    //console.log("Search Characters returned ", json);
                    this.characterResults = json;
                });

                this.searchSeries(this.name).then(json => {
                    if (json.code === 409) {
                        this.characterResults.loading = false;
                        this.characterSearchMessage = json.status;
                        return;
                    }
                    //console.log("Search Comics returned ", json);
                    this.seriesResults = json;
                });

            },
            loadMoreCharacters() {
                if (this.charactersLoading || ! this.name) {
                    return;
                }
                this.charactersLoading=true;
                this.searchCharacters()
                    .then(json=> {
                        this.charactersLoading=false;
                        this.characterResults.data.results.push(...(json.data.results))
                    });
            },
            loadMoreSeries() {
                if (this.seriesLoading || ! this.name) {
                    return
                }
                this.seriesLoading=true;
                this.searchSeries()
                    .then(json=> {
                        this.seriesLoading=false;
                        this.seriesResults.data.results.push(...(json.data.results))
                    })
            }
        },
        watch: {
            selectedCharacter(newValue) {
                if (newValue!==undefined && newValue !== null) {
                    const character = this.characterResults.data.results[newValue];
                    this.$router.push({name: 'character', params: {characterId: character.id.toString()}});
                }
            },
            selectedSeries(newValue) {
                const series = this.seriesResults.data.results[newValue];
                this.$router.push({name: 'series', params: {seriesId: series.id.toString()}});
            }
        },
    }
</script>

<style scoped="true">
    ul {
        list-style: none
    }

</style>
