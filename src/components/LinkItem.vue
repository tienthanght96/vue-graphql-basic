<template>
  <div class="uk-flex">
    <div class="uk-flex">
      <span class="gray">{{linkNumber}}.</span>
      <div v-if="userId" class="upvote" :style="isVoted ? 'color: #42b983' : ''" @click="voteForLink()">▲</div>
    </div>
    <div class="ml1">
      <a :href="link.url" class="link">{{link.description}} ({{link.url}})</a>
      <div class="uk-flex">
        {{link.votes.length}} votes | by {{link.postedBy ? link.postedBy.name : 'Unknown'}} {{timeDifferenceForDate(link.createdAt)}}
      </div>
    </div>
  </div>
</template>


<script>
  import { timeDifferenceForDate } from '../utils'
  import { CREATE_VOTE_MUTATION, ALL_LINKS_QUERY } from '../constants/graphql';
  import { GC_USER_ID } from '../constants/settings';
  import { LINKS_PER_PAGE } from '../constants/settings'

  export default {
    props: {
      link: Object,
      index: Number,
      pageNumber: Number
    },
    data() {
      return {
        linksPerPage: LINKS_PER_PAGE
      }
    },
    computed: {
      userId () {
        return this.$root.$data.userId
      },
      linkNumber () {
        if (this.$route.path.includes('new')) {
          return (this.pageNumber - 1) * this.linksPerPage + (this.index + 1)
        } else {
          return this.index + 1
        }
      },
      isVoted() {
        const  { votes } = this.link;
        const userVoted = votes.find(v => v.user.id === this.userId);
        return typeof userVoted !== 'undefined';
      }
    },
    methods: {
      voteForLink() {

        const userId = localStorage.getItem(GC_USER_ID);
        const linkId = this.link.id;
        const voterId = this.link.votes.find(vote => vote.user.id === userId);
        if(voterId) {
          UIkit.notification({
            message: `You already voted for this link.`,
            status: 'primary',
            pos: 'top-right',
            timeout: 5000
          });
          return;
        }
         this.$apollo.mutate({
          mutation: CREATE_VOTE_MUTATION,
          variables: {
            userId,
            linkId
          },
          update: (store, {  data: { createVote } }) => {
            this.updateStoreAfterVote(store, createVote, linkId);
          }
        });
      },
      updateStoreAfterVote(store, createVote, linkId, ) {
        const data = store.readQuery({
          query: ALL_LINKS_QUERY,
          variables: {
            first: 5,
            skip: 0,
            orderBy: 'createdAt_DESC'
          }
        });

        const votedLink = data.allLinks.find(link => link.id === linkId);
        if(votedLink) {
          votedLink.votes = createVote.link.votes;
          store.writeQuery({ query: ALL_LINKS_QUERY, data });
        }
      },
      timeDifferenceForDate
    }
  }
</script>

<style scoped>
  .upvote {
    cursor: pointer;
    margin: 0 10px;
  }
</style>