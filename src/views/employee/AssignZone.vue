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
                Detalles de Horario
            </v-card-title>
            <v-card-text>
                <strong>Nombre:</strong> {{ schedule.scheduleName }}
            </v-card-text>
        </v-card>
        <br/>
        <v-card>
            <v-card-title>
                Detalles por Día
            </v-card-title>
            <v-card-text>
                <v-list>
                    <v-list-item v-for="(detail, index) in schedule.detailSchedule" :key="index">
                            <v-list-item-title>{{ detail.day }}</v-list-item-title>
                            <v-list-item-subtitle>Desde {{ detail.startHour }} hasta {{ detail.endHour
                            }}</v-list-item-subtitle>
                        <v-list-item-action>
                            <v-select
                                :items="zoneList"
                                v-model="selectedZones[index]"
                                item-title="text"
                                item-value="value"
                                label="Zona"
                                @update:model-value="updateSelectedZones(index, $event)"
                            ></v-select>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
                <v-row justify="end">
                        <v-btn color="primary" @click="saveZones" class="mr-2">Modificar</v-btn>
                        <v-btn color="error" @click="cancel" class="mr-8">Cancelar</v-btn>
                </v-row>
                <br/>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { getSchedule } from '@/services/employee';
import { getAllZones, getZoneByEmployeeEmail, assignZoneToEmployee } from '@/services/geofencing';
import { getToken } from '@/util/getToken';
export default {
    data: () => ({
        employeeId: null,
        employeeEmail: null,
        schedule: {},
        zoneList: [],
        selectedZones: [],
        employeeZones: [],
        isLoading: false,
        showDisplay: false,
        typeMessage: '',
        message: '',

    }),
    mounted() {
        getToken(this.$router);

    },
    async created() {
        this.employeeId = this.$route.params.id;        
        await this.getAllZones();
        await this.initialize(this.employeeId);
        await this.getZonesEmployee(this.employeeEmail);
    },

    methods: {
        closeAlert() {
            this.showDisplay = false;
        },
        async initialize(id) {
            this.isLoading = true;
            try {
                const token = getToken();
                const res = await getSchedule(token, id);
                if(res.error) {
                    this.showDisplay = true;
                    this.message = res.error;
                    this.typeMessage = 'error';
                    return;
                }
                
                this.schedule = res.data;
                this.schedule.detailSchedule.sort((a, b) => {
                    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                    return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
                });

                this.employeeEmail = res.data.employeeEmail;
            } catch (error) {
                console.log("🚀 ~ file: AssignZone.vue:95 ~ initialize ~ error:", error)
                this.showDisplay = true;
                this.message = 'Error al cargar los empleados';
                this.typeMessage = 'error';
            } finally {
                this.isLoading = false;
            }
        },

        async getAllZones(){
            try {
                const token = getToken();
                const res = await getAllZones(token);
                if(res.error) {
                    this.showDisplay = true;
                    this.message = res.error;
                    this.typeMessage = 'error';
                    return;
                }
                res.data.forEach(zone => {
                    this.zoneList.push({ text: zone.name, value: zone._id});
                });
                
            } catch (error) {
                console.log("🚀 ~ file: AssignZone.vue:105 ~ getAllZones ~ error:", error.message)
                this.showDisplay = true;
                this.message = 'Error al cargar las zonas';
                this.typeMessage = 'error';
            }
        },

        async getZonesEmployee(email) {
            try {
                const token = getToken();
                const res = await getZoneByEmployeeEmail(token, email);
                if (res.error) {
                    this.showDisplay = true;
                    this.message = res.error;
                    this.typeMessage = 'error';
                    return;
                }

                res.data.sort((a, b) => {
                    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                    return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
                });

                res.data.forEach(zone => {
                    this.employeeZones.push({ text: zone.name, value: zone._id });
                    this.selectedZones.push({ text: zone.zoneId.name, value: zone.zoneId._id });
                });
                
            } catch (error) {
                console.error("🚀 ~ file: AssignZone.vue:148 ~ getZonesEmployee ~ error:", error)
                this.showDisplay = true;
                this.message = 'Error al cargar las zonas';
                this.typeMessage = 'error';
            }
        },

        async saveZones(){
            try{
                this.isLoading = true;
                if(this.selectedZones.length !== this.schedule.detailSchedule.length){
                    this.isLoading = false;
                    this.showDisplay = true;
                    this.message = 'Debe seleccionar una zona para cada día';
                    this.typeMessage = 'error';
                    return;
                }
                const token = getToken(this.$router);
                const zonesAndDays = [];
                this.selectedZones.forEach((zone, index) => {
                    zonesAndDays.push({
                        zoneId: zone.value,
                        day: this.schedule.detailSchedule[index].day,
                    });
                });

                const res = await assignZoneToEmployee(token, this.employeeEmail, zonesAndDays);
                this.isLoading = false;
                if(res.error) {
                    this.showDisplay = true;
                    this.message = res.error;
                    this.typeMessage = 'error';
                    return;
                }

                this.showDisplay = true;
                this.message = 'Zonas asignadas correctamente';
                this.typeMessage = 'success';
                this.$router.push({ name: 'Employee' });

            }catch(error){
                console.log("🚀 ~ file: AssignZone.vue:136 ~ saveZones ~ error:", error)
                this.showDisplay = true;
                this.message = 'Error al asignar las zonas';
                this.typeMessage = 'error';
            }
        },

        async cancel(){
            this.$router.push({ name: 'Employee' });
        },

        updateSelectedZones(index, value) {
            this.selectedZones[index] = this.zoneList.find(zone => zone.value === value);
        },
    },
}

</script>