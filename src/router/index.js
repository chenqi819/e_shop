import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/uesr/Users.vue'
import Right from '../components/Power/Right.vue'
import Roles from '../components/Power/Roles.vue'
import Cate from '../components/Goods/Cate.vue'
import Parmas from '../components/Goods/Params.vue'
import Goods from '../components/Goods/Goods.vue'
import Add from '../components/Goods/Add'
Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/Login'
    },
    {
        path: '/Login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [{
                path: '/welcome',
                component: Welcome
            },
            {
                path: '/users',
                component: Users
            },
            {
                path: '/rights',
                component: Right
            },
            {
                path: '/roles',
                component: Roles
            },
            {
                path: '/categories',
                component: Cate
            },
            {
                path: '/params',
                component: Parmas
            },
            {
                path: '/goods',
                component: Goods
            },
            {
                path: '/goods/add',
                component: Add
            }
        ]
    }

]

const router = new VueRouter({
    routes
})

// 挂载导航守卫

router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 代表从哪个路径跳转而来
    // next 是一个函数 ，表示放行
    if (to.path === '/login') next()
        // 获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router
