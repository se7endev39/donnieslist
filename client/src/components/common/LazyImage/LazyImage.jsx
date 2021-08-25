import React, { useCallback, useEffect, useState } from 'react'

const LazyImage = ({ src, placeholder, ...restProps }) => {
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
    }, [])
    return (
        <img
            src={currentSrc}
            width="400px"
            { ...restProps }
        />
    )
}

export default LazyImage