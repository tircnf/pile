<template>
    <div>

        <v-card>
            <v-card-title>Character Search</v-card-title>
            <v-card-subtitle>Enter the first few letters of the Marvel Character. Press 'enter' to run the search.
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

        <div v-if="!character">

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
                                <v-list-item-content>
                                    <v-list-item-title>
                                        <h5>{{index+1}} {{character.name}}</h5>
                                    </v-list-item-title>
                                    <div>
                                        <div class="float-left mr-5 mb-1">
                                            <!--suppress HtmlUnknownTarget -->
                                            <v-img
                                                    :alt="`thumbnail image for {{character.name}}`"
                                                    :src="`${character.thumbnail.path}/landscape_large.jpg`"
                                                    contain
                                                    height="140"
                                                    width="190"
                                            />
                                        </div>

                                        <div class="ml-3">
                                            <ul class="comic-info mb-3">
                                                <li> Comics: {{character.comics.available}}</li>
                                                <li> Events: {{character.events.available}}</li>
                                                <li> Series: {{character.series.available}}</li>
                                                <li> Stories: {{character.stories.available}}</li>
                                            </ul>
                                            <p><span v-html="character.description"/></p>
                                        </div>
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

        <div v-else>
            <v-card>
                <v-card-title>
                    <v-icon v-if="loading">mdi-waiting mdi-spinner</v-icon>
                    <span v-else>{{character.name}} -- {{selectedTab}}</span>
                </v-card-title>
                <v-card-subtitle v-html="character.description"/>
                <v-card-text>
                    <v-row>
                        <v-col cols="6">
                            <div>
                                <!--suppress HtmlUnknownTarget -->
                                <v-img
                                        :src="`${character.thumbnail.path}.jpg`"
                                        contain
                                />
                            </div>
                        </v-col>
                        <v-col cols="12">
                            <div>
                                <v-tabs v-model="selectedTab" xvertical>
                                    <v-tab>
                                        <v-icon left>mdi-account</v-icon>
                                        Comics: {{character.comics.available}}
                                    </v-tab>
                                    <v-tab>
                                        <v-icon left>mdi-lock</v-icon>
                                        Events: {{character.events.available}}
                                    </v-tab>
                                    <v-tab>
                                        <v-icon left>mdi-access-point</v-icon>
                                        Series: {{character.series.available}}
                                    </v-tab>
                                    <v-tab>
                                        <v-icon left>mdi-access-point</v-icon>
                                        Stories: {{character.stories.available}}
                                    </v-tab>
                                    <v-tab>
                                        JSON response
                                    </v-tab>

                                    <v-tab-item>
                                        <v-card flat>
                                            <v-card-text>
                                                <ComicList :comic-list="comicListPromise" @more="loadMoreComics()"/>
                                            </v-card-text>
                                        </v-card>
                                    </v-tab-item>
                                    <v-tab-item>
                                        <v-card flat>
                                            <v-card-text>
                                                <ul>
                                                    <li :key="event.resourceURI"
                                                        v-for="event in character.events.items">{{event.name}}
                                                    </li>
                                                </ul>
                                            </v-card-text>
                                        </v-card>
                                    </v-tab-item>
                                    <v-tab-item>
                                        <v-card flat>
                                            <v-card-text>
                                                <p>
                                                    Fusce a quam. Phasellus nec sem in justo pellentesque facilisis. Nam
                                                    eget dui. Proin viverra, ligula sit amet ultrices semper, ligula
                                                    arcu tristique sapien, a accumsan nisi mauris ac eros. In dui magna,
                                                    posuere eget, vestibulum et, tempor auctor, justo.
                                                </p>

                                                <p class="mb-0">
                                                    Cras sagittis. Phasellus nec sem in justo pellentesque facilisis.
                                                    Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Donec quam
                                                    felis, ultricies nec, pellentesque eu, pretium quis, sem. Nam at
                                                    tortor in tellus interdum sagittis.
                                                </p>
                                            </v-card-text>
                                        </v-card>
                                    </v-tab-item>
                                    <v-tab-item>
                                        <v-card flat>
                                            <v-card-text>
                                                Show me the stories.
                                            </v-card-text>
                                        </v-card>
                                    </v-tab-item>
                                    <v-tab-item>
                                        <v-card flat>
                                            <v-card-text>
                                                <pre style="white-space: pre-wrap">{{character}}</pre>
                                            </v-card-text>
                                        </v-card>
                                    </v-tab-item>
                                </v-tabs>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </div>
    </div>
</template>

<script>

    import api from "../lib/api";
    import ComicList from "../components/ComicList";

    export default {
        name: "Character.vue",
        components: {ComicList},
        props: {
            characterId: String
        },
        data: () => ({
            character: null,
            comicOffset: 0,
            comicLimit: 10,
            comicListPromise: null,
            name: "",
            searchString: "",
            characterOffset: 0,
            characterLimit: 70,
            characterList: [],
            characterTotal: null,
            searching: false,
            loading: false,
            selectedCharacter: null,
            selectedTab: 0,
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

                this.selectedCharacter = null;
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
            },
            showComics() {
                if (this.characterId) {
                    this.comicListPromise = api.fetchComicsForCharacter(this.characterId, this.comicOffset, 10)
                        .then(results => {
                            this.comicOffset += results.limit;
                            return results;
                        })
                }
            },
            loadMoreComics() {
                this.showComics();
            }
        },
        watch: {
            characterId: {
                immediate: true,
                handler: function (newValue) {
                    console.log("New character selected:  ", newValue);
                    this.character = null;
                    this.comicListPromise = null;
                    this.comicOffset=0;
                    if (newValue) {
                        api.fetchCharacter(newValue)
                            .then(json => {
                                this.character = json;
                                this.showComics();
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
            },
        }
    }
</script>

<style scoped>
 ul.comic-info {
     list-style: none
 }
</style>
