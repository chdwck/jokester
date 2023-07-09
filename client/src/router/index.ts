import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        {
            path: '/joke/:id',
            name: 'joke',
            component: () => import(/* webpackChunkName: "joke" */ '../views/JokeView.vue')
        },
        {
            path: '/borked',
            name: 'borked',
            component: () => import(/* webpackChunkName: "borked" */ '../views/BorkedView.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import(/* webpackChunkName: "not-found" */ '../views/NotFoundView.vue')
        }
    ],
});

export default router;
