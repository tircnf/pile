<template>
    <div>

        <v-card>
            <v-card-title>Series Search</v-card-title>
            <v-card-subtitle>Enter the first few letters of the Marvel Series. Press 'enter' to search.
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
                            v-model="q"
                    />

                    <v-btn @click="search" class="primary mt-2 ml-2">
                        Search
                        <v-icon v-if="searching">mdi-loading mdi-spin</v-icon>
                    </v-btn>
                </div>

                <v-list shaped>
<!--                    <v-list-item v-if="seriesList.attributionHTML">-->
<!--                        <ul>-->
<!--                            <li v-if="seriesList.data.count">Showing Series-->
<!--                                {{seriesList.data.offset+1}} to {{seriesList.data.offset +-->
<!--                                seriesList.data.count}}-->
<!--                                of-->
<!--                                {{seriesList.data.total}}-->
<!--                            </li>-->
<!--                            <li v-else>No Results found</li>-->
<!--                        </ul>-->
<!--                    </v-list-item>-->
                    <v-list-item-group v-model="selectedSeries">
                        <v-list-item :key="series.id" v-for="(series,index) in seriesList">
                            <v-list-item-icon>
                                <!--suppress HtmlUnknownTarget -->
                                <v-img
                                        :height="thumbnailSize.height"
                                        :src="`${series.thumbnail.path}/${thumbnailSize.name}.jpg`"
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
                                        <li> Events: {{series.events.available}}</li>
                                        <li> Stories: {{series.stories.available}}</li>
                                    </ul>
                                    <p><span v-html="series.description"/></p>
                                    <!--                <pre>{{series}}</pre>-->
                                </div>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-card-text>
        </v-card>

        <v-row>
            <v-col cols="0" sm="1"/> <!-- offset one column -->
            <v-col cols="3">
                <a
                        @click='$router.push({name: "series", params: {seriesId: previous.id.toString()}})'
                        class="hidden-sm-and-up"
                        v-if="previous"
                >{{previous.title}}</a>
                <!--
                there is a weird issue with hover.
                Search for Thor, choose 1966-1996.
                hover over and click the previous value.
                previous value now disappers because Journey into mystery doesn't have a previous.
                Now click "Next" and go back to the 1966 one.
                The "Previous" card loads with hover=true (and dark theme).
                It is cached somehow, and never notices the mouse leaving.
                -->
                <v-hover
                        open-delay="50"
                        v-slot:default="{ hover }"
                >
                    <div>
                        <v-card :dark="hover"
                                :elevation="hover ? 20 : 2"
                                @click='$router.push({name: "series", params: {seriesId: previous.id.toString()}})'
                                class="hidden-xs-only"
                                v-if="previous"
                        >

                            <v-card-title>
                                Previous {{hover}}
                            </v-card-title>
                            <v-card-subtitle>
                                {{previous.title}}
                            </v-card-subtitle>
                            <!--suppress HtmlUnknownTarget -->
                            <v-img :src="`${previous.thumbnail.path}/standard_xlarge.jpg`"
                                   alt="thumbnail image"
                                   class="mt-3 v-chip--clickable"
                            />
                        </v-card>
                    </div>
                </v-hover>
            </v-col>

            <v-col cols="6" sm="4" v-if="series">
                <v-card>
                    <v-card-title>
                        <v-icon v-if="!series">mdi-waiting mdi-spinner</v-icon>
                        <span v-else>{{series.title}}</span>
                    </v-card-title>

                    <v-card-subtitle>
                        {{series.description}}
                    </v-card-subtitle>

                    <div v-if="series">
                        <ul>
                            <li> Active Years : {{series.startYear}} - {{series.endYear}}</li>
                            <li> Comics: {{series.comics.available}}</li>
                            <li> Characters: {{series.characters.available}}</li>
                            <li> Events: {{series.events.available}}</li>
                            <li> Stories: {{series.stories.available}}</li>
                        </ul>
                        <!--suppress HtmlUnknownTarget -->
                        <v-img :src="`${series.thumbnail.path}/portrait_uncanny.jpg`"
                               alt="thumbnail image"
                               class="mt-3"
                        />
                    </div>
                </v-card>
            </v-col>


            <v-col cols="3">
                <a
                        @click='$router.push({name: "series", params: {seriesId: next.id.toString()}})'
                        class="hidden-sm-and-up"
                        v-if="next"
                >{{next.title}}</a>
                <v-hover
                        open-delay="50"
                        v-slot:default="{ hover }"
                >
                    <div>
                        <v-card
                                :dark="hover"
                                :elevation="hover ? 20 : 2"
                                @click='$router.push({name: "series", params: {seriesId: next.id.toString()}})'
                                class="hidden-xs-only"
                                v-if="next"
                        >

                            <v-card-title>
                                Next {{hover}}
                            </v-card-title>
                            <v-card-subtitle>
                                {{next.title}}
                            </v-card-subtitle>
                            <!--suppress HtmlUnknownTarget -->
                            <v-img :src="`${next.thumbnail.path}/standard_xlarge.jpg`"
                                   alt="thumbnail image"
                                   class="mt-3 v-chip--clickable"
                            />
                        </v-card>
                    </div>
                </v-hover>
            </v-col>
        </v-row>

        <div v-if="series">
            <v-row v-if="comicList.data">
                <v-col :key="comic.id" cols="6" lg="2" md="3" sm="4" v-for="comic in comicList.data.results">
                    <v-hover
                            open-delay="50"
                            v-slot:default="{ hover }"
                    >
                        <v-card
                                :elevation="hover ? 20 : 2"
                                @click='$router.push(`/comics/${comic.id}`)'
                        >
                            <v-card-title>{{comic.title}}</v-card-title>
                            <!--suppress HtmlUnknownTarget -->
                            <!--                                :height="thumbnailSize.height"-->
                            <!--                                :width="thumbnailSize.width"-->
                            <v-img
                                    :src="`${comic.thumbnail.path}/${thumbnailSize.name}.jpg`"
                                    alt="thumbnail image"
                            />
                            <!--                        <pre style="word-break: break-word">{{comic}}</pre>-->
                        </v-card>
                    </v-hover>
                </v-col>
            </v-row>

            <v-btn @click="fetchMoreComics()">Fetch More Comics
                <v-icon v-if="comicsLoading">mdi-loading mdi-spin</v-icon>
            </v-btn>
        </div>

        <!--            This is my comicListPromise.-->
        <!--            <pre>{{comicListPromise}}</pre>-->
        <!---->
        <!--            <pre>{{series}}</pre>-->

    </div>
