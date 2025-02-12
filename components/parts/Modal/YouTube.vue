<template>
  <n-drawer :width="774">
    <n-drawer-content :title="$t('dashboard.youTube.title')" closable>
      <YouTube ref="youtubeRef" :src="`https://www.youtube.com/watch?v=${videoId}`" @ready="onReady" />

      <div v-if="ytChapters" class="my-8">
        <h4>{{ $t('dashboard.youTube.chapters') }}</h4>

        <table class="">
          <tr v-for="chapter in ytChapters">
            <td>
              <button class="inline-block h-6 w-full bg-bg-light px-1 text-center" @click="selectChapter(chapter.time)">
                {{ chapter.time }}
              </button>
            </td>
            <td class="pl-1">{{ chapter.title }}</td>
          </tr>
        </table>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
import YouTube from 'vue3-youtube';

export type VideoChapter = {
  title: string;
  time: number | string;
};

const props = defineProps({
  videoId: { type: String, required: true },
  btnText: { type: String, default: '' },
  chapters: { type: Array<VideoChapter>, default: null },
});

const youtubeRef = ref();
const ytChapters = ref(props.chapters);
const YT_API_KEY = 'AIzaSyA-uVxBQx2eJX2LPsb0R284y11S9jUpKYs';

async function onReady() {
  if (!props.chapters) {
    ytChapters.value = await getYouTubeChapters(props.videoId);
  }
}

function selectChapter(t: string | number) {
  const time = typeof t === 'string' ? parseChapterTime(t) : Number(t);
  if (youtubeRef.value) {
    youtubeRef.value.seekTo(time, true);
  }
}

function parseChapterTime(t: string) {
  const time = t.split(':').reverse();
  const timeUnits = [1, 60, 3600];
  return time.reduce((acc, value, key) => {
    return acc + Number(value) * timeUnits[key];
  }, 0);
}

async function getYouTubeChapters(videoId: string) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YT_API_KEY}`;

  try {
    const response = await fetch(decodeURI(url));
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error('Video not found');
    }

    const description = data.items[0].snippet.description;
    console.log('Description:', description);

    // Extract timestamps using a regex pattern
    const chapterRegex = /(\d{1,2}:\d{2}(?::\d{2})?)\s+(.+)/g;
    let match;
    const chapters: VideoChapter[] = [];

    while ((match = chapterRegex.exec(description)) !== null) {
      chapters.push({
        time: match[1],
        title: match[2].replace(/[^a-zA-Z ]/g, '').trim(),
      });
    }

    return chapters;
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    return [];
  }
}
</script>
