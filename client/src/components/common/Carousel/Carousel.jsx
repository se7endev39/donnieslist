/* eslint-disable jsx-a11y/alt-text */
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import './Carousel.css'
import axios from 'axios'
import { API_URL, Image_URL } from '../../../constants/api';
import { getBase64 } from '../../../utils'
import LazyImage from '../LazyImage';

const Media = ({ type, src, width, height, goPrev, goNext, choosePhoto, chooseYoutube, chooseVideo, editable }) => {
    return (
        <div style={{position: 'relative'}}>
            {
                type == "img" ?
                    (
                        <LazyImage 
                            src={(src.startsWith("data") || src.startsWith("http")) ? src: `${Image_URL}${src}`}
                            width={width}
                            height={height}
                            background="grey"
                        />
                    ):
                type == "video" ?
                    (
                        <video 
                            controls={true}
                            src={`${Image_URL}${src}`}
                            width={width}
                            height={height}
                            style={{objectFit: 'cover'}}
                        />
                    ):
                type == "youtube" ?
                    (
                        <iframe 
                            style={{background: 'grey'}}
                            width={width} 
                            height={height} 
                            src={src}
                            title="YouTube video player" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    )
                :
                (<div></div>)
            }
            <button className="control_btn prev_btn" onClick={goPrev}>{"<"}</button>
            <button className="control_btn next_btn" onClick={goNext}>{">"}</button>
            {
                editable && (
                    <div>
                        <button className="upload_btn upload_photo" onClick={choosePhoto}>
                            <img width={40} height={40} src="/img/camera-icon.png" />
                        </button>
                        <button className="upload_btn upload_video" onClick={chooseVideo}>
                            <img width={40} height={40} src="/img/video-icon.svg" style={{borderRadius:"100%"}}/>
                        </button>
                        <button className="upload_btn upload_youtube" onClick={chooseYoutube}>
                            <img width={40} height={40} src="/img/youtube-icon.png" />
                        </button>
                    </div>
                )
            }
        </div>
    )
}

const defaultSources = 
[
    {src:"https://grace951.github.io/react-image-carousel/img/landing3.jpg", type:"img"},
    {src:"https://www.youtube.com/embed/GEgSBuYlSoA", type:"youtube"},
    {src:"https://grace951.github.io/react-image-carousel/img/landing5.jpg", type:"img"},
]

const uploadFile = async (file) => {
    const formData = new FormData
    formData.set("file", file)
    try{
        const request = axios.post(`${API_URL}/uploadFile`, formData)
        const response = await request
        console.log("upload completed", file.name, response.data)
        return response.data.filename
    }catch(e){

    }
    return false
}

const Carousel = React.forwardRef(({ sources: sources_orig, width, height, editable }, ref) => {
    const [index, setIndex] = useState(0)
    const [sources, setSources] = useState(sources_orig)
    const file_img_ref = useRef(null)
    const file_video_ref = useRef(null)
    const pageCount = 3
    useEffect(() => {
        if(sources_orig != sources){
            setSources(sources_orig)
        }
    }, [sources_orig])
    const goNext = () => {
        setIndex((index+1) % pageCount)
    }    
    const goPrev = () => {
        setIndex((index+pageCount-1)%pageCount)
    }
    const updatePhoto = async () => {
        const file = file_img_ref.current.files[0]
        if(file == null) return
        let src_img = await uploadFile(file)
        let newSources = [...sources]
        newSources[index] = {type: "img", src: src_img}
        setSources(newSources)
    }   
    const updateVideo = async () => {
        const file = file_video_ref.current.files[0]
        if(file == null) return
        let src_video = await uploadFile(file)
        if(!src_video) return
        let newSources = [...sources]
        newSources[index] = {type: "video", src: src_video}
        setSources(newSources)
    }     
    const choosePhoto = () => {
        file_img_ref.current.click()
    }
    const chooseVideo = () => {
        file_video_ref.current.click()
    }
    const chooseYoutube = () => {
        let youtube_src = prompt('Enter youtube url', ''); //https://youtu.be/mPlfQJJI_ro
        if(!youtube_src) return
        youtube_src = youtube_src.replace("https://youtu.be", "https://www.youtube.com/embed")
        youtube_src = youtube_src.replace("https://www.youtube.com/watch?v=", "https://www.youtube.com/embed/")
        let newSources = [...sources]
        newSources[index] = {type: "youtube", src: youtube_src}
        setSources(newSources)
    }

    useImperativeHandle(ref, () => ({
        getSources: () => sources
    }), [sources])

    const sources2draw = (sources && sources[index]) ?? defaultSources[index]

    return (
        <div style={{position: 'relative'}}>
            <Media 
                { ...sources2draw }
                width={width ?? "100%"}
                height={height}
                goNext={goNext}
                goPrev={goPrev}
                choosePhoto={choosePhoto}
                chooseVideo={chooseVideo}
                chooseYoutube={chooseYoutube}
                editable={editable}
            >
            </Media>
            <input ref={file_img_ref} style={{display: 'none'}} type='file' onChange={updatePhoto} accept="image/*"/>
            <input ref={file_video_ref} style={{display: 'none'}} type='file' onChange={updateVideo} accept="video/mp4"/>
        </div>
    )
})


export default Carousel