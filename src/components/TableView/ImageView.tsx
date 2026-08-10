import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
    Button,
    Image
} from '@chakra-ui/react'
import { downloadImage } from '../../api/file';
type Props = {
   url: string
}
const ImageView = ({ url }: Props) => {
        const [imageUrl, setImageUrl] = useState<any>(null)
    
    const getImageUrl = async (url: string) => {
            const data = await downloadImage(url)
            const resUrl = URL.createObjectURL(data)
            console.log(resUrl)
            setImageUrl(resUrl)
            return resUrl;
        }
        useEffect(() => {
            getImageUrl(url)
        }, [])
    return (
        <Popover>
            <PopoverTrigger>
                <Image width="10%" height="10%" src={imageUrl}/>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                {/* <PopoverHeader></PopoverHeader> */}
                <PopoverBody marginTop={"20px"}>
                    <Image width="100%" height="100%" src={imageUrl}/>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}

export default ImageView;