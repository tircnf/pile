<template>
    <div>
        <v-container>
            <h2>Hello
                <v-icon v-if="!series">mdi-waiting mdi-spinner</v-icon>
                <span v-else>{{series.title}}</span>
            </h2>

            <div v-if="series">
                <p>{{series.description}}</p>

                <v-row v-if="comicList.data">
                    <v-col :key="comic.id" cols="2" v-for="comic in comicList.data.results">
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

                <v-btn @click="fetchMoreComics()">Fetch More Comics  <v-icon v-if="comicsLoading">mdi-loading mdi-spin</v-icon></v-btn>
            </div>

<!--            This is my comicList.-->
<!--            <pre>{{comicList}}</pre>-->
<!---->
<!--            <pre>{{series}}</pre>-->

        </v-container>
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
            fetchSeries() {
                api.fetchSeries(this.seriesId)
                    .then(json => {
                        this.series = json;
                        this.fetchMoreComics()

                    })

            },
            fetchMoreComics() {
                if (this.comicsLoading) {
                    return;
                }
                // load some comics from the series.
                this.comicsLoading=true;

                api.fetchComicsForSeries(this.series.id, this.comicOffset, this.comicLimit)
                    .then(json => {
                        this.comicsLoading=false;
                        if (! this.comicList.code) {
                            this.comicList = json;
                        } else {
                            this.comicList.data.results.push(...(json.data.results))
                        }
                        this.comicOffset = this.comicOffset + this.comicLimit
                    })
            }
        },
        watch: {
            seriesId: {
                immediate: true,
                handler: function (newValue) {
                    this.series = null;
                    this.comicList = {};
                    this.comicOffset = 0;

                    this.fetchSeries(newValue);
                }
            }
        }
    }
</script>

<style scoped>

</style>
