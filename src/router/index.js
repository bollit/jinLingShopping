import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home'),
    redirect: '/home/welcom',
    children: [
      {
        path: 'welcom',
        component: () => import('@/components/Welcom')
      },
      {
        path: 'users',
        component: () => import('@/components/Users.vue'),
      },
      {
        path: 'rights',
        component: () => import('@/components/Rights')
      },
      {
        path: 'reports',
        component: () => import('@/components/Reports')
      }, {
        path: 'orders',
        component: () => import('@/components/Orders')
      },
      {
        path: 'goods',
        component: () => import('@/components/Goods')
      },
      {
        path: 'roles',
        component: () => import('@/components/Roles')
      },
      {
        path: 'params',
        component: () => import('@/components/Params')
      },
      {
        path: 'categories',
        component: () => import('@/components/Categories')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: function () {
      return import('@/views/Login')
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path != '/login') {
    let token = sessionStorage.getItem('token')
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
