<template>
  <InfoAlert ref="infoAlert" />
  <v-dialog v-model="transferAllToMainDialog.show" width="auto">
    <v-card
      max-width="500"
      prepend-icon="mdi-alert-circle"
      text="Все выбранные токены будут слиты на основной кошелек"
      title="Подтверждение"
    >
      <v-radio-group v-model="transferAllToMainDialog.useToken" class="ms-4">
        <v-radio label="BNB" :value="false" />
        <v-radio :label="token_symbol" :value="true" />
      </v-radio-group>
      <template #actions>
        <v-spacer />

        <v-btn @click="transferAllToMainDialog.show = false"> Отмена </v-btn>

        <v-btn
          @click="
            transferAllToMainDialog.show = false;
            transferAllToMainHandle();
          "
        >
          Подтвердить
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
  <v-dialog v-model="distributeEqualDialog.show" width="auto">
    <v-card
      max-width="500"
      prepend-icon="mdi-alert-circle"
      text="Выбранный токен будет равномерно разделен по кошелькам"
      title="Подтверждение"
    >
      <div class="d-flex">
        <div class="ms-4 w-25">
          <v-radio-group v-model="distributeEqualDialog.useToken">
            <v-radio label="BNB" :value="false" />
            <v-radio :label="token_symbol" :value="true" />
          </v-radio-group>
        </div>
        <div class="w-50">
          <v-text-field
            v-model="distributeEqualDialog.amount"
            :rules="distributeEqualDialog.rules"
            hide-details="auto"
            variant="underlined"
            label="Количество"
          />
        </div>
      </div>
      <template #actions>
        <v-spacer />

        <v-btn @click="distributeEqualDialog.show = false"> Отмена </v-btn>

        <v-btn
          @click="
            distributeEqualDialog.show = false;
            distributeEqualHandle();
          "
        >
          Подтвердить
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
  <v-dialog v-model="receiveDialog.show" width="auto">
    <v-card
      max-width="500"
      prepend-icon="mdi-alert-circle"
      text="Введите сумму, которую вы хотите отправить на этот кошелек"
      title="Подтверждение"
    >
      <div class="d-flex">
        <div class="ms-4 w-25">
          <v-radio-group v-model="receiveDialog.useToken">
            <v-radio label="BNB" :value="false" />
            <v-radio :label="token_symbol" :value="true" />
          </v-radio-group>
        </div>
        <div class="w-50">
          <v-text-field
            v-model="receiveDialog.amount"
            :rules="receiveDialog.rules"
            hide-details="auto"
            variant="underlined"
            label="Количество"
          />
        </div>
      </div>
      <template #actions>
        <v-spacer />

        <v-btn @click="distributeEqualDialog.show = false"> Отмена </v-btn>

        <v-btn
          @click="
            distributeEqualDialog.show = false;
            distributeEqualHandle();
          "
        >
          Подтвердить
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
  <div class="container">
    <div class="child-cont">
      <div>
        <v-progress-linear :active="loadingSet.size" :indeterminate="loadingSet.size" color="blue-darken-1" />
      </div>
      <div class="px-2" style="display: flex; align-items: center; justify-content: center; gap: 10px">
        <v-btn
          :disabled="loadingSet.has(getWallets)"
          prepend-icon="mdi-refresh"
          :text="'Обновить (' + countdown + ')'"
          @click="
            async () => {
              try {
                await getWallets();
              } catch (e) {
                stopAutoUpdate();
              }
            }
          "
        />
        <v-select
          v-model="selectedNetwork"
          :items="['bsc', 'bsctest', 'hardhat']"
          label="Выберите сеть"
          hide-details="true"
          @update:model-value="changeSelectedNetwork"
        />
      </div>
      <div class="table-container">
        <v-table density="compact" hover="true">
          <thead>
            <tr>
              <th class="text-left">Адрес</th>
              <th class="text-left">BNB</th>
              <th class="text-left">USDT</th>
              <th class="text-left">
                {{ token_symbol.toUpperCase() }}
              </th>
              <th class="text-left" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(wallet, walletIndex) in wallets" :key="walletIndex">
              <td>
                {{ wallet.address }}
              </td>
              <td>{{ wallet.balance.bnb }}</td>
              <td>{{ wallet.balance.usdt }}</td>
              <td>{{ wallet.balance[token_symbol] }}</td>
              <td>
                <v-btn
                  density="compact"
                  variant="tonal"
                  color="green-lighten-1"
                  rounded="0"
                  icon="mdi-download"
                  @click="receiveDialog.show = true"
                />
                <v-btn
                  density="compact"
                  variant="tonal"
                  color="red-lighten-1"
                  rounded="0"
                  class="ms-2"
                  icon="mdi-upload"
                />
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>
    <div class="child-cont pt-3">
      <v-card
        v-if="main_wallet"
        variant="outlined"
        class="d-flex flex-column pa-2"
        style="align-self: center; width: min-content"
      >
        <h3>Основной кошелек</h3>
        <span>{{ main_wallet.address }}</span>
        <span>BNB: {{ main_wallet.balance.bnb }}</span>
        <span>USDT: {{ main_wallet.balance.usdt }}</span>
        <span>{{ token_symbol.toUpperCase() }}: {{ main_wallet.balance[token_symbol] }}</span>
      </v-card>
      <div class="pt-2 buttons-container">
        <v-btn @click="transferAllToMainDialog.show = true"> Слить монеты на основной кошелек </v-btn>
        <v-btn @click="distributeEqualDialog.show = true"> Разделить токены по кошелькам </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/api.js";
import InfoAlert from "@/components/infoAlert.vue";

