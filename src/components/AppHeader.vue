<template>
  <nav class="uk-navbar-container uk-box-shadow-small" uk-navbar>
    <div class="uk-navbar-left">
      <a class="uk-navbar-item uk-logo">Hacker News</a>
      <ul class="uk-navbar-nav">
          <li>
            <router-link to="/" class="ml1 no-underline black">News</router-link>
          </li>
          <li v-if="userId">
            <router-link to="/create" class="ml1 no-underline black">Submit</router-link>
          </li>
          <li>
            <router-link to="/top" class="ml1 no-underline black">Top</router-link>
          </li>
          <li>
            <router-link to="/search" class="ml1 no-underline black">Search</router-link>
          </li>
          <li v-if="userId">
            <a class="ml1 no-underline black">
              <button class="uk-button uk-button-danger" @click="logout">Logout</button>
            </a>
          </li>
          <li v-else>
            <router-link to="/login" class="ml1 no-underline black">
              <button class="uk-button uk-button-primary">
                Login
              </button>
            </router-link>
          </li>

      </ul>
    </div>
  </nav>
</template>

<script>
import { GC_AUTH_TOKEN, GC_USER_ID } from '../constants/settings';
  export default {
    name: 'AppHeader',
    computed: {
      userId() {
        return this.$root.$data.userId;
      }
    },
    methods: {
      logout() {
        localStorage.removeItem(GC_USER_ID)
        localStorage.removeItem(GC_AUTH_TOKEN)
        this.$root.$data.userId = localStorage.getItem(GC_USER_ID)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .uk-navbar-container {
    background-color: transparent !important;
    border: 1px solid #ededed;
  }
</style>
