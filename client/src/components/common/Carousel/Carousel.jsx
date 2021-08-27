/* eslint-disable jsx-a11y/alt-text */
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import './Carousel.css'
import axios from 'axios'
import { API_URL, Image_URL } from '../../../constants/api';
import { getBase64 } from '../../../utils'
import LazyImage from '../LazyImage';
import {useDropzone} from 'react-dropzone';
import WifiLoader from '../WifiLoader'

const Media = ({ type, src, width, height, goPrev, goNext, choosePhoto, chooseYoutube, chooseVideo, editable }) => {
    const [dropZone, setDropZone] = useState(false)
    return (
        <div style={{position: 'relative'}} onDragEnter={() => setDropZone(true)} onDrop={() => setDropZone(false)}>
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
            {
                dropZone && (
                    <div className="overlay">
                        Drop file here.
                    </div>
                )
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

const Carousel = React.forwardRef(({ sources: sources_orig, width, height, editable }, ref) => {
    const [index, setIndex] = useState(0)
    const [sources, setSources] = useState(sources_orig)
    const [isUploading, setUploading] = useState(false)
    const file_img_ref = useRef(null)
    const file_video_ref = useRef(null)
    const pageCount = 3
    const {
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps
    } = useDropzone({
    accept: 'image/jpeg, image/png, video/mp4',
    maxFiles: 1
    });

    useEffect(() => {
        if(sources_orig != sources){
            setSources(sources_orig)
        }
    }, [sources_orig])

    const uploadFile = async (file) => {
        if(file == null) return
        setUploading(true)
        let type = "img"
        if(file.name.endsWith(".mp4")){
            type = "video"
        }
        const formData = new FormData
        formData.set("file", file)
        try{
            const request = axios.post(`${API_URL}/uploadFile`, formData)
            const response = await request
            console.log("upload completed", file.name, response.data)            
            setUploading(false)
            let newSources = [...sources]
            newSources[index] = {type, src: response.data.filename}
            setSources(newSources)
        }catch(e){
            alert("upload failed")
            setUploading(false)
        }
    }
    

    useEffect(async () => {
        if(acceptedFiles.length == 0) return
        const file = acceptedFiles[0]
        uploadFile(file)
    }, [acceptedFiles])

    const goNext = () => {
        setIndex((index+1) % pageCount)
    }    
    const goPrev = () => {
        setIndex((index+pageCount-1)%pageCount)
    }
    const updatePhoto = () => {
        uploadFile(file_img_ref.current.files[0])
    }   
    const updateVideo = async () => {
        uploadFile(file_video_ref.current.files[0])        
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
            <div {...getRootProps({ className: 'dropzone' })}>
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
            </div>
            <input ref={file_img_ref} style={{display: 'none'}} type='file' onChange={updatePhoto} accept="image/*"/>
            <input ref={file_video_ref} style={{display: 'none'}} type='file' onChange={updateVideo} accept="video/mp4"/>
            { isUploading && <WifiLoader text="Uploading ..."/> }
        </div>
    )
})


export default Carousel