</template>

<script>
    import api from "../lib/api";

    export default {
        name: "Series",
        props: {
            seriesId: String,
        },
        data: () => ({
            q: "",
            searchString: "",
            selectedSeries: null,
            series: null,
            previous: null,
            next: null,
            comicOffset: 0,
            comicLimit: 12,
            comicList: null,
            comicsLoading: false,
            searching: false,
            thumbnailSize: {
                name: "portrait_uncanny",
                width: 100,
                height: 150,
            },
            seriesList: []
        }),
        methods: {
            search() {
                if (this.searching) {
                    return;
                }
                if (!this.q) {
                    return;
                }

                if (this.seriesId) {
                    this.$router.push({name: "series"})
                }

                this.searchString = this.q;
                this.searching = true;

                this.seriesList = [];
                this.seriesOffset = 0;
                this.seriesLimit = 20;

                this.loadMoreSeries()
                    .then(json => {
                        this.searching = false;
                        this.seriesTotal = json.data.total;
                    })
            },
            showSeries() {
                if (this.seriesId) {
                    //this.seriesList = api.
                }
            },
            loadMoreSeries() {
                this.loading = true;
                return api.searchSeries(this.q, this.seriesOffset, this.seriesLimit)
                    .then(json => {
                        this.seriesList.push(...json.data.results);
                        this.seriesOffset += this.seriesLimit;
                        this.seriesLimit = Math.min(100, this.seriesLimit + 20)
                        this.loading = false;
                        return json;
                    })
            },
            fetchSeries(id) {
                return api.fetchSeries(id)
            },
            fetchMoreComics() {
                if (this.comicsLoading) {
                    return;
                }
                // load some comics from the series.
                this.comicsLoading = true;

                api.fetchComicsForSeries(this.series.id, this.comicOffset, this.comicLimit)
                    .then(json => {
                        this.comicsLoading = false;
                        if (!this.comicList.code) {
                            this.comicList = json;
                        } else {
                            this.comicList.data.results.push(...(json.data.results))
                        }
                        this.comicOffset = this.comicOffset + this.comicLimit;
                        this.comicLimit = Math.min(60, this.comicLimit + 24); // cap it at 60 comics at a time.
                    })
            },
            getId(url) {
                // expects the url to end with an id and to be full of slashes.
                // like http://gateway.marvel.com/v1/public/series/2032
                return url.split("/").pop();
            }
        },
        watch: {
            seriesId: {
                immediate: true,
                handler: function (newValue) {
                    console.log("New series selected:  ", newValue);
                    this.series = null;
                    this.seriesOffset = 0;
                    if (newValue) {

                        this.series = null;
                        this.previous = null;
                        this.next = null;

                        this.comicList = {};
                        this.comicOffset = 0;
                        this.comicLimit = 12;
                        this.seriesList=[];  // build a seriesList like the comics List, and
                        // this would be the promise.

                        this.fetchSeries(newValue).then(json => {
                            this.series = json;
                            this.fetchMoreComics();

                            if (this.series.previous) {
                                this.fetchSeries(this.getId(this.series.previous.resourceURI)).then(json => this.previous = json);
                            }

                            if (this.series.next) {
                                this.fetchSeries(this.getId(this.series.next.resourceURI)).then(json => this.next = json);
                            }
                        })
                    }
                }
            },
            selectedSeries: {
                handler: function(newValue) {
                    if (newValue!== undefined) {
                        this.$router.push({
                            name: "series",
                            params: {seriesId: this.seriesList[newValue].id.toString()}
                        })
                    } else {
                        this.$router.push({
                            name: "series",
                            params: {}
                        })
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
