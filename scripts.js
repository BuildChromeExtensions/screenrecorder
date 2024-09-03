// Documentation -  https://developer.chrome.com/docs/extensions/reference/api/desktopCapture

let desktopMediaRequestId = null;

document.getElementById("start").onclick = (e) => {
    const sources = ["screen", "window", "tab", "audio"];
    const targetTab = null;

    desktopMediaRequestId = chrome.desktopCapture.chooseDesktopMedia(sources, targetTab, (streamId, options) => {

        if (streamId) {
            const useAudio = options.canRequestAudioTrack
            const audioSettings = {
                // whether these settings are coming from 
                // https://developer.chrome.com/docs/extensions/how-to/web-platform/screen-capture#audio-and-video-offscreen-doc
                mandatory: {
                    chromeMediaSource: "desktop",
                    chromeMediaSourceId: streamId,
                },
            }

            const audio = useAudio ? audioSettings : false
            const constraints = {
                audio: audio,
                video: {
                    // whether these settings are coming from 
                    // https://developer.chrome.com/docs/extensions/how-to/web-platform/screen-capture#audio-and-video-offscreen-doc
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: streamId,
                    }
                }
            }

            // Get stream based off of constraints
            navigator.mediaDevices.getUserMedia(constraints).then(screenCaptureStream => {
                // add stream to video element
                const video = document.querySelector("video");
                video.srcObject = screenCaptureStream;
                video.onloadedmetadata = () => video.play();
                console.log(screenCaptureStream);
            })
        }

    });
}


// cancel the desktop capture request and stop the video recording
document.getElementById("stop").onclick = (e) => {
    if (desktopMediaRequestId) {
        chrome.desktopCapture.cancelChooseDesktopMedia(desktopMediaRequestId);
        desktopMediaRequestId = null;
        const video = document.querySelector("video");
        video.pause()
    }
}