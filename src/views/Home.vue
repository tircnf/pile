<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/marvel-banner.jpg">
    <HelloWorld msg="Search for a Marvel Comic Something.  (Character, book, etc)"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '../components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>
