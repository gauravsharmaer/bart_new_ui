// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import { REACT_APP_GOOEY_API_KEY, REACT_APP_GOOEY_API_URL } from '../../config'

// interface GooeyApiResponse {
//     id: string;
//     url: string;
//     created_at: string;
//     output: {
//         output_video: string;
//         audio_url: string;
//         text_prompt: string;
//         duration_sec: number;
//     };
// }

// export const apiSlice = createApi({
//     reducerPath: 'avatarApi',
//     baseQuery: fetchBaseQuery({
//         baseUrl: REACT_APP_GOOEY_API_URL,

//         prepareHeaders: (headers) => {
//             headers.set('Authorization', `bearer ${REACT_APP_GOOEY_API_KEY}`);
//             headers.set('Content-Type', 'application/json');
//             return headers;
//         }
//     }),
//     tagTypes: ['Avatar'],
//     keepUnusedDataFor: 300, // Keep cache for 5 minutes (in seconds)
//     endpoints: builder => ({
//         getAvatar: builder.mutation<GooeyApiResponse, string>({
//             query: (text: string) => ({
//                 url: '/',
//                 method: 'POST',
//                 body: {
//                     text_prompt: text.replace(/<[^>]*>/g, "")
//                         .replace(/\[(.*?)\]\(.*?\)/g, "$1")
//                         .replace(/https?:\/\/\S+/g, "")
//                         .trim(),
//                     tts_provider: "ELEVEN_LABS",
//                     elevenlabs_voice_name: null,
//                     elevenlabs_api_key: "sk_0c1bc5383092605e8582a5018e2584633522f8cda998ad0e",
//                     elevenlabs_voice_id: "TXWiRvyOg0OggHSQHU9L",
//                     input_face: "https://testing-bart-1.s3.us-east-2.amazonaws.com/Stevejobs.jpeg"
//                 }
//             }),
//             invalidatesTags: ['Avatar'],
//             extraOptions: {
//                 maxRetries: 0
//             },
//             transformResponse: (response: GooeyApiResponse) => {
//                 return {
//                     ...response,
//                     cacheKey: response.output.text_prompt
//                 };
//             }
//         })
//     })
// })

// export const getAvatarCacheKey = (text: string) =>
//     `avatar-${text.replace(/<[^>]*>/g, "").replace(/\[(.*?)\]\(.*?\)/g, "$1").trim()}`;

// export const { useGetAvatarMutation } = apiSlice

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { REACT_APP_GOOEY_API_KEY, REACT_APP_GOOEY_API_URL } from "../../config";
interface GooeyApiResponse {
  id: string;
  url: string;
  created_at: string;
  output: {
    output_video: string;
    audio_url: string;
    text_prompt: string;
    duration_sec: number;
  };
}

interface VoiceOption {
  name: string;
  voice_id: string;
  face_url: string;
}

export const VOICE_OPTIONS: VoiceOption[] = [
  {
    name: "MorganFreeman",
    voice_id: "T6zE62d20GFxMuUwNpjF",
    face_url:
      "https://testing-bart-1.s3.us-east-2.amazonaws.com/MorganFreeman.mp4",
  },
  {
    name: "JulieAndrews",
    voice_id: "uirkSuBoAZO93LPMf4zq",
    face_url:
      "https://testing-bart-1.s3.us-east-2.amazonaws.com/JulieAndrews.mp4",
  },
  {
    name: "PriyankaChopra",
    voice_id: "U15nmNd3j2DJLALLylQG",
    face_url:
      "https://testing-bart-1.s3.us-east-2.amazonaws.com/LipSync+Video.mp4",
  },
];

export const apiSlice = createApi({
  reducerPath: "avatarApi",
  baseQuery: fetchBaseQuery({
    baseUrl: REACT_APP_GOOEY_API_URL,

    prepareHeaders: (headers) => {
      headers.set("Authorization", `bearer ${REACT_APP_GOOEY_API_KEY}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Avatar"],
  endpoints: (builder) => ({
    getAvatar: builder.mutation<
      GooeyApiResponse,
      { text: string; voiceId: string; faceUrl: string }
    >({
      query: ({ text, voiceId, faceUrl }) => ({
        url: "/",
        method: "POST",
        body: {
          text_prompt: text
            .replace(/<[^>]*>/g, "")
            .replace(/\[(.*?)\]\(.*?\)/g, "$1")
            .replace(/https?:\/\/\S+/g, "")
            .trim(),
          tts_provider: "ELEVEN_LABS",
          elevenlabs_voice_name: null,
          elevenlabs_api_key:
            "sk_0c1bc5383092605e8582a5018e2584633522f8cda998ad0e",
          elevenlabs_voice_id: voiceId,
          input_face: faceUrl,
        },
      }),
      invalidatesTags: ["Avatar"],
      extraOptions: {
        maxRetries: 0,
      },
      transformResponse: (response: GooeyApiResponse) => {
        return {
          ...response,
          cacheKey: response.output.text_prompt,
        };
      },
    }),
  }),
});

export const getAvatarCacheKey = (text: string) =>
  `avatar-${text
    .replace(/<[^>]*>/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .trim()}`;

export const { useGetAvatarMutation } = apiSlice;
