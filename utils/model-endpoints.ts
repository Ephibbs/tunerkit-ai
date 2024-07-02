export default {
    create_chat_completion: {
        url: 'https://api.openai.com/v1/chat/completions',
        contentType: 'application/json',
        type: 'completion',
        responseType: 'application/json',
    },
    create_embedding: {
        url: 'https://api.openai.com/v1/embeddings',
        contentType: 'application/json',
        type: 'embedding',
        responseType: 'application/json',
    },
    create_image: {
        url: 'https://api.openai.com/v1/images/generations',
        contentType: 'application/json',
        type: 'image_generation',
        responseType: 'application/json',
    },
    create_image_edit: {
        url: 'https://api.openai.com/v1/images/edits',
        contentType: 'application/json',
        type: 'image_generation',
        responseType: 'application/json',
    },
    create_speech: {
        url: 'https://api.openai.com/v1/audio/speech',
        contentType: 'application/json',
        type: 'speech_generation',
        responseType: 'mp3',
    },
    create_transcription: {
        url: 'https://api.openai.com/v1/audio/transcriptions',
        contentType: 'multipart/form-data',
        type: 'transcription',
        responseType: 'application/json',
    },
};