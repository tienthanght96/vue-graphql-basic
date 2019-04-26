<template>
  <div  class="uk-flex uk-flex-center">
    <div class="uk-card uk-card-default uk-card-body uk-text-center uk-width-1-2@m uk-margin">
      <h4 class='uk-heading-medium'>{{isLogin ? 'Login' : 'Sign Up'}}</h4>
      <div class="uk-margin" v-if="!isLogin">
        <div class="uk-block">
          <input class="uk-input uk-width-1-1" type="text" v-model="name">
        </div>
      </div>
      <div class="uk-margin">
        <div class="uk-block">
          <input class="uk-input uk-width-1-1" type="email" v-model="email">
        </div>
      </div>
      <div class="uk-margin">
        <div class="uk-block">
          <input class="uk-input uk-width-1-1" type="password" v-model="password">
        </div>
      </div>
      <div class="uk-margin">
        <div>
          <button class="uk-button uk-button-primary" @click="confirm">Submit</button>
        </div>
        <div>
          <button class="uk-button uk-button-link" @click="toggleLogin">
            {{isLogin ? 'need to create an account?' : 'already have an account?'}}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { GC_USER_ID, GC_AUTH_TOKEN } from '../constants/settings';
  import { SIGNIN_USER_MUTATION, CREATE_USER_MUTATION } from '../constants/graphql';

  export default {
    data() {
      return {
        email: '',
        isLogin: true,
        name: '',
        password: ''
      }
    },
    methods: {
      confirm() {
        const { name, email, password } = this.$data
        if (this.isLogin) {
          this.login(email, password);
        } else {
          this.createNewUser(name,email,password);
        }
      },
      login(email, password) {
        this.$apollo.mutate({
          mutation: SIGNIN_USER_MUTATION,
          variables: { email, password }
        })
        .then(result => {
          const id = result.data.signinUser.user.id;
          const token = result.data.signinUser.token;
          this.saveUserData(id, token);
          this.$router.push({path: '/'})

        })
        .catch(error => alert(error));
      },
      createNewUser(name,email,password) {
        this.$apollo.mutate({
          mutation: CREATE_USER_MUTATION,
          variables: { name, email,password }
        })
        .then(result => {
          const id = result.data.signinUser.user.id;
          const token = result.data.signinUser.token;
          this.saveUserData(id, token);
          this.$router.push({path: '/'})
        })
        .catch(error => alert(error));
      },
      toggleLogin() {
        this.isLogin = !this.isLogin;
      },
      saveUserData (id, token) {
        localStorage.setItem(GC_USER_ID, id)
        localStorage.setItem(GC_AUTH_TOKEN, token)
        this.$root.$data.userId = localStorage.getItem(GC_USER_ID)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>