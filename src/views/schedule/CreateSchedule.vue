<template>
    <v-alert v-if="isLoading" type="warning">
        Enviando datos...
    </v-alert>

    <v-alert v-if="showDisplay" :type="typeMessage" closable @click:close="closeAlert">
        {{ message }}
    </v-alert>
    <v-form>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-card-text>
                        <v-card-title>
                            <h3 class="text-h5">Nuevo Horario</h3>
                        </v-card-title>
                        <v-form>
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field label="Nombre" v-model="title" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <label for="Dia de la semana" class="label">Dia de la semana</label>
                                        <v-select
                                            :items="['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']"
                                            v-model="day" label="Día" required></v-select>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <TimePicker label="Hora de entrada" @time-change="onTimeSelectedIn" />
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <TimePicker label="Hora de salida" @time-change="onTimeSelectedOut" />
                                    </v-col>
                                    <v-col cols="12">
                                        <!-- Mover el Data Table principal aquí -->
                                        <v-data-table-virtual :headers="headers" :items="virtualDesserts"
                                            class="elevation-1" height="400" item-value="name">
                                            <template v-slot:top>
                                                <v-toolbar flat>
                                                    <v-toolbar-title>Detalles del horario</v-toolbar-title>
                                                    <v-btn color="primary" dark class="mb-2" @click="onAddSchedule">
                                                        Agregar Horario
                                                    </v-btn>
                                                </v-toolbar>
                                            </template>
                                            <template v-slot:item.action="{ item }">
                                                <v-icon @click="removeItem(item)">mdi-delete</v-icon>
                                            </template>
                                        </v-data-table-virtual>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-btn color="primary" @click="onSubmit">Guardar</v-btn>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-form>
                    </v-card-text>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script>
import TimePicker from '@/components/schedule/TimePicker.vue';
import TableDay from '@/components/schedule/DayTable.vue';
import { createSchedule } from '@/services/schedules';
export default {
    components: {
        TimePicker,
        TableDay
    },
    data: () => ({
        showDisplay: false,
        isLoading: false,
        typeMessage: '',
        message: '',
        title: null,
        day: null,
        timeIn: null,
        timeOut: null,
        headers: [
            {
                title: 'Dia',
                align: 'start',
                sortable: false,
                key: 'day',
            },
            { title: 'Hora de entrada', align: 'end', key: 'startHour' },
            { title: 'Hora de salida', align: 'end', key: 'endHour' },
            { title: 'Actions', align: 'end', key: 'action', sortable: false },
        ],
        desserts: [],
    }),
    computed: {
        virtualDesserts() {
            // Agregamos una copia del índice a cada elemento para usarlo posteriormente
            return this.desserts.map((d, index) => ({
                ...d,
                startHour: d.startHour,
                endHour: d.endHour,
                index: index, // Almacenamos el índice en el campo "index"
            }))
        },
    },
    methods: {
        removeItem(item) {
            // Obtenemos el índice desde el campo "index" en el elemento
            const index = item.index;
            if (index !== -1) {
                // Eliminar el elemento del array desserts
                this.desserts.splice(index, 1);
            }
        },
        onTimeSelectedIn(time) {
            this.timeIn = time;
        },
        onTimeSelectedOut(time) {
            this.timeOut = time;
        },
        closeAlert() {
            this.showDisplay = false;
        },
        onAddSchedule() {
            if (this.day && this.timeIn && this.timeOut) {
                let [hourIn, minuteIn] = this.timeIn.split(":");
                let [hourOut, minuteOut] = this.timeOut.split(":");
                let newHourIn = new Date(0, 0, 0, hourIn, minuteIn);
                let newHourOut = new Date(0, 0, 0, hourOut, minuteOut);
                if (newHourIn > newHourOut) {
                    this.showDisplay = true;
                    this.typeMessage = "error";
                    this.message = "La hora de entrada debe ser menor a la hora de salida";
                    return;
                }

                this.desserts.push({
                    day: this.day,
                    startHour: this.timeIn,
                    endHour: this.timeOut,
                });
            }
        },
        async onSubmit() {
            try {
                if (this.title && this.desserts.length > 0) {
                    const req = {
                        name: this.title,
                        typeOfSchedule: "Predefinido",
                        detailSchedules: this.desserts
                    }
                    this.isLoading = true;
                    let token = document.cookie.split(';').find(cookie => cookie.includes('token=')).split('=')[1];
                    const res = await createSchedule(token, req);
                    if (!res.error) {
                        this.showDisplay = true;
                        this.typeMessage = "success";
                        this.message = "Horario creado correctamente";
                        this.$router.push({ name: 'Schedule' });
                    } else {
                        this.showDisplay = true;
                        this.typeMessage = "error";
                        this.message = res.message;

                    }
                } else {
                    this.showDisplay = true;
                    this.typeMessage = "error";
                    this.message = "Debes poner un nombre y agregar al menos un horario";
                }
            } catch (error) {
                console.log("🚀 ~ file: CreateSchedule.vue:150 ~ onSubmit ~ error", error)
                this.showDisplay = true;
                this.typeMessage = "error";
                this.message = "Ocurrió un error al crear el horario";
            } finally {
                this.isLoading = false;
            }
        }

    },
}
</script>

<style>
.label {
    font-size: 14px;
    color: #616161;
}
</style>