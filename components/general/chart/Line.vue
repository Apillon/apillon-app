<template>
  <div class="mb-8">
    <Line ref="chartRef" class="min-h-80" :data="data" :options="options" :plugins="[plugin]" />
  </div>
</template>

<script lang="ts" setup>
import { Line } from 'vue-chartjs';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import colors from '~~/tailwind.colors';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type ChartData = {
  labels: String[];
  datasets: Array<any>;
};

defineProps({
  data: { type: Object as PropType<ChartData>, default: null },
});

const chartRef = ref<{ chart: Chart } | null>(null);

const options = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    customCanvasBackgroundColor: {
      color: colors.bg.light,
    },
  },
});

const plugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart, args, options) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = options.color || '#99ffff';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};
</script>
