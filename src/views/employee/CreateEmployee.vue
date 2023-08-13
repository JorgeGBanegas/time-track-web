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
                Datos del Empleado
            </v-card-title>
            <v-card-text>
                <v-form @submit.prevent="submitForm" class="form-container">
                    <v-row>
                        <v-col cols="12" md="6" lg="4">
                            <v-text-field label="Nombres" v-model="employee.firstName" :rules="nameRules"
                                required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" lg="4">
                            <v-text-field label="Apellidos" v-model="employee.lastName" :rules="nameRules"
                                required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" lg="4">
                            <v-text-field type="email" label="Correo electrónico" v-model="employee.email"
                                :rules="emailRules" required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" lg="4">
                            <v-text-field type="number" label="Número de teléfono" v-model="employee.phoneNumber"
                                :rules="phoneNumberRules" required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" lg="4">
                            <v-select :items="genders" v-model="employee.gender" label="Género"
                                :item-title="item => item.name" :item-value="item => item.id" :rules="emptyRule"
                                required></v-select>
                        </v-col>
                        <v-col cols="12" md="6" lg="4">
                            <v-text-field type="date" label="Fecha de nacimiento" v-model="employee.birthDate"
                                :rules="birthDateRules" required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" lg="4">
                            <v-select :items="jobs" v-model="employee.job_id" label="Cargo" :rules="emptyRule"
                                :item-title="item => item.name" :item-value="item => item.id" required></v-select>
                        </v-col>
                        <v-col cols="12" md="6" lg="4">
                            <v-select :items="schedules" v-model="employee.schedule_id" label="Horario" :rules="emptyRule"
                                :item-title="item => item.name" :item-value="item => item.id" equired></v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-file-input label="Foto" accept="image/*" show-size counter @change="onFileChange"
                                @click:clear="removePhoto" :rules="emptyRule"></v-file-input>
                            <!-- Mostrar la foto cargada -->
                            <img v-if="image" :src="image" alt="Foto del empleado"
                                style="max-width: 100%; margin-top: 10px;" />
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
import { createEmployee } from '@/services/employee';
import { getAllJobs } from '@/services/job';
import { getAllSchedules } from '@/services/schedules';
export default {
    data() {
        return {
            showDisplay: false,
            image: null,
            typeMessage: '',
            message: '',
            isLoading: false,
            genders: [{
                name: 'Masculino',
                id: 'M',
            },
            {
                name: 'Femenino',
                id: 'F',
            }],
            jobs: [],
            schedules: [],
            employee: {
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                gender: '',
                birthDate: '',
                photo: '',
                job_id: '',
                schedule_id: '',
            },
        };
    },
    created() {
        this.getInfo();
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

        birthDateRules() {
            return [
                v => !!v || 'La fecha de nacimiento es obligatoria',
                v => this.isOver18YearsOld(v) || 'El empleado debe tener al menos 18 años para registrarlo',
            ]
        },

        emptyRule() {
            return [
                v => !!v || 'El campo es obligatorio',
            ]
        },

        phoneNumberRules() {
            return [
                v => !!v || 'El número de teléfono es obligatorio',
                v => v.length >= 7 || 'El número de teléfono debe tener al menos 7 caracteres',
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
                    let cookie = document.cookie
                    if (typeof cookie === undefined || cookie === '' || cookie === null) {
                        this.$router.push({ name: 'Login' });
                        return;
                    }
                    let token = cookie.split(';').find(cookie => cookie.includes('token=')).split('=')[1];
                    this.isLoading = true;
                    const res = await createEmployee(token, this.employee);
                    this.showDisplay = true;
                    if (!res.error) {
                        this.typeMessage = 'success';
                        this.message = 'Empleado registrado correctamente';
                        this.$router.push({ name: 'Employee' });
                    } else {
                        this.typeMessage = 'error';
                        this.message = res.message;
                    }
                }
            } catch (error) {
                this.showDisplay = true;
                this.typeMessage = 'error';
                this.message = 'Ha ocurrido un error al registrar el empleado';
                console.log("🚀 ~ file: CreateEmployee.vue:139 ~ submitForm ~ error:", error)
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
        removePhoto() {
            this.image = null;
        },
        convertFileToBase64(file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.image = reader.result;
            };
            reader.readAsDataURL(file);
        },
        isOver18YearsOld(birthDate) {
            if (!birthDate) return false;

            // Obtener la fecha actual y la fecha de nacimiento
            const currentDate = new Date();
            const selectedDate = new Date(birthDate);

            // Calcular la diferencia en milisegundos entre la fecha actual y la fecha de nacimiento
            const timeDifference = currentDate - selectedDate;

            // Calcular la edad en años
            const age = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365.25));

            // Verificar si la edad es mayor o igual a 18 años
            return age >= 18;
        },
        validate() {

            return this.nameRules.every(v => v(this.employee.firstName) === true) &&
                this.nameRules.every(v => v(this.employee.lastName) === true) &&
                this.emailRules.every(v => v(this.employee.email) === true) &&
                this.phoneNumberRules.every(v => v(this.employee.phoneNumber) === true) &&
                this.emailRules.every(v => v(this.employee.email) === true) &&
                this.birthDateRules.every(v => v(this.employee.birthDate) === true) &&
                this.emptyRule.every(v => v(this.employee.job_id) === true) &&
                this.emptyRule.every(v => v(this.employee.schedule_id) === true) &&
                this.emptyRule.every(v => v(this.employee.photo) === true);
        },
        async getInfo() {
            try {
                this.isLoading = true;
                let token = document.cookie.split(';').find(cookie => cookie.includes('token=')).split('=')[1];
                const jobs = await getAllJobs(token);
                const schedules = await getAllSchedules(token);
                if (jobs === null || schedules.error) {
                    this.showDisplay = true;
                    this.typeMessage = 'error';
                    this.message = 'No se pudo obtener la información';
                    return;
                } else {
                    this.jobs = jobs;
                    this.schedules = schedules.data;
                }
            } catch (error) {
                console.log("🚀 ~ file: CreateEmployee.vue:201 ~ getInfo ~ error:", error)
                this.showDisplay = true;
                this.typeMessage = 'error';
                this.message = 'No se pudo obtener la información';
            } finally {
                this.isLoading = false;
            }
        }

    }
};
</script>