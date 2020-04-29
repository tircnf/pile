<template>
    <v-container class="helloworld">
        <v-row class="text-center">
            <v-col cols="12">
                <v-img
                        alt="Vue logo"
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

            <v-col cols="6">
                <v-text-field
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

        <v-row>

            <v-col cols="6">

                <h3>Characters
                    <v-icon v-if="characterResults.loading">mdi-loading mdi-spin</v-icon>
                </h3>
                <h5>{{characterSearchMessage}}</h5>
                <ul>
                    <li v-if="characterResults.attributionHTML"><span v-html="characterResults.attributionHTML"/>
                        <ul>
                            <li v-if="characterResults.data.count">Showing characterResults
                                {{characterResults.data.offset+1}} to {{characterResults.data.offset +
                                characterResults.data.count}}
                                of
                                {{characterResults.data.total}}
                            </li>
                            <li v-else>No Results found</li>
                        </ul>
                    </li>
                    <li :key="character.id" v-for="(character,index) in characterResults.data.results">
                        <v-tooltip open-delay="350"
                                   close-delay="100"
                                   right
                        >
                            <template v-slot:activator="{ on }">
                                <!--suppress HtmlUnknownTarget -->
                                <v-img
                                        :height="thumbnailSize.height"
                                        :src="`${character.thumbnail.path}/${thumbnailSize.name}.jpg`"
                                        :width="thumbnailSize.width"
                                        alt="thumbnail image"
                                        class="float-left mr-4"
                                        v-on="on"

                                />
                            </template>
                            <!--suppress HtmlUnknownTarget -->
                            <v-img
                                    :src="`${character.thumbnail.path}.jpg`"
                                    alt="thumbnail image"
                                    max-height="750"/>


                        </v-tooltip>

                        <div style="min-height: 175px;">

                            <!--                        {{character.id}} - -->
                            <h5>{{index+1}} {{character.name}}</h5>
                            <ul>
                                <li> Comics: {{character.comics.available}}</li>
                                <li> Series: {{character.series.available}}</li>
                            </ul>
                            <p><span v-html="character.description"/></p>
                            <!--                <pre>{{character}}</pre>-->
                        </div>
                    </li>
                </ul>
            </v-col>

            <v-col cols="6">
                <h3>Series
                    <v-icon v-if="seriesResults.loading">mdi-loading mdi-spin</v-icon>
                </h3>
                <h5>{{seriesSearchMessage}}</h5>
                <ul>
                    <li v-if="seriesResults.attributionHTML"><span v-html="seriesResults.attributionHTML"/>
                        <ul>
                            <li v-if="seriesResults.data.count">Showing seriesResults
                                {{seriesResults.data.offset+1}} to {{seriesResults.data.offset +
                                seriesResults.data.count}}
                                of
                                {{seriesResults.data.total}}
                            </li>
                            <li v-else>No Results found</li>
                        </ul>
                    </li>
                    <li :key="series.id" v-for="(series,index) in seriesResults.data.results">
                        <v-tooltip open-delay="350"
                                   close-delay="100"
                                   left
                        >
                            <template v-slot:activator="{ on }">
                                <!--suppress HtmlUnknownTarget -->
                                <v-img
                                        :height="thumbnailSize.height"
                                        :src="`${series.thumbnail.path}/${thumbnailSize.name}.jpg`"
                                        :width="thumbnailSize.width"
                                        alt="thumbnail image"
                                        class="float-left mr-4"
                                        v-on="on"

                                />
                            </template>
                            <!--suppress HtmlUnknownTarget -->
                            <v-img
                                    :src="`${series.thumbnail.path}.jpg`"
                                    alt="thumbnail image"
                                    max-height="750"/>


                        </v-tooltip>

                        <div style="min-height: 175px;">

                            <!--                        {{series.id}} - -->
                            <h5>{{index+1}} {{series.title}}</h5>
                            <ul>
                                <li> Comics: {{series.comics.available}}</li>
                                <li> Characters: {{series.characters.available}}</li>
                            </ul>
                            <p><span v-html="series.description"/></p>
                            <!--                <pre>{{series}}</pre>-->
                        </div>
                    </li>
                </ul>
            </v-col>

        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: 'HelloWorld',
        props: {
            msg: String
        },
        data: () => ({
            apiKey: "b51a816f55c2b752fe029e625cd2d81b",
            endpoint: "https://gateway.marvel.com",
            name: "Spider",
            thumbnailSize: {
                name: "portrait_medium",
                width: 100,
                height: 150,
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
            searchCharacters(searchStr) {
                const url = new URL(`${this.endpoint}/v1/public/characters`);
                const params = {
                    nameStartsWith: searchStr,
                    apikey: this.apiKey
                };
                //https://gateway.marvel.com/v1/public/characters?nameStartsWith=spider&apikey=b51a816f55c2b752fe029e625cd2d81b
                Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

                return fetch(url)
                    .then(response => response.json())
            },

            searchSeries(searchStr) {
                const url = new URL(`${this.endpoint}/v1/public/series`);
                const params = {
                    titleStartsWith: searchStr,
                    apikey: this.apiKey
                };
                //https://gateway.marvel.com/v1/public/characters?nameStartsWith=spider&apikey=b51a816f55c2b752fe029e625cd2d81b
                Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

                return fetch(url)
                    .then(response => response.json())
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

                this.name = "";
            }
        },
    }
</script>

<style scoped="true">
    .helloworld {
        word-break: break-word;
    }

    ul {
        list-style: none
    }
</style>
