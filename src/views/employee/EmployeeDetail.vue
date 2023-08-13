<template>
    <v-alert v-if="isLoading" :value="true" type="warning">
        Enviando datos...
    </v-alert>
    <v-alert v-if="showDisplay" :value="true" :type="typeMessage" closable @click:close="closeAlert">
        {{ message }}
    </v-alert>
    <v-container>
        <v-card>
            <v-card-title>
                Datos del Empleado
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="6">
                        <strong>Nombre:</strong> {{ employee.firstName }} {{ employee.lastName }}
                    </v-col>
                    <v-col cols="12" sm="6">
                        <strong>Número de teléfono:</strong> {{ employee.phoneNumber }}
                    </v-col>
                    <v-col cols="12" sm="6">
                        <strong>Correo electrónico:</strong> {{ employee.email }}
                    </v-col>
                    <v-col cols="12" sm="6">
                        <strong>Género:</strong> {{ employee.gender === 'M' ? 'Masculino' : 'Femenino' }}
                    </v-col>
                    <v-col cols="12" sm="6">
                        <strong>Fecha de nacimiento:</strong> {{ employee.birthDate }}
                    </v-col>
                    <v-col cols="12" sm="6">
                        <strong>Horario:</strong> {{ employee.schedule?.name }}
                    </v-col>
                    <v-col cols="12" sm="6">
                        <img v-if="employee.photo" :src="employee.photo" alt="Foto del empleado"
                            style="max-width: 100%; margin-top: 10px;" />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <strong>Cargo:</strong> {{ employee.job?.name }}
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { getEmployeeById } from '@/services/employee';

export default {
    data: () => ({
        isLoading: false,
        showDisplay: false,
        message: '',
        typeMessage: '',
        id: null,
        employee: {},
    }),
    created() {
        this.id = this.$route.params.id;
        this.initialize(this.id);
    },

    methods: {
        closeAlert() {
            this.showDisplay = false;
        },
        async initialize(id) {
            try {
                this.isLoading = true;
                let token = document.cookie.split(';').find(cookie => cookie.includes('token=')).split('=')[1];
                let res = await getEmployeeById(token, id);
                if (res.error) {
                    this.message = res.message;
                    this.typeMessage = 'error';
                } else {
                    this.employee = res.data;
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.isLoading = false;
            }
        },
    }
}
</script>