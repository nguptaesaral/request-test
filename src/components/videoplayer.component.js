import React, { useEffect, useRef, useState } from "react"
import content from "../services/content";
import { Ratio } from "react-bootstrap";

const VideoPlayer = ({ videoUrl, index, style, phone, autoPlay = true, onPlay, onPause }) => {
    const playerRef = useRef();
    const [URL, setURL] = useState('')

    async function streamURL(url) {
        let src = ""
        if (url && /^[0-9]+$/.test(url)) {
            src = `https://player.vimeo.com/video/${url}?badge=0&amp;autopause=1&amp;player_id=0&amp;app_id=58479&autoplay=${autoPlay}`;
        } else if (url) {
            await content.getVideoOTP(url, phone)
                .then((res) => {
                    src = `https://player.vdocipher.com/v2/?otp=${res.video_otp.otp}&playbackInfo=${res.video_otp.playbackInfo}&autoplay=${autoPlay}&primaryColor=5f46e3`
                })
                .catch(console.error)
        }
        setURL(src)
    }

    useEffect(() => {
        streamURL(videoUrl)
    }, [videoUrl])

    useEffect(() => {
        if (playerRef.current && URL.startsWith("https://player.vdocipher.com")) {
            const player = window.VdoPlayer.getInstance(playerRef.current)
            // const player = new window.VdoPlayer(playerRef.current);
            player.video.addEventListener("play", onPlay)
            player.video.addEventListener("pause", onPause)
            return () => {
                player.video.removeEventListener("pause", onPause);
                player.video.removeEventListener("play", onPlay);
            }
        }
    }, [URL])

    if (!URL) return <></>

    return <Ratio aspectRatio="16x9" key={videoUrl} style={style}>
        <iframe ref={playerRef} src={URL + ""} allow="encrypted-media" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}></iframe>
    </Ratio>
}

export default VideoPlayer;