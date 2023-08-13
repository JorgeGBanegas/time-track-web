<template>
    <v-alert v-if="isLoading" :value="true" type="warning">
        Enviando datos...
    </v-alert>
    <v-alert v-if="showDisplay" :value="true" :type="typeMessage" closable @click:close="closeAlert">
        {{ message }}
    </v-alert>
    <br/>
    <v-data-table :headers="headers" :items="users" :sort-by="[{ key: 'firstName', order: 'asc' }]" class="elevation-1">
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>Listado De Usuarios</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-btn color="primary" dark class="mb-2" @click="regUser">
                    Registrar Usuario
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
        </template>
        <template v-slot:no-data>
            No hay datos disponibles
        </template>
    </v-data-table>
</template>

<script>
import { getAllUsers } from '@/services/auth';
import { getToken } from '@/util/getToken';

export default {
    data: () => ({
        isLoading: false,
        showDisplay: false,
        message: '',
        typeMessage: '',
        dialog: false,
        dialogDelete: false,
        headers: [
            { title: 'Nombre', key: 'firstName' },
            { title: 'Apellido', key: 'lastName' },
            { title: 'Email', key: 'email' },
            { title: 'Rol', key: 'role' },
            { title: 'Status', key: 'status' },
            //{ title: 'Actions', key: 'actions', sortable: false },
        ],
        users: [],
    }),

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
                const token = getToken();
                const res = await getAllUsers(token);
                this.users = res.data;
                this.isLoading = false;
            } catch (e) {
                console.error("🚀 ~ file: User.vue:127 ~ initialize ~ e:", e);
                this.showDisplay = true;
                this.message = 'Error al cargar los datos';
                this.typeMessage = 'error';
            }

        },
        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        async regUser() {
            this.$router.push({ name: 'CreateUser' })
        },

    },
}
</script>