<template>
    <v-alert v-if="isLoading" :value="true" type="warning">
        Enviando datos...
    </v-alert>
    <v-alert v-if="showDisplay" :value="true" :type="typeMessage" closable @click:close="closeAlert">
        {{ message }}
    </v-alert>
    <br />
    <v-data-table :headers="headers" :items="jobs" :sort-by="[{ key: 'id', order: 'asc' }]" class="elevation-1">
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>Listado De Trabajos</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ props }">
                        <v-btn color="primary" dark class="mb-2" v-bind="props">
                            Agregar Trabajo
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field v-model="editedItem.name" label="Nombre"></v-text-field>
                                    </v-col>

                                </v-row>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" variant="text" @click="close">
                                Cancelar
                            </v-btn>
                            <v-btn color="blue-darken-1" variant="text" @click="save">
                                Guardar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                        <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                            <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
            <v-icon size="small" class="me-2" @click="editItem(item.raw)">
                mdi-pencil
            </v-icon>
            <v-icon size="small" @click="deleteItem(item.raw)">
                mdi-delete
            </v-icon>
        </template>
        <template v-slot:no-data>
            No hay datos disponibles
        </template>
    </v-data-table>
</template>

<script>
import { getAllJobs, createJob } from '@/services/job';

export default {
    data: () => ({
        isLoading: false,
        showDisplay: false,
        message: '',
        typeMessage: '',
        dialog: false,
        dialogDelete: false,
        headers: [
            { title: 'Identificador', key: 'id' },
            { title: 'Nombre', key: 'name' },
            //{ title: 'Actions', key: 'actions', sortable: false },
        ],
        jobs: [],
        editedIndex: -1,
        editedItem: {
            name: '',
        },
        defaultItem: {
            name: '',
            calories: 0,
            fat: 0,
            carbs: 0,
            protein: 0,
        },
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nuevo Trabajo' : 'Editar Trabajo'
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
                let res = await getAllJobs();
                this.jobs = res;
            } catch (e) {
                console.log("🚀 ~ file: UserTable.vue:134 ~ initialize ~ e):", e)
                alert("Error al cargar los datos")
            }

        },
        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        async save() {
            try {
                let job = this.editedItem;
                let token = document.cookie.split(';').find(cookie => cookie.includes('token=')).split('=')[1];
                this.isLoading = true;
                this.close();
                const res = await createJob(token, job.name);
                let err = res.error;
                this.typeMessage = err === true ? 'error' : 'success';
                if (!err) {
                    this.initialize();
                }

                this.message = res.message;
            } catch (e) {
                this.close();
                console.log("🚀 ~ file: UserTable.vue:134 ~ initialize ~ e):", e)
                this.typeMessage = 'Ah ocurrido un error, intentelo mas tarde o contacte con el administrador';
            } finally {
                this.showDisplay = true;
                this.isLoading = false;
            }
        },
    },
}
</script>