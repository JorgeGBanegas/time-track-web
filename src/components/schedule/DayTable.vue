
<template>
    <v-data-table-virtual :headers="headers" :items="virtualDesserts" class="elevation-1" height="400" item-value="name">
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>Detalles del horario</v-toolbar-title>
                <v-btn color="primary" dark class="mb-2" @click="create">
                    Agregar Horario
                </v-btn>
            </v-toolbar>
        </template>
        <template v-slot:item.action="{ item }">
            <v-icon @click="removeItem(item)">mdi-delete</v-icon>
        </template>
    </v-data-table-virtual>
</template>
<script>
export default {
    data: () => ({
        headers: [
            {
                title: 'Dia',
                align: 'start',
                sortable: false,
                key: 'name',
            },
            { title: 'Hora de entrada', align: 'end', key: 'startHour' },
            { title: 'Hora de salida', align: 'end', key: 'endHour' },
            { title: 'Actions', align: 'end', key: 'action', sortable: false },
        ],
        desserts: [
            {
                name: 'Lunes',
                startHour: '08:00',
                endHour: '17:00',
            },
            {
                name: 'Martes',
                startHour: '08:00',
                endHour: '17:00',
            }
        ],
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
        create() {
            this.$emit('add-schedule');
        },
    }
}
</script>