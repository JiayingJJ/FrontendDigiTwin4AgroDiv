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
    Image,
    Text,
    Box
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
                <Image 
                    border="1px solid"
                    borderColor="blackAlpha.800"
                    maxWidth={"64px"}
                    maxHeight={"64px"}
                    src={imageUrl} 
                    cursor={"zoom-in"}
                />
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                {/* <PopoverHeader></PopoverHeader> */}
                <PopoverBody 
                    minWidth="128px" minHeight="128px" 
                    marginTop={"20px"} 
                    display="flex" 
                    alignItems={"center"}
                    >
                    <Image
                        border="1px solid"
                        borderColor="blackAlpha.800"
                        src={imageUrl}
                    />
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}

export default ImageView;