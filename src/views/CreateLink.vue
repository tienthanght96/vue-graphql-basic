<template>

  <div class="uk-flex uk-flex-center">
    <div class="uk-card uk-card-default uk-card-body uk-width-1-2@m" v-if="!isLogin">
      <h3 class="uk-card-title">You are not logged !</h3>
      <p>
        <router-link to="/login">Go to login now</router-link>
      </p>
    </div>
    <div v-else class="uk-card uk-card-default uk-card-body uk-text-center uk-width-1-2@m uk-margin">
      <div class="uk-margin">
        <input class="uk-input"  v-model="description" type="text" placeholder="A description for the link">
      </div>
      <div class="uk-margin">
        <input class="uk-input" v-model="url" type="text" placeholder="The URL for the link">
      </div>
      <button button class="uk-button uk-button-secondary" @click="createLink">Submit</button>
    </div>
  </div>
</template>

<script>
  import { CREATE_LINK_MUTATION, ALL_LINKS_QUERY } from '../constants/graphql'
  import { GC_USER_ID } from '../constants/settings';

  export default {
    name: 'CreateLink',
    data () {
      return {
        description: '',
        url: ''
      }
    },
    computed: {
      isLogin() {
        return localStorage.getItem(GC_USER_ID);
      }
    },
    methods: {
      createLink () {
        const postedById = localStorage.getItem(GC_USER_ID);

        if(!postedById) {
          alert("No user login now !");
          return;
        }

        const { description, url } = this;
        this.$apollo.mutate({
          mutation: CREATE_LINK_MUTATION,
          variables: {
            description,
            url,
            postedById
          },
          update: (store, { data: { createLink } }) => {
            const data = store.readQuery({
              query: ALL_LINKS_QUERY,
              variables: {
                first: 5,
                skip: 0,
                orderBy: 'createdAt_DESC'
              }
            });
            data.allLinks = data.allLinks.concat([createLink]);
            store.writeQuery({
              query: ALL_LINKS_QUERY,
              variables: {
                first: 5,
                skip: 0,
                orderBy: 'createdAt_DESC'
              },
              data
            });
          }
        })
        .then(data => this.$router.push('/'))
        .catch(error => console.log(error));

      }
    }
  }
</script>

<style lang="scss" scoped>

</style>