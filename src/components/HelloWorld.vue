<template>
    <div class="hello">
        <h1>{{ msg }}</h1>

        <label>Enter the name for a 'starts with' match
            <input @keyup.enter="search" v-model="name">
        </label>
        <button @click="search">Search</button>


        <div class="searchResults">


            <ul>
                <li v-if="result.attributionHTML"><span v-html="result.attributionHTML"/>
                    <ul>
                        <li>Showing results {{result.data.offset}} to {{result.data.offset + result.data.count}} of
                            {{result.data.total}}
                        </li>
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

        </div>
        <!--        <pre>{{result}}</pre>-->


    </div>
</template>

<script>
    export default {
        name: 'HelloWorld',
        props: {
            msg: String
        },
        data() {
            return {
                one: "two",
                apiKey: "b51a816f55c2b752fe029e625cd2d81b",
                endpoint: "https://gateway.marvel.com",
                name: "Spider",
                result: {
                    data: {
                        results: []
                    }
                }
            }
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
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .hello .searchResults {
        text-align: left;
    }

    h3 {
        margin: 40px 0 0;
    }


    a {
        color: #42b983;
    }
</style>
