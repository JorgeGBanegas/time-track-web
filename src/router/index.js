// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/employee/Employee'),
        meta: {
          requiredAuth: true,
          authorizedRoles: ['Coordinador de Asistencia']
        }
      },
      {
        path: 'job',
        name: 'Job',
        component: () => import(/* webpackChunkName: "job" */ '@/views/job/Jobs'),
        meta: {
          requiredAuth: true,
          authorizedRoles: ['Coordinador de Asistencia']
        }
      },
      {
        path: 'employee',
        name: 'Employee',
        component: () => import(/* webpackChunkName: "employee" */ '@/views/employee/Employee'),
        meta: {
          requiredAuth: true,
          authorizedRoles: ['Coordinador de Asistencia']
        }
      },
      {
        path: 'employee/:id',
        name: 'EmployeeDetail',
        component: () => import(/* webpackChunkName: "employee-detail" */ '@/views/employee/EmployeeDetail'),
        meta: {
          requiredAuth: true,
          authorizedRoles: ['Coordinador de Asistencia']
        }
      },
      {
        path: 'employee/create-employee',
        name: 'CreateEmployee',
        component: () => import(/* webpackChunkName: "employee-create" */ '@/views/employee/CreateEmployee'),
        meta: {
          requiredAuth: true,
          authorizedRoles: ['Coordinador de Asistencia']
        }
      },
      {
        path: 'employee/zone/:id',
        name: 'EmployeeZone',
        component: () => import(/* webpackChunkName: "employee-zone" */ '@/views/employee/AssignZone'),
        meta: {
          requiredAuth: true,
          authorizedRoles: ['Coordinador de Asistencia']
        }
      },
      {
        path: 'schedule',
        name: 'Schedule',
        component: () => import(/* webpackChunkName: "schedule" */ '@/views/schedule/Schedules'),
        meta: {
          requiredAuth: true,
          authorizedRoles: ['Coordinador de Asistencia']
        }
      },
      {
        path: 'schedule/create-schedule',
        name: 'CreateSchedule',
        component: () => import(/* webpackChunkName: "schedule-create" */ '@/views/schedule/CreateSchedule'),
        meta: {
          requiredAuth: true,
          authorizedRoles: ['Coordinador de Asistencia']
        }
      },
      {
        path: 'schedule/:id',
        name: 'ScheduleDetail',
        component: () => import(/* webpackChunkName: "schedule-detail" */ '@/views/schedule/ScheduleDetail'),
        meta: {
          requiredAuth: true,
          authorizedRoles: ['Coordinador de Asistencia']
        }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import(/* webpackChunkName: "users" */ '@/views/user/User'),
        meta: {
          requiredAuth: true,
          authorizedRoles: ['Coordinador de Asistencia']
        }
      },
      {
        path: 'users/create',
        name: 'CreateUser',
        component: () => import(/* webpackChunkName: "create-user" */ '@/views/user/RegisterUser'),
        meta: {
          requiredAuth: true,
          authorizedRoles: ['Coordinador de Asistencia']
        }
      },
      {
        path: 'zones',
        name: 'Zones',
        component: () => import(/* webpackChunkName: "zones" */ '@/views/zones/zones'),
        meta: {
          requiredAuth: true,
          authorizedRoles: ['Coordinador de Asistencia']
        }
      },
      {
        path: 'zones/create-zone',
        name: 'CreateZone',
        component: () => import(/* webpackChunkName: "create-zone" */ '@/views/zones/CreateZone'),
        meta: {
          requiredAuth: true,
          authorizedRoles: ['Coordinador de Asistencia']
        }
      }, 
      {
        path: 'zones/:id',
        name: 'ZoneDetail',
        component: () => import(/* webpackChunkName: "zone-detail" */ '@/views/zones/ZoneDetails'),
        meta: {
          requiredAuth: true,
          authorizedRoles: ['Coordinador de Asistencia']
        }
      }
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login'),
  },
  {
    path: '/login/change-password',
    name: 'ChangePassword',
    component: () => import(/* webpackChunkName: "change-password" */ '@/views/ChangePassword'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
  },
  {
    path: '/not-authorized',
    name: 'NotAuthorized',
    component: () => import('@/views/NotAuthorized.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

import { getUser, isAuthenticated, logout } from '@/services/auth.js';
import { getToken } from '@/util/getToken';
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiredAuth)) {
    const  isAuth = await isAuthenticated();
    if (isAuth) {
      const userRoles = document.cookie.split(';').find(cookie => cookie.includes('rol=')).split('=')[1];
      const authorizedRoles = to.meta.authorizedRoles || []; // Obtiene los roles autorizados de la ruta
      if (authorizedRoles.includes(userRoles)) {
        if (to.name === 'Login' || to.name === 'ChangePassword') {
          next({ name: 'Home' });
        } else {
          next();
        }
      }else{
        if(userRoles === 'Empleado'){
          const token = getToken();
          await logout(token);
          next({ name: 'NotAuthorized' });
        }
        next({ name: 'NotAuthorized' });
      }
    } else {
      next({ name: 'Login' });
    }
  } else {
    const isAuth = await isAuthenticated();
    if (isAuth && (to.name === 'Login' || to.name === 'ChangePassword')) {
      next({ name: 'Home' });
    } else {
      next();
    }

  }
});
export default router
