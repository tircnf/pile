<template>
    <div>
        <v-row>
            <v-col cols="12">
                <v-icon v-if="loading">mdi-loading mdi-spin</v-icon>

                <div v-if="results && results.total">
                    <span v-if="results">Showing {{results.offset+1}} - {{results.limit + results.offset}} of {{results.total}}</span>
                    <v-btn @click="$emit('more')" class="ml-5" v-if="!loading">More</v-btn>

                    <v-list shaped v-if="results">
                        <v-list-item-group xv-model="selectedCharacter">
                            <v-list-item :key="comic.id" v-for="(comic) in results.results">
                                <v-list-item-icon>
                                    <!--suppress HtmlUnknownTarget -->
                                    <v-img
                                            :alt="`thumbnail image for {{comic.name}}`"
                                            :src="`${comic.thumbnail.path}/portrait_xlarge.jpg`"
                                            contain
                                            xheight="140"
                                            xwidth="190"
                                    />
                                </v-list-item-icon>

                                <v-list-item-content>
                                    <div>
                                        <h5>{{comic.series.name}} #{{comic.issueNumber}}/{{comic.format}}</h5>
                                        {{comic.title}}
                                        <p><span v-html="comic.description"/></p>
                                        <ul class="mb-3">
                                            <li> Characters: {{comic.characters.available}}</li>
                                            <li> Events: {{comic.events.available}}</li>
                                            <li> Stories: {{comic.stories.available}}</li>
                                            <li> {{comic.dates[0].date.substr(0,10)}}</li>
                                        </ul>
<!--                                        <pre>{{comic}}</pre>-->
                                    </div>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                <v-btn @click="$emit('more')" class="ml-5" v-if="!loading">More</v-btn>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    export default {
        name: "ComicList",
        props: {
            comicList: Promise
        },
        data: () => ({
            loading: false,
            thumbnailSize: {
                name: "portrait_uncanny",
                width: 100,
                height: 150,
            },
            results: {}
        }),
        watch: {
            comicList: {
                immediate: true,
                handler: function () {
                    if (this.comicList) {
                        this.results = null;
                        this.loading = true;
                        this.comicList.then(result => {
                            console.log("result for comicList = ", result);
                            this.results = result;
                            this.loading = false;
                        })
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
