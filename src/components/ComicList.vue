<template>
    <div>
        <v-row>
            <v-col cols="12">
                <v-icon v-if="loading">mdi-loading mdi-spin</v-icon>

                <span v-if="results">Showing {{results.offset+1}} - {{results.limit + results.offset}} of {{results.total}}</span>
                <v-btn v-if="!loading" class="ml-5" @click="$emit('more')">More</v-btn>

                <v-list v-if="results" shaped>
                    <v-list-item-group xv-model="selectedCharacter">
                        <v-list-item :key="comic.id" v-for="(comic,index) in results.results">
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
                                    <h5>{{index+1}} {{comic.title}}  #{{comic.issueNumber}}/{{comic.format}}</h5>
                                    <p><span v-html="comic.description"/></p>
                                    <ul class="mb-3">
                                        <li> Characters: {{comic.characters.available}}</li>
                                        <li> Events: {{comic.events.available}}</li>
                                        <li> Series: {{comic.series.available}}</li>
                                        <li> Stories: {{comic.stories.available}}</li>
                                        <li> On Sale Date: {{comic.dates[0].date.substr(0,10)}}</li>
                                    </ul>
<!--                                    <pre>{{comic}}</pre>-->
                                </div>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-col>
            <v-btn v-if="!loading" class="ml-5" @click="$emit('more')">More</v-btn>
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
                            console.log("result for comicList = ",result);
                            this.results = result;
                            // setTimeout(()=>{this.loading=false},1000);
                            this.loading=false;
                        })
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
