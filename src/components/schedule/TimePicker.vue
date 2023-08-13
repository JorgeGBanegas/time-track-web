<template>
    <div class="time-picker">
        <label :for="label">{{ label }}</label>
        <input type="time" id="time" v-model="time" @change="onTimeChange">
    </div>
</template>
<script>

export default {
    props: {
        label: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            time: '',
        }
    },
    methods: {
        onTimeChange() {
            this.$emit('time-change', this.time);
        },
    },
}
</script>

<style>
/* Estilos personalizados con el color verde */
.time-picker {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.time-picker label {
    font-size: 14px;
    color: #616161;
}

.time-picker input[type="time"] {
    border: none;
    border-bottom: 1px solid #bdbdbd;
    padding: 8px;
    font-size: 16px;
    color: #424242;
    background-color: #f5f5f5;
    /* Color de fondo gris */
    outline: none;
    width: 100%;
    height: 57px;
}

/* Cambiar color de texto cuando se selecciona la hora */
.time-picker input[type="time"]::-webkit-datetime-edit-text {
    color: #24DCA4;
    /* Cambia este valor por el color verde que desees */
}

/* Cambiar color de fondo de la hora seleccionada */
.time-picker input[type="time"]::-webkit-datetime-edit-text:valid {
    background-color: #24DCA4;
    /* Cambia este valor por el color verde que desees */
    color: #ffffff;
    /* Cambia este valor al color de texto deseado */
}

.time-picker input[type="time"]::-webkit-datetime-edit-hour-field {
    padding-right: 0;
}

.time-picker input[type="time"]::-webkit-datetime-edit-minute-field {
    padding-left: 0;
}

.time-picker input[type="time"]::-webkit-inner-spin-button,
.time-picker input[type="time"]::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
}

.time-picker input[type="time"]::-webkit-clear-button {
    display: none;
}

.time-picker input[type="time"]:focus {
    border-bottom-color: #24DCA4;
    /* Cambiar el color del borde inferior al estar enfocado */
}
</style>