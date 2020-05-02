<template>
    <div>

        <v-row>
            <v-col cols="1"/> <!-- offset one column -->
            <v-col cols="3">
                <v-hover
                        open-delay="50"
                        v-slot:default="{ hover }"
                >
                    <v-card
                            :elevation="hover ? 20 : 2"
                            @click='$router.push({name: "series", params: {seriesId: previous.id.toString()}})'
                            v-if="previous"
                            :dark="hover"
                    >

                        <v-card-title>
                            Previous Series
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
                </v-hover>
            </v-col>

            <v-col cols="4">
                <v-card>
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
                               alt="thumbnail image"
                               class="mt-3"
                        />
                    </div>
                </v-card>
            </v-col>


            <v-col cols="3">
                <v-hover
                        open-delay="50"
                        v-slot:default="{ hover }"
                >
                    <v-card
                            :elevation="hover ? 20 : 2"
                            @click='$router.push({name: "series", params: {seriesId: next.id.toString()}})'
                            v-if="next"
                            :dark="hover"
                    >

                        <v-card-title>
                            Next Series
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
                </v-hover>
            </v-col>
        </v-row>

        <div v-if="series">
            <v-row>
                <v-col cols="3"/>
                <v-col cols="6">
                    <p>{{series.description}}</p>
                </v-col>
            </v-row>

            <v-row v-if="comicList.data">
                <v-col :key="comic.id" cols="4" lg="2" md="3" v-for="comic in comicList.data.results">
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
                    this.series = null;
                    this.previous = null;
                    this.next = null;

                    this.comicList = {};
                    this.comicOffset = 0;
                    this.comicLimit = 12;

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
