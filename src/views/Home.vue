<template>
  <div class="container container-home">
    <link-list />
  </div>
</template>

<script>
// @ is an alias to /src
import LinkList from '@/components/LinkList.vue';

export default {
  name: 'home',
  components: {
    LinkList,
  },
};
</script>

<style lang="scss" scoped>

</style>
