import React, { useCallback, useEffect, useState } from 'react'

const LazyImage = ({ src, placeholder, background, ...restProps }) => {
    const [currentSrc, setCurrentSrc] = useState(placeholder || src)

    const onLoad = useCallback(() => {
        setCurrentSrc(src)
    }, [src])

    useEffect(() => {
        const img = new Image()
        img.src = src
        img.addEventListener('load', onLoad)
        return () => {
            img.removeEventListener('load', onLoad)
        }
    }, [src])
    if( !placeholder && !currentSrc  && background )
        return (
            <div
                style={{background}}
                {...restProps}
            >
                This is placeholder
            </div>
        )
    return (
        <img 
            src={currentSrc}
            style={{objectFit: 'cover'}}
            { ...restProps }
        />
    )
}

export default LazyImage