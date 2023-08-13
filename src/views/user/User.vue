<template>
    <v-container>
            <v-row>
                <v-col cols="12">
                    <v-card-text>
                        <UsersTable />
                    </v-card-text>
                </v-col>
            </v-row>
        </v-container>
</template>

<script>
import UsersTable from '@/components/user/UsersTable.vue'
export default {
    components: {
        UsersTable
    },
}

</script>