<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list density="compact">
        <v-list-item :prepend-avatar="profile.avatar" :title="profile.name" :subtitle="profile.rol">
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item v-for="(item, index) in items" :key="index" @click="navigateTo(item.route)">
          <v-icon>{{ item.icon }}</v-icon> {{ item.title }}
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>TimeTrack</v-toolbar-title>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
        </template>

        <v-list>
          <v-list-item v-for="(option, i) in options" :key="i" @click="logout">
            <v-list-item-title>{{ option.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <!-- Contenido de la página -->
      <router-view />
    </v-main>
  </v-app>
</template>
<script>
import { logout } from '@/services/auth'
export default {
  data() {
    return {
      profile: {
        name: document.cookie.split(';').find(cookie => cookie.includes('userName=')).split('=')[1],
        rol: document.cookie.split(';').find(cookie => cookie.includes('rol=')).split('=')[1],
        avatar: document.cookie.split(';').find(cookie => cookie.includes('avatar=')).split('=')[1]
      },
      drawer: false,
      showMenu: false,
      options: [{ title: 'Cerrar Sesión' }],
      items: [
        { title: 'Empleados', icon: 'mdi-account-group', route: '/employee' },
        { title: 'Horarios', icon: 'mdi-clock', route: '/schedule' },
        { title: 'Cargos', icon: 'mdi-briefcase', route: '/job' },
        { title: 'Usuarios', icon: 'mdi-account', route: '/users' },
        { title: 'Zonas de trabajo', icon: 'mdi-map-marker', route: '/zones' },
      ]
    }
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route)
    },

    async logout() {
      try {
        const token = document.cookie.split(';').find(cookie => cookie.includes('token='))
        const res = await logout(token.split('=')[1])
        if (res.error == false) {
          this.$router.push({ name: res.redirect })
        } else {
          alert(res.message)
        }
      } catch (error) {
        console.log("🚀 ~ file: Default.vue:64 ~ logout ~ error", error)
        alert(res.message)
      }
    }
  }
}
</script>