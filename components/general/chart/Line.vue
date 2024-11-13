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

type ChartDataset = {
  label: string;
  backgroundColor: string;
  borderColor: string;
  data: number[];
  fill: boolean;
  borderWidth: number;
};
type ChartData = {
  labels: String[];
  datasets: ChartDataset[];
};

const props = defineProps({
  data: { type: Object as PropType<ChartData>, default: null },
});

const chartRef = ref<{ chart: Chart } | null>(null);

const suggestedMax = computed(() => {
  const max = Math.max(...props.data.datasets.flatMap(dataSet => dataSet?.data || []));
  return Math.round((max + 4) * 1.1);
});

const options = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    customCanvasBackgroundColor: {
      color: colors.bg.light,
    },
    decimation: {
      enabled: false,
      algorithm: 'min-max',
    },
  },
  scales: {
    y: {
      suggestedMax: suggestedMax.value,
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
