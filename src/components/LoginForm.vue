<template>
    <div class="login-form">
        <div class="text-center mb-8">
            <h2 class="mb-4">Bienvenido</h2>
            <p class="h5-text">Introduce tus credenciales, si es primera vez tendrás que
                ingresar tu Contraseña temporal que te fue enviada a tu correo electrónico, y
                luego cambiarla por una nueva.
            </p>
        </div>
        <div class="text-center">
            <v-progress-circular v-if="loading" indeterminate color="primary" size="80" class="mb-4">
            </v-progress-circular>
        </div>
        <v-form @submit.prevent="login" class="form-container" v-if="!loading">
            <v-text-field v-model="email" class="text-field" label="Email" prepend-icon="mdi-email"
                :rules="usernameRules"></v-text-field>
            <v-text-field v-model="password" class="text-field" label="Contraseña"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="togglePasswordVisibility"
                :type="showPassword ? 'text' : 'password'" prepend-icon="mdi-lock" :rules="passwordRules"></v-text-field>
            <v-btn type="submit" color="primary" size="x-large">Iniciar sesión</v-btn>
        </v-form>
    </div>
</template>

<script>
import { login } from '@/services/auth.js'
export default {
    data() {
        return { email: '', password: '', showPassword: false, loading: false };
    },
    methods: {
        async login() {
            if (this.validate()) {
                // Aquí puedes agregar la lógica para iniciar sesión
                this.loading = true;
                try {
                    let response = await login(this.email, this.password)
                    if (!response.error) {
                        if (response.redirect === 'ChangePassword') {
                            this.$router.push({ name: response.redirect, query: { email: this.email, session: response.data } });
                        } else {
                            this.$router.push({ name: response.redirect });
                        }

                    } else {
                        alert(response.message)
                    }
                } catch (error) {
                    console.log("🚀 ~ file: LoginForm.vue:61 ~ login ~ error:", error)
                    alert('Ocurrió un error al iniciar sesión')
                } finally {
                    this.loading = false;
                }
            }

        },
        togglePasswordVisibility() {
            this.showPassword = true;
            setTimeout(() => {
                this.showPassword = false;
            }, 2000); // Ocultar la contraseña después de 2 segundos (ajusta el tiempo según tus preferencias)
        },
        validate() {
            return this.usernameRules.every((rule) => rule(this.email) === true) &&
                this.passwordRules.every((rule) => rule(this.password) === true);
        }
    },
    computed: {
        usernameRules() {
            return [
                (v) => !!v || 'El campo de usuario no puede estar vacío.',
                (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'El usuario debe ser un correo electrónico válido.'
            ];
        },
        passwordRules() {
            return [(v) => !!v || 'El campo de contraseña no puede estar vacío.'];
        }
    }
};
</script>

<style scoped="scoped">
/* Puedes agregar estilos específicos para este componente si lo deseas */
.login-form {
    padding: 20px;
}

.form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.text-field {
    width: 80%;
}

.h5-text {
    text-align: center;
    color: rgb(133, 133, 133);
}
</style>