export default {
  name: "App",
  components: { InfoAlert },
  data() {
    return {
      main_wallet: null,
      token_symbol: "BALLS",
      network: "",
      selectedNetwork: "",
      loadingSet: new Set(), // Множество для отслеживания загрузок
      wallets: [],
      updateInterval: null,
      countdown: 30,
      transferAllToMainDialog: {
        show: false,
        useToken: false,
      },
      distributeEqualDialog: {
        show: false,
        amount: 0,
        useToken: false,
        rules: [(value) => !!value || "Required.", (value) => /^(\d+(\.\d*)?|(\.\d+))$/.test(value) || "Type a number"],
      },
      receiveDialog: {
        show: false,
        amount: 0,
        useToken: false,
        rules: [(value) => !!value || "Required.", (value) => /^(\d+(\.\d*)?|(\.\d+))$/.test(value) || "Type a number"],
      },
    };
  },

  mounted() {
    this.startAutoUpdate(); // Начать автообновление при монтировании
  },

  beforeUnmount() {
    this.stopAutoUpdate(); // Остановить автообновление при уничтожении компонента
  },

  async beforeMount() {
    // console.log(await api.disableWhitelist())
    // console.log(await api.enableWhitelist())
    // console.log(await api.isWhitelistEnabled())
    try {
      this.token_symbol = await api.getTokenSymbol();
    } catch (error) {
      this.triggerAlert("error", "Ошибка при получении символа токена: " + error.message);
    }

    await this.trackLoading("getNetwork", async () => {
      const res = await api.getNetwork();
      try {
        if (res) {
          this.network = res.network;
          this.selectedNetwork = res.network;
          await this.getWallets();
        }
      } catch (error) {
        this.triggerAlert("error", "Ошибка при автообновлении: " + error.message);
        this.stopAutoUpdate(); // Остановить автообновление
      }
    });
  },
  methods: {
    resetCountdown() {
      this.countdown = 30; // Сброс таймера до 30 секунд
    },

    startAutoUpdate() {
      return
      if (this.updateInterval) {
        clearInterval(this.updateInterval); // Очистить предыдущий интервал, если есть
      }
      this.countdown = 30; // Установить начальный таймер
      this.updateInterval = setInterval(async () => {
        if (this.countdown <= 0) {
          try {
            await this.getWallets();
            this.countdown = 30; // Сброс таймера после обновления
          } catch (error) {
            this.triggerAlert("error", "Ошибка при автообновлении: " + error.message);
            this.stopAutoUpdate(); // Остановить автообновление
          }
        } else {
          this.countdown--; // Уменьшить таймер каждую секунду
        }
      }, 1000); // Обновление каждую секунду
    },

    stopAutoUpdate() {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
      }
    },

    triggerAlert(type, text, timeout) {
      this.$refs.infoAlert.showAlert(type, text, timeout, true);
    },

    async trackLoading(name, fn) {
      this.loadingSet.add(name);
      try {
        await fn();
      } finally {
        this.loadingSet.delete(name);
      }
    },

    async getWallets() {
      await this.trackLoading("getWallets", async () => {
        try {
          let res = await api.getBalances();
          if (res) {
            this.wallets = res?.balances || [];
          }
          res = await api.getBalance(this.selectedNetwork, import.meta.env.VITE_MAIN_WALLET_ADDRESS);
          if (res) {
            this.main_wallet = res.balance;
          }

          // Сброс таймера после успешного обновления
          this.resetCountdown();
        } catch (error) {
          this.triggerAlert("error", "Ошибка при загрузке кошельков: " + error.message);
          throw error; // Проброс ошибки для остановки автообновления
        }
      });
    },

    async changeSelectedNetwork() {
      await this.trackLoading("setNetwork", async () => {
        try {
          const res = await api.setNetwork(this.selectedNetwork);
          if (res) {
            this.network = this.selectedNetwork;
            console.log(`Сеть изменена на: ${this.selectedNetwork}`);
            this.wallets = [];
            await this.getWallets();
          }
        } catch (error) {
          console.error("Ошибка при изменении сети:", error.message);
        }
      });
    },

    async transferAllToMainHandle() {
      await this.trackLoading("transferAllToMain", async () => {
        console.log(this.transferAllToMainDialog.useToken);
        try {
          const res = await api.transferAllToMain(this.transferAllToMainDialog.useToken);
          console.log(res);
          if (res) {
            this.triggerAlert("success", "Переводы прошли успешно", 2000);
            this.wallets = [];
            await this.getWallets();
          }
        } catch (error) {
          this.triggerAlert("error", "Ошибка в процессе перевода: " + error.message);
          console.error("Ошибка при изменении сети:", error.message);
        }
      });
    },

    async distributeEqualHandle() {
      await this.trackLoading("distributeEqual", async () => {
        console.log(this.distributeEqualDialog.useToken, this.distributeEqualDialog.amount);
        let amount = parseFloat(this.distributeEqualDialog.amount);
        console.log(amount);
        if (!amount || amount <= 0) {
          this.triggerAlert("error", "Некорректная сумма");
          return;
        }
        try {
          const res = await api.distributeEqual(amount, this.distributeEqualDialog.useToken);
          if (res) {
            this.triggerAlert("success", "Переводы прошли успешно", 2000);
            this.wallets = [];
            await this.getWallets();
          }
        } catch (error) {
          this.triggerAlert("error", "Ошибка в процессе перевода: " + error.message);
          console.error("Ошибка при изменении сети:", error.message);
        }
      });
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

.container {
  width: 100vw;
  height: 100vh;
  display: flex;
}

.child-cont {
  width: 50%;
  display: flex;
  flex-direction: column;
}

.table-container {
  overflow-y: auto;
  height: 100%;
}

v-table {
  width: 100%;
}

.v-input__details {
  display: none !important;
}
.buttons-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
</style>
