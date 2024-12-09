<template>
  <transition name="fade-slide">
    <v-alert
      v-if="show"
      :type="type"
      closable="closable"
      class="alert-top"
    >
      <div class="textBlock">
        {{ text }}
      </div>
    </v-alert>
  </transition>
</template>

<script>
export default {
  name: "InfoAlert",
  data() {
    return {
      show: false,
      text: null,
      type: "success", // По умолчанию тип success
      timeout: null,
      timer: null,
    };
  },
  methods: {
    showAlert(type = "success", text = "", timeout = 5000, killPrevious = true) {
      // Остановить текущий таймер, если включен killPrevious
      if (killPrevious) {
        this.closeAlert();
      }

      // Устанавливаем параметры нового алерта
      if (type && text && timeout >= 0 && !this.show) {
        this.text = text;
        this.type = type;
        this.timeout = timeout;

        this.$nextTick(() => {
          this.show = true;
          if (timeout) {
            this.timer = setTimeout(() => {
              this.closeAlert();
            }, this.timeout);
          }
        });
      }
    },

    closeAlert() {
      this.show = false;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
  },
};
</script>

<style scoped>
.alert-top {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 90%;
  max-width: 600px;
  border-radius: 8px !important;
}

.iconBlock {
  display: flex;
  align-items: center;
  position: fixed;
  right: 10px;
  top: 50%;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from {
  opacity: 0;
}

.fade-slide-leave-to {
  opacity: 0;
}

.textBlock {
  margin: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.closeIcon {
  cursor: pointer;
  transition: color 0.3s;
}

::v-deep(.v-btn__content)  {
  font-size: 16px !important;
}
</style>
