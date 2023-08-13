<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card-text>
                    <ScheduleTable />
                </v-card-text>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import ScheduleTable from '@/components/schedule/scheduleTable.vue';

export default {
    components: {
        ScheduleTable
    },
}

</script>