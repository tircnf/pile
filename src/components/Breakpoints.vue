<template>
    <span>
        <!-- displays a label with the current size -->
        <span class="hidden-lg-and-down">xlarge &gt; 1904</span>
        <span class="hidden-md-and-down hidden-xl-only">large 1264 - 1903</span>
        <span class="hidden-sm-and-down hidden-lg-and-up">medium 960 - 1263</span>
        <span class="hidden-xs-only hidden-md-and-up">small 600 - 959</span>
        <span class="hidden-sm-and-up">xsmall &lt; 600</span>
        <span v-resize="onResize">:{{windowSize.x}}/{{windowSize.y}}</span>
    </span>
</template>
<script>
    export default {
        name: 'Breakpoints',
        data: () => ({
            windowSize: {
                x: 0,
                y: 0,
            },
        }),
        mounted () {
            this.onResize()
        },
        methods: {
            onResize () {
                this.windowSize = { x: window.innerWidth, y: window.innerHeight }
            },
        },
    }
</script>
