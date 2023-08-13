<template>
  <div class="change-password-form">
    <div class="text-center mb-8">
      <h2 class="mb-4">Cambiar Contraseña</h2>
      <h5 class="h5-text">Introduce tu nueva contraseña. Esta debe contener al menos 8
        caracteres, una letra mayúscula, una letra minúscula, un número y un caracter
        especial.</h5>
    </div>
    <v-form @submit.prevent="changePassword" class="form-container">
      <v-text-field v-model="newPassword" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="togglePasswordVisibility" :type="showPassword ? 'text' : 'password'" class="text-field"
        label="Nueva Contraseña" prepend-icon="mdi-lock" :rules="newPasswordRules"
        :error-messages="newPasswordErrors"></v-text-field>
      <v-text-field v-model="repeatNewPassword" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="togglePasswordVisibility" :type="showPassword ? 'text' : 'password'" class="text-field"
        label="Repetir Contraseña" prepend-icon="mdi-lock-check" :rules="repeatNewPasswordRules"
        :error-messages="repeatNewPasswordErrors"></v-text-field>
      <v-btn type="submit" color="primary" size="x-large">Cambiar Contraseña</v-btn>
    </v-form>
  </div>
</template>

<script>
import { changePassword } from '@/services/auth';
export default {
  props: {
    email: {
      type: String,
      required: true,
    },
    session: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      newPassword: '',
      repeatNewPassword: '',
      newPasswordErrors: [],
      repeatNewPasswordErrors: [],
      showPassword: false,
    };
  },
  methods: {
    async changePassword() {
      try {
        if (this.validate()) {
          const email = this.email;
          const session = this.session;
          const newPassword = this.newPassword;
          const res = await changePassword(email, newPassword, session);
          if (!res.error) {
            this.$router.push({ name: 'Login' });
          } else {
            alert(res.error);
          }
        }
      } catch (error) {
        console.log("🚀 ~ file: ChangePasswordForm.vue:61 ~ changePassword ~ error:", error)
        alert('Ha ocurrido un error. Por favor, inténtalo de nuevo.');
      }
    },
    validate() {
      return (
        this.newPasswordRules.every((rule) => rule(this.newPassword) === true) &&
        this.repeatNewPasswordRules.every((rule) => rule(this.repeatNewPassword) === true)
      );
    },

    togglePasswordVisibility() {
      this.showPassword = true;
      setTimeout(() => {
        this.showPassword = false;
      }, 2000); // Ocultar la contraseña después de 2 segundos (ajusta el tiempo según tus preferencias)
    },
  },
  computed: {
    newPasswordRules() {
      return [
        (v) => !!v || 'La nueva contraseña es obligatoria.',
        (v) => v && v.length >= 8 || 'La nueva contraseña debe tener al menos 8 caracteres.',
        (v) => /(?=.*[A-Z])/.test(v) || 'La nueva contraseña debe contener al menos una letra mayúscula.',
        (v) => /(?=.*[a-z])/.test(v) || 'La nueva contraseña debe contener al menos una letra minúscula.',
        (v) => /(?=.*\d)/.test(v) || 'La nueva contraseña debe contener al menos un número.',
        (v) => /(?=.*[-!@#$%^&*()_+|~=`{}[\]:";\'<>?,.\/])/.test(v) || 'La nueva contraseña debe contener al menos un caracter especial.',
      ];
    },
    repeatNewPasswordRules() {
      return [
        (v) => !!v || 'Por favor, repite la nueva contraseña.',
        (v) => v === this.newPassword || 'Las contraseñas no coinciden.',
      ];
    },
  },
};

</script>
  
<style scoped="scoped">
/* Puedes agregar estilos específicos para este componente si lo deseas */
.change-password-form {
  padding: 20px;
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.text-field {
  width: 70%;
}

.h5-text {
  text-align: center;
  color: rgb(133, 133, 133);
}
</style>