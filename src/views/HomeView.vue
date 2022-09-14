<template>
  <div class="home container mx-auto sm:px-4">
    <ToDoList></ToDoList>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ToDoList from '../components/ToDoList/ToDoList.vue'; // @ is an alias to /src

@Options({
  components: {
    ToDoList,
  },
})
export default class HomeView extends Vue {}
</script>

<style lang="scss" scoped>
.home {
  width: 70%;
  margin: 0 auto;
  padding: 2rem 0;
}
</style>