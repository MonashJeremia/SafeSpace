<template>
  <div class="main-container">
    <MainHeader />

    <main class="content py-4 py-sm-5 px-3 px-sm-4">
      <div class="container">
        <!-- Page Title -->
        <div class="row justify-content-center mb-5">
          <div class="col-12 col-lg-8">
            <h1 class="page-title text-center mb-4">Donation Statistics</h1>
          </div>
        </div>

        <!-- Donation Statistics Section -->
        <div class="row justify-content-center mb-5">
          <div class="col-12 col-lg-8">
            <div class="donation-stats-minimal">
              <div v-if="loading" class="loading-state">Loading...</div>

              <div v-else-if="error" class="error-state">
                Unable to load statistics
              </div>

              <div v-else class="stats-grid">
                <div class="stat-item">
                  <div class="stat-number">${{ formattedTotalAmount }}</div>
                  <div class="stat-text">DONATED</div>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <div class="stat-number">{{ donationCount }}</div>
                  <div class="stat-text">DONATIONS</div>
                </div>
              </div>

              <button class="donate-btn" @click="goToDonate">Donate</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getApp } from "firebase/app";
import MainHeader from "../components/MainHeader.vue";

export default {
  name: "DonationStatisticsView",
  components: {
    MainHeader,
  },
  setup() {
    const router = useRouter();
    const totalAmount = ref(0);
    const donationCount = ref(0);
    const loading = ref(true);
    const error = ref(false);

    // Initialize Firebase Functions
    const app = getApp();
    const functions = getFunctions(app);

    const formattedTotalAmount = computed(() => {
      return totalAmount.value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    });

    const fetchDonationStats = async () => {
      try {
        loading.value = true;
        error.value = false;

        const getDonationStats = httpsCallable(functions, "getDonationStats");
        const result = await getDonationStats();

        if (result.data.success) {
          totalAmount.value = result.data.totalAmount || 0;
          donationCount.value = result.data.donationCount || 0;
        }
      } catch (err) {
        console.error("Error fetching donation stats:", err);
        error.value = true;
      } finally {
        loading.value = false;
      }
    };

    const goToDonate = () => {
      router.push("/DonateNow");
    };

    const goToAboutUs = () => {
      router.push("/about-us");
    };

    onMounted(() => {
      fetchDonationStats();
    });

    return {
      totalAmount,
      donationCount,
      formattedTotalAmount,
      loading,
      error,
      goToDonate,
      goToAboutUs,
    };
  },
};
</script>

<style scoped>
.main-container {
  font-family: Arial, sans-serif;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.content {
  padding-top: 2rem;
  padding-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.donation-stats-minimal {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 3rem 2rem;
  text-align: center;
}

.loading-state,
.error-state {
  font-size: 0.95rem;
  color: #666;
  padding: 2rem 0;
}

.stats-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2.5rem;
}

.stat-item {
  flex: 1;
  max-width: 200px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 300;
  color: #000;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-text {
  font-size: 0.85rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 60px;
  background: #e0e0e0;
}

.donate-btn {
  background: #000;
  color: white;
  border: none;
  padding: 0.75rem 2.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.5px;
}

.donate-btn:hover {
  background: #333;
  transform: translateY(-1px);
}

.btn-back {
  background: transparent;
  color: #666;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.btn-back:hover {
  color: #000;
  transform: translateX(-3px);
}
</style>
