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
                <v-btn @click="search"
                       class="primary"
                >Search
                </v-btn>
            </v-col>


        </v-row>

        <v-row>

            <v-col cols="3">

                <h3>Characters</h3>
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
                        <!--suppress HtmlUnknownTarget -->
                        {{index+1}} &mdash;
                        {{character.id}} - {{character.name}}
                        <v-img :height="thumbnailSize.height"
                               :src="`${character.thumbnail.path}/${thumbnailSize.name}.jpg`"
                               :width="thumbnailSize.width"
                               alt="thumbnail image"/>
                        <p><span v-html="character.description"/></p>
                        <ul>
                            <li> Comics: {{character.comics.available}}</li>
                            <li> Series: {{character.series.available}}</li>
                            <li> Stories: {{character.stories.available}}</li>
                            <li> events: {{character.events.available}}</li>
                            <li :key="url.type" v-for="url in character.urls">
                                <a :href="url.url" target="_blank">{{url.type}}</a>
                            </li>
                        </ul>
                        <!--                <pre>{{character}}</pre>-->
                    </li>
                </ul>
            </v-col>

            <v-col cols="3">
                <h3>Series</h3>
                <ul>
                    <li v-if="comicResults.attributionHTML"><span v-html="comicResults.attributionHTML"/>
                        <ul>
                            <li v-if="comicResults.data.count">Showing characterResults {{comicResults.data.offset+1}}
                                to {{comicResults.data.offset + comicResults.data.count}}
                                of
                                {{comicResults.data.total}}
                            </li>
                            <li v-else>No Results found</li>
                        </ul>
                    </li>
                    <li :key="comic.id" v-for="(comic,index) in comicResults.data.results">
                        <!--suppress HtmlUnknownTarget -->
                        {{index+1}} &mdash;
                        {{comic.id}} - {{comic.title}}

                        <v-tooltip right>
                            <template v-slot:activator="{ on }">
                                <!--suppress HtmlUnknownTarget -->
                                <v-img
                                       v-on="on"
                                       :src="`${comic.thumbnail.path}/${thumbnailSize.name}.jpg`"
                                       :width="thumbnailSize.width"
                                       :height="thumbnailSize.height"
                                       alt="thumbnail image"/>
                            </template>
                            <!--suppress HtmlUnknownTarget -->
                            <v-img
                                   :src="`${comic.thumbnail.path}.jpg`"
                                   max-height="750"
                                   alt="thumbnail image"/>


                        </v-tooltip>

                        <p><span v-html="comic.description"/></p>
                        <ul>
                            <li> Comics: {{comic.comics.available}}</li>
                            <li> Characters: {{comic.characters.available}}</li>
                            <li> Stories: {{comic.stories.available}}</li>
                            <li> events: {{comic.events.available}}</li>
                            <li :key="url.type" v-for="url in comic.urls">
                                <a :href="url.url" target="_blank">{{url.type}} </a>
                            </li>
                        </ul>
                        <!--                                        <pre>{{comic}}</pre>-->
                    </li>
                </ul>

            </v-col>

            <v-col cols="3">
                <h3>Events</h3>
            </v-col>

            <v-col cols="3">
                <h3>Stories</h3>
            </v-col>


            <v-col class="mb-4">
                <h3 class="display-2 font-weight-bold mb-3">
                    Welcome to Vuetify
                </h3>

                <p class="subheading font-weight-regular">
                    For help and collaboration with other Vuetify developers,
                    <br>please join our online
                    <a
                            href="https://community.vuetifyjs.com"
                            target="_blank"
                    >Discord Community</a>
                </p>
            </v-col>

            <v-col
                    class="mb-5"
                    cols="12"
            >
                <h2 class="headline font-weight-bold mb-3">
                    What's next?
                </h2>

                <v-row justify="center">
                    <a
                            :href="next.href"
                            :key="i"
                            class="subheading mx-3"
                            target="_blank"
                            v-for="(next, i) in whatsNext"
                    >
                        {{ next.text }}
                    </a>
                </v-row>
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
                this.characterResults = {
                    data: {
                        results: []
                    }
                };
                this.comicResults = {
                    data: {
                        results: []
                    }
                };

                if (!this.name) {
                    return;
                }
                this.searchCharacters(this.name).then(json => {
                    console.log("Search Characters returned ", json);
                    this.characterResults = json;
                });

                this.searchSeries(this.name).then(json => {
                    console.log("Search Comics returned ", json);
                    this.comicResults = json;
                });

                this.name = "";
            }
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
            characterResults: {
                data: {
                    results: []
                }
            },
            comicResults: {
                data: {
                    results: []
                }
            },
            whatsNext: [
                {
                    text: 'Explore components',
                    href: 'https://vuetifyjs.com/components/api-explorer',
                },
                {
                    text: 'Select a layout',
                    href: 'https://vuetifyjs.com/layout/pre-defined',
                },
                {
                    text: 'Frequently Asked Questions',
                    href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions',
                },
            ],
        }),
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
