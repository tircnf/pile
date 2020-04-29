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
                <v-btn class="primary"
                       @click="search"
                >Search</v-btn>
            </v-col>


        </v-row>

        <v-row>

            <v-col cols="3">

                <h3>Characters</h3>
                <ul>
                    <li v-if="result.attributionHTML"><span v-html="result.attributionHTML"/>
                        <ul>
                            <li v-if="result.data.count">Showing results {{result.data.offset+1}} to {{result.data.offset + result.data.count}}
                                of
                                {{result.data.total}}
                            </li>
                            <li v-else>No Results found</li>
                        </ul>
                    </li>
                    <li :key="character.id" v-for="(character,index) in result.data.results">
                        <!--suppress HtmlUnknownTarget -->
                        {{index+1}} &mdash;
                        <img :src="`${character.thumbnail.path}/portrait_small.jpg`" alt="thumbnail image">
                        {{character.id}} - {{character.name}}
                        <p><span v-html="character.description"/></p>
                        <ul>
                            <li> Comics: {{character.comics.available}}</li>
                            <li> Series: {{character.series.available}}</li>
                            <li> Stories: {{character.stories.available}}</li>
                            <li> events: {{character.events.available}}</li>
                            <li :key="url.type" v-for="url in character.urls">
                                {{url.type}} <a :href="url.url" target="_blank">{{url.url}}</a>
                            </li>
                        </ul>
                        <!--                <pre>{{character}}</pre>-->
                    </li>
                </ul>
            </v-col>

            <v-col cols="3">
                <h3>Comics</h3>
                <ul>
                    <li v-if="result.attributionHTML"><span v-html="result.attributionHTML"/>
                        <ul>
                            <li v-if="result.data.count">Showing results {{result.data.offset+1}} to {{result.data.offset + result.data.count}}
                                of
                                {{result.data.total}}
                            </li>
                            <li v-else>No Results found</li>
                        </ul>
                    </li>
                    <li :key="character.id" v-for="character in result.data.results">
                        <!--suppress HtmlUnknownTarget -->
                        <img :src="`${character.thumbnail.path}/portrait_small.jpg`" alt="thumbnail image">
                        {{character.id}} - {{character.name}}
                        <p><span v-html="character.description"/></p>
                        <ul>
                            <li> Comics: {{character.comics.available}}</li>
                            <li> Series: {{character.series.available}}</li>
                            <li> Stories: {{character.stories.available}}</li>
                            <li> events: {{character.events.available}}</li>
                            <li :key="url.type" v-for="url in character.urls">
                                {{url.type}} <a :href="url.url" target="_blank">{{url.url}}</a>
                            </li>
                        </ul>
                        <!--                <pre>{{character}}</pre>-->
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
            search() {
                if (!this.name) {
                    return;
                }
                const url = new URL(`${this.endpoint}/v1/public/characters`);
                const params = {
                    nameStartsWith: this.name,
                    apikey: this.apiKey
                };

                //https://gateway.marvel.com/v1/public/characters?nameStartsWith=spider&apikey=b51a816f55c2b752fe029e625cd2d81b
                Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

                fetch(url)
                    .then(response => response.json())
                    .then(json => this.result = json);

                this.name = "";
            }
        },
        data: () => ({
            apiKey: "b51a816f55c2b752fe029e625cd2d81b",
            endpoint: "https://gateway.marvel.com",
            name: "Spider",
            result: {
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
