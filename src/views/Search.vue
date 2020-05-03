<template>
    <div class="home">
        <GenericSearch msg="Search for a Marvel character or comic"/>
    </div>
</template>

<script>


    import GenericSearch from "../components/GenericSearch";
    export default {
        name: "Search",
        components: {GenericSearch}
    }
</script>

<style scoped>

</style>
