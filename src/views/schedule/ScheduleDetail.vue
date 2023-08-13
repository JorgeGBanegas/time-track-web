<template>
    <v-alert v-if="showDisplay" :type="typeMessage" closable @click:close="closeAlert">
        {{ message }}
    </v-alert>
    <v-alert v-if="isLoading" type="warning">
        Cargando datos...
    </v-alert>

    <v-container>
        <v-col cols="12">
            <!-- Mover el Data Table principal aquí -->
            <v-data-table-virtual :headers="headers" :items="virtualDetails" class="elevation-1" height="400"
                item-value="name">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>{{ nameSchedule }}</v-toolbar-title>
                    </v-toolbar>
                </template>
            </v-data-table-virtual>
        </v-col>
    </v-container>
</template>

<script>
import { getScheduleById } from '@/services/schedules';
export default {
    data: () => ({
        showDisplay: false,
        typeMessage: '',
        isLoading: false,
        id: null,
        nameSchedule: null,
        details: [],
        headers: [
            {
                title: 'Dia',
                align: 'start',
                sortable: false,
                key: 'day',
            },
            { title: 'Hora de entrada', align: 'end', key: 'startHour' },
            { title: 'Hora de salida', align: 'end', key: 'endHour' },
        ],
    }),

    computed: {
        virtualDetails() {
            return this.details.map((item) => {
                return {
                    day: item.day,
                    startHour: item.startHour,
                    endHour: item.endHour,
                };
            });
        },
    },
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
                let res = await getScheduleById(token, id);
                if (res.error) {
                    this.message = res.message;
                    this.typeMessage = 'error';
                } else {
                    this.nameSchedule = res.data.name;
                    this.details = res.data.detailSchedules;

                }

            } catch (e) {
                this.message = 'Error al cargar los horarios';
                this.typeMessage = 'error';
            } finally {
                this.isLoading = false;
            }
        },
    },
}
</script>