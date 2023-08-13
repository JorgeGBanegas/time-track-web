<template>
    <v-alert v-if="isLoading" :value="true" type="warning">
        Enviando datos...
    </v-alert>
    <v-alert v-if="showDisplay" :value="true" :type="typeMessage" closable @click:close="closeAlert">
        {{ message }}
    </v-alert>
    <br />
    <v-data-table :headers="headers" :items="zones" :sort-by="[{ key: '_id', order: 'asc' }]" class="elevation-1">
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>Listado De Zonas</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-btn color="primary" dark class="mb-2" @click="create">
                    Agregar Zona
                </v-btn>

                <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                        <v-card-title>¿Estás seguro de que deseas eliminar este ítem?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancelar</v-btn>
                            <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
            <v-icon size="small" class="me-2" @click="goToView(item.raw)">
                mdi-eye
            </v-icon>
            <v-icon size="small" class="me-2" @click="showConfirmationDialog(item.raw)">
                mdi-delete
            </v-icon>
        </template>
        <template v-slot:no-data>
            No hay datos disponibles
        </template>
    </v-data-table>
</template>

<script>
import { getAllZones } from '@/services/zones';

export default {
    data: () => ({
        isLoading: false,
        showDisplay: false,
        message: '',
        typeMessage: '',
        dialog: false,
        dialogDelete: false,
        headers: [
            { title: 'Identificador', key: '_id' },
            { title: 'Nombre de la zona', key: 'name' },
            { title: 'Actions', key: 'actions', sortable: false },
        ],
        zones: [],
        itemToDelete: null, // Agregar esta propiedad para almacenar el ítem que se eliminará
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nueva Zona' : 'Editar Zona'
        },
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

    created() {
        this.initialize()
    },

    methods: {
        closeAlert() {
            this.showDisplay = false;
        },
        async initialize() {
            try {
                this.isLoading = true;
                this.close();
                const token = document.cookie.split(';').find(cookie => cookie.includes('token=')).split('=')[1];
                const res = await getAllZones(token);
                if (res.error) {
                    this.message = res.message;
                    this.typeMessage = 'error';
                } else {
                    this.zones = res;
                }

            } catch (e) {
                this.message = 'Ah ocurrido un error, intentelo mas tarde o contacte con el administrador';
                this.typeMessage = 'error';
            } finally {
                this.isLoading = false;
            }
        },
        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        goToView(item) {
            this.$router.push({ name: 'ZoneDetail', params: { id: item._id } });
        },
        async create() {
            this.$router.push({ name: 'CreateZone' });
        },

        // Método para mostrar el diálogo de confirmación antes de eliminar un ítem
        showConfirmationDialog(item) {
            this.itemToDelete = item; // Almacenar el ítem que se eliminará
            this.dialogDelete = true; // Mostrar el diálogo de confirmación
        },

        // Método para cerrar el diálogo de confirmación sin eliminar el ítem
        closeDelete() {
            this.dialogDelete = false;
            this.itemToDelete = null; // Limpiar el ítem que se eliminaría
        },

        // Método para eliminar el ítem y cerrar el diálogo de confirmación
        async deleteItemConfirm() {
            try {
                this.isLoading = true;
                this.dialogDelete = false;

                let token = document.cookie.split(';').find(cookie => cookie.includes('token=')).split('=')[1];
                const res = await deleteSchedule(token, this.itemToDelete.id); // Suponiendo que el ítem tiene un campo "id".

                if (res.error) {
                    this.showDisplay = true;
                    this.typeMessage = 'error';
                    this.message = res.message;
                    return;
                }

                this.showDisplay = true;
                this.typeMessage = 'success';
                this.message = 'Horario eliminado correctamente';
                this.initialize(); // Refrescar la lista de ítems

            } catch (error) {
                this.showDisplay = true;
                this.typeMessage = 'error';
                this.message = 'Error al eliminar el ítem';
            } finally {
                this.itemToDelete = null; // Limpiar el ítem que se eliminaría
                this.isLoading = false;
            }
        },
    },
};
</script>
