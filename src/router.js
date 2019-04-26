import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import LinkList from './components/LinkList.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/news/1'
    },
    {
      path: '/news/:page',
      name: 'news',
      component: LinkList,
    },
    {
      path: '/top',
      name: 'top',
      component: LinkList,
    },
    {
      path: '/create',
      name: 'create',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/CreateLink.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "about" */ './views/AppLogin.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import(/* webpackChunkName: "about" */ './views/Search.vue')
    }
  ]
})
