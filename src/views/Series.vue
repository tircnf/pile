<template>
    <div>

        <v-row>
            <v-col cols="3">
                <div v-if="previous">
                    <v-btn
                            @click='$router.push({name: "series", params: {seriesId: previous.id.toString()}})'
                            class="primary">
                        {{previous.title}}
                    </v-btn>
                    <!--suppress HtmlUnknownTarget -->
                    <v-img :src="`${previous.thumbnail.path}/portrait_medium.jpg`"
                           :width="100"
                           alt="thumbnail image"
                           class="mt-3 align-center"
                    />
                </div>
            </v-col>

            <v-col cols="6">
                <h2>Title:
                    <v-icon v-if="!series">mdi-waiting mdi-spinner</v-icon>
                    <span v-else>{{series.title}}</span>
                </h2>
                <div v-if="series">
                    <ul>
                        <li> Active Years : {{series.startYear}} - {{series.endYear}}</li>
                        <li> Comics: {{series.comics.available}}</li>
                        <li> Characters: {{series.characters.available}}</li>
                        <li> Events: {{series.events.available}}</li>
                    </ul>
                    <!--suppress HtmlUnknownTarget -->
                    <v-img :src="`${series.thumbnail.path}/portrait_uncanny.jpg`"
                           :width="300"
                           alt="thumbnail image"
                           class="mt-3 align-center"
                    />
                </div>
            </v-col>


            <v-col cols="3">
                <div v-if="next">
                    <v-btn
                            @click='$router.push({name: "series", params: {seriesId: next.id.toString()}})'
                            class="primary">
                        {{next.title}}
                    </v-btn>
                    <!--suppress HtmlUnknownTarget -->
                    <v-img :src="`${next.thumbnail.path}/portrait_medium.jpg`"
                           :width="100"
                           alt="thumbnail image"
                           class="mt-3 align-center"
                    />
                </div>
            </v-col>
        </v-row>

        <div v-if="series">
            <p>{{series.description}}</p>

            <v-row v-if="comicList.data">
                <v-col :key="comic.id" cols="4" lg="2" md="3" v-for="comic in comicList.data.results">
                    {{comic.title}}
                    <!--suppress HtmlUnknownTarget -->
                    <!--                                :height="thumbnailSize.height"-->
                    <!--                                :width="thumbnailSize.width"-->
                    <v-img
                            :src="`${comic.thumbnail.path}/${thumbnailSize.name}.jpg`"
                            alt="thumbnail image"
                    />
                    <!--                        <pre style="word-break: break-word">{{comic}}</pre>-->

                </v-col>
            </v-row>

            <v-btn @click="fetchMoreComics()">Fetch More Comics
                <v-icon v-if="comicsLoading">mdi-loading mdi-spin</v-icon>
            </v-btn>
        </div>

        <!--            This is my comicList.-->
        <!--            <pre>{{comicList}}</pre>-->
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
            series: null,
            previous: null,
            next: null,
            comicOffset: 0,
            comicLimit: 12,
            comicList: null,
            comicsLoading: false,
            thumbnailSize: {
                name: "portrait_uncanny",
                width: 100,
                height: 150,
            },
        }),
        methods: {
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
                        this.comicLimit=Math.min(60, this.comicLimit+24); // cap it at 60 comics at a time.
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
                    this.series = null;
                    this.previous = null;
                    this.next = null;

                    this.comicList = {};
                    this.comicOffset = 0;
                    this.comicLimit=12;

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
        }
    }
</script>

<style scoped>

</style>
