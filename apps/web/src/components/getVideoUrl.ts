const mySecret = 'AIzaSyBRPP3cEvj_Exo1y1BHHbjvadqJ9fUCqE0';

// Function to extract YouTube video ID from URL
export function getYoutubeVideoId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
}

// Function to fetch YouTube video metadata
export async function fetchYoutubeMetadata(videoId) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${mySecret}&part=snippet`);
    const data = await response.json();
    // return data;
    return data.items[0].snippet;
}

// Function to display thumbnail and link in chat
async function displayYoutubePreview(url) {
    const videoId = getYoutubeVideoId(url);
    if (videoId) {
        const metadata = await fetchYoutubeMetadata(videoId);
        const thumbnailUrl = metadata.thumbnails.default.url;
        const videoTitle = metadata.title;
        return metadata;
        // Render thumbnail and link in chat interface
        const chatMessage = `<div><img src="${thumbnailUrl}" alt="${videoTitle}"><a href="${url}" target="_blank">${videoTitle}</a></div>`;
        // Append chatMessage to chat interface
    } else {
        // Handle invalid YouTube link
    }
}

// Example usage
const youtubeUrl = 'https://www.youtube.com/watch?v=VIDEO_ID';
displayYoutubePreview(youtubeUrl);

export default displayYoutubePreview;