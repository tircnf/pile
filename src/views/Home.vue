<template>
    <div class="home">
<!--            <v-img src="../assets/marvel-banner.jpg"/>-->
        <v-card
                xmax-width="400"
                class="mx-auto"
        >

            <v-container>
                <v-row dense>

                    <v-col
                            cols="12"
                    >
                        <v-card
                                color="blue"
                                dark
                                to="search"
                        >
                            <div class="d-flex flex-no-wrap">
                                <v-avatar
                                        class="ma-3 "
                                        size="125"
                                        xtile

                                >
                                    <v-img src="../assets/marvel-banner.jpg"
                                    />
                                </v-avatar>

                                <div>
                                    <v-card-title
                                            class="headline"
                                    >
                                        Marvel Browser
                                    </v-card-title>

                                    <v-card-subtitle>
                                        This site is not affiliated with Marvel Comics in any way.
                                    </v-card-subtitle>

                                    <v-card-text>
                                        But it does take advantage of
                                        their fun to use API.
                                            <span class="mr-2">Data provided by Marvel. &copy; 2020 MARVEL</span>
                                    </v-card-text>
                                </div>


                            </div>
                        </v-card>
                    </v-col>


                    <v-col cols="12" sm="6">
                        <v-card
                                color="#385F73"
                                dark
                                to="character"
                        >
                            <v-card-title class="headline">Find your favorite Character</v-card-title>

                            <v-card-subtitle>Search for your favorite character among the hundreds of the Marvel Super Heroes and Super Villans.</v-card-subtitle>

                            <v-card-actions>
                                <v-btn to="search" text>Search for a Character</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>

                    <v-col cols="12" sm="6">
                        <v-card
                                color="#385F73"
                                dark
                                to="series"
                        >
                            <v-card-title class="headline">Find your favorite Series</v-card-title>

                            <v-card-subtitle>There are a lot of great comic series out there starting from way back in the 1950's.  Check out 'Journey Into Mystery'</v-card-subtitle>

                            <v-card-actions>
                                <v-btn to="search" text>Search for a Series</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>

                </v-row>
            </v-container>
        </v-card>

        <GenericSearch/>
    </div>
</template>

<script>
    // @ is an alias to /src

    import GenericSearch from "../components/GenericSearch";
    export default {
        name: 'Home',
        components: {GenericSearch}
    }
</script>
