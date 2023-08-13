<template>
    <v-alert v-if="isLoading" type="warning">
        Enviando datos...
    </v-alert>

    <v-alert v-if="showDisplay" :type="typeMessage" closable @click:close="closeAlert">
        {{ message }}
    </v-alert>
    <v-container>
        <v-card>
            <v-card-title>
                Datos del Usuario
            </v-card-title>
            <v-card-text>
                <v-form @submit.prevent="submitForm" class="form-container">
                    <v-row>
                        <v-col cols="12" md="6" lg="4">
                            <v-text-field label="Nombres" v-model="user.first_name" :rules="nameRules"
                                required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" lg="4">
                            <v-text-field label="Apellidos" v-model="user.last_name" :rules="nameRules"
                                required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" lg="4">
                            <v-text-field type="email" label="Correo electrónico" v-model="user.email"
                                :rules="emailRules" required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" lg="4">
                            <v-select :items="roles" v-model="user.role" label="Rol"
                                :item-title="item => item.name" :item-value="item => item.id" :rules="emptyRule"
                                required></v-select>
                        </v-col>
                        
                        <v-col cols="12">
                            <v-btn color="primary" type="submit">Registrar</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { registerUser } from '@/services/auth';
import { getToken } from '@/util/getToken';
export default {
    data() {
        return {
            showDisplay: false,
            image: null,
            typeMessage: '',
            message: '',
            isLoading: false,
            roles: [
            {
                name: 'Coordinador de Asistencia',
                id: 'Coordinador de Asistencia',
            }],
            user: {
                first_name: '',
                last_name: '',
                email: '',
                role: '',
                image: '',
            },
        };
    },

    computed: {
        nameRules() {
            return [
                v => !!v || 'El campo es obligatorio',
                v => v.length >= 3 || 'El nombre debe tener al menos 5 caracteres',
            ]
        },

        emailRules() {
            return [
                v => !!v || 'El correo electrónico es obligatorio',
                (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'El usuario debe ser un correo electrónico válido.'
            ]
        },

        emptyRule() {
            return [
                v => !!v || 'El campo es obligatorio',
            ]
        },
    },

    methods: {
        closeAlert() {
            this.showDisplay = false;
        },
        async submitForm() {
            try {
                if (this.validate()) {
                    this.isLoading = true;
                    const token = getToken();
                    const res = await registerUser(token, this.user);
                    this.showDisplay = true;
                    if (res.error) {
                        this.typeMessage = 'error';
                        this.message = res.message;
                    } else {
                        this.typeMessage = 'success';
                        this.message = 'Usuario registrado correctamente';
                        this.$router.push({ name: 'Users' });
                    }
                }
            } catch (error) {
                this.showDisplay = true;
                this.typeMessage = 'error';
                this.message = 'Ha ocurrido un error al registrar el usuario';
            } finally {
                this.isLoading = false;

            }
        },
        onFileChange(event) {
            const file = event.target.files[0];
            this.employee.photo = file;
            if (file) {
                this.convertFileToBase64(file);
            } else {
                // Si el input está vacío, eliminar la foto anterior
                this.removePhoto();
            }
        },

        validate() {
            return this.nameRules.every(v => v(this.user.first_name) === true) &&
                this.nameRules.every(v => v(this.user.last_name) === true) &&
                this.emailRules.every(v => v(this.user.email) === true) &&
                this.emptyRule.every(v => v(this.user.role) === true);
        },

    }
};
</script>