<template>
  <div class="container">
    <div class="uk-margin">
      <input class="uk-input" v-model="searchText" type="text" placeholder="Search...">
    </div>
    <div class="list-link">
      <h4 v-if="loading"><div uk-spinner></div></h4>
      <div class="uk-alert-danger" uk-alert v-else-if="allLinks.length < 1">
        <p>Data is empty !</p>
      </div>
      <template v-else-if="allLinks.length">
        <link-item
          v-for="(link, index) in allLinks"
          :key="link.id"
          :link="link"
          :index="index">
        </link-item>
      </template>
    </div>
  </div>
</template>

<script>
  import LinkItem from '@/components/LinkItem.vue';
  import { ALL_LINKS_SEARCH_QUERY } from '../constants/graphql';
  export default {
    name: 'search',
    components: {
      LinkItem,
    },
    data() {
      return {
        allLinks: [],
        loading: 0,
        searchText: ''
      }
    },
    watch: {
      searchText() {
        if(!this.searchText) {
          this.allLinks = [];
        }
      }
    },
    apollo: {
      allLinks: {
        query: ALL_LINKS_SEARCH_QUERY,
        variables() {
          return { searchText: this.searchText };
        },
        skip() {
          return !this.searchText;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .list-link {
    margin-top: 20px;
  }
</